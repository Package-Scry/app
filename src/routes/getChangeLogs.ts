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
  const chunk = (
    arr: {
      name: string
      currentVersion: string
    }[],
    size: number
  ) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    )

  const { packages } = data
  const chunkedPackages = chunk(packages, 100)

  await Promise.all(
    chunk(packages, 100).map(async chunkedPackages => {
      const response = await fetch(
        "https://breaking-production.up.railway.app/changeLogs",
        {
          method: "POST",
          body: JSON.stringify({ packages: chunkedPackages }),
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
    })
  )

  return { wasSuccessful: true }
}
