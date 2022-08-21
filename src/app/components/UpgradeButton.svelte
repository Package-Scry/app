<script lang="ts">
  import { SendChannels } from "../../channels"

  import Scry from "./icon/Scry.svelte"

  const style =
    "cursor-pointer bg-green-1 w-auto mr-auto ml-5 py-1 px-4 rounded font-serif text-white text-xl self-center hover:bg-green-2"
  const onClick = () => {
    window.api.send({ channel: SendChannels.Upgrade, meta: {} })
  }
</script>

<span class={style} on:click={onClick}>
  <span class="text-white fill-current"><Scry /></span>
  <span class="align-middle ml-2.5">Upgrade to Pro</span>
</span>
