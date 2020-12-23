import m from 'mithril'
import taskStore from '../services/taskStore'
import Task from './Task'

export default function App() {
    const view = () => [
        m('div.egin-task-list', taskStore.getAll().map((_, i) => m(Task, {key: i})))
    ]
    return { view }
}
