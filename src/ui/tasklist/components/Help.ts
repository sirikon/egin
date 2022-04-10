import m from "mithril"

import { HotkeyMap } from "../hotkeys"

interface HelpAttrs {
    hotkeys: HotkeyMap
}

export default function Help(vnode: m.Vnode<HelpAttrs>) {
  const hotkeys = () => vnode.attrs.hotkeys
  const view = () => m("div.egin-help", [
    m("div", [
      m("h1", "Help"),
      m("div.egin-help-keylist", [
        m("div.egin-help-bind-column", Object.entries(hotkeys()).map(([bind]) => {
          return m("div", extractKeys(bind).map(key => m("span.egin-help-key", key)))
        })),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        m("div.egin-help-name-column", Object.entries(hotkeys()).map(([_, hotkey]) => {
          return m("div", hotkey.name)
        }))
      ])
    ])
  ])
  return { view }
}

function extractKeys(bind: string) {
  return bind.split("_").map(k => {
    if (k.indexOf("Key") === 0) {
      return k.substr(3)
    }
    switch(k) {
    case "ArrowUp": return "↑"
    case "ArrowDown": return "↓"
    case "Escape": return "Esc"
    }
    return k
  })
}
