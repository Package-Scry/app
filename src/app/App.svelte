<script lang="ts">
  import PackageTable from "./components/PackageTable.svelte"
  import Workspaces from "./components/Workspaces.svelte"
  import { isLoggedIn } from "./components/stores/user"
  import LoginModal from "./components/LoginModal.svelte"
  import ProFeatureModal from "./components/ProFeatureModal.svelte"
  import UpgradeModal from "./components/UpgradeModal.svelte"
  import AuthHandler from "./components/AuthHandler.svelte"
  import UpgradeButton from "./components/UpgradeButton.svelte"
</script>

<AuthHandler />

{#if $isLoggedIn}
  <Workspaces />
  <PackageTable />
  <ProFeatureModal />
  <UpgradeModal />
{/if}

<div
  class="flex flex-row-reverse bg-gray-4 fixed w-full h-13 bottom-0 shadow-inner-2"
>
  <span
    class="bg-black-1 w-auto mx-5 py-1 px-8 rounded font-serif text-white text-xl self-center"
    >1.0.0</span
  >
  <span
    class="cursor-pointer bg-black-1 w-auto mx-2 py-1 px-6 rounded font-serif text-white text-lg self-center hover:bg-black-5"
  >
    Feedback
  </span>
  <UpgradeButton />
</div>

<LoginModal />
