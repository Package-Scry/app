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

    window.api.receive("cancelled", () => {
      if (!this.activeTab) window.api.send("workspaceFolder", { path: null })
    })

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
    localStorage.removeItem(`dirPath-${tab}`)

    this.tabs = replacedTabs ? replacedTabs.split(",").filter(tab => tab) : []

    if (this.activeTab === tab) {
      this.activeTab = replacedTabs ? this.tabs[0] : ""
      localStorage.setItem("activeTab", this.activeTab)

      const path = this.activeTab
        ? localStorage.getItem(`dirPath-${this.activeTab}`)
        : null

      window.api.send("workspaceFolder", { path })

      this.rerenderTable()
    }

    this.render()
  }

  render() {
    this.className = "flex flex-row bg-gray-4 w-full h-10 top-0"

    const plusStyle = `text-2xl text-white cursor-pointer font-serif font-semibold leading-normal pt-2 hover:text-3xl plus`
    const plus = `<div class="flex justify-center content-center w-7 h-full"><div class="${plusStyle}">+</div></div>`

    this.innerHTML = `${this.tabs
      .map(
        tab => `<ps-tab activeTab="${this.activeTab}" name="${tab}"></ps-tab>`
      )
      .join(
        ""
      )}${plus}<ps-icon-logout class="ml-auto mt-1.5 mr-4"></ps-icon-logout>`

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

        if (this.tabs[i] !== this.activeTab)
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
