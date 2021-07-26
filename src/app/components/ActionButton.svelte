<script lang="ts">
  import Button from "./button/Button.svelte"
  import { Types } from "./button/types"
  import { requestUpdatePackage } from "./stores/package"

  type ButtonText = "Update" | "Loading" | "Up to date"
  type ButtonTypes = "primary" | "secondary" | "loading"
  type Status = "loading" | "up to date" | "updatable"

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
    status === "loading"
      ? Types.Loading
      : status === "up to date"
      ? Types.Secondary
      : Types.Primary
  $: text =
    status === "loading"
      ? "Loading"
      : status === "up to date"
      ? "Up to date"
      : ("Update" as ButtonText)
  $: isDisabled = ["loading", "secondary"].includes(type)

  const onClick = () => requestUpdatePackage(packageName, targetVersion)
</script>

<Button
  {type}
  icon="updateAll"
  iconStyle="absolute left-2"
  {onClick}
  {isDisabled}>{text}</Button
>
