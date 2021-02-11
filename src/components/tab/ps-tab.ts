class Tab extends HTMLElement {
  connectedCallback() {
    const activeTab: string = this.getAttribute("activeTab")
    const name: string = this.getAttribute("name")
    const style =
      "relative cursor-pointer bg-gray-11 w-auto h-8 mx-2 px-10 rounded-t font-serif text-white text-lg self-end shadow-drop"
    const xStyle = "close absolute -top-1 right-1.5"
    this.innerHTML = `<span class="${style}"><span class="align-middle">${name}</span><span class="${xStyle}">x</span></span>`
  }
}

window.customElements.define("ps-tab", Tab)
