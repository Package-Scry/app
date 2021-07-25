<script lang="ts">
  import { Types } from "./button"

  import Button from "./button/Button.svelte"
  import {
    packages,
    isUpdatingAll,
    requestUpdateAllPackage,
  } from "./stores/package"

  const hasOutdated = !!$packages.find(
    p => p.latest !== p.local.replace("^", "")
  )
  const hasUpdatable = !!$packages.find(
    p => p.wanted !== "-" && p.wanted !== p.local.replace("^", "")
  )
  const onClick = () =>
    requestUpdateAllPackage(hasUpdatable ? "Wanted" : "Latest")
  const isDisabled = $isUpdatingAll || (!hasOutdated && !hasUpdatable)

  $: buttonText = $isUpdatingAll
    ? "Loading"
    : hasUpdatable
    ? "Update all to Wanted"
    : hasOutdated
    ? "Update all to Latest"
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
