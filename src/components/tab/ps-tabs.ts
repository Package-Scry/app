class Tabs extends HTMLElement {
  activeTab: string
  tabs: string[]

  constructor() {
    super()

    this.activeTab = localStorage.getItem("activeTab")
    this.tabs = localStorage.getItem("tabs")
      ? localStorage
          .getItem("tabs")
          .split(",")
          .filter(tab => tab)
      : []

    window.api.receive("packages", (data: { name: string }) => {
      this.activeTab = data.name
      localStorage.setItem("activeTab", this.activeTab)

      if (!this.tabs.includes(this.activeTab)) {
        this.tabs = [...this.tabs, this.activeTab]

        localStorage.setItem("tabs", `${this.tabs.join(",")},`)
      }

      this.render()
    })
  }

  rerenderTable() {
    const table = document.querySelector<
      HTMLElement & { shouldRerender: string }
    >("ps-table")

    table.shouldRerender = "true"
  }

  close(tab: string) {
    const replacedTabs = localStorage.getItem("tabs").replace(`${tab},`, "")

    localStorage.setItem("tabs", replacedTabs)

    this.tabs = replacedTabs ? replacedTabs.split(",").filter(tab => tab) : []
    this.activeTab = replacedTabs ? this.tabs[0] : ""

    localStorage.setItem("activeTab", this.activeTab)

    const path = this.activeTab
      ? localStorage.getItem(`dirPath-${this.activeTab}`)
      : null

    window.api.send("workspaceFolder", { path })

    this.rerenderTable()
    this.render()
  }

  render() {
    this.setAttribute(
      "class",
      "flex flex-row bg-gray-4 w-full h-10 top-0 shadow"
    )

    const plusStyle = `text-2xl text-white cursor-pointer font-serif font-semibold leading-normal pt-2 hover:text-3xl plus`
    const plus = `<div class="flex justify-center content-center w-7 h-full"><div class="${plusStyle}">+</div></div>`
    const tabStyle =
      "relative cursor-pointer bg-gray-11 h-8 px-10 rounded-t font-serif text-white text-lg self-end shadow-drop mr-0.5 first:ml-2 hover:bg-gray-12"

    this.innerHTML = `${this.tabs
      .map(
        tab =>
          `<ps-tab class="${tabStyle}" activeTab="${this.activeTab}" name="${tab}"></ps-tab>`
      )
      .join("")}${plus}`

    const tabs = document.querySelectorAll<HTMLElement>("ps-tab")
    const closeButtons = document.querySelectorAll<HTMLElement>(".close")
    const elPlus = document.querySelector<HTMLElement>(".plus")

    closeButtons.forEach((button, i) =>
      button.addEventListener("click", e => {
        e.stopPropagation()
        this.close(this.tabs[i])
      })
    )
    tabs.forEach((tab, i) =>
      tab.addEventListener("click", () => {
        const path = localStorage.getItem(`dirPath-${this.tabs[i]}`)

        window.api.send("workspaceFolder", { path })
      })
    )
    elPlus.addEventListener("click", () =>
      window.api.send("workspaceFolder", { path: null })
    )
  }

  connectedCallback() {
    this.render()
  }
}

window.customElements.define("ps-tabs", Tabs)
