<script lang="ts">
  import Tabs from "./tab/Tabs.svelte"
  import {
    activeTab,
    close,
    changeActive,
    workspaces,
  } from "./stores/workspace"

  window.api.receive("cancelled", () => {
    if (!$activeTab) window.api.send("workspaceFolder", { path: null })
  })

  window.api.receive("packages", (data: { name: string }) => {
    const newActiveTab = data.name

    changeActive(newActiveTab, $workspaces)
  })

  const onTabClick = (workspace: string, isTabActive: boolean) => {
    if (!isTabActive) {
      const path = localStorage.getItem(`dirPath-${workspace}`)

      window.api.send("workspaceFolder", { path })
    }
  }
  const addNewTab = () => {
    const workspaceCount = $workspaces.length

    window.api.send("workspaceFolder", { path: null, workspaceCount })
  }
</script>

<div class="flex bg-gray-4 w-full items-end">
  <Tabs
    onTabClose={close}
    {onTabClick}
    tabs={$workspaces}
    activeTab={$activeTab}
  />
  <div class="flex justify-center content-center w-7 h-full ml-2">
    <div
      class="text-2xl text-white cursor-pointer font-serif font-semibold leading-normal pt-2 hover:text-3xl plus"
      on:click={addNewTab}
    >
      +
    </div>
  </div>
  <ps-icon-logout class="mt-1.5 mx-3.5" />
</div>
