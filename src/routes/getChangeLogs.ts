import type { GetChangeLog } from "../../custom"
import fetch from "node-fetch"
import { ReceiveChannels } from "../channels"
import { send } from "../send"

export interface ChangeLog {
  version: string
  changes: {
    breaking: string | null
  }
}

export const getChangeLogs = async ({
  meta,
  data,
}: Omit<GetChangeLog, "channel">) => {
  const { workspace } = meta

  const response = await fetch(
    "https://breaking-production.up.railway.app/changeLogs",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "breaking-api-key": "aJzzRC2HTywKgcmxG7pG",
      },
    }
  )
  const { data: dataChangeLogs } = (await response.json()) as {
    data: {
      name: string
      changeLogs: ChangeLog[]
    }[]
  }

  console.log("DATA")
  console.log(JSON.stringify(dataChangeLogs, null, 2))

  dataChangeLogs.forEach(({ name, changeLogs }) => {
    send({
      channel: ReceiveChannels.SendChangeLog,
      meta: { workspace },
      data: {
        name,
        changeLogs,
      },
      wasSuccessful: false,
    })
  })

  return { wasSuccessful: true }
}
