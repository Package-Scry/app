class Header extends HTMLElement {
  sizes = {
    big: "3xl",
    medium: "xl",
    small: "sm",
  }

  connectedCallback() {
    const size: "big" | "medium" | "small" = (this.getAttribute("size") ??
      "big") as "big" | "medium" | "small"

    this.innerHTML = `<span class="text-white text-${this.sizes[size]} font-serif">${this.innerHTML}</span>`
  }
}

window.customElements.define("ps-header", Header)
