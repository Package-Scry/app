type Status = "up to date" | "outdated" | "updating"

interface Data {
  name: string
  local: string
  stable: string
  status: Status
}

const fakeData: Data[] = [
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "up to date" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "updating" },
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
const BUTTON_STATE: {
  [key: string]: { text: ButtonText; type: ButtonTypes }
} = {
  outdated: { text: "Update", type: "primary" },
  "up to date": { text: "Up to date", type: "secondary" },
  updating: { text: "Loading", type: "loading" },
}

class Table extends HTMLElement {
  getButton = (type: ButtonTypes, text: ButtonText, i: number) =>
    `<ps-button type="${type}" class="ml-4" i="${i}">${text}</ps-button>`
  data: Data[] = []
  handleClick = (name: string, i: number) => {
    this.data[i].status = "updating"
    console.log("here")
    // update package
  }

  connectedCallback() {
    // const data: Data[] = (this.getAttribute("data") ?? []) as Data[]
    this.data = fakeData
    const header = `<ps-row type="header">${COLUMN_NAMES.map(
      (_, i) =>
        `<div class="p-2${
          i === COLUMN_NAMES.length - 1 ? " ml-4" : ""
        }"><ps-header size="medium">${COLUMN_NAMES[i]}</ps-header></div>`
    ).join("")}</ps-row>`
    const rows = this.data
      .map((item, i) => {
        const state = BUTTON_STATE[item.status]
        const columns = COLUMN_KEYS.map(
          name =>
            `<div class="p-2 ${
              i % 2 === 0 ? "bg-gray-4" : "bg-turquoise-2"
            }"><ps-base>${item[name]}</ps-base></div>`
        )

        return `<ps-row>${columns.join("")}${this.getButton(
          state.type,
          state.text,
          i
        )}</ps-row>`
      })
      .join("")

    this.innerHTML = `<div class="text-blue-4 text-center mx-12 my-6">${header}${rows}</div>`
    const buttons = document.querySelectorAll<HTMLElement>("ps-button")
    buttons.forEach((button, i) => {
      button.addEventListener("click", () =>
        this.handleClick(this.data[i].name, i)
      )
    })
  }

  // render() {

  // }
}

window.customElements.define("ps-table", Table)
