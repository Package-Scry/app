class Button extends HTMLElement {
  primary = `"cursor-pointer container w-36 m-4 p-2 bg-turquoise-4 hover:bg-gray-3 hover:shadow-inner rounded-md text-center"`

  connectedCallback() {
    this.innerHTML = `<div class=${this.primary}><ps-header size="medium">${this.innerHTML}</ps-header></div>`
  }
}

window.customElements.define("ps-button", Button)
