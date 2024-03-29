import { app, BrowserWindow } from "electron"
import { autoUpdater } from "electron-updater"
import * as path from "path"
import fixPath from "fix-path"
import { createWindow, win } from "./window"
import { socket } from "./socket"
import { initRoutes } from "./routes"
import { initEnvironmentVariables } from "./commands"

const env = process.env.NODE_ENV || "development"

if (env !== "development") {
  fixPath()
}

const gotTheLock = app.requestSingleInstanceLock()

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

    initEnvironmentVariables()

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
    // send({ channel: ReceiveChannels.TestAlert, data: { text } })
  }

  initRoutes()
}
