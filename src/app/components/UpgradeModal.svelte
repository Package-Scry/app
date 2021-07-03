<script lang="ts">
  import Modal from "./components/modal/Modal.svelte"
  import Base from "./components/typography/Base.svelte"
  import Item from "./components/list/Item.svelte"

  // TODO: get this from store
  export let isVisible = false
</script>

<Modal
  headerText="Upgrade to Pro"
  buttonText="Upgrade to Pro"
  cancelText="Skip upgrade for now"
  onCancel={() => {
    isVisible = false
  }}
  onClick={() => {
    window.api.send("upgrade", {})

    isVisible = false
  }}
  {isVisible}
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
