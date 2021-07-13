import { writable } from "svelte/store"

export interface Package {
  name: string
  local: string
  wanted: string
  latest: string
  status: string
}
export interface PackageData {
  name: string
  local?: string
  wanted?: string
  latest?: string
  status?: string
}

interface OutdatedEvent {
  packages: Package[]
  project: string
}
interface PackagesEvent {
  packages: Package[]
  filePath: string
  name: string
}
interface UpdatedEvent {
  name: string
  version: string
  project: string
  wasSuccessful: boolean
}

export const packages = writable<Package[]>([])

export const requestUpdatePackage = (name: string, version: string): void => {
  const activeTab = localStorage.getItem("activeTab")
  const path = localStorage.getItem(`dirPath-${activeTab}`)

  window.api.send("packageUpdate", {
    name,
    path,
    version,
    project: activeTab,
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
        status: "loading",
      },
      ...oldPackages.slice(packageIndex + 1),
    ]
  })
}

window.api.receive("packages", (data: PackagesEvent) => {
  const { filePath, name, packages: eventPackages } = data

  if (filePath) {
    packages.set(eventPackages)

    localStorage.setItem(`dirPath-${name}`, filePath)
  }
})

window.api.receive("outdated", (data: OutdatedEvent) => {
  const { packages: newPackages, project } = data
  const activeTab = localStorage.getItem("activeTab")

  if (activeTab !== project) return

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
          status: wanted === latest ? "updatable" : "outdated",
        }
      }

      return {
        ...oldPackage,
        latest: local.replace("^", ""),
        wanted: "-",
        status: "up to date",
      }
    })
  )
})

export const updatePackage = (data: PackageData): void => {
  const { name } = data

  packages.update(oldPackages => {
    const packageIndex = oldPackages.findIndex(
      npmPackage => npmPackage.name === name
    )
    const updatedPackage = oldPackages[packageIndex]

    return [
      ...oldPackages.slice(0, packageIndex),
      {
        ...updatedPackage,
        ...data,
      },
      ...oldPackages.slice(packageIndex + 1),
    ]
  })
}
