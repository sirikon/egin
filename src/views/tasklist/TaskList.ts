import m from 'mithril'
import hyperactiv from 'hyperactiv'
const { computed } = hyperactiv

import TaskStore from '../../core/TaskStore'
import Actions from '../../core/Actions'
import * as storage from '../../core/storage'
import { state } from '../../core/state'

import { buildHotkeys } from './hotkeys'
import Task from './components/Task'
import Help from './components/Help'

export default function TaskList(vnode) {
    const taskListState = {
        helpMenuVisible: false
    }
    
    const taskListId = () => vnode.attrs.taskListId

    const taskStore = () => new TaskStore(taskListId())
    const actions = () => new Actions(taskListId())
    const hotkeys = () => buildHotkeys(taskListId(), taskListState, actions())
    
    const isHelpVisible = () => taskListState.helpMenuVisible

    let storageStatus = null;
    computed(() => {
        storageStatus = state.storageStatus[taskListId()]
        m.redraw()
    })

    const keydownListener = (e) => {
        const handlerName = [
            e.ctrlKey && 'Ctrl',
            e.shiftKey && 'Shift',
            e.altKey && 'Alt',
            e.code
        ].filter(e => !!e).join('_')

        const hk = hotkeys()
        
        if (hk[handlerName]) {
            hk[handlerName].action(e)
            m.redraw()
        }
    }

    const oncreate = () => {
        document.addEventListener('keydown', keydownListener, true)
        storage.load(taskListId()).then(() => m.redraw())
    }

    const onremove = () => {
        document.removeEventListener('keydown', keydownListener, true)
    }

    const view = () => [
        m('div.egin-task-list', taskStore().getAll()
            .map((_, i) => m(Task, {key: i, taskStore: taskStore(), actions: actions()}))),
        m('div.egin-task-list-storage-state', storageStatus),
        isHelpVisible() && m(Help, { hotkeys: hotkeys() })
    ]

    return { view, oncreate, onremove }
}
