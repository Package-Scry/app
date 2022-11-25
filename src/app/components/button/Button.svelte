<script lang="ts">
  import { Types } from "./types"
  import GitHub from "../icon/GitHub.svelte"
  import Update from "../icon/Update.svelte"
  import Loading from "../icon/Loading.svelte"
  import { Header } from "../typography"
  import Warning from "../icon/Warning.svelte"

  export let type: Types = Types.Primary
  export let icon: string = undefined
  export let onClick: () => void
  export let isDisabled = false
  export let style = ""
  export let iconStyle = ""

  $: isButtonDisabled =
    isDisabled || [Types.Loading, Types.Secondary].includes(type)

  const icons = {
    github: GitHub,
    updateAll: Update,
    loading: Loading,
    warning: Warning,
  }

  const styles = {
    common: `select-none rounded-md text-center h-full flex items-center justify-center relative`,
    primary: `bg-turquoise-4 hover:bg-gray-3 hover:shadow-inner`,
    icon: `text-center h-full flex items-center justify-center relative rounded-full select-none`,
    secondary: `border-2 border-turquoise-5`,
    loading: `bg-gray-6`,
    modal: `cursor-pointer inline-block bg-black-3 py-${
      icon ? 2 : 4
    } px-10 mt-14 rounded-lg hover:bg-black-5`,
  }

  $: finalStyle = `${style ? ` ${style} ` : ""}${
    type === "modal" || type === Types.Icon ? "" : styles.common
  } ${styles[type]}${isButtonDisabled ? "" : " cursor-pointer"}`
</script>

<div class={finalStyle} on:click={isButtonDisabled ? () => {} : onClick}>
  <svelte:component this={icons[icon]} style={iconStyle ?? "inline-block"} />
  <Header size="medium" style="inline-block"><slot /></Header>
</div>
