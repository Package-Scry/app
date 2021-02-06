class Tab extends HTMLElement {
  connectedCallback() {
    const activeTab = localStorage.getItem("activeTab")
    const style =
      "relative cursor-pointer bg-gray-11 w-auto h-8 mx-2 px-10 rounded-t font-serif text-white text-lg self-end shadow-drop"
    const xStyle = "absolute -top-1 right-1.5"
    this.outerHTML = `<span class="${style}"><span class="align-middle">${activeTab}</span><span class="${xStyle}">x</span></span>`
  }
}

window.customElements.define("ps-tab", Tab)
