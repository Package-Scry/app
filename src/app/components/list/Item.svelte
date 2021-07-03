<script lang="ts">
  import Tick from "./Tick.svelte"
</script>

<li class="grid grid-flow-col items-center grid-cols-feature gap-x-5">
  <div><Tick /></div>
  <div><slot /></div>
</li>
