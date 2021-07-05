<script lang="ts">
  import Modal from "./modal/Modal.svelte"
  import { isLoggedIn } from "./stores/user"
</script>

<Modal
  headerText="Login"
  buttonText="Login with GitHub"
  buttonIcon="github"
  onClick={() => {
    window.api.send("authenticate", {})
  }}
  onCancel={() => {}}
  isVisible={!$isLoggedIn}
/>
