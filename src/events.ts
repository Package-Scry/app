const token = localStorage.getItem("token")

window.api.send("token", token)
window.api.receive("saveToken", (token: string) => {
  localStorage.setItem("token", token)

  const elTabs = document.querySelector("ps-tabs")
  const elTable = document.querySelector("ps-table")
  const elModal = document.querySelector("ps-modal")

  elTabs.className = elTabs.className.replace("hidden", "")
  elTable.className = elTable.className.replace("hidden", "")
  elModal.className = `${elModal.className} hidden`

  const activeTab = localStorage.getItem("activeTab")
  const path = activeTab ? localStorage.getItem(`dirPath-${activeTab}`) : null

  window.api.send("workspaceFolder", { path })
})
window.api.receive("alert", (text: string) => {
  console.log("|  ALERT  |")
  console.log(text)
})
