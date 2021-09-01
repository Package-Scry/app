<script lang="ts">
  import Column from "./Column.svelte"
  import Row from "./Row.svelte"
  import type { Column as ColumnType, Data } from "./index"
  import Header from "../typography/Header.svelte"
  import type { SvelteComponentDev } from "svelte/internal"

  export let data: Data
  export let columns: ColumnType[]
  export let headers: { text?: string; render?: typeof SvelteComponentDev }[]
</script>

<div class="text-center mx-12 mt-6 mb-20">
  <Row style="grid grid-cols-table grid-rows-table-header grid-flow-col mb-4">
    {#each headers as header}
      <Column style="bg-turquoise-1 justify-center" {...header}>
        <Header>{header.text}</Header>
      </Column>
    {/each}
  </Row>

  <ul>
    {#each data as rowData, i (rowData.name)}
      <Row>
        {#each columns as column, j}
          <Column
            {rowData}
            {...column}
            style={`${i % 2 === 0 ? "bg-gray-4" : "bg-turquoise-2"} ${
              j !== 0 ? "justify-center" : ""
            }`}
          />
        {/each}
      </Row>
    {/each}
  </ul>
</div>
