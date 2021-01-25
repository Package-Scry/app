type RowTypes = "default" | "header"

class Row extends HTMLElement {
  connectedCallback() {
    const type: RowTypes = (this.getAttribute("type") ?? "default") as RowTypes
    const style = `grid grid-cols-table grid-flow-col mb-4 ${
      type === "header" ? "bg-turquoise-1" : ""
    }`

    this.innerHTML = `<div class="${style}">${this.innerHTML}</div>`
  }
}

window.customElements.define("ps-row", Row)
