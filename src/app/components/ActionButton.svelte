<script lang="ts">
  import Button from "./button/Button.svelte"
  import { Types } from "./button/types"
  import { requestUpdatePackage, Status } from "./stores/package"

  export let rowData: {
    status: Status
    name: string
    version: string
    wanted: string
    latest: string
    local: string
  }

  export let dataKey: string

  $: packageName = rowData.name
  $: localVersion = rowData.local
  $: targetVersion = rowData[dataKey]
  $: status =
    rowData.status !== Status.Loading &&
    targetVersion === localVersion.replace("^", "")
      ? Status.UpToDate
      : rowData.status

  const types = {
    [Status.Loading]: Types.Loading,
    [Status.UpToDate]: Types.Secondary,
    [Status.Updatable]: Types.Primary,
    [Status.Outdated]: Types.Primary,
  }
  const icons = {
    [Status.Loading]: "loading",
    [Status.UpToDate]: "",
    [Status.Updatable]: "updateAll",
    [Status.Outdated]: "updateAll",
  }
  $: texts = {
    [Status.Loading]: "Loading",
    [Status.UpToDate]: "Up to date",
    [Status.Updatable]: rowData[dataKey],
    [Status.Outdated]: rowData[dataKey],
  }

  $: type = types[status]
  $: icon = icons[status]
  $: text = texts[status]

  const onClick = () => requestUpdatePackage(packageName, targetVersion)
</script>

<Button
  {type}
  {icon}
  style="w-40 m-4 justify-self-center"
  iconStyle={type === Types.Secondary
    ? "absolute left-2"
    : "absolute left-borderless"}
  {onClick}
>
  {text}
</Button>
