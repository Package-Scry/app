import { contextBridge, ipcRenderer } from "electron"
import { ReceiveChannels, SendChannels } from "../custom"

// https://github.com/reZach/secure-electron-template/blob/master/docs/newtoelectron.md
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: ({ channel, data }) => {
    if (Object.values(SendChannels).includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: ({ channel, fn }) => {
    if (Object.values(ReceiveChannels).includes(channel)) {
      // Deliberately strip event as it includes `sender`
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      ipcRenderer.on(channel, (event, ...args) => fn(...args))
    }
  },
})
