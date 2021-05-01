type Status = "up to date" | "outdated" | "updating" | "updatable"

interface Data {
  name: string
  local: string
  latest: string
  status: Status
  wanted: string
}

const fakeData: Data[] = [
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "up to date",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "updating",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
  {
    name: "react",
    local: "2.3.45",
    wanted: "1.0.0",
    latest: "17.0.1",
    status: "outdated",
  },
]

const COLUMN_KEYS: Array<keyof Data> = [
  "name",
  "local",
  "wanted",
  "latest",
  "status",
]
const COLUMN_NAMES = ["Name", "Local", "Wanted", "Latest", "Status", "Action"]
const BUTTON_STATE: {
  [key: string]: { text: ButtonText; type: ButtonTypes }
} = {
  loading: { text: "Loading", type: "loading" },
  outdated: { text: "Update", type: "primary" },
  "up to date": { text: "Up to date", type: "secondary" },
  updatable: { text: "Update", type: "primary" },
  updating: { text: "Loading", type: "loading" },
}

class Table extends HTMLElement {
  constructor() {
    super()

    window.api.receive("packages", (data: TSFixMe) => {
      const { filePath, name, packages } = data

      if (filePath) {
        this.packages = packages

        localStorage.setItem(`dirPath-${name}`, filePath)

        this.render()
      }
    })

    window.api.receive(
      "outdated",
      (data: { name: string; wanted: string; latest: string }[]) => {
        this.packages = this.packages.map(npmPackage => {
          const { name, local } = npmPackage
          const selectedPackage = data.find(p => p.name === name)

          if (selectedPackage) {
            const { wanted, latest } = selectedPackage

            return {
              ...npmPackage,
              wanted,
              latest,
              status: wanted === latest ? "updatable" : "outdated",
            }
          }
          return {
            ...npmPackage,
            latest: local,
            wanted: "-",
            status: "up to date",
          }
        })

        this.render()
      }
    )

    window.api.receive(
      "packageUpdated",
      (data: { name: string; version: string }) => {
        const { name, version } = data
        const packageIndex = this.getData().findIndex(p => p.name === name)
        const updatedPacakge = this.packages[packageIndex]
        const { wanted, latest } = updatedPacakge

        this.packages[packageIndex] = {
          ...updatedPacakge,
          local: `^${version}`,
          status: latest === version ? "up to date" : "outdated",
          wanted: latest === version ? "-" : wanted,
        }

        this.updateRow(packageIndex)
      }
    )
  }

  get shouldRerender() {
    return this.getAttribute("shouldRerender")
  }

  set shouldRerender(_) {
    this.packages = null
    this.setAttribute("shouldRerender", "false")
    this.render()
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
    if (!["outdated", "updatable"].includes(this.getData()[i].status)) return
    const activeTab = localStorage.getItem("activeTab")
    const path = localStorage.getItem(`dirPath-${activeTab}`)
    const { name, local, wanted, latest } = this.getData()[i]
    const version =
      wanted !== latest && wanted !== local.replace("^", "") ? wanted : latest

    this.packages[i].status = "updating"
    this.updateRow(i)
    window.api.send("packageUpdate", { name, path, version })
  }

  getRow = (item: Data, i: number) => {
    const state = BUTTON_STATE[item.status]
    const columns = COLUMN_KEYS.map(
      (name, j) =>
        `<ps-column shouldCenter="${j !== 0}" isOdd="${
          i % 2 !== 0
        }"><ps-base text="${item[name]}">${item[name]}</ps-base></ps-column>`
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

    rowElement.outerHTML = this.getRow(this.getData()[i], i)
    this.updateButton(i)
  }

  updateButton(i: number, elButton?: HTMLElement) {
    const button =
      elButton ?? document.querySelectorAll<HTMLElement>("ps-button")[i]

    button.addEventListener("click", () => this.handleClick(i))
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

    buttons.forEach((button, i) => this.updateButton(i, button))
  }
}

window.customElements.define("ps-table", Table)
