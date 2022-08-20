<script lang="ts">
  import Table from "./Table/Table.svelte"
  import Button from "./ActionButton.svelte"
  import {
    packages,
    updatePackage,
    Package,
    updatePackages,
    isUpdatingAll,
    Status,
  } from "./stores/package"
  import { ReceiveChannels, SendChannels } from "../../../custom"

  enum COLUMN_KEYS {
    Name = "name",
    Local = "local",
    Wanted = "wanted",
    Latest = "latest",
    Status = "status",
  }

  window.api.receive({
    channel: ReceiveChannels.UpdatedAllPackage,
    fn: ({ meta, wasSuccessful }) => {
      const { workspace } = meta
      const activeTab = localStorage.getItem("activeTab")

      if (workspace === activeTab) {
        if (wasSuccessful) {
          const path = localStorage.getItem(`dirPath-${workspace}`)

          // TODO: add refresh event instead?

          window.api.send({
            channel: SendChannels.OpenWorkspaceFolder,
            meta: {
              path,
            },
            data: { workspaceCount: 0 },
          })
        }
      }
    },
  })

  window.api.receive({
    channel: ReceiveChannels.GetOutdatedPackages,
    fn: ({ data, meta }) => {
      const { packages: newPackages } = data
      const { workspace } = meta
      const activeTab = localStorage.getItem("activeTab")

      if (activeTab !== workspace) return

      isUpdatingAll.set(false)

      updatePackages(newPackages)
    },
  })

  window.api.receive({
    channel: ReceiveChannels.GetPackages,
    fn: ({ data }) => {
      const { filePath, name, packages: eventPackages } = data

      isUpdatingAll.set(true)

      if (filePath) {
        packages.set(eventPackages)

        localStorage.setItem(`dirPath-${name}`, filePath)
      }
    },
  })

  window.api.receive({
    channel: ReceiveChannels.PackageUpdated,
    fn: ({ data, meta, wasSuccessful }) => {
      const { name, version } = data
      const { workspace } = meta
      const activeTab = localStorage.getItem("activeTab")

      if (activeTab !== workspace) return

      isUpdatingAll.set(false)

      const currentPackage = $packages.find(
        npmPackage => npmPackage.name === name
      )
      const { latest, local, wanted } = currentPackage

      const status = !wasSuccessful
        ? wanted === latest
          ? Status.Updatable
          : Status.Outdated
        : latest === version
        ? Status.UpToDate
        : Status.Outdated
      const updatedWanted = wasSuccessful
        ? latest === version
          ? { wanted: "-" }
          : { wanted }
        : {}

      updatePackage({
        name,
        status,
        local: wasSuccessful ? `^${version}` : local,
        ...updatedWanted,
      })
    },
  })

  const COLUMN_NAMES = [
    { text: "Name" },
    { text: "Local" },
    { text: "Wanted" },
    { text: "Latest" },
  ]
  const columns = [
    { dataKey: COLUMN_KEYS.Name },
    { dataKey: COLUMN_KEYS.Local },
    { dataKey: COLUMN_KEYS.Wanted, render: Button },
    { dataKey: COLUMN_KEYS.Latest, render: Button },
  ]
</script>

<Table data={$packages} {columns} headers={COLUMN_NAMES} />
