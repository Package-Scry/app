interface Data {
  name: string
  local: string
  stable: string
  status: "up to date" | "outdated"
}

const fakeData: Data[] = [
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
]

const COLUMN_KEYS: Array<keyof Data> = ["name", "local", "stable", "status"]
const COLUMN_NAMES = [
  "Name",
  "Version (local)",
  "Version (stable)",
  "Status",
  "Action",
]

class Table extends HTMLElement {
  sizes = {
    big: "3xl",
    medium: "xl",
    small: "sm",
  }

  connectedCallback() {
    // const data: Data[] = (this.getAttribute("data") ?? []) as Data[]
    const data: Data[] = fakeData
    const header = `<div class="grid grid-cols-5 grid-flow-col mb-2 bg-turquoise-2">${COLUMN_NAMES.map(
      (_, i) =>
        `<div class="p-2"><ps-header size="medium">${COLUMN_NAMES[i]}</ps-header></ps-header></div>`
    ).join("")}</div>`
    const rows = data
      .map((item, i) => {
        const columns = COLUMN_KEYS.map(
          name =>
            `<div class="p-2 ${
              i % 2 === 0 ? "bg-gray-4" : "bg-turquoise-2"
            }"><ps-base>${item[name]}</ps-base></div>`
        )

        return `<div class="grid grid-cols-5 grid-flow-col mb-2">${columns.join(
          ""
        )}</div>`
      })
      .join("")

    this.innerHTML = `<div class="text-blue-4 text-center mx-12">${header}${rows}</div>`
  }
}

window.customElements.define("ps-table", Table)
