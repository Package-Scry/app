import { BrowserWindow, ipcMain } from "electron"
import { updateAllToLatest, updateAllToWanted } from "./commands"

interface EventUpdateAll {
  path: string
  workspace: string
}

export default (send: BrowserWindow["webContents"]["send"]): void => {
  ipcMain.on("updateAllToWanted", async (event, args: EventUpdateAll) => {
    const { path, workspace } = args

    const { wasSuccessful } = await updateAllToWanted(path)

    send("updatedAllToWanted", { workspace, wasSuccessful })
  })

  ipcMain.on("updateAllToLatest", async (event, args: EventUpdateAll) => {
    const { path, workspace } = args

    const { wasSuccessful, packages } = await updateAllToLatest(path)

    send("updatedAllToLatest", { workspace, wasSuccessful, packages })
  })
}
