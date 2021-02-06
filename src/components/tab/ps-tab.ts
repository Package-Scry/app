class Tab extends HTMLElement {
  constructor() {
    super()

    this.activeTab = localStorage.getItem("activeTab")

    window.api.receive("packages", (data: TSFixMe) => {
      this.activeTab = data.name
    })
  }

  activeTab: string

  close() {
    const table = document.querySelector<
      HTMLElement & { shouldRerender: string }
    >("ps-table")

    table.shouldRerender = "true"
    localStorage.clear()
    window.api.send("workspaceFolder", { path: null })
  }

  connectedCallback() {
    const style =
      "relative cursor-pointer bg-gray-11 w-auto h-8 mx-2 px-10 rounded-t font-serif text-white text-lg self-end shadow-drop"
    const xStyle = "absolute -top-1 right-1.5"
    this.outerHTML = `<span class="${style}"><span class="align-middle">${this.activeTab}</span><span class="${xStyle}">x</span></span>`

    const span = document.querySelectorAll<HTMLElement>("span")[2]

    span.addEventListener("click", this.close)
  }
}

window.customElements.define("ps-tab", Tab)
