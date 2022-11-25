import { exec } from "child_process"
import { getErrorFromCli, Error } from "./utils"
import { readFileSync } from "fs"
import util from "util"
import { writeFileSync } from "original-fs"
import type { PackageUpdate, UpdateAllPackages } from "../custom"
import { send } from "./send"
import type { PackageJSON } from "."
import { ReceiveChannels } from "./channels"

const pExec = util.promisify(exec)

interface Packages {
  name: string
  wanted: string
  latest: string
}

export const checkPackages = async (
  filePath: string,
  project?: string
): Promise<{
  packages: Packages[]
}> => {
  const parsePackages = (text: string): Packages[] => {
    const packages = text
      .split("\n")
      .filter(p => p)
      .map(data => {
        const [name, _, wanted, latest] = data.split(" ").filter(d => d)

        return { name, wanted, latest }
      })
      .slice(1)

    send?.({
      channel: ReceiveChannels.GetOutdatedPackages,
      data: { packages },
      meta: { workspace: project },
    })

    return packages
  }

  try {
    const { stdout, stderr } = await pExec(`cd "${filePath}" && npm outdated`)

    if (stderr) console.log(`stderr: ${stderr}`)

    return { packages: parsePackages(stdout) }
  } catch (error) {
    const { stdout } = error

    console.log(`error: ${error.message}`)

    // TODO: on mac `npm outdated` exits with `code 1` for some reason
    if (process.platform !== "darwin" || error.code !== 1) return
    else if (stdout) return { packages: parsePackages(stdout) }
  }
}

export const updatePackage = async ({
  meta,
  data,
}: Omit<PackageUpdate, "channel">) => {
  const { name, version, shouldForceInstall } = data
  const { path, workspace } = meta

  exec(
    `cd "${path}" && npm i ${name}@${version} ${
      shouldForceInstall ? "-f" : ""
    }`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`)
      }

      const wasSuccessful = !!stdout

      if (!wasSuccessful && !!error)
        send({
          channel: ReceiveChannels.PackageUpdateErrored,
          data: {
            name,
            version,
            error: error.message,
          },
          meta: { workspace },
          wasSuccessful,
        })

      send({
        channel: ReceiveChannels.PackageUpdated,
        data: {
          name,
          version,
        },
        meta: { workspace },
        wasSuccessful,
      })

      return {
        wasSuccessful,
        error: error ? error?.message ?? error?.toString() : null,
      }
    }
  )

  return { wasSuccessful: false }
}

const runCommand = async (
  command: string
): Promise<{ wasSuccessful: boolean; error?: Error; response: string }> => {
  try {
    const { stdout, stderr } = await pExec(command)
    const jsonError = stderr ? getErrorFromCli(stderr.toString()) : null

    if (jsonError) {
      console.log("---------")
      console.log("error", JSON.stringify(jsonError, null, 2))
    }

    return { wasSuccessful: !!stdout, response: stdout }
  } catch (error) {
    const { stdout, message } = error
    const jsonError = message ? getErrorFromCli(message.toString()) : null

    if (jsonError) {
      console.log("---------")
      console.log("error", JSON.stringify(jsonError, null, 2))
    }

    return { wasSuccessful: !!stdout, error: jsonError, response: stdout }
  }
}

export const updateAllPackagesTo = async ({
  meta,
  data,
}: Omit<UpdateAllPackages, "channel">) => {
  const { type } = data
  const { workspace, path } = meta
  try {
    const data = readFileSync(`${path}/package.json`, { encoding: "utf8" })
    const parsedData: PackageJSON = JSON.parse(data)
    const { dependencies, devDependencies } = parsedData
    const { packages: outdatedPackages } = await checkPackages(path)
    const updatedDependencies = Object.keys(dependencies ?? {}).reduce<
      PackageJSON["dependencies"]
    >((allPackages, packageName) => {
      const outdatedPackage = outdatedPackages.find(p => p.name === packageName)

      return outdatedPackage
        ? { ...allPackages, [packageName]: `^${outdatedPackage[type]}` }
        : allPackages
    }, {})
    const updatedDevDependencies = Object.keys(devDependencies ?? {}).reduce<
      PackageJSON["devDependencies"]
    >((allPackages, packageName) => {
      const outdatedPackage = outdatedPackages.find(p => p.name === packageName)

      return outdatedPackage
        ? { ...allPackages, [packageName]: `^${outdatedPackage[type]}` }
        : allPackages
    }, {})

    const newPackageJSON = {
      ...parsedData,
      dependencies: { ...dependencies, ...updatedDependencies },
      devDependencies: { ...devDependencies, ...updatedDevDependencies },
    }

    writeFileSync(
      `${path}/package.json`,
      JSON.stringify(newPackageJSON, null, 2)
    )

    const { wasSuccessful } = await runCommand(`cd "${path}" && npm i --json`)

    send({
      channel: ReceiveChannels.UpdatedAllPackage,
      meta: { workspace },
      wasSuccessful,
    })

    return { wasSuccessful }
  } catch (error) {
    console.log("error reading or writing the file", error)

    return { wasSuccessful: false, error }
  }
}
export const getGitHubRepoUrl = async (name: string, path: string) => {
  try {
    const { wasSuccessful, response } = await runCommand(
      `cd "${path}" && npm repo ${name} --browser=false --json`
    )
    const url = JSON.parse(response)?.url.split("/").slice(0, 5).join("/")

    return { wasSuccessful, url }
  } catch (error) {
    console.log("error reading or writing the file", error)

    return { wasSuccessful: false, error }
  }
}
