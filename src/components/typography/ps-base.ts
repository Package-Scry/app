class Base extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<span class="text-black text-base font-serif">${this.innerHTML}</span>`
  }
}

window.customElements.define("ps-base", Base)
