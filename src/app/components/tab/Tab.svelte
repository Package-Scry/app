<script lang="ts">
  import Base from "../typography/Base.svelte"

  export let activeTab: string
  export let name: string
  export let onClick: (tabName: string, isTabActive: boolean) => void
  export let onClose: (tabName: string, isTabActive: boolean) => void

  const tabStyle =
    "align-middle relative cursor-pointer px-10 rounded-t font-serif text-white text-lg self-end shadow-drop mr-0.5 first:ml-2"
  const activeStyle = "bg-black-2 h-9 leading-loose hover:bg-black-6"

  $: isActive = name === activeTab
  $: style = isActive
    ? `${activeStyle} ${tabStyle}`
    : `${tabStyle} bg-gray-11 h-8 hover:bg-gray-12`
</script>

<span
  class={style}
  on:click={() => onClick(name, isActive)}
  style="min-width: fit-content"
>
  {name}
  <span
    class="close absolute -top-1 right-1 font-sans-serif text-base font-thin"
    on:click={() => onClose(name, isActive)}
  >
    x
  </span>
</span>
