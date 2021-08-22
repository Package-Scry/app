import { ipcMain } from "electron"
import type { ReceiveChannel } from "../custom"
import { updateAllTo } from "./commands"

interface EventUpdateAll {
  path: string
  workspace: string
  type: "wanted" | "latest"
}

type Send = (channel: ReceiveChannel, ...args: TSFixMe[]) => void

export default (send: Send): void => {
  ipcMain.on("updateAll", async (event, args: EventUpdateAll) => {
    const { path, workspace, type } = args
    const { wasSuccessful } = await updateAllTo(path, type)

    send("updatedAll", { workspace, wasSuccessful })
  })
}
