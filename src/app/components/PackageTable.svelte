<script lang="ts">
  import Table from "./Table/Table.svelte"
  import Button from "./ActionButton.svelte"
  import HeaderButton from "./HeaderButton.svelte"
  import {
    packages,
    updatePackage,
    Package,
    updatePackages,
  } from "./stores/package"

  enum COLUMN_KEYS {
    Name = "name",
    Local = "local",
    Wanted = "wanted",
    Latest = "latest",
    Status = "status",
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

  window.api.receive("outdated", (data: OutdatedEvent) => {
    const { packages: newPackages, project } = data
    const activeTab = localStorage.getItem("activeTab")

    if (activeTab !== project) return

    updatePackages(newPackages)
  })

  window.api.receive("packages", (data: PackagesEvent) => {
    const { filePath, name, packages: eventPackages } = data

    if (filePath) {
      packages.set(eventPackages)

      localStorage.setItem(`dirPath-${name}`, filePath)
    }
  })

  window.api.receive("packageUpdated", (data: UpdatedEvent) => {
    const { name, project, version, wasSuccessful } = data
    const activeTab = localStorage.getItem("activeTab")

    if (activeTab !== project) return

    const currentPackage = $packages.find(
      npmPackage => npmPackage.name === name
    )
    const { latest, local, wanted } = currentPackage

    const status = !wasSuccessful
      ? wanted === latest
        ? "updatable"
        : "outdated"
      : latest === version
      ? "up to date"
      : "outdated"
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
    { text: "Status" },
    { render: HeaderButton },
  ]
  const columns = [
    { dataKey: COLUMN_KEYS.Name },
    { dataKey: COLUMN_KEYS.Local },
    { dataKey: COLUMN_KEYS.Wanted },
    { dataKey: COLUMN_KEYS.Latest },
    { dataKey: COLUMN_KEYS.Status },
    { render: Button },
  ]
</script>

<Table data={$packages} {columns} headers={COLUMN_NAMES} />
