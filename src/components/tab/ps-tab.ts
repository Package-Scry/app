class Tab extends HTMLElement {
  connectedCallback() {
    const style =
      "relative cursor-pointer bg-gray-2 w-auto h-10 mx-2 px-8 py-2 rounded-t font-serif text-white leading-6 text-lg self-end"
    const xStyle = "absolute -top-1 right-1.5"
    this.outerHTML = `<span class="${style}"><span>${this.innerHTML}</span><span class="${xStyle}">x</span></span>`
  }
}

window.customElements.define("ps-tab", Tab)
