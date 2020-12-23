import './style.scss'
import m from "mithril"

import * as actions from './actions/actions'
import App from './components/App'

var root = document.getElementById('app')

const globalKeyHandlers = {
    ArrowUp: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.jumpToPreviousTask()
        return focusSelectedTaskInput
    },
    ArrowDown: (e) => {
        e.preventDefault()
        e.stopPropagation()
        actions.jumpToNextTask()
        return focusSelectedTaskInput
    },
    Escape: () => blurSelectedTaskInput(),
    Enter: () => {
        actions.insertTaskUnderSelectedTask()
        return focusSelectedTaskInput
    },
    Backspace: (e) => {
        const selectedTask = actions.getSelectedTask()
        if (selectedTask.name === '') {
            e.preventDefault()
            e.stopPropagation()
            actions.removeSelectedTask()
            return focusSelectedTaskInput
        }
    },
    Tab: (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
}

document.addEventListener('keydown', (e) => {
    if (globalKeyHandlers[e.key]) {
        const cb = globalKeyHandlers[e.key](e)
        m.redraw.sync()
        cb && (cb instanceof Function) && cb()
    }
});

function focusSelectedTaskInput() {
    document.querySelector('.egin-task.is-selected input[type="text"]').focus()
}

function blurSelectedTaskInput() {
    document.querySelector('.egin-task.is-selected input[type="text"]').blur()
}

m.mount(root, App)
