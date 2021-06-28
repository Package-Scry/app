<script lang="ts">
  type Type = "primary" | "secondary" | "loading"

  export let text: string
  export let type: Type = "primary"
  export let onClick: () => void

  const styles = {
    common: `cursor-pointer select-none rounded-md text-center w-full h-full flex items-center justify-center`,
    primary: `bg-turquoise-4 hover:bg-gray-3 hover:shadow-inner`,
    secondary: `border-2 border-turquoise-5`,
    loading: `bg-gray-6`,
  }

  $: style = `${styles.common} ${styles[type]}`
</script>

<div class={style} on:click={onClick}>
  <ps-header size="medium">{text}</ps-header>
</div>
