import { svgScry } from "../../svg/scry"

class UpgradeButton extends HTMLElement {
  connectedCallback() {
    const style = `cursor-pointer bg-green-1 w-auto mr-auto ml-5 py-1 px-4 rounded font-serif text-white text-xl self-center hover:bg-green-2`
    this.outerHTML = `<span class="${style}" id="upgradeButton"><span class="text-white fill-current">${svgScry(
      "1.9em",
      "1.9em"
    )}</span><span class="align-middle ml-2.5">Upgrade to Pro</span></span>`
    const elUpgradeButton = document.querySelector("#upgradeButton")

    elUpgradeButton.addEventListener("click", () =>
      window.api.send("upgrade", {})
    )
  }
}

window.customElements.define("ps-upgrade", UpgradeButton)
