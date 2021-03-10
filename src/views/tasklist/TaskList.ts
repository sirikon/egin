import m from 'mithril'
import hyperactiv from 'hyperactiv'
const { computed, dispose } = hyperactiv;

import { TaskStore } from '../../core/TaskStore'
import { buildActions } from '../../core/Actions'
import * as storage from '../../core/storage'
import state from '../../core/state'

import { buildHotkeys } from './hotkeys'
import Task from './components/Task'
import Help from './components/Help'
import { TaskListComponentState } from './models'
import { StorageStatus } from '../../core/models'

interface TaskListAttrs {
    taskListId: string
}

export default function TaskList(vnode: m.VnodeDOM<TaskListAttrs>) {
    const taskListState: TaskListComponentState = {
        helpMenuVisible: false
    }

    const taskListId = () => vnode.attrs.taskListId

    const taskStore = () => new TaskStore(taskListId())
    const actions = () => buildActions(taskListId())
    const hotkeys = () => buildHotkeys(taskListId(), taskListState, actions())
    
    const isHelpVisible = () => taskListState.helpMenuVisible

    let storageStatus:StorageStatus | null = null;
    const subscription = computed(() => {
        storageStatus = state.storageStatus[taskListId()]
        m.redraw()
    })

    const keydownListener = (e: KeyboardEvent) => {
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
        dispose(subscription);
    }

    const view = () => [
        m('div.egin-task-list', taskStore().getAll()
            .map((_, i) => m(Task, {key: i, taskStore: taskStore(), actions: actions()}))),
        m('div.egin-task-list-storage-state', storageStatus),
        isHelpVisible() && m(Help, { hotkeys: hotkeys() })
    ]

    return { view, oncreate, onremove }
}
