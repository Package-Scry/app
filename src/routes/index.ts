import { ipcMain } from "electron"
import type { WebContentsSend } from ".."
import {
  SendChannels,
  ReceiveChannels,
  CallbackStatus,
  DefaultEventArgs,
} from "../../custom"

// TODO: is <T> neccessary at all?
const addRoute = <T, A extends DefaultEventArgs>(
  send: WebContentsSend,
  sendChannel: SendChannels,
  receiveChannel: ReceiveChannels,
  fn: (args: A) => Promise<T & CallbackStatus>
) => {
  ipcMain.on(sendChannel, async (event, args: A) => {
    const data = await fn(args)
    const { wasSuccessful, error } = data
    const { workspace } = args

    if (!wasSuccessful) send(ReceiveChannels.AlertError, { workspace, error })
    else send<T>(receiveChannel, { ...data, workspace })
  })
}
