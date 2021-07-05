import { writable } from "svelte/store"

export const isProModalOpen = writable(false)
export const isUpgradeModalOpen = writable(false)

export const openProModal = (): void => isProModalOpen.set(true)
export const closeProModal = (): void => isProModalOpen.set(false)
export const openUpgradeModal = (): void => isUpgradeModalOpen.set(true)
export const closeUpgradeModal = (): void => isUpgradeModalOpen.set(false)
