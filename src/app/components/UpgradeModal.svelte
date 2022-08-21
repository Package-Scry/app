<script lang="ts">
  import Modal from "./modal/Modal.svelte"
  import Base from "./typography/Base.svelte"
  import Item from "./list/Item.svelte"
  import { isUpgradeModalOpen, closeUpgradeModal } from "./stores/ui"
  import { SendChannels } from "../../channels"
</script>

<Modal
  headerText="Upgrade to Pro"
  buttonText="Upgrade to Pro"
  cancelText="Skip upgrade for now"
  onCancel={() => {
    closeUpgradeModal()
  }}
  onClick={() => {
    window.api.send({ channel: SendChannels.Upgrade, meta: {} })

    closeUpgradeModal()
  }}
  isVisible={$isUpgradeModalOpen}
>
  <div slot="content">
    <Base style="block mt-4 text-xl">Your free trial has just ended.</Base>
    <Base style="block mt-2 text-xl">
      Want to enjoy the full feature set of Package Scry?
    </Base>
    <ul class="mt-14 grid text-left justify-center">
      <Item>Ad-free</Item>
      <Item>Commercial Use</Item>
      <Item>Unlimited workspaces</Item>
      <Item>Priority support</Item>
    </ul>
  </div>
</Modal>
