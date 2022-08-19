import type { ReceiveChannels } from "../custom"

export type WebContentsSend = <T>(channel: ReceiveChannels, args: T) => void

export interface PackageJSON {
  name?: string
  dependencies?: {
    [key in string]: string
  }
  devDependencies?: {
    [key in string]: string
  }
}
