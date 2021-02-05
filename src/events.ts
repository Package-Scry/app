const activeTab = localStorage.getItem("activeTab")
const path = activeTab ? localStorage.getItem(`dirPath-${activeTab}`) : null

window.api.send("workspaceFolder", { path })
