import './config'
import './style.scss'

import m from "mithril"
import Home from './views/home/Home'
import TaskList from './views/tasklist/TaskList'

var root = document.getElementById('app')
m.route(root, '/', {
    '/': { view: () => m(Home) },
    '/:backend/:key': (vnode) => {
        return {
            view: () => m(TaskList, {
                taskListId: `${vnode.attrs.backend}/${vnode.attrs.key}`
            })
        }
    }
})
