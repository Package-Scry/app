import type { GetChangeLog } from "../../custom"
import fetch from "node-fetch"
import { ReceiveChannels, SendChannels } from "../channels"
import { send } from "../send"

export interface ChangeLog {
  version: string
  changes: {
    breaking: {
      items: string[]
    }
  }
}

export const getChangeLogs = async ({
  meta,
  data,
}: Omit<GetChangeLog, "channel">) => {
  const { workspace } = meta
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

    // @ts-ignore
    const changeLog: ChangeLog = {
      version: data?.tag_name,
      changes: {
        // @ts-ignore
        breaking: [data?.body],
      },
    }
    const hasReachedLatest =
      getMajorVersion(changeLog.version) === latestVersion
    const newChangeLogs = hasReachedLatest
      ? []
      : await getChangeLogFromGitHub(baseUrl, version + 1, latestVersion)

    return [changeLog, ...newChangeLogs]
  }
  const getChangeLog = async (npmPackage: {
    owner: string
    repo: string
    currentVersion: string
  }) => {
    const { currentVersion, owner, repo } = npmPackage
    const majorVersion = getMajorVersion(currentVersion)
    const githubURL = `https://api.github.com/repos/${owner}/${repo}`

    try {
      const latestMajorVersion = await getLatestMajorVersion(githubURL)
      const changeLogs = await getChangeLogFromGitHub(
        githubURL,
        majorVersion + 1,
        latestMajorVersion
      )

      send({
        channel: ReceiveChannels.SendChangeLog,
        meta: { workspace },
        data: { name: repo, changeLogs },
        wasSuccessful: true,
      })
    } catch (error) {
      console.log(error)
      send({
        channel: ReceiveChannels.SendChangeLog,
        meta: { workspace },
        data: { name: repo, changeLogs: null },
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
    getChangeLog(npmPackage)
  })

  return { wasSuccessful: true }
}
