import m from 'mithril'

import * as taskStore from '../core/taskStore'
import hotkeys from '../services/hotkeys'
import { load, save } from '../services/localStorage'

import Task from './Task'
import Help from './Help'

export default function TaskList() {

    const keydownListener = (e) => {
        const handlerName = [
            e.ctrlKey && 'Ctrl',
            e.shiftKey && 'Shift',
            e.altKey && 'Alt',
            e.code
        ].filter(e => !!e).join('_')
        
        if (hotkeys[handlerName]) {
            hotkeys[handlerName].action(e)
            m.redraw()
        }
    }

    const beforeunloadListener = () => save()

    const oninit = () => {
        load()
        document.addEventListener('keydown', keydownListener)
        window.onbeforeunload = beforeunloadListener
    }

    const onremove = () => {
        document.removeEventListener('keydown', keydownListener)
        window.onbeforeunload = () => {}
    }

    const view = () => [
        m('div.egin-task-list', taskStore.getAll().map((_, i) => m(Task, {key: i}))),
        m(Help)
    ]

    return { view, oninit, onremove }
}
