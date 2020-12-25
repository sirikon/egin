import * as taskStore from '../services/taskStore'
import { state, historify, delayedHistorify } from '../services/state'
import { removeTaskIfEmpty, setSelectedTaskIndex } from '../actions/actions'

export default function Task(vnode) {
    const taskIndex = () => vnode.attrs.key
    const task = () => taskStore.get(taskIndex())
    const isSelected = () => taskIndex() === state.ui.selectedTaskIndex
    const isDone = () => task().done
    const getLevel = () => task().level
    const classes = () => buildClasses({
        'is-selected': isSelected(),
        'is-done': isDone()
    })

    const setDone = (value) => { taskStore.setDone(taskIndex(), value); historify() }
    const setName = (value) => { taskStore.setName(taskIndex(), value); delayedHistorify() }
    const setSelected = () => setSelectedTaskIndex(taskIndex())
    const removeSelected = () => isSelected() && setSelectedTaskIndex(null)
    const removeTaskOnBlur = () => (state.ui.selectedTaskIndex === null) && removeTaskIfEmpty(taskIndex())

    const updateFocus = () => {
        const textInput = vnode.dom.querySelector('input[type="text"]')
        isSelected()
            ? textInput.focus()
            : textInput.blur()
    }

    const oncreate = () => updateFocus()
    const onupdate = () => updateFocus()

    const view = () => m('div.egin-task', {
            class: classes(),
            style: `margin-left: ${getLevel() * 20}px;`
        }, [
        m('input', {
            type: 'checkbox',
            checked: task().done,
            onchange: (e) => setDone(e.target.checked),
            onfocus: setSelected,
            onblur: () => { removeSelected(); removeTaskOnBlur() }
        }),
        m('input', {
            type: 'text',
            value: task().name,
            oninput: (e) => setName(e.target.value),
            onfocus: setSelected,
            onblur: () => { removeSelected(); removeTaskOnBlur() }
        })
    ])

    return { view, oncreate, onupdate }
}

function buildClasses(obj) {
    return Object.keys(obj).filter(k => obj[k]).join(' ')
}
