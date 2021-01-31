import { contextBridge, ipcRenderer } from "electron"

type SendChannel = "workspace-folder" | "packages"
type ReceiveChannel = "workspace-folder" | "packages"

// https://github.com/reZach/secure-electron-template/blob/master/docs/newtoelectron.md
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel: SendChannel, data: TSFixMe) => {
    // whitelist channel
    const validChannels: SendChannel[] = ["workspace-folder"]

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: ReceiveChannel, func: TSFixMe) => {
    const validChannels: ReceiveChannel[] = ["packages"]

    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
})
