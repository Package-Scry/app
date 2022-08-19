import { exec } from "child_process"
import { getErrorFromCli, Error } from "./utils"
import { readFileSync } from "fs"
import type { PackageJSON } from "./main"
import util from "util"
import { writeFileSync } from "original-fs"
import type { WebContentsSend } from "."
import { PackageUpdate, ReceiveChannels } from "../custom"

const pExec = util.promisify(exec)

interface Packages {
  name: string
  wanted: string
  latest: string
}

export const checkPackages = async (
  filePath: string,
  project?: string,
  send?: WebContentsSend
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

    send?.(ReceiveChannels.Outdated, { packages, project })

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

export const updatePackage = async (
  { meta, data }: Omit<PackageUpdate, "channel">,
  send: WebContentsSend
) => {
  const { name, version } = data
  const { path, workspace } = meta
  exec(`cd "${path}" && npm i ${name}@${version}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)
    }

    const wasSuccessful = !!stdout

    send(ReceiveChannels.PackageUpdated, {
      name,
      version,
      workspace,
      wasSuccessful,
    })

    return { wasSuccessful }
  })

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

export const updateAllTo = async (
  filePath: string,
  type: "wanted" | "latest"
): Promise<{ wasSuccessful: boolean }> => {
  try {
    const data = readFileSync(`${filePath}/package.json`, { encoding: "utf8" })
    const parsedData: PackageJSON = JSON.parse(data)
    const { dependencies, devDependencies } = parsedData
    const { packages: outdatedPackages } = await checkPackages(filePath)
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
      `${filePath}/package.json`,
      JSON.stringify(newPackageJSON, null, 2)
    )

    const { wasSuccessful } = await runCommand(
      `cd "${filePath}" && npm i --json`
    )

    return { wasSuccessful }
  } catch (error) {
    console.log("error reading or writing the file", error)

    return { wasSuccessful: false }
  }
}
