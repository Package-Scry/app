class Column extends HTMLElement {
  connectedCallback() {
    const isOdd: boolean = this.getAttribute("isOdd") === "true" ?? true
    const shouldAddMargin: boolean =
      this.getAttribute("shouldAddMargin") === "true" ?? true
    const style = `${isOdd ? "bg-turquoise-2" : "bg-gray-4"}${
      shouldAddMargin ? "ml-4" : ""
    }`

    this.innerHTML = `<div class="p-2 ${style}">${this.innerHTML}</div>`
  }
}

window.customElements.define("ps-column", Column)
