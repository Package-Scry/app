import type { SvelteComponentDev } from "svelte"

export type Data = Row[]
export interface Row {
  [key: string]: TSFixMe
}
export interface Column {
  dataKey?: string
  render?: SvelteComponentDev
  onClick?: (e: Event) => void
}
