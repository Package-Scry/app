import { readFile } from "fs"
import type { WebContentsSend, PackageJSON } from ".."
import { ReceiveChannels, OpenWorkspaceFolder } from "../../custom"
import { getIsProVersion } from "../authentication"
import { checkPackages } from "../commands"
import { getSelectedFolderPath } from "../utils"

export const openWorkspaceFolder = async (
  { meta, data }: Omit<OpenWorkspaceFolder, "channel">,
  send: WebContentsSend
) => {
  const { workspaceCount } = data
  const { path } = meta
  // TODO: do this without mutation
  let wasSuccessful = true

  if (!getIsProVersion() && !!workspaceCount && workspaceCount > 0) {
    send(ReceiveChannels.ProFeature, {})
    return { wasSuccessful: true }
  }

  const filePath = path ?? (await getSelectedFolderPath())

  if (filePath === false) {
    send(ReceiveChannels.OpenWFolderCancelled, {})
    return { wasSuccessful: true }
  }

  readFile(`${filePath}/package.json`, "utf-8", (error, data) => {
    if (error) {
      console.error("error", error)
      wasSuccessful = false
    }

    const parsedData: PackageJSON = JSON.parse(data)
    const { dependencies, devDependencies, name } = parsedData

    checkPackages(filePath, name, send)

    const allDependencies = { ...dependencies, ...devDependencies }
    const packages = Object.keys(allDependencies).map(key => ({
      name: key,
      local: allDependencies[key],
      latest: "loading",
      wanted: "loading",
      status: "loading",
    }))

    send(ReceiveChannels.GetPackages, {
      filePath,
      packages: packages.sort((a, b) => (a.name < b.name ? -1 : 1)),
      name,
    })

    return {
      wasSuccessful,
    }
  })
}
