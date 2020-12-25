import m from 'mithril'

import TaskList from './components/TaskList'

export default function App() {
    const view = () => m(TaskList)
    return { view }
}
