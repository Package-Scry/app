import { ipcMain, shell } from "electron"
import type {
  CallbackStatus,
  MainEvents,
  PackageUpdate,
  OpenWorkspaceFolder,
  UpdateAllPackages,
  ValidateToken,
  Upgrade,
  Feedback,
  GetChangeLog,
} from "../../custom"
import { updateAllPackagesTo, updatePackage } from "../commands"
import { ReceiveChannels, SendChannels } from "../channels"
import { send } from "../send"
import { openWorkspaceFolder } from "./openWorkspaceFolder"
import { validateToken } from "./validateToken"
import { getChangeLogs } from "./getChangeLogs"

const addRoute = <T extends MainEvents>(
  sendChannel: T["channel"],
  fn: (args: Omit<T, "channel">) => Promise<CallbackStatus & { error?: string }>
) => {
  ipcMain.on(sendChannel, async (event, args: T) => {
    console.log(`${sendChannel}|`, args)

    const eventData = await fn(args)

    const { wasSuccessful, error } = eventData
    const workspace = args.meta.workspace

    if (!wasSuccessful)
      send({
        channel: ReceiveChannels.AlertError,
        meta: { workspace },
        data: { error, channel: sendChannel },
      })
  })
}

export const initRoutes = () => {
  addRoute<GetChangeLog>(SendChannels.GetChangeLog, getChangeLogs)
  addRoute<PackageUpdate>(SendChannels.PackageUpdate, updatePackage)
  addRoute<OpenWorkspaceFolder>(
    SendChannels.OpenWorkspaceFolder,
    openWorkspaceFolder
  )
  addRoute<UpdateAllPackages>(
    SendChannels.UpdateAllPackages,
    updateAllPackagesTo
  )
  addRoute<ValidateToken>(SendChannels.ValidateToken, validateToken)
  addRoute<Upgrade>(SendChannels.Upgrade, async () => {
    shell.openExternal(`https://packagescry.com/sign-up`)

    return { wasSuccessful: true }
  })
  addRoute<Feedback>(SendChannels.Feedback, async () => {
    shell.openExternal(`https://www.packagescry.com/contact-us/`)

    return { wasSuccessful: true }
  })
}
