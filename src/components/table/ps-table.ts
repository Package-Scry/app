interface Data {
  name: string
  local: string
  stable: string
  status: "up to date" | "outdated"
}

class Table extends HTMLElement {
  connectedCallback() {
    const columnNames: Array<keyof Data> = ["name", "local", "stable", "status"]
    const data: Data[] = (this.getAttribute("data") ?? []) as Data[]
    const rows = data.map(item => {
      const columns = columnNames.map(name => `<div>${item[name]}</div>`)

      return `<div>${columns.join("")}</div>`
    })

    this.innerHTML = `<div>${rows.join("")}</div>`
  }
}

window.customElements.define("ps-table", Table)
