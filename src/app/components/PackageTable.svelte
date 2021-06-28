<script lang="ts">
  import Table from "./Table/Table.svelte"
  import Test from "./Test.svelte"
  import { packages, Package } from "./store"

  enum COLUMN_KEYS {
    Name = "name",
    Local = "local",
    Wanted = "wanted",
    Latest = "latest",
    Status = "status",
  }

  let packages_value: Package[]

  packages.subscribe(value => {
    packages_value = value
  })

  const COLUMN_NAMES = ["Name", "Local", "Wanted", "Latest", "Status", "Action"]
  const columns = [
    { dataKey: COLUMN_KEYS.Name },
    { dataKey: COLUMN_KEYS.Local },
    { dataKey: COLUMN_KEYS.Wanted },
    { dataKey: COLUMN_KEYS.Latest },
    { dataKey: COLUMN_KEYS.Status },
    { render: Test },
  ]
</script>

<Table data={packages_value} {columns} headers={COLUMN_NAMES} />
