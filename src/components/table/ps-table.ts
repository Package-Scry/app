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
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
  { name: "react", local: "2.3.45", stable: "17.0.1", status: "outdated" },
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
const BUTTON_STATE: {
  [key: string]: { text: ButtonText; type: ButtonTypes }
} = {
  outdated: { text: "Update", type: "primary" },
  "up to date": { text: "Up to date", type: "secondary" },
  updating: { text: "Loading", type: "loading" },
}

class Table extends HTMLElement {
  constructor() {
    super()

    window.api.receive("packages", (data: TSFixMe) => {
      const { filePath, name, packages } = data

      this.packages = packages

      localStorage.setItem("activeTab", name)
      localStorage.setItem(`dirPath-${name}`, filePath)

      this.render()
    })
  }

  packages: Data[] | null = null

  getData = (): Data[] => {
    if (this.packages) return this.packages

    return fakeData
  }

  getButton = (type: ButtonTypes, text: ButtonText, i: number) =>
    `<ps-button type="${type}" class="ml-4" i="${i}">${text}</ps-button>`

  data: Data[] = []

  handleClick = (i: number) => {
    this.data[i].status = "updating"

    this.updateRow(i)

    // update package
  }

  getRow = (item: Data, i: number) => {
    const state = BUTTON_STATE[item.status]
    const columns = COLUMN_KEYS.map(
      name =>
        `<ps-column isOdd="${i % 2 !== 0}"><ps-base text="${item[name]}">${
          item[name]
        }</ps-base></ps-column>`
    )

    return `<ps-row>${columns.join("")}${this.getButton(
      state.type,
      state.text,
      i
    )}</ps-row>`
  }

  getHeader = () =>
    `<ps-row type="header">${COLUMN_NAMES.map(
      (name, i) =>
        `<ps-column type="header" shouldAddMargin="${
          i === COLUMN_NAMES.length - 1
        }"><ps-header size="big">${name}</ps-header></ps-column>`
    ).join("")}</ps-row>`

  updateRow = (i: number) => {
    const rowElement = document.querySelectorAll<HTMLElement>("ps-row")[i + 1]

    rowElement.outerHTML = this.getRow(this.data[i], i)
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const header = this.getHeader()
    const rows = this.getData()
      .map((item, i) => {
        return this.getRow(item, i)
      })
      .join("")

    this.innerHTML = `<div class="text-center mx-12 mt-6 mb-20">${header}${rows}</div>`

    const buttons = document.querySelectorAll<HTMLElement>("ps-button")

    buttons.forEach((button, i) => {
      if (this.getData()[i].status === "outdated")
        button.addEventListener("click", () => this.handleClick(i))
    })
  }
}

window.customElements.define("ps-table", Table)
