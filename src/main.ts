import './config'

import m from "mithril"
import Home from './views/home/Home'
import TaskList from './views/tasklist/TaskList'

const root = document.getElementById('app')
root && m.route(root, '/', {
    '/': { view: () => m(Home) },
    '/:backend/:key': (vnode) => {
        return {
            view: () => m(TaskList, {
                taskListId: `${vnode.attrs.backend}/${vnode.attrs.key}`
            })
        }
    }
})
