<script lang="ts">
  import PackageTable from "./components/PackageTable.svelte"
  import Workspaces from "./components/Workspaces.svelte"
  import { hasPro, isLoggedIn } from "./components/stores/user"
  import LoginModal from "./components/LoginModal.svelte"
  import ProFeatureModal from "./components/ProFeatureModal.svelte"
  import UpgradeModal from "./components/UpgradeModal.svelte"
  import AuthHandler from "./components/AuthHandler.svelte"
  import UpgradeButton from "./components/UpgradeButton.svelte"
  import Header from "./components/typography/Header.svelte"
  import HeaderButton from "./components/HeaderButton.svelte"

  const onClick = () => window.api.send("feedback", {})
</script>

<AuthHandler />

{#if $isLoggedIn}
  <Workspaces />
  <div
    class="grid grid-cols-2 items-center grid-rows-table gap-y-4 gap-x-4 my-4 mx-14"
  >
    <Header
      style="w-full h-full bg-turquoise-1 col-span-full justify-center px-2 flex items-center"
    >
      Actions
    </Header>
    <HeaderButton />
    <HeaderButton isWanted={false} />
  </div>

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
    on:click={onClick}
  >
    Feedback
  </span>
  {#if !$hasPro}
    <UpgradeButton />
  {/if}
</div>

<LoginModal />
