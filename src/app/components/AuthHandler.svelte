<script lang="ts">
  import { ReceiveChannels, SendChannels } from "../../../custom"

  import { openProModal } from "./stores/ui"
  import { token, login } from "./stores/user"
  import { activeTab } from "./stores/workspace"

  window.api.send({
    channel: SendChannels.Token,
    meta: { workspace: $activeTab },
    data: { token: $token },
  })

  window.api.receive(
    ReceiveChannels.SaveToken,
    ({ token, hasPro }: { token: string; hasPro: boolean }) => {
      login(token, hasPro, $activeTab)

      const path = $activeTab
        ? localStorage.getItem(`dirPath-${$activeTab}`)
        : null

      window.api.send(SendChannels.WorkspaceFolder, {
        path,
        workspace: $activeTab,
      })
    }
  )

  window.api.receive(ReceiveChannels.ProFeature, () => {
    openProModal()
  })

  window.api.receive(ReceiveChannels.Alert, (text: string) => {
    console.log("|  ALERT  |")
    console.log(text)
  })
</script>
