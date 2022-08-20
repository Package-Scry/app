import { ipcMain } from "electron"
import type { WebContentsSend } from ".."
import {
  ReceiveChannels,
  CallbackStatus,
  MainEvents,
  SendChannels,
  PackageUpdate,
  OpenWorkspaceFolder,
} from "../../custom"
import { updatePackage } from "../commands"
import { send } from "../send"
import { openWorkspaceFolder } from "./openWorkspaceFolder"

const addRoute = <T extends MainEvents>(
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

    if (!wasSuccessful)
      send(ReceiveChannels.AlertError, { workspace, error, channel })
  })
}

export const initRoutes = (send: WebContentsSend) => {
  addRoute<PackageUpdate>(send, SendChannels.PackageUpdate, updatePackage)
  addRoute<OpenWorkspaceFolder>(
    send,
    SendChannels.OpenWorkspaceFolder,
    openWorkspaceFolder
  )
}
