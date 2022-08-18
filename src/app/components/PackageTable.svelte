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

  interface UpdateAllToEvent {
    wasSuccessful: boolean
    workspace: string
  }

  interface OutdatedEvent {
    packages: Package[]
    project: string
  }

  interface PackagesEvent {
    packages: Package[]
    filePath: string
    name: string
  }

  interface UpdatedEvent {
    name: string
    version: string
    project: string
    wasSuccessful: boolean
  }

  window.api.receive(ReceiveChannels.UpdatedAll, (data: UpdateAllToEvent) => {
    const { wasSuccessful, workspace } = data
    const activeTab = localStorage.getItem("activeTab")

    if (workspace === activeTab) {
      if (wasSuccessful) {
        const path = localStorage.getItem(`dirPath-${workspace}`)

        // TODO: add refresh event instead?
        window.api.send(SendChannels.WorkspaceFolder, {
          path,
          workspace,
        })
      }
    }
  })

  window.api.receive(ReceiveChannels.Outdated, (data: OutdatedEvent) => {
    const { packages: newPackages, project } = data
    const activeTab = localStorage.getItem("activeTab")

    if (activeTab !== project) return

    isUpdatingAll.set(false)

    updatePackages(newPackages)
  })

  window.api.receive(ReceiveChannels.Packages, (data: PackagesEvent) => {
    const { filePath, name, packages: eventPackages } = data

    isUpdatingAll.set(true)

    if (filePath) {
      packages.set(eventPackages)

      localStorage.setItem(`dirPath-${name}`, filePath)
    }
  })

  window.api.receive(ReceiveChannels.PackageUpdated, (data: UpdatedEvent) => {
    const { name, project, version, wasSuccessful } = data
    const activeTab = localStorage.getItem("activeTab")

    if (activeTab !== project) return

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
