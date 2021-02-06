import { exec } from "child_process"
import { BrowserWindow } from "electron"

export const checkPackages = (
  filePath: string,
  send: BrowserWindow["webContents"]["send"]
): void => {
  exec(`cd "${filePath}" && npm outdated`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }

    const data = stdout
      .split("\n")
      .filter(a => a)
      .map(data => {
        const [name, _, wanted, latest] = data.split(" ").filter(d => d)

        return { name, wanted, latest }
      })
      .slice(1)

    send("outdated", data)
  })
}

export const getLatestVersion = (
  filePath: string,
  packageName: string,
  send: BrowserWindow["webContents"]["send"]
): void => {
  exec(
    `cd ${filePath} && npm v ${packageName} version`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return ""
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return ""
      }

      send("packageInfo", {
        name: packageName,
        version: stdout.replace("\n", ""),
      })
    }
  )
}
