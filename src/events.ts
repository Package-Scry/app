const hasSelectedProject = (): boolean => !!localStorage.getItem("activeTab")

if (!hasSelectedProject()) window.api.send("workspaceFolder", "value")
