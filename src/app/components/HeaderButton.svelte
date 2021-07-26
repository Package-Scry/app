<script lang="ts">
  import { Types } from "./button/types"

  import Button from "./button/Button.svelte"
  import {
    packages,
    isUpdatingAll,
    requestUpdateAllPackage,
  } from "./stores/package"

  $: hasOutdated = !!$packages.find(p => p.latest !== p.local.replace("^", ""))
  $: hasUpdatable = !!$packages.find(
    p => p.wanted !== "-" && p.wanted !== p.local.replace("^", "")
  )
  $: onClick = () => requestUpdateAllPackage(hasUpdatable ? "Wanted" : "Latest")
  $: isDisabled = $isUpdatingAll || (!hasOutdated && !hasUpdatable)

  $: buttonText = $isUpdatingAll
    ? "Loading"
    : hasUpdatable
    ? "Update all"
    : hasOutdated
    ? "Update all"
    : "Up to date"

  $: type = $isUpdatingAll
    ? Types.Loading
    : hasOutdated || hasUpdatable
    ? Types.Primary
    : Types.Secondary
</script>

<Button {type} icon="updateAll" {onClick} {isDisabled}>
  {buttonText}
</Button>
