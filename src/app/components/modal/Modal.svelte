<script lang="ts">
  import type { SvelteComponentDev } from "svelte/internal"
  import { Header } from "../typography"
  import Button from "../button/Button.svelte"
  import { Types } from "../button/types"

  export let isVisible = false
  export let style = ""
  export let wrapperStyle = ""
  export let headerText: string
  export let footerRender: SvelteComponentDev = undefined
  export let buttonText: string = undefined
  export let buttonIcon: string = undefined
  export let cancelText: string = undefined
  export let onCancel: () => void
  export let onClick: () => void

  const overlayStyle = "bg-opacity-50"
  const baseStyle = `w-200 min-h-72 bg-turquoise-1 px-8 py-10 self-center m-auto shadow rounded-lg text-white text-xl`
  const wrapperBaseStyle = `font-serif grid fixed top-0 left-0 w-full h-full bg-gray-1 text-center`

  $: document.body.classList[isVisible ? "add" : "remove"]("overflow-hidden")
</script>

{#if isVisible}
  <div class={`${wrapperBaseStyle} ${wrapperStyle}`}>
    <div class={`${baseStyle} ${style}`}>
      <Header style="text-center mb-6" size="xl">{headerText}</Header>
      <slot name="content" />
      {#if !footerRender}
        <Button type={Types.Modal} icon={buttonIcon} {onClick}
          >{buttonText}</Button
        >
        {#if cancelText}
          <div
            class="cursor-pointer text-xl mt-3 hover:underline"
            on:click={onCancel}
          >
            {cancelText}
          </div>
        {/if}
      {/if}
      <svelte:component this={footerRender} />
    </div>
  </div>
{/if}
