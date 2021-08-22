<script lang="ts">
  import Tab from "./Tab.svelte"

  export let tabs: string[] = []
  export let activeTab: string
  export let onTabClick: (tabName: string, isTabActive: boolean) => void
  export let onTabClose: (tabName: string, isTabActive: boolean) => void

  let elTabs: HTMLElement

  const onWheel = (e: WheelEvent) => {
    e.preventDefault()

    const tabsScrollPosition = elTabs.scrollLeft
    elTabs.scrollTo({
      top: 0,
      left: tabsScrollPosition + e.deltaY,
      behavior: "smooth",
    })
  }
</script>

<div
  class="flex flex-row bg-gray-4 w-full h-10 top-0 overflow-hidden"
  on:wheel={onWheel}
  bind:this={elTabs}
>
  {#if elTabs}
    {#each tabs as tab}
      <Tab name={tab} {activeTab} onClose={onTabClose} onClick={onTabClick} />
    {/each}
    <!-- only used so that `scrollIntoView` works properly with last tab -->
    <span class="w-4" style="min-width: 1rem;" />
  {/if}
</div>
