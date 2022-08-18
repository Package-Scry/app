import type { ReceiveChannels } from "../custom"

export type WebContentsSend = <T>(channel: ReceiveChannels, args: T) => void
