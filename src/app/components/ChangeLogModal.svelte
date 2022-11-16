<script lang="ts">
  import Modal from "./modal/Modal.svelte"
  import Text from "./typography/Text.svelte"
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
        <Header size="medium" style="mt-8">{changeLog.version}</Header>
        <Text style="mt-4 text-left text-l">
          {@html changeLog.changes.breaking}
        </Text>
      {/if}
    {/each}
  </div>
</Modal>
