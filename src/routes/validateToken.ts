import { ipcMain, shell } from "electron"
import type { ValidateToken } from "../../custom"
import { setIsProVersion } from "../authentication"
import { ReceiveChannels, SendChannels } from "../channels"
import { send } from "../send"
import { setSocket, socket } from "../socket"

export const validateToken = async ({
  data,
}: Omit<ValidateToken, "channel">) => {
  const { token } = data
  setSocket(token)

  const openLogin = () => {
    shell.openExternal(`https://package-scry.herokuapp.com/auth/${socket.id}`)
  }

  socket.on("connect", () => {
    console.log(`Socket ${socket.id} connected`)
  })

  socket.on(
    `authentication`,
    ({ token, hasPro }: { token: string; hasPro: boolean }) => {
      setIsProVersion(hasPro)
      send({ channel: ReceiveChannels.SaveToken, data: { token, hasPro } })
      socket.disconnect()

      ipcMain.removeListener("authenticate", openLogin)
    }
  )

  // TODO: move them to their own routes
  ipcMain.on(SendChannels.Authenticate, openLogin)

  return {
    wasSuccessful: true,
  }
}
