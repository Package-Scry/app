import { exec } from "child_process"
import type { BrowserWindow } from "electron"
import { getErrorFromCli, parseJSONFromCli } from "./utils"

export const checkPackages = (
  filePath: string,
  project: string,
  send: BrowserWindow["webContents"]["send"]
): void => {
  exec(`cd "${filePath}" && npm outdated`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)

      // TODO: on mac `npm outdated` exits with `code 1` for some reason
      if (process.platform !== "darwin" || error.code !== 1) return
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }

    const packages = stdout
      .split("\n")
      .filter(a => a)
      .map(data => {
        const [name, _, wanted, latest] = data.split(" ").filter(d => d)

        return { name, wanted, latest }
      })
      .slice(1)

    send("outdated", { packages, project })
  })
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
