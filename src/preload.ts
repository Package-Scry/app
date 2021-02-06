import { contextBridge, ipcRenderer } from "electron"

type SendChannel = "workspaceFolder" | "outdated" | "packageUpdate"
type ReceiveChannel = "packages" | "outdated" | "packageUpdated"

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
    ]

    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
})
