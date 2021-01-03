import * as history from '../../../core/history'

export default function Task(vnode) {
    const taskStore = () => vnode.attrs.taskStore
    const actions = () => vnode.attrs.actions
    const taskIndex = () => vnode.attrs.key

    const task = () => taskStore().get(taskIndex())
    const isSelected = () => taskIndex() === actions().getSelectedTaskIndex()
    const isDone = () => task().done
    const isHeader = () => task().header
    const getLevel = () => task().level
    const classes = () => buildClasses({
        'is-selected': isSelected(),
        'is-done': isDone(),
        'is-header': isHeader(),
    })

    const setDone = (value) => { taskStore().setDone(taskIndex(), value); history.commit() }
    const setName = (value) => { taskStore().setName(taskIndex(), value); history.delayedCommit() }
    const setSelected = () => actions().setSelectedTaskIndex(taskIndex())
    const removeSelected = () => isSelected() && actions().setSelectedTaskIndex(null)
    const removeTaskOnBlur = () => (actions().getSelectedTaskIndex() === null) && actions().removeTaskIfEmpty(taskIndex())

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
