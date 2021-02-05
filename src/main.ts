import { app, BrowserWindow, ipcMain, dialog } from "electron"
import * as path from "path"
import { readFile } from "fs"
import { exec, execSync } from "child_process"

interface PackageJSON {
  name?: string
  dependencies?: {
    [key in string]: string
  }
  devDependencies?: {
    [key in string]: string
  }
}

interface EventWorkspace {
  path: string | null
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow

function createWindow() {
  const env = process.env.NODE_ENV || "development"

  if (env === "development") {
    try {
      // eslint-disable-next-line
      require("electron-reloader")(module, {
        debug: true,
        watchRenderer: true,
      })
    } catch (e) {
      console.error("Electron-reloader error", e)
    }
  }

  // Create the browser windows.
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    show: false,
  })

  win.removeMenu()
  win.maximize()
  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "../src/index.html"))

  // Open the DevTools.
  win.webContents.openDevTools()
  // console.log(dialog.showOpenDialog({ properties: ["openDirectory"] }))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow()

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

const getSelectedFolderPath = async () => {
  const dir = await dialog.showOpenDialog({ properties: ["openDirectory"] })

  if (dir.canceled) win.webContents.send("packages", "canceled")

  return dir.filePaths[0]
}

const checkPackages = (filePath: string) => {
  exec("npm outdated", (error, stdout, stderr) => {
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

    win.webContents.send("outdated", data)
  })
}

const getLatestVersion = (filePath: string, packageName: string) => {
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

      win.webContents.send("packageInfo", {
        name: packageName,
        version: stdout.replace("\n", ""),
      })
    }
  )
}

ipcMain.on("workspaceFolder", async (event, args: EventWorkspace) => {
  const { path } = args
  const filePath = path ?? (await getSelectedFolderPath())

  checkPackages(filePath)

  readFile(`${filePath}/package.json`, "utf-8", (error, data) => {
    if (error) {
      console.error("error", error)
      return win.webContents.send("packages", "error")
    }

    const parsedData: PackageJSON = JSON.parse(data)
    const { dependencies, devDependencies, name } = parsedData
    const allDependencies = { ...dependencies, ...devDependencies }
    const packages = Object.keys(allDependencies).map(key => {
      getLatestVersion(filePath, key)

      return {
        name: key,
        local: allDependencies[key],
        latest: "loading",
        wanted: "loading",
        status: "up to date",
      }
    })

    return win.webContents.send("packages", {
      filePath,
      packages: packages.sort((a, b) => (a.name < b.name ? -1 : 1)),
      name,
    })
  })
})
