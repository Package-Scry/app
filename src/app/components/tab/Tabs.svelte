<script lang="ts">
  import Tab from "./Tab.svelte"

  export let tabs: string[] = []
  export let activeTab: string
  export let onTabClick: (tabName: string, isTabActive: boolean) => void
  export let onTabClose: (tabName: string, isTabActive: boolean) => void
</script>

<div class="flex flex-row bg-gray-4 w-full h-10 top-0">
  {#each tabs as tab}
    <Tab name={tab} {activeTab} onClose={onTabClose} onClick={onTabClick} />
  {/each}
</div>
