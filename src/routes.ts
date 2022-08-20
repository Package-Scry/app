import { ipcMain, shell } from "electron"
import { SendChannels } from "../custom"

export default (): void => {
  ipcMain.on(SendChannels.Feedback, () => {
    shell.openExternal(`https://www.packagescry.com/contact-us/`)
  })
}
