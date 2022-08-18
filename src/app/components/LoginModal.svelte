<script lang="ts">
  import { SendChannels } from "../../../custom"

  import Modal from "./modal/Modal.svelte"
  import { isLoggedIn } from "./stores/user"
</script>

<Modal
  headerText="Login"
  buttonText="Login with GitHub"
  buttonIcon="github"
  onClick={() => {
    window.api.send(SendChannels.Authenticate, {})
  }}
  onCancel={() => {}}
  isVisible={!$isLoggedIn}
/>
