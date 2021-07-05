<script lang="ts">
  import PackageTable from "./components/PackageTable.svelte"
  import Workspaces from "./components/Workspaces.svelte"
  import { isLoggedIn } from "./components/stores/user"
  import LoginModal from "./components/LoginModal.svelte"
  import ProFeatureModal from "./components/ProFeatureModal.svelte"
  import UpgradeModal from "./components/UpgradeModal.svelte"
  import AuthHandler from "./components/AuthHandler.svelte"
</script>

<AuthHandler />

{#if $isLoggedIn}
  <Workspaces />
  <PackageTable />
  <ProFeatureModal />
  <UpgradeModal />
{/if}

<LoginModal />
