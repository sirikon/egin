import * as actions from '../core/actions'
import * as history from '../core/history'
import * as dropbox from './dropbox'

const hotkeys = {
    ArrowUp: {
        name: 'Jump to task above',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.jumpToPreviousTask()
        }
    },
    ArrowDown: {
        name: 'Jump to task below',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.jumpToNextTask()
        }
    },
    Escape: {
        name: 'Unselect task',
        action: () => actions.setSelectedTaskIndex(null)
    },
    Enter: {
        name: 'Insert task',
        action: () => {
            actions.insertTask()
        }
    },
    Backspace: {
        name: 'Remove task (if the name is empty)',
        action: (e) => {
            const selectedTask = actions.getSelectedTask()
            if (selectedTask.name === '') {
                e.preventDefault()
                e.stopPropagation()
                actions.removeSelectedTask()
            }
        }
    },
    Ctrl_Space: {
        name: 'Toggle task (done/to-do)',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.toggleSelectedTask()
        }
    },
    Ctrl_KeyH: {
        name: 'Turn task into Header and viceversa',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.toggleSelectedTaskHeaderState()
        }
    },
    Ctrl_KeyS: {
        name: 'Save',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            dropbox.save().then(() => console.log('Done'))
        }
    },
    Ctrl_KeyZ: {
        name: 'Undo',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            history.rollback()
        }
    },
    Tab: {
        name: 'Indent task',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.indentSelectedTask()
        }
    },
    Shift_Tab: {
        name: 'Unindent task',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.unindentSelectedTask()
        }
    },
    Ctrl_ArrowUp: {
        name: 'Move task up',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.moveSelectedTaskUp()
        }
    },
    Ctrl_ArrowDown: {
        name: 'Move task down',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.moveSelectedTaskDown()
        }
    },
    Ctrl_Alt_KeyH: {
        name: 'Toggle help',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            actions.toggleHelp()
        }
    },
    Ctrl_Alt_KeyM: {
        name: 'Menu',
        action: (e) => {
            e.preventDefault()
            e.stopPropagation()
            alert("Menu!")
        }
    }
}

export default hotkeys
