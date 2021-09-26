<script lang="ts">
  import { Types } from "./button/types"
  import Button from "./button/Button.svelte"
  import {
    packages,
    isUpdatingAll,
    requestUpdateAllPackage,
  } from "./stores/package"

  export let isWanted = true
  $: hasOutdated = !!$packages.find(p => p.latest !== p.local.replace("^", ""))
  $: hasUpdatable = !!$packages.find(
    p => p.wanted !== "-" && p.wanted !== p.local.replace("^", "")
  )
  $: onClick = () => requestUpdateAllPackage(isWanted ? "Wanted" : "Latest")
  $: isDisabled = $isUpdatingAll || (!hasOutdated && !hasUpdatable)

  $: buttonText = $isUpdatingAll
    ? "Loading"
    : hasUpdatable
    ? `Update all ${isWanted ? "wanted" : "latest"}`
    : hasOutdated
    ? `Update all ${isWanted ? "wanted" : "latest"}`
    : "Up to date"

  $: type = $isUpdatingAll
    ? Types.Loading
    : hasOutdated || hasUpdatable
    ? Types.Primary
    : Types.Secondary
  $: icon = $isUpdatingAll ? "loading" : "updateAll"
</script>

<Button
  {type}
  {icon}
  iconStyle="absolute left-borderless"
  style="w-full py-3 justify-self-center"
  {onClick}
  {isDisabled}
>
  {buttonText}
</Button>
