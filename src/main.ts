import { app, BrowserWindow, ipcMain } from "electron"
import * as path from "path"

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

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

ipcMain.on("toMain", (event, args) => {
  // win.webContents.send("fromMain", responseObj)
})
