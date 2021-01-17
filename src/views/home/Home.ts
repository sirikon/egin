import m from 'mithril'
import * as storage from '../../core/storage'
import * as dropbox from '../../storageBackends/dropbox'

export default function Home() {

    let backends = storage.getBackends()
        .reduce((map, backend) => (map[backend]=[], map), {})

    const createTaskList = (backend) => {
        const taskListName = prompt('Task list name')
        if (taskListName === null) { return }
        location.hash = `#/${backend}/${taskListName}`
    }

    const oninit = () => {
        Object.keys(backends).forEach((backend) => {
            storage.list(backend)
                .then(taskLists => {
                    backends[backend] = taskLists;
                    m.redraw()
                })
        })
    }

    const view = () => m('div.egin-home', [
        m('h1', 'Egin'),
        !dropbox.isAuthenticated() && m('a', {href: dropbox.getAuthUrl()}, 'Login with Dropbox'),
        m('ul', Object.keys(backends).map(backend => {
            return m('li', [
                m('div', [
                    m('span', backend),
                    " ",
                    m('button', {type: 'button', onclick: () => createTaskList(backend)}, 'New')
                ]),
                m('ul', backends[backend].map(taskListKey => {
                    return m('li', [
                        m('a', {href: `#/${backend}/${taskListKey}`}, taskListKey)
                    ])
                }))
            ])
        }))
    ]);

    return { view, oninit }
}
