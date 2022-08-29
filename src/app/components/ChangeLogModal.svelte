<script lang="ts">
  import Modal from "./modal/Modal.svelte"
  import Base from "./typography/Base.svelte"
  import { closeChangeLogModal, isChangeLogModalOpen } from "./stores/ui"
  import { SendChannels } from "../../channels"
  import { packages, selectedPackage } from "./stores/package"

  $: console.log("$selectedPackage")
  $: console.log($selectedPackage)
  $: console.log($packages.find(({ name }) => $selectedPackage === name))

  $: changeLog = $packages.find(({ name }) => name === $selectedPackage)
    ?.changeLogs[0].changes.breaking
</script>

<Modal
  headerText="Changelog"
  buttonText="Close"
  onClick={() => closeChangeLogModal()}
  onCancel={() => closeChangeLogModal()}
  isVisible={$isChangeLogModalOpen}
  wrapperStyle="overflow-y-auto"
  style=" mb-40 mt-16"
>
  <div slot="content">
    <Base style="mt-4 text-left">
      {@html changeLog}
    </Base>
  </div>
</Modal>
