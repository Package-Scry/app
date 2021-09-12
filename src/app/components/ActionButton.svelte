<script lang="ts">
  import Button from "./button/Button.svelte"
  import { Types } from "./button/types"
  import { requestUpdatePackage, Status } from "./stores/package"

  type ButtonText = "Update" | "Loading" | "Up to date"

  export let rowData: {
    status: Status
    name: string
    version: string
    wanted: string
    latest: string
    local: string
  }

  $: status = rowData.status
  $: packageName = rowData.name
  $: localVersion = rowData.local
  $: wantedVersion = rowData.wanted
  $: latestVersion = rowData.latest
  $: targetVersion =
    wantedVersion !== latestVersion &&
    wantedVersion !== localVersion.replace("^", "")
      ? wantedVersion
      : latestVersion
  $: type =
    status === Status.Loading
      ? Types.Loading
      : status === Status.UpToDate
      ? Types.Secondary
      : Types.Primary
  $: text =
    status === Status.Loading
      ? "Loading"
      : status === Status.UpToDate
      ? "Up to date"
      : ("Update" as ButtonText)
  $: icon = status === Status.Loading ? "loading" : "updateAll"

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
