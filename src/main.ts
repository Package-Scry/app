import { app, BrowserWindow, ipcMain, dialog, shell } from "electron"
import { autoUpdater } from "electron-updater"
import * as path from "path"
import { readFile } from "fs"
import { io, Socket } from "socket.io-client"
import fixPath from "fix-path"
import { checkPackages, updatePackage } from "./commands"
import initRoutes from "./routes"
import type { ReceiveChannel } from "../custom"
import { ReceiveChannel, SendChannels } from "../custom"
import { ReceiveChannels, SendChannels } from "../custom"

export interface PackageJSON {
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
  workspaceCount: number
}

interface EventPackageUpdate {
  name: string
  path: string
  project: string
  version: string
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow
let socket: Socket
let isProVersion = false
const HOST = "https://package-scry.herokuapp.com/"
const env = process.env.NODE_ENV || "development"

if (env !== "development") {
  fixPath()
}

async function createWindow() {
  // Create the browser windows.
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  })

  win.removeMenu()
  win.maximize()
  // and load the index.html of the app.
  await win.loadFile(path.join(__dirname, "./index.html"))

  // Open the DevTools.
  win.webContents.openDevTools()
}

const gotTheLock = app.requestSingleInstanceLock()
const send = <T>(channel: ReceiveChannel, args: T) =>
  win.webContents.send(channel, args)
const send: WebContentsSend = (channel, args) =>
  win.webContents.send(channel.toString(), args)

app.on("open-url", (event, _) => {
  event.preventDefault()
})

if (!gotTheLock) {
  app.quit()
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore()

      win.focus()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    app.removeAsDefaultProtocolClient("app")

    if (
      process.env.NODE_ENV === "development" &&
      process.platform === "win32"
    ) {
      // Set the path of electron.exe and your app.
      // These two additional parameters are only available on windows.
      app.setAsDefaultProtocolClient("package-scry", process.execPath, [
        path.resolve(process.argv[3] ?? ""),
      ])
    } else {
      app.setAsDefaultProtocolClient("package-scry")
    }
    createWindow()

    win.webContents.on("did-finish-load", () => {
      win.show()

      if (env !== "production") return

      try {
        alert("checking for updated")
        autoUpdater.checkForUpdatesAndNotify()
      } catch (error) {
        alert("errored!")
        alert(error)
      }

      autoUpdater.on("update-downloaded", info => {
        const { version } = info
        alert(`Update downloaded v${version}`)
      })

      autoUpdater.on("update-available", info => {
        const { version } = info
        alert(`Update available v${version}`)
      })
    })

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
      socket.disconnect()
      app.quit()
    }
  })

  const alert = (text: string) => {
    win.webContents.send("alert", text)
  }

  const getSelectedFolderPath = async () => {
    const dir = await dialog.showOpenDialog({ properties: ["openDirectory"] })

    if (dir.canceled) return false

    return dir.filePaths[0]
  }

  initRoutes((channel: ReceiveChannel, args: TSFixMe[]) =>
    win.webContents.send(channel, args)
  )

  ipcMain.on("token", (_, token: string) => {
    socket = io(HOST, {
      query: {
        token: token ?? "",
      },
    })

    const openLogin = () => {
      shell.openExternal(`https://package-scry.herokuapp.com/auth/${socket.id}`)
    }

    socket.on("connect", () => {
      console.log(`Socket ${socket.id} connected`)
    })

    socket.on(
      `authentication`,
      ({ token, hasPro }: { token: string; hasPro: boolean }) => {
        isProVersion = hasPro
        win.webContents.send("saveToken", { token, hasPro })
        socket.disconnect()

        ipcMain.removeListener("authenticate", openLogin)
      }
    )

    ipcMain.on("authenticate", openLogin)

    ipcMain.on("upgrade", () => {
      shell.openExternal(`https://packagescry.com/sign-up`)
    })
  })

  ipcMain.on("workspaceFolder", async (event, args: EventWorkspace) => {
    const { path, workspaceCount } = args

    if (!isProVersion && !!workspaceCount && workspaceCount > 0)
      return win.webContents.send("proFeature", {})

    const filePath = path ?? (await getSelectedFolderPath())
    const send = (channel: string, args: TSFixMe[]) =>
      win.webContents.send(channel, args)

    if (filePath === false) return win.webContents.send("cancelled", {})

    readFile(`${filePath}/package.json`, "utf-8", (error, data) => {
      if (error) {
        console.error("error", error)
        return win.webContents.send("packages", "error")
      }

      const parsedData: PackageJSON = JSON.parse(data)
      const { dependencies, devDependencies, name } = parsedData

      checkPackages(filePath, name, send)

      const allDependencies = { ...dependencies, ...devDependencies }
      const packages = Object.keys(allDependencies).map(key => ({
        name: key,
        local: allDependencies[key],
        latest: "loading",
        wanted: "loading",
        status: "loading",
      }))

      return win.webContents.send("packages", {
        filePath,
        packages: packages.sort((a, b) => (a.name < b.name ? -1 : 1)),
        name,
      })
    })
  })

  ipcMain.on("packageUpdate", (event, args: EventPackageUpdate) => {
    const { name, path, project, version } = args
    const send = (channel: string, args: TSFixMe[]) =>
      win.webContents.send(channel, args)

    updatePackage(path, name, version, project, send)
  })
}
