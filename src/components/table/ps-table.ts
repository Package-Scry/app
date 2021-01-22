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
  getButton = (
    type: "primary" | "secondary" | "loading",
    text: "Update" | "Loading" | "Up to date"
  ) => `<ps-button type="${type}" class="ml-4">${text}</ps-button>`

  connectedCallback() {
    // const data: Data[] = (this.getAttribute("data") ?? []) as Data[]
    const data: Data[] = fakeData
    const header = `<div class="grid grid-cols-table grid-flow-col mb-4 bg-turquoise-2">${COLUMN_NAMES.map(
      (_, i) =>
        `<div class="p-2${
          i === COLUMN_NAMES.length - 1 ? " ml-4" : ""
        }"><ps-header size="medium">${COLUMN_NAMES[i]}</ps-header></div>`
    ).join("")}</div>`
    const rows = data
      .map((item, i) => {
        const columns = COLUMN_KEYS.map(
          name =>
            `<div class="p-2 ${
              i % 2 === 0 ? "bg-gray-4" : "bg-turquoise-2"
            }"><ps-base>${item[name]}</ps-base></div>`
        )

        return `<div class="grid grid-cols-table grid-flow-col mb-4">${columns.join(
          ""
        )}${this.getButton("primary", "Update")}</div>`
      })
      .join("")

    this.innerHTML = `<div class="text-blue-4 text-center mx-12 my-6">${header}${rows}</div>`
  }
}

window.customElements.define("ps-table", Table)
