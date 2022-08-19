import { writable } from "svelte/store"
import { SendChannels } from "../../../../custom"

const getWorkspaces = () =>
  localStorage.getItem("tabs")
    ? localStorage
        .getItem("tabs")
        .split(",")
        .filter(tab => tab)
    : []

export const workspaces = writable<string[]>(getWorkspaces())
export const activeTab = writable<string>(localStorage.getItem("activeTab"))

export const changeActive = (
  newActiveTab: string,
  currentWorkspaces: string[]
): void => {
  activeTab.set(newActiveTab)

  localStorage.setItem("activeTab", newActiveTab)

  if (!currentWorkspaces.includes(newActiveTab)) {
    workspaces.update(value => {
      const newWorkspaces = [...value, newActiveTab]

      localStorage.setItem("tabs", `${newWorkspaces.join(",")},`)

      return newWorkspaces
    })
  }
}

export const close = (tab: string, isTabActive: boolean): void => {
  const replacedTabs = localStorage.getItem("tabs").replace(`${tab},`, "")
  const newTabs = replacedTabs ? replacedTabs.split(",").filter(tab => tab) : []

  localStorage.setItem("tabs", replacedTabs)
  localStorage.removeItem(`dirPath-${tab}`)

  workspaces.set(newTabs)

  if (isTabActive) {
    const newActiveTab = replacedTabs ? newTabs[0] : ""

    localStorage.setItem("activeTab", newActiveTab)

    activeTab.set(newActiveTab)

    const path = newActiveTab
      ? localStorage.getItem(`dirPath-${newActiveTab}`)
      : null

    window.api.send({
      channel: SendChannels.OpenWorkspaceFolder,
      meta: { path },
      data: { workspaceCount: 0 },
    })
  }
}
