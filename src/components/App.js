import m from 'mithril'
import * as taskStore from '../services/taskStore'
import Task from './Task'
import Help from './Help'

export default function App() {
    const view = () => [
        m('div.egin-task-list', taskStore.getAll().map((_, i) => m(Task, {key: i}))),
        m(Help)
    ]
    return { view }
}
