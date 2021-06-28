<script lang="ts">
  import Button from "./button/Button.svelte"
  import type Row from "./Table/index"

  type ButtonText = "Update" | "Loading" | "Up to date"
  type ButtonTypes = "primary" | "secondary" | "loading"
  type Status = "loading" | "up to date" | "updatable"

  export let rowData: { status: Status; name: string }
  export let onClick = () => {
    console.log(rowData.name)
  }

  $: status = rowData.status
  $: type =
    status === "loading"
      ? "loading"
      : status === "up to date"
      ? "secondary"
      : ("primary" as ButtonTypes)
  $: text =
    status === "loading"
      ? "Loading"
      : status === "up to date"
      ? "Up to date"
      : ("Update" as ButtonText)
</script>

<Button {text} {type} {status} {onClick} />
