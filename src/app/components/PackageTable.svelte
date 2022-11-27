<script lang="ts">
  import Table from "./Table/Table.svelte"
  import Button from "./ActionButton.svelte"
  import ChangeLogIcon from "./ChangeLogIcon.svelte"
  import {
    packages,
    updatePackage,
    updatePackages,
    isUpdatingAll,
    Status,
  } from "./stores/package"
  import { ReceiveChannels, SendChannels } from "../../channels"
  import { dataForceInstallModal, openForceInstallModal } from "./stores/ui"

  enum COLUMN_KEYS {
    Name = "name",
    Local = "local",
    Wanted = "wanted",
    Latest = "latest",
    Status = "status",
    ChangeLog = "changeLog",
  }

  window.api.receive({
    channel: ReceiveChannels.UpdatedAllPackage,
    fn: ({ data, meta, wasSuccessful }) => {
      const { error, type } = data ?? {}
      const { workspace } = meta
      const activeTab = localStorage.getItem("activeTab")

      if (workspace === activeTab) {
        if (error) {
          openForceInstallModal()
          dataForceInstallModal.set({ type, error })
        }

        const path = localStorage.getItem(`dirPath-${workspace}`)

        // TODO: add refresh event instead?

        window.api.send({
          channel: SendChannels.OpenWorkspaceFolder,
          meta: {
            path,
          },
          data: { workspaceCount: 0 },
        })
      }
    },
  })

  window.api.receive({
    channel: ReceiveChannels.GetOutdatedPackages,
    fn: ({ data, meta }) => {
      const { packages: newPackages } = data
      const { workspace } = meta
      const activeTab = localStorage.getItem("activeTab")

      if (activeTab !== workspace) return

      isUpdatingAll.set(false)

      const packagesWithBreakingChange = newPackages
        .filter(({ wanted, latest, name }) => {
          const local = $packages
            .find(npmPackage => npmPackage.name === name)
            ?.local.replace("^", "")

          return latest !== wanted && latest !== local
        })
        .map(({ name }) => {
          const local = $packages
            .find(npmPackage => npmPackage.name === name)
            ?.local.replace("^", "")

          return { name, currentVersion: local }
        })

      if (!!packagesWithBreakingChange.length) {
        const chunk = (
          arr: {
            name: string
            currentVersion: string
          }[],
          size: number
        ) =>
          Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
          )

        chunk(packagesWithBreakingChange, 100).forEach(chunkedPackages =>
          window.api.send({
            channel: SendChannels.GetChangeLog,
            data: {
              packages: chunkedPackages,
            },
            meta: {
              workspace: activeTab,
              path: localStorage.getItem(`dirPath-${activeTab}`),
            },
          })
        )
      }

      updatePackages(newPackages)
    },
  })

  window.api.receive({
    channel: ReceiveChannels.PackageUpdateErrored,
    fn: ({ data, meta }) => {
      const { workspace } = meta
      const activeTab = localStorage.getItem("activeTab")

      if (activeTab !== workspace) return

      const { name, version, error } = data

      openForceInstallModal()
      dataForceInstallModal.set({ name, version, error })
    },
  })

  window.api.receive({
    channel: ReceiveChannels.SendChangeLog,
    fn: ({ data, meta }) => {
      const { workspace } = meta
      const activeTab = localStorage.getItem("activeTab")

      if (activeTab !== workspace) return

      updatePackage(data)
    },
  })

  window.api.receive({
    channel: ReceiveChannels.GetPackages,
    fn: ({ data }) => {
      const { filePath, name, packages: eventPackages } = data

      isUpdatingAll.set(true)

      if (filePath) {
        packages.set(eventPackages)

        localStorage.setItem(`dirPath-${name}`, filePath)
      }
    },
  })

  window.api.receive({
    channel: ReceiveChannels.PackageUpdated,
    fn: ({ data, meta, wasSuccessful }) => {
      const { name, version } = data
      const { workspace } = meta
      const activeTab = localStorage.getItem("activeTab")

      if (activeTab !== workspace) return

      isUpdatingAll.set(false)

      const currentPackage = $packages.find(
        npmPackage => npmPackage.name === name
      )
      const { latest, local, wanted } = currentPackage

      const status = !wasSuccessful
        ? wanted === latest
          ? Status.Updatable
          : Status.Outdated
        : latest === version
        ? Status.UpToDate
        : Status.Outdated
      const updatedWanted = wasSuccessful
        ? latest === version
          ? { wanted: "-" }
          : { wanted }
        : {}

      updatePackage({
        name,
        status,
        local: wasSuccessful ? `^${version}` : local,
        ...updatedWanted,
      })
    },
  })

  const COLUMN_NAMES = [
    { text: "Name" },
    { text: "Local" },
    { text: "Wanted" },
    { text: "Latest" },
    { text: "" },
  ]
  const columns = [
    { dataKey: COLUMN_KEYS.Name },
    { dataKey: COLUMN_KEYS.Local },
    { dataKey: COLUMN_KEYS.Wanted, render: Button },
    { dataKey: COLUMN_KEYS.Latest, render: Button },
    { dataKey: COLUMN_KEYS.ChangeLog, render: ChangeLogIcon },
  ]
</script>

<Table data={$packages} {columns} headers={COLUMN_NAMES} />
