import { ipcMain } from "electron"
import type { WebContentsSend } from ".."
import {
  ReceiveChannels,
  CallbackStatus,
  MainEvents,
  SendChannels,
  PackageUpdate,
} from "../../custom"
import { updatePackage } from "../commands"

const addRoute = <T extends MainEvents>(
  send: WebContentsSend,
  sendChannel: T["channel"],
  fn: (
    args: Omit<T, "channel">,
    send: WebContentsSend
  ) => Promise<CallbackStatus>
) => {
  ipcMain.on(sendChannel, async (event, args: T) => {
    const { channel, ...argsWithoutChannel } = args

    const eventData = await fn(argsWithoutChannel, send)

    const { wasSuccessful, error } = eventData
    const workspace = argsWithoutChannel.meta.workspace

    if (!wasSuccessful) send(ReceiveChannels.AlertError, { workspace, error })
  })
}

export const initRoutes = (send: WebContentsSend) => {
  addRoute<PackageUpdate>(send, SendChannels.PackageUpdate, updatePackage)
}
