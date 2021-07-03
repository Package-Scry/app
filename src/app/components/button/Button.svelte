<script lang="ts">
  import { Header } from "../typography"

  type Type = "primary" | "secondary" | "loading" | "modal"

  export let type: Type = "primary"
  export let onClick: () => void
  export let isDisabled = false

  const styles = {
    common: `select-none rounded-md text-center w-full h-full flex items-center justify-center`,
    primary: `bg-turquoise-4 hover:bg-gray-3 hover:shadow-inner`,
    secondary: `border-2 border-turquoise-5`,
    loading: `bg-gray-6`,
    modal: `cursor-pointer inline-block bg-black-3 py-4 px-10 mt-14 rounded-lg hover:bg-black-5`,
  }

  $: style = `${type === "modal" ? "" : styles.common} ${styles[type]}${
    isDisabled ? "" : " cursor-pointer"
  }`
</script>

<div class={style} on:click={isDisabled ? () => {} : onClick}>
  <Header size="medium"><slot /></Header>
</div>
