type ButtonTypes = "primary" | "secondary" | "loading"
type ButtonText = "Update" | "Loading" | "Up to date"

class Button extends HTMLElement {
  styles = {
    common: `cursor-pointer select-none rounded-md text-center h-full flex items-center justify-center`,
    primary: `bg-turquoise-4 hover:bg-gray-3 hover:shadow-inner`,
    secondary: `border-2 border-turquoise-5`,
    loading: `bg-gray-6`,
  }

  connectedCallback() {
    const type: ButtonTypes = (this.getAttribute("type") ??
      "primary") as ButtonTypes

    const style = `${this.styles.common} ${this.styles[type]}`
    this.innerHTML = `<div class="${style}"><ps-header size="medium">${this.innerHTML}</ps-header></div>`
  }
}

window.customElements.define("ps-button", Button)
