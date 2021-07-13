<script lang="ts">
  import Table from "./Table/Table.svelte"
  import Button from "./ActionButton.svelte"
  import { packages, updatePackage } from "./store"

  enum COLUMN_KEYS {
    Name = "name",
    Local = "local",
    Wanted = "wanted",
    Latest = "latest",
    Status = "status",
  }

  interface UpdatedEvent {
    name: string
    version: string
    project: string
    wasSuccessful: boolean
  }

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

  const COLUMN_NAMES = ["Name", "Local", "Wanted", "Latest", "Status", "Action"]
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
