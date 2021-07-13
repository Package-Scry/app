<script lang="ts">
  import Logout from "./icon/Logout.svelte"
  import { logout } from "./stores/user"
</script>

<span on:click={logout}> <Logout /></span>
