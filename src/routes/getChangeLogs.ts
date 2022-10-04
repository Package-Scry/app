import { marked } from "marked"
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
  const { workspace, path } = meta

  const response = await fetch(
    "https://breaking-production.up.railway.app/changeLogs",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }
  )
  const { wasSuccessful, data: dataChangeLogs } = (await response.json()) as {
    wasSuccessful: boolean
    data: {
      name: string
      changeLogs: ChangeLog[]
    }[]
  }

  console.log("DATA")
  console.log(dataChangeLogs)

  dataChangeLogs.forEach(({ name, changeLogs }) => {
    send({
      channel: ReceiveChannels.SendChangeLog,
      meta: { workspace },
      data: {
        name,
        changeLogs: changeLogs?.map(changeLog => ({
          ...changeLog,
          changes: {
            breaking: marked.parse(changeLog?.changes?.breaking) ?? null,
          },
        })),
      },
      wasSuccessful: false,
    })
  })

  return { wasSuccessful: true }
}
