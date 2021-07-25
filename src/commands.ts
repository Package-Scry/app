import { exec } from "child_process"
import type { BrowserWindow } from "electron"
import { getErrorFromCli, parseJSONFromCli } from "./utils"
import { readFileSync } from "fs"
import type { PackageJSON } from "./main"
import util from "util"
import { writeFileSync } from "original-fs"

const pExec = util.promisify(exec)

interface Packages {
  name: string
  wanted: string
  latest: string
}

export const checkPackages = async (
  filePath: string,
  project?: string,
  send?: BrowserWindow["webContents"]["send"]
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

    send?.("outdated", { packages, project })

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

export const updatePackage = (
  filePath: string,
  packageName: string,
  version: string,
  project: string,
  send: BrowserWindow["webContents"]["send"]
): void => {
  exec(
    `cd "${filePath}" && npm i ${packageName}@${version}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`)
      }

      send("packageUpdated", {
        name: packageName,
        version,
        project,
        wasSuccessful: !!stdout,
      })
    }
  )
}

export const updateAllToWanted = (
  filePath: string,
  project: string,
  send: BrowserWindow["webContents"]["send"]
): void => {
  exec(`cd "${filePath}" && npm update --json`, (error, stdout, stderr) => {
    const jsonError =
      error?.toString() || stderr
        ? getErrorFromCli(error?.toString() ?? stderr)
        : null

    if (jsonError) {
      console.log("---------")
      console.log("error", JSON.stringify(jsonError, null, 2))
    }

    const response = parseJSONFromCli<TSFixMe>(stdout)
    console.log("---------")
    console.log(response)

    send("updatedAllToWanted", {
      project,
      wasSuccessful: !!stdout,
    })
  })
}

export const updateAllToLatest = async (
  filePath: string,
  project: string,
  send: BrowserWindow["webContents"]["send"]
): Promise<{ packages: { [name: string]: string } }> => {
  try {
    const data = readFileSync(`${filePath}/package.json`, { encoding: "utf8" })
    const parsedData: PackageJSON = JSON.parse(data)
    const { dependencies, devDependencies } = parsedData
    const { packages: outdatedPackages } = await checkPackages(filePath)

    const updatedDependencies = Object.keys(dependencies).reduce<
      PackageJSON["dependencies"]
    >((allPackages, packageName) => {
      const outdatedPackage = outdatedPackages.find(p => p.name === packageName)

      return outdatedPackage
        ? { ...allPackages, [packageName]: `^${outdatedPackage.latest}` }
        : allPackages
    }, {})

    const updatedDevDependencies = Object.keys(devDependencies).reduce<
      PackageJSON["devDependencies"]
    >((allPackages, packageName) => {
      const outdatedPackage = outdatedPackages.find(p => p.name === packageName)

      return outdatedPackage
        ? { ...allPackages, [packageName]: `^${outdatedPackage.latest}` }
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

    const wasSuccessful = await install(filePath)

    // TODO: send an event

    return { packages: { ...updatedDependencies, ...updatedDevDependencies } }
  } catch (error) {
    console.log("error reading or writing the file", error)

    send("updatedAllToLatest", {
      project,
      wasSuccessful: false,
    })
  }
}

const install = async (filePath: string): Promise<boolean> => {
  try {
    const { stdout, stderr } = await pExec(`cd "${filePath}" && npm i --json`)
    const jsonError = stderr ? getErrorFromCli(stderr?.toString()) : null

    if (jsonError) {
      console.log("---------")
      console.log("error", JSON.stringify(jsonError, null, 2))
    }

    return !!stdout
  } catch (error) {
    const { stdout, message } = error
    const jsonError = message ? getErrorFromCli(message.toString()) : null

    if (jsonError) {
      console.log("---------")
      console.log("error", JSON.stringify(jsonError, null, 2))
    }

    return !!stdout
  }
}
