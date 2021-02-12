class Tab extends HTMLElement {
  connectedCallback() {
    const tabStyle =
      "relative cursor-pointer px-10 rounded-t font-serif text-white text-lg self-end shadow-drop mr-0.5 first:ml-2"
    const activeStyle = "bg-black-2 h-9 leading-loose hover:bg-black-4"
    const activeTab: string = this.getAttribute("activeTab")
    const name: string = this.getAttribute("name")
    const style =
      activeTab === name
        ? `${activeStyle} ${tabStyle}`
        : `${tabStyle} bg-gray-11 h-8 hover:bg-gray-12`
    const xStyle =
      "close absolute -top-1 right-1 font-sans-serif text-base font-thin"
    this.innerHTML = `<span class="align-middle">${name}</span><span class="${xStyle}">x</span>`
    this.className = style
  }
}

window.customElements.define("ps-tab", Tab)
