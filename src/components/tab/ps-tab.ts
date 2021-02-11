class Tab extends HTMLElement {
  connectedCallback() {
    const activeTab: string = this.getAttribute("activeTab")
    const name: string = this.getAttribute("name")
    const style = ""
    const xStyle = "close absolute -top-1 right-1.5"
    this.innerHTML = `<span class="align-middle">${name}</span><span class="${xStyle}">x</span>`
  }
}

window.customElements.define("ps-tab", Tab)
