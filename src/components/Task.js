import taskStore from '../services/taskStore'
import uiState from '../services/uiState'
import { removeTaskIfEmpty } from '../actions/actions'

export default function Task(vnode) {
    const taskIndex = () => vnode.attrs.key
    const task = () => taskStore.get(taskIndex())
    const isSelected = () => taskIndex() === uiState.selectedTaskIndex
    const isDone = () => task().done
    const classes = () => buildClasses({
        'is-selected': isSelected(),
        'is-done': isDone()
    })

    const setSelected = () => uiState.selectedTaskIndex = taskIndex()
    const removeSelected = () => isSelected() && (uiState.selectedTaskIndex = null)
    const removeTaskOnBlur = () => (uiState.selectedTaskIndex === null) && removeTaskIfEmpty(taskIndex())

    const view = () => m('div.egin-task', {class: classes()}, [
        m('input', {
            type: 'checkbox',
            checked: task().done,
            onchange: (e) => task().done = e.target.checked,
            onfocus: setSelected,
            onblur: () => { removeSelected(); removeTaskOnBlur() }
        }),
        m('input', {
            type: 'text',
            value: task().name,
            oninput: (e) => task().name = e.target.value,
            onfocus: setSelected,
            onblur: () => { removeSelected(); removeTaskOnBlur() }
        })
    ])

    return { view }
}

function buildClasses(obj) {
    return Object.keys(obj).filter(k => obj[k]).join(' ')
}
