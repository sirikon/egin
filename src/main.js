import './config'
import './style.scss'
import './services/debug'
import m from "mithril"

import * as actions from './actions/actions'
import { state, eventHandlers, rollback, historify, triggerAllEventHandlers } from './services/state'
import App from './components/App'

var root = document.getElementById('app')

const globalKeyHandlers = {
    ArrowUp: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.jumpToPreviousTask()
    },
    ArrowDown: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.jumpToNextTask()
    },
    Escape: () => actions.setSelectedTaskIndex(null),
    Enter: () => {
        actions.insertTask()
    },
    Backspace: (e) => {
        const selectedTask = actions.getSelectedTask()
        if (selectedTask.name === '') {
            e.preventDefault()
            e.stopPropagation()
            actions.removeSelectedTask()
        }
    },
    Ctrl_Space: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.toggleSelectedTask()
    },
    Ctrl_KeyZ: (e) => {
        e.preventDefault()
        e.stopPropagation()
        rollback()
    },
    Tab: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.indentSelectedTask()
    },
    Shift_Tab: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.unindentSelectedTask()
    },
    Ctrl_ArrowUp: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.moveSelectedTaskUp()
    },
    Ctrl_ArrowDown: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.moveSelectedTaskDown()
    },
    Ctrl_Alt_KeyH: (e) => {
        e.preventDefault()
        e.stopPropagation()
        alert("Help!")
    },
    Ctrl_Alt_KeyM: (e) => {
        e.preventDefault()
        e.stopPropagation()
        alert("Menu!")
    }
}

document.addEventListener('keydown', (e) => {
    const handlerName = [
        e.ctrlKey && 'Ctrl',
        e.shiftKey && 'Shift',
        e.altKey && 'Alt',
        e.code
    ].filter(e => !!e).join('_')
    
    if (globalKeyHandlers[handlerName]) {
        globalKeyHandlers[handlerName](e)
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
