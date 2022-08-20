import { app, BrowserWindow, ipcMain, shell } from "electron"
import * as path from "path"

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let win: BrowserWindow

export const createWindow = async () => {
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
