<script lang="ts">
  import Tabs from "./tab/Tabs.svelte"
  import {
    activeTab,
    close,
    changeActive,
    workspaces,
  } from "./stores/workspace"
  import LogoutButton from "./LogoutButton.svelte"
  import { isUpdatingAll } from "./stores/package"
  import { ReceiveChannels, SendChannels } from "../../../custom"

  window.api.receive({
    channel: ReceiveChannels.OpenWFolderCancelled,
    fn: _ => {
      if (!$activeTab)
        window.api.send({
          channel: SendChannels.OpenWorkspaceFolder,
          meta: {
            path: null,
          },
          data: {
            workspaceCount: 0,
          },
        })
    },
  })

  window.api.receive({
    channel: ReceiveChannels.GetPackages,
    fn: ({ data }) => {
      const newActiveTab = data.name

      changeActive(newActiveTab, $workspaces)

      isUpdatingAll.set(false)
    },
  })

  const onTabClick = (workspace: string, isTabActive: boolean) => {
    if (!isTabActive) {
      const workspaceCount = $workspaces.length
      const path = localStorage.getItem(`dirPath-${workspace}`)

      window.api.send({
        channel: SendChannels.OpenWorkspaceFolder,
        meta: {
          path,
        },
        data: { workspaceCount },
      })
    }
  }
  const addNewTab = () => {
    const workspaceCount = $workspaces.length

    window.api.send({
      channel: SendChannels.OpenWorkspaceFolder,
      meta: {
        path: null,
      },
      data: { workspaceCount },
    })
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
  <LogoutButton />
</div>
