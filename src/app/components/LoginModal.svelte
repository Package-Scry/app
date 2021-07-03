<script lang="ts">
  import Modal from "./components/modal/Modal.svelte"

  // TODO: get this from store
  export let isVisible = false
</script>

<Modal
  headerText="Login"
  buttonText="Login with GitHub"
  buttonIcon="github"
  onClick={() => {
    window.api.send("authenticate", {})

    isVisible = false
  }}
  {isVisible}
/>
