class Base extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<span class="text-white text-lg font-serif">${this.innerHTML}</span>`
  }
}

window.customElements.define("ps-base", Base)
