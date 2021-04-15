class Column extends HTMLElement {
  connectedCallback() {
    const isOdd: boolean = this.getAttribute("isOdd") === "true" ?? true
    const type: RowTypes = (this.getAttribute("type") ?? "default") as RowTypes
    const shouldAddMargin: boolean =
      this.getAttribute("shouldAddMargin") === "true" ?? true
    const style = `${
      type === "header"
        ? "bg-turquoise-1"
        : isOdd
        ? "bg-turquoise-2"
        : "bg-gray-4"
    }${shouldAddMargin ? "ml-4" : ""}`

    this.innerHTML = `<div class="px-2 truncate h-full flex items-center justify-center ${style}">${this.innerHTML}</div>`
  }
}

window.customElements.define("ps-column", Column)
