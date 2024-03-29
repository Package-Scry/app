import { writable } from "svelte/store"
import { SendChannels } from "../../../channels"
import type { ChangeLog } from "../../../routes/getChangeLogs"

export interface Package {
  name: string
  local?: string
  wanted: string
  latest: string
  status?: Status
  changeLogs?: ChangeLog[]
}
export interface PackageData {
  name: string
  local?: string
  wanted?: string
  latest?: string
  status?: Status
  changeLogs?: ChangeLog[]
}
export enum Status {
  Loading = "loading",
  UpToDate = "up to date",
  Updatable = "updatable",
  Outdated = "outdated",
}
export const packages = writable<Package[]>([])
export const isUpdatingAll = writable<boolean>(false)
export const selectedPackage = writable<string>("")

export const requestUpdatePackage = (
  name: string,
  version: string,
  shouldForceInstall?: boolean
): void => {
  const activeTab = localStorage.getItem("activeTab")
  const path = localStorage.getItem(`dirPath-${activeTab}`)

  isUpdatingAll.set(true)

  window.api.send({
    channel: SendChannels.PackageUpdate,
    data: { name, version, shouldForceInstall },
    meta: {
      path,
      workspace: activeTab,
    },
  })

  packages.update(oldPackages => {
    const packageIndex = oldPackages.findIndex(
      npmPackage => npmPackage.name === name
    )
    const updatedPackage = oldPackages[packageIndex]

    return [
      ...oldPackages.slice(0, packageIndex),
      {
        ...updatedPackage,
        status: Status.Loading,
      },
      ...oldPackages.slice(packageIndex + 1),
    ]
  })
}

export const updatePackages = (newPackages: Package[]): void => {
  packages.update(oldPackages =>
    oldPackages.map(oldPackage => {
      const { name, local } = oldPackage
      const selectedPackage = newPackages.find(
        newPackage => newPackage.name === name
      )

      if (selectedPackage) {
        const { wanted, latest } = selectedPackage

        return {
          ...oldPackage,
          wanted,
          latest,
          status: wanted === latest ? Status.Updatable : Status.Outdated,
        }
      }

      return {
        ...oldPackage,
        latest: local.replace("^", ""),
        wanted: "-",
        status: Status.UpToDate,
      }
    })
  )
}

export const updatePackage = (data: PackageData): void => {
  const { name } = data

  packages.update(oldPackages =>
    oldPackages.map(npmPackage =>
      npmPackage.name === name
        ? {
            ...npmPackage,
            ...data,
          }
        : npmPackage
    )
  )
}

export const requestUpdateAllPackage = (
  type: "wanted" | "latest",
  shouldForceInstall?: boolean
): void => {
  const activeTab = localStorage.getItem("activeTab")
  const path = localStorage.getItem(`dirPath-${activeTab}`)

  isUpdatingAll.set(true)

  packages.update(oldPackages => {
    return oldPackages.map(oldPackage => ({
      ...oldPackage,
      wanted: "loading",
      latest: "loading",
      status: Status.Loading,
    }))
  })

  window.api.send({
    channel: SendChannels.UpdateAllPackages,
    data: {
      type,
      shouldForceInstall,
    },
    meta: {
      path,
      workspace: activeTab,
    },
  })
}
