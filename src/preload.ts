import { contextBridge, ipcRenderer } from "electron"
import type { ReceiveChannel, SendChannel } from "../custom"

// https://github.com/reZach/secure-electron-template/blob/master/docs/newtoelectron.md
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel: SendChannel, data: TSFixMe) => {
    // whitelist channel
    const validChannels: SendChannel[] = [
      "workspaceFolder",
      "packageUpdate",
      "outdated",
      "cancelled",
      "authenticate",
      "isLoggedIn",
      "token",
      "logout",
      "upgrade",
      "alert",
      "proFeature",
      "updateAll",
      "feedback",
    ]

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: ReceiveChannel, func: TSFixMe) => {
    const validChannels: ReceiveChannel[] = [
      "packages",
      "packageUpdated",
      "outdated",
      "cancelled",
      "saveToken",
      "logout",
      "alert",
      "proFeature",
      "updatedAll",
    ]

    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
})
