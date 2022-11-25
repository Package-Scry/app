<script lang="ts">
  import Modal from "./modal/Modal.svelte"
  import Text from "./typography/Text.svelte"
  import Header from "./typography/Header.svelte"
  import {
    dataForceInstallModal,
    closeForceInstallModal,
    isForceInstallModalOpen,
  } from "./stores/ui"
  import { requestUpdatePackage } from "./stores/package"
  import Button from "./button/Button.svelte"

  $: error = $dataForceInstallModal?.error
  $: name = $dataForceInstallModal?.name
  $: version = $dataForceInstallModal?.version

  const forceInstall = () => {
    closeForceInstallModal()
    requestUpdatePackage(name, version, true)
  }
</script>

<Modal
  headerText={`${name} error`}
  buttonText="Close"
  onClick={() => closeForceInstallModal()}
  onCancel={() => closeForceInstallModal()}
  isVisible={$isForceInstallModalOpen}
  wrapperStyle="overflow-y-auto bg-opacity-50"
  style=" mb-40 mt-16 change-log-modal">
  <div slot="content" class="text-left">
    <Header size="medium" style="mt-8 mb-4 text-left italic"
      >There was an error with the package installation. You can still try to
      force install it.</Header>
    <div class="grid">
      <Button
        onClick={() => forceInstall()}
        style="h-12 w-40 mb-8 justify-self-center">Force install</Button>
    </div>
    <Text style="mx-auto text-l bg-red-900 p-8 block">
      {error}
    </Text>
  </div>
</Modal>
