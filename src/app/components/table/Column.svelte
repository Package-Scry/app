<script lang="ts">
  import Base from "../typography/Base.svelte"
  import type { Column, Row } from "./index"

  export let render: Column["render"] = undefined
  export let style = "bg-turquoise-2"
  export let dataKey: Column["dataKey"] = undefined
  export let onClick: Column["onClick"] = () => {}
  export let rowData: Row = {}
</script>

<div
  class="truncate h-full flex items-center text-white text-xl font-serif {!render
    ? `${style} px-2`
    : 'pl-2'}"
  on:click={onClick}
>
  {#if !!dataKey && !render}
    <Base>{rowData[dataKey]}</Base>
  {:else if !!render}
    <svelte:component this={render} {rowData} {dataKey} />
  {:else}
    <slot />
  {/if}
</div>
