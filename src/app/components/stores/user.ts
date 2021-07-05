import { writable } from "svelte/store"
import { openUpgradeModal } from "./ui"
import { workspaces } from "./workspace"

export const isLoggedIn = writable(false)
export const hasPro = writable(false)
export const token = writable(localStorage.getItem("token"))

const saveToken = (token: string): void => {
  localStorage.setItem("token", token)
}

export const login = (
  token: string,
  hasUserPro: boolean,
  activeTab: string
): void => {
  saveToken(token)

  if (!hasPro && activeTab) {
    workspaces.set([activeTab])
    localStorage.setItem("tabs", `${activeTab},`)

    openUpgradeModal()
  }

  hasPro.set(hasUserPro)
  isLoggedIn.set(true)
}
