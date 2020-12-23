import './style.scss'
import m from "mithril"
import * as jsonpatch from 'fast-json-patch'

window.jsonpatch = jsonpatch

import * as actions from './actions/actions'
import { state, eventHandlers, rollback } from './services/state'
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
        actions.insertTaskUnderSelectedTask()
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
    }
}

document.addEventListener('keydown', (e) => {
    const handlerName = [
        e.ctrlKey && 'Ctrl',
        e.shiftKey && 'Shift',
        e.code
    ].filter(e => !!e).join('_')
    
    if (globalKeyHandlers[handlerName]) {
        globalKeyHandlers[handlerName](e)
        m.redraw()
    }
});

eventHandlers.selectedTaskIndexChanged = () => {
    if (state.ui.selectedTaskIndex === null) {
        const possibleFocus = document.querySelector(":focus")
        possibleFocus && possibleFocus.blur()
    } else {
        m.redraw.sync()
        document.querySelector('.egin-task.is-selected input[type="text"]').focus()
    }
}

m.mount(root, App)
