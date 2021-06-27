<script lang="ts">
  import Column from "./Column.svelte"
  import Row from "./Row.svelte"
  import type { Column as ColumnType, Data } from "./index"

  export let data: Data
  export let columns: ColumnType[]
</script>

<div class="text-center mx-12 mt-6 mb-20">
  <ul>
    <slot />
    {#each data as rowData, i (rowData.name)}
      <Row>
        {#each columns as column}
          <Column
            {rowData}
            {...column}
            style={i % 2 === 0 ? "bg-gray-4" : undefined}
          />
        {/each}
      </Row>
    {/each}
  </ul>
</div>
