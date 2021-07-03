<script lang="ts">
  enum SIZES {
    big = "3xl",
    medium = "xl",
    small = "sm",
  }

  export let size: keyof typeof SIZES = "big"
  const style = `text-white text-${SIZES[size]} font-serif`
</script>

<span class={style}><slot /></span>
