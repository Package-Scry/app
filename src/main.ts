import { app, BrowserWindow, ipcMain, shell } from "electron"
import { autoUpdater } from "electron-updater"
import * as path from "path"
import { readFile } from "fs"
import { io, Socket } from "socket.io-client"
import fixPath from "fix-path"
import { checkPackages, updatePackage } from "./commands"
import initRoutes from "./routes"
import { ReceiveChannels, SendChannels } from "../custom"
import type { WebContentsSend } from "."
import { setisProVersion } from "./authentication"

interface EventPackageUpdate {
  name: string
  path: string
  workspace: string
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
    send(ReceiveChannels.Alert, text)
  }

  initRoutes(send)

  ipcMain.on(SendChannels.Token, (_, token: string) => {
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
        setisProVersion(hasPro)
        send(ReceiveChannels.SaveToken, { token, hasPro })
        socket.disconnect()

        ipcMain.removeListener("authenticate", openLogin)
      }
    )

    ipcMain.on(SendChannels.Authenticate, openLogin)

    ipcMain.on(SendChannels.Upgrade, () => {
      shell.openExternal(`https://packagescry.com/sign-up`)
    })
  })

  ipcMain.on(SendChannels.PackageUpdate, (_, args: EventPackageUpdate) => {
    const { name, path, workspace, version } = args

    updatePackage(path, name, version, workspace, send)
  })
}
