import { writable } from "svelte/store"

export const isProModalOpen = writable(false)
export const isUpgradeModalOpen = writable(false)
export const isChangeLogModalOpen = writable(false)
export const isForceInstallModalOpen = writable(false)

export const openProModal = (): void => isProModalOpen.set(true)
export const closeProModal = (): void => isProModalOpen.set(false)

export const openChangeLogModal = (): void => isChangeLogModalOpen.set(true)
export const closeChangeLogModal = (): void => isChangeLogModalOpen.set(false)

export const openUpgradeModal = (): void => isUpgradeModalOpen.set(true)
export const closeUpgradeModal = (): void => isUpgradeModalOpen.set(false)

export const openForceInstallModal = (): void =>
  isForceInstallModalOpen.set(true)
export const closeForceInstallModal = (): void =>
  isForceInstallModalOpen.set(false)
export const dataForceInstallModal = writable<{
  error: string
  name?: string
  version?: string
  type?: "wanted" | "latest"
}>()
