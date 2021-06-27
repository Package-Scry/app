import type { SvelteComponent } from "svelte"

export type Data = Row[]
export interface Row {
  [key: string]: TSFixMe
}
export interface Column {
  dataKey?: string
  render?: SvelteComponent
  onClick?: (e: Event) => void
}
