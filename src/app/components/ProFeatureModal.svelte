<script lang="ts">
  import Modal from "./modal/Modal.svelte"
  import Base from "./typography/Base.svelte"
  import { closeProModal, isProModalOpen } from "./stores/ui"
  import { SendChannels } from "../../../custom"
</script>

<Modal
  headerText="You've discovered a Pro featutre!"
  buttonText="Upgrade to Pro"
  cancelText="Skip upgrade for now"
  onCancel={() => {
    closeProModal()
  }}
  onClick={() => {
    window.api.send({ channel: SendChannels.Upgrade, meta: {} })

    closeProModal()
  }}
  isVisible={$isProModalOpen}
>
  <div slot="content">
    <Base style="mt-4 text-xl">
      With Pro you can enjoy Unlimited Workspaces.
    </Base>
  </div>
</Modal>
