<script lang="ts">
  import Modal from "./modal/Modal.svelte"
  import Base from "./typography/Base.svelte"
  import Header from "./typography/Header.svelte"
  import { closeChangeLogModal, isChangeLogModalOpen } from "./stores/ui"
  import { packages, selectedPackage } from "./stores/package"

  $: console.log("$selectedPackage")
  $: console.log($selectedPackage)
  $: console.log($packages.find(({ name }) => $selectedPackage === name))

  $: changeLogs = $packages.find(
    ({ name }) => name === $selectedPackage
  )?.changeLogs
</script>

<Modal
  headerText="Changelog"
  buttonText="Close"
  onClick={() => closeChangeLogModal()}
  onCancel={() => closeChangeLogModal()}
  isVisible={$isChangeLogModalOpen}
  wrapperStyle="overflow-y-auto"
  style=" mb-40 mt-16 change-log-modal"
>
  <div slot="content">
    {#each changeLogs as changeLog}
      {#if !!changeLog.changes.breaking}
        <Header size="medium">{changeLog.version}</Header>
        <Base style="mt-4 text-left">
          {@html changeLog.changes.breaking}
        </Base>
      {/if}
    {/each}
  </div>
</Modal>
