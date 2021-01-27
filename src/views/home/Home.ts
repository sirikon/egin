import m from 'mithril'
import * as storage from '../../core/storage'
import * as dropbox from '../../storageBackends/dropbox'

export default function Home() {

    const backends = storage.getBackends();
    const backendsKeys = Object.keys(backends);
    const taskListsPerBackend: { [backend:string]: string[] } = {};

    const createTaskList = (backend: string) => {
        const taskListName = prompt('Task list name');
        if (taskListName === null) { return }
        location.hash = `#/${backend}/${taskListName}`
    }

    const fetchBackendTaskLists = async (backend: string) => {
        taskListsPerBackend[backend] = await storage.list(backend);
        m.redraw();
    }

    const oncreate = () => {
        Object.keys(backends).forEach((backend) =>
            fetchBackendTaskLists(backend));
    }

    const view = () =>
        m('div.egin-home', [
            m('div.egin-home-content', [
                m('h1.egin-home-header', [
                    m('img', { src: '/icon.svg' }),
                    m('span', 'Egin')
                ]),
                !dropbox.isAuthenticated() && m('a', {href: dropbox.getAuthUrl()}, 'Login with Dropbox'),
                m('div', backendsKeys.map(backend => 
                    m('div', [
                        m('h3.egin-home-backend-title', [
                            m('img', { src: `/storageBackends/${backend}.svg` }),
                            m('span', backends[backend].displayName),
                            m('button.egin-home-create-tasklist', {type: 'button', onclick: () => createTaskList(backend)}, '+')
                        ]),
                        taskListsPerBackend[backend] === undefined
                            ? m('span.egin-home-tasklist-loading', '...')
                            : m('div', (taskListsPerBackend[backend] || []).map(taskListKey => m('div', [
                                m('a.egin-home-tasklist-link', {href: `#/${backend}/${taskListKey}`}, taskListKey)
                            ])))
                    ]))),
                m('div.egin-home-footer', [
                    m('span', 'Made with ❤️ by '),
                    m('a', { href: 'https://sirikon.me', target: '_blank' }, 'Sirikon'),
                    m('span', ' | '),
                    m('a', { href: 'https://github.com/sirikon/egin/', target: '_blank' }, 'Source Code')
                ])
            ])
        ]);

    return { view, oncreate }
}
