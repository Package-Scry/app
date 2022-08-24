<script lang="ts">
  import Button from "./button/Button.svelte"
  import { Types } from "./button/types"
  import type { Status } from "./stores/package"

  export let rowData: {
    status: Status
    name: string
    version: string
    wanted: string
    latest: string
    local: string
  }

  export let dataKey: string

  console.log(dataKey)

  $: packageName = rowData.name

  const onClick = () => {
    console.log("jere")
  }
</script>

<Button
  type={Types.Icon}
  icon={"warning"}
  style="w-16 m-4 justify-self-center"
  iconStyle="inline-block"
  {onClick}
>
  {""}
</Button>
