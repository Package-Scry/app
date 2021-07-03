<script lang="ts">
  import { Header } from "../typography"

  type Type = "primary" | "secondary" | "loading"

  export let text: string
  export let type: Type = "primary"
  export let onClick: () => void
  export let isDisabled: boolean

  const styles = {
    common: `select-none rounded-md text-center w-full h-full flex items-center justify-center`,
    primary: `bg-turquoise-4 hover:bg-gray-3 hover:shadow-inner`,
    secondary: `border-2 border-turquoise-5`,
    loading: `bg-gray-6`,
  }

  $: style = `${styles.common} ${styles[type]}${
    isDisabled ? "" : " cursor-pointer"
  }`
</script>

<div class={style} on:click={isDisabled ? () => {} : onClick}>
  <Header size="medium">{text}</Header>
</div>
