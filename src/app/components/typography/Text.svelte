<script lang="ts">
  export let style: string = undefined
  const defaultStyle = `text-white text-l font-serif`
  const finalStyle = `${defaultStyle} ${style ?? ""}`
</script>

<span class={finalStyle}><slot /></span>
