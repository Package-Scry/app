import type { ReceiveChannels } from "../custom"

type WebContentsSend = <T>(channel: ReceiveChannels, args: T) => void
