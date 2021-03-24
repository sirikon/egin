import m from 'mithril'
import { Actions } from '../../../core/Actions'
import history from '../../../core/history'
import { TaskStore } from '../../../core/TaskStore'

interface TaskAttrs {
    taskStore: TaskStore;
    actions: Actions;
    key: number;
}

export default function Task(vnode: m.VnodeDOM<TaskAttrs>) {
    const taskStore = (): TaskStore => vnode.attrs.taskStore
    const actions = (): Actions => vnode.attrs.actions
    const taskIndex = (): number => vnode.attrs.key

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

    const setDone = (value: Boolean) => { taskStore().setDone(taskIndex(), value); history.commit() }
    const setName = (value: string) => { taskStore().setName(taskIndex(), value); history.delayedCommit() }
    const setSelected = () => actions().setSelectedTaskIndex(taskIndex())
    const removeSelected = () => isSelected() && actions().setSelectedTaskIndex(null)
    const removeTaskOnBlur = () => (actions().getSelectedTaskIndex() === null) && actions().removeTaskIfEmpty(taskIndex())

    const updateFocus = (v: m.VnodeDOM<TaskAttrs>) => {
        const nameInput = (v.dom.querySelector('.egin-task-name') as HTMLTextAreaElement)
        isSelected()
            ? nameInput.focus()
            : nameInput.blur()
    }

    const oncreate = (v: m.VnodeDOM<TaskAttrs>) => updateFocus(v);
    const onupdate = (v: m.VnodeDOM<TaskAttrs>) => updateFocus(v);

    const view = () => m('div.egin-task', {
            class: classes(),
            style: `margin-left: ${getLevel() * 20}px;`,
            onclick: setSelected,
        }, [
        m('input.egin-task-checkbox', {
            type: 'checkbox',
            checked: task().done,
            onchange: (e: InputEvent) => setDone((e.target as HTMLInputElement).checked),
            onfocus: setSelected,
            onblur: () => { removeSelected(); removeTaskOnBlur() }
        }),
        m(TaskName, {
            name: task().name,
            onName: setName,
            onFocus: setSelected,
            onBlur: () => { removeSelected(); removeTaskOnBlur() }
        })
    ])

    return { view, oncreate, onupdate }
}

interface TaskNameAttrs {
    name: string;
    onName: (name: string) => void;
    onFocus: () => void;
    onBlur: () => void;
}

function TaskName(vnode: m.VnodeDOM<TaskNameAttrs>) {

    let lastRenderedText = '';
    const updateNameHeight = (vnode: m.VnodeDOM<TaskNameAttrs>) => {
        if (lastRenderedText === vnode.attrs.name) return;
        forceUpdateNameHeight(vnode);
    }

    const forceUpdateNameHeight = (vnode: m.VnodeDOM<TaskNameAttrs>) => {
        if (!vnode.dom) return;
        const nameInput = (vnode.dom as HTMLTextAreaElement)
        nameInput.style.height = '';
        nameInput.style.height = `${nameInput.scrollHeight}px`;
        lastRenderedText = vnode.attrs.name;
    }

    const keydownHandler = (e: KeyboardEvent) => {
        const nameInput = (e.target as HTMLTextAreaElement)

        if (e.code === 'ArrowUp' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            if (nameInput.selectionStart === 0 && nameInput.selectionEnd === 0) return;
            e.stopPropagation();
        }

        if (e.code === 'ArrowDown' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            const inputLength = nameInput.value.length;
            if ( nameInput.selectionStart === inputLength && nameInput.selectionEnd === inputLength) return;
            e.stopPropagation();
        }
    }

    function windowResizeHandler() {
        forceUpdateNameHeight(vnode);
    }

    const oncreate = (vnode: m.VnodeDOM<TaskNameAttrs>) => {
        window.addEventListener('resize', windowResizeHandler)
        updateNameHeight(vnode);
    }
    
    const onremove = () => {
        window.removeEventListener('resize', windowResizeHandler)
    }

    const onupdate = (vnode: m.VnodeDOM<TaskNameAttrs>) => {
        updateNameHeight(vnode);
    }

    const view = (vnode: m.VnodeDOM<TaskNameAttrs>) =>
        m('textarea.egin-task-name', {
            spellcheck: false,
            value: vnode.attrs.name,
            onkeydown: keydownHandler,
            oninput: (e: InputEvent) => vnode.attrs.onName((e.target as HTMLTextAreaElement).value),
            onfocus: vnode.attrs.onFocus,
            onblur: vnode.attrs.onBlur
        })

    return { view, oncreate, onremove, onupdate }
}

function buildClasses(obj: any) {
    return Object.keys(obj).filter(k => obj[k]).join(' ')
}
