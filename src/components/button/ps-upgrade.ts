class UpgradeButton extends HTMLElement {
  connectedCallback() {
    const style = `cursor-pointer bg-green-1 w-auto mr-auto ml-5 py-1 px-4 rounded font-serif text-white text-xl self-center hover:bg-green-2`
    this.outerHTML = `<span class="${style}" id="upgradeButton"><span class="bg-gray-2">O</span>Upgrade to Pro</span>`
    const elUpgradeButton = document.querySelector("#upgradeButton")

    elUpgradeButton.addEventListener("click", () =>
      window.api.send("upgrade", {})
    )
  }
}

window.customElements.define("ps-upgrade", UpgradeButton)
