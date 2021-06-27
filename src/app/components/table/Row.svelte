<script lang="ts">
  export let style = "grid grid-cols-table grid-rows-table grid-flow-col mb-4 "
</script>

<li class="px-2 truncate h-full flex items-center {style}">
  <slot>loading</slot>
</li>
