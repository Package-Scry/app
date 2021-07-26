import { ipcMain } from "electron"
import type { ReceiveChannel } from "../custom"
import { updateAllToLatest, updateAllToWanted } from "./commands"

interface EventUpdateAll {
  path: string
  workspace: string
}

type Send = (channel: ReceiveChannel, ...args: TSFixMe[]) => void

export default (send: Send): void => {
  ipcMain.on("updateAllToWanted", async (event, args: EventUpdateAll) => {
    const { path, workspace } = args

    const { wasSuccessful } = await updateAllToWanted(path)

    send("updatedAll", { workspace, wasSuccessful })
  })

  ipcMain.on("updateAllToLatest", async (event, args: EventUpdateAll) => {
    const { path, workspace } = args

    const { wasSuccessful } = await updateAllToLatest(path)

    send("updatedAll", { workspace, wasSuccessful })
  })
}
