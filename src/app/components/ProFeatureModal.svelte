<script lang="ts">
  import Modal from "./components/modal/Modal.svelte"
  import Base from "./components/typography/Base.svelte"

  // TODO: get this from store
  export let isVisible = false
</script>

<Modal
  headerText="You've discovered a Pro featutre!"
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
    <Base style="mt-4 text-xl">
      With Pro you can enjoy Unlimited Workspaces.
    </Base>
  </div>
</Modal>
