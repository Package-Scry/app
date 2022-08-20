import type { RendererEventsSend } from "../custom"
import { win } from "./window"

export interface WebContentsSend {
  (args: RendererEventsSend): void
}

export const send: WebContentsSend = ({ channel, ...args }) =>
  win.webContents.send(channel.toString(), args)
