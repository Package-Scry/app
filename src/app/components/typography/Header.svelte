<script lang="ts">
  enum SIZES {
    xl = "4xl",
    big = "3xl",
    medium = "xl",
    small = "sm",
  }

  export let style: string = undefined
  export let size: keyof typeof SIZES = "big"
  export let hasShadow = false
  const defaultStyle = `block text-white text-${SIZES[size]} font-serif${
    hasShadow ? " text-shadow" : ""
  }`
  const finalStyle = `${defaultStyle}${style ?? ""}`
</script>

<span class={finalStyle}><slot /></span>
