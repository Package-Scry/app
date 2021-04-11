const token = localStorage.getItem("token")

window.api.send("token", token)
window.api.receive(
  "saveToken",
  ({ token, hasPro }: { token: string; hasPro: boolean }) => {
    localStorage.setItem("token", token)

    const elTabs = document.querySelector("ps-tabs")
    const elTable = document.querySelector("ps-table")
    const elModal = document.querySelector("#githubModal")
    const elUpgradeModal = document.querySelector("#upgradeModal")
    const activeTab = localStorage.getItem("activeTab")

    if (!hasPro && activeTab) {
      elUpgradeModal.className = elUpgradeModal.className.replace("hidden", "")
    }

    elTabs.className = elTabs.className.replace("hidden", "")
    elTable.className = elTable.className.replace("hidden", "")
    elModal.className = `${elModal.className} hidden`

    const path = activeTab ? localStorage.getItem(`dirPath-${activeTab}`) : null

    window.api.send("workspaceFolder", { path })
  }
)
window.api.receive("proFeature", () => {
  const elModal = document.querySelector("#proFeatureModal")

  elModal.className = elModal.className.replace("hidden", "")
})

window.api.receive("alert", (text: string) => {
  console.log("|  ALERT  |")
  console.log(text)
})
