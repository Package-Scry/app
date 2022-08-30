import { marked } from "marked"
import type { GetChangeLog } from "../../custom"
import fetch from "node-fetch"
import { ReceiveChannels, SendChannels } from "../channels"
import { send } from "../send"
import { getGitHubRepoUrl } from "../commands"

export interface ChangeLog {
  version: string
  changes: {
    breaking: string
  }
}

export const getChangeLogs = async ({
  meta,
  data,
}: Omit<GetChangeLog, "channel">) => {
  const { workspace, path } = meta
  const { packages } = data

  const getMajorVersion = (version: string) =>
    parseInt(version.replace("v", "").split(".")[0], 10)

  const getLatestMajorVersion = async (baseUrl: string) => {
    const response = await fetch(`${baseUrl}/releases/latest`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    const data = (await response.json()) as TSFixMe
    // @ts-ignore
    const tag_name = data?.tag_name

    return getMajorVersion(tag_name)
  }

  const getBreakingChange = (changeLog: string): string | null => {
    const regXHeader = /#{1,6}.+/g
    const headers: string[] = changeLog.match(regXHeader)
    const breakingChangeIndex = headers.findIndex(header =>
      header.toLocaleLowerCase().includes("breaking")
    )

    if (breakingChangeIndex === -1) return null

    const isTheSameHeader = (header: string, headerCount: number) =>
      (header.match(new RegExp("#", "g")) || []).length === headerCount

    const headerCount = (
      headers[breakingChangeIndex].match(new RegExp("#", "g")) || []
    ).length
    const isLastItem =
      headers
        .slice(breakingChangeIndex + 1)
        .filter(header => isTheSameHeader(header, headerCount)).length === 0
    const start = changeLog.search(headers[breakingChangeIndex])
    console.log({ start })
    console.log({ isLastItem })
    const end = isLastItem
      ? changeLog.length
      : changeLog.search(
          headers
            .slice(breakingChangeIndex + 1)
            .find(header => isTheSameHeader(header, headerCount))
        )

    return changeLog.slice(start, end)
  }

  const getChangeLogFromGitHub = async (
    baseUrl: string,
    version: number,
    latestVersion: number
  ): Promise<ChangeLog[]> => {
    const fetchAndParse = async (url: string) => {
      try {
        console.log("fetching", url)
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        const data = (await response.json()) as TSFixMe
        return data?.tag_name ? data : null
      } catch (error) {
        console.error(error)
      }
    }

    const data =
      (await fetchAndParse(`${baseUrl}/releases/tags/v${version}.0.0`)) ??
      (await fetchAndParse(`${baseUrl}/releases/tags/${version}.0.0`))

    const body: string = data?.body
    const breakingText = getBreakingChange(body)
    const breakingTextHtml = breakingText ? marked.parse(breakingText) : null

    const changeLog: ChangeLog = {
      version: data?.tag_name,
      changes: {
        breaking: breakingTextHtml,
      },
    }

    const hasReachedLatest =
      getMajorVersion(changeLog.version) === latestVersion
    const newChangeLogs = hasReachedLatest
      ? []
      : await getChangeLogFromGitHub(baseUrl, version + 1, latestVersion)

    return [changeLog, ...newChangeLogs]
  }
  const getChangeLog = async (
    npmPackage: {
      name: string
      currentVersion: string
    },
    path: string
  ) => {
    const { currentVersion, name } = npmPackage
    try {
      const majorVersion = getMajorVersion(currentVersion)

      const { wasSuccessful, url } = await getGitHubRepoUrl(name, path)

      if (!wasSuccessful || !url.includes("github"))
        throw new Error("Couldn't find repo url")

      const gitHubUrl = url.replace("github.com", "api.github.com/repos")
      const latestMajorVersion = await getLatestMajorVersion(gitHubUrl)
      const changeLogs = await getChangeLogFromGitHub(
        gitHubUrl,
        majorVersion + 1,
        latestMajorVersion
      )

      send({
        channel: ReceiveChannels.SendChangeLog,
        meta: { workspace },
        data: { name, changeLogs },
        wasSuccessful: true,
      })
    } catch (error) {
      console.log(error)
      send({
        channel: ReceiveChannels.SendChangeLog,
        meta: { workspace },
        data: { name, changeLogs: null },
        wasSuccessful: false,
      })
      send({
        channel: ReceiveChannels.AlertError,
        meta: { workspace },
        data: { error: error?.message, channel: SendChannels.GetChangeLog },
      })
    }
  }

  packages.forEach(async npmPackage => {
    getChangeLog(npmPackage, path)
  })

  return { wasSuccessful: true }
}
