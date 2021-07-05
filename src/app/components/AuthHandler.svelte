<script lang="ts">
  import { openProModal } from "./stores/ui"
  import { token, login } from "./stores/user"
  import { activeTab } from "./stores/workspace"

  window.api.send("token", $token)

  window.api.receive(
    "saveToken",
    ({ token, hasPro }: { token: string; hasPro: boolean }) => {
      login(token, hasPro, $activeTab)

      const path = $activeTab
        ? localStorage.getItem(`dirPath-${$activeTab}`)
        : null

      window.api.send("workspaceFolder", { path })
    }
  )

  window.api.receive("proFeature", () => {
    openProModal()
  })

  window.api.receive("alert", (text: string) => {
    console.log("|  ALERT  |")
    console.log(text)
  })
</script>
