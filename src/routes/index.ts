import { ipcMain } from "electron"
import {
  ReceiveChannels,
  CallbackStatus,
  MainEvents,
  SendChannels,
  PackageUpdate,
  OpenWorkspaceFolder,
  UpdateAllPackages,
} from "../../custom"
import { updateAllPackagesTo, updatePackage } from "../commands"
import { send } from "../send"
import { openWorkspaceFolder } from "./openWorkspaceFolder"

const addRoute = <T extends MainEvents>(
  sendChannel: T["channel"],
  fn: (args: Omit<T, "channel">) => Promise<CallbackStatus & { error?: string }>
) => {
  ipcMain.on(sendChannel, async (event, args: T) => {
    const { channel, ...argsWithoutChannel } = args

    const eventData = await fn(argsWithoutChannel)

    const { wasSuccessful, error } = eventData
    const workspace = argsWithoutChannel.meta.workspace

    if (!wasSuccessful)
      send({
        channel: ReceiveChannels.AlertError,
        meta: { workspace },
        data: { error, channel: sendChannel },
      })
  })
}

export const initRoutes = () => {
  addRoute<PackageUpdate>(SendChannels.PackageUpdate, updatePackage)
  addRoute<OpenWorkspaceFolder>(
    SendChannels.OpenWorkspaceFolder,
    openWorkspaceFolder
  )
  addRoute<UpdateAllPackages>(
    SendChannels.UpdateAllPackages,
    updateAllPackagesTo
  )
}
