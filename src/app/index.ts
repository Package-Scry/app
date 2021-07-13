// eslint-disable-next-line
// @ts-ignore
__webpack_nonce__ = "c29tZSBke29sIHN0cmluZyB3aWxsIHBvcCB5cCAxMjM"

import App from "./App.svelte"

import "../css/base.css"

const app = new App({
  target: document.querySelector("#root"),
  props: {
    name: "world",
  },
})

export default app
