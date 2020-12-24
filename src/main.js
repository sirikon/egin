import './config'
import './style.scss'
import './services/debug'
import m from "mithril"

import hotkeys from './actions/hotkeys'
import { state, eventHandlers, rollback, historify, triggerAllEventHandlers } from './services/state'
import App from './components/App'

var root = document.getElementById('app')

document.addEventListener('keydown', (e) => {
    const handlerName = [
        e.ctrlKey && 'Ctrl',
        e.shiftKey && 'Shift',
        e.altKey && 'Alt',
        e.code
    ].filter(e => !!e).join('_')
    
    if (hotkeys[handlerName]) {
        hotkeys[handlerName].action(e)
        m.redraw()
    }
});

window.onbeforeunload = () => { historify() }

eventHandlers.selectedTaskIndexChanged = () => {
    if (state.ui.selectedTaskIndex === null) {
        removeFocus()
        return
    }

    m.redraw.sync()
    focusSelected() || removeFocus()
}

function removeFocus() {
    const focusedElement = document.querySelector(":focus")
    focusedElement && focusedElement.blur()
}

function focusSelected() {
    const selectedInput = document.querySelector('.egin-task.is-selected input[type="text"]')
    if (!selectedInput) {
        return false;
    }
    selectedInput.focus()
    return true;
}

m.mount(root, App)
triggerAllEventHandlers()
