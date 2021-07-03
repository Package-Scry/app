// eslint-disable-next-line
// @ts-ignore
__webpack_nonce__ = "c29tZSBke29sIHN0cmluZyB3aWxsIHBvcCB5cCAxMjM"

import App from "./App.svelte"

import "../css/base.css"
import "../components/typography/ps-base"
import "../components/typography/ps-header"
import "../components/button/ps-button"
import "../components/button/ps-upgrade"
import "../components/icons/ps-logout"
import "../components/tab/ps-tab"
import "../components/tab/ps-tabs"
import "../components/modal/ps-modal"
import initEvents from "../events"

initEvents()

const app = new App({
  target: document.querySelector("#root"),
  props: {
    name: "world",
  },
})

export default app
