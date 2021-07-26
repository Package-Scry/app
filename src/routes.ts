import { BrowserWindow, ipcMain } from "electron"
import { updateAllToWanted } from "./commands"

interface EventUpdateAll {
  path: string
  project: string
}

export default (send: BrowserWindow["webContents"]["send"]): void => {
  ipcMain.on("updateAllToWanted", async (event, args: EventUpdateAll) => {
    const { path, project } = args

    const { wasSuccessful } = await updateAllToWanted(path)

    send("updatedAllToWanted", { project, wasSuccessful })
  })
}
