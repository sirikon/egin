import m from 'mithril'
import { BehaviorSubject, combineLatest, from } from 'rxjs'
import { map, startWith } from "rxjs/operators";
import * as storage from '../../core/storage'

export default function Home() {

    const backends = storage.getBackends();
    const backendsKeys = Object.keys(backends);
    const taskListsPerBackend = new BehaviorSubject<{ [backend:string]: string[] }>({});
    taskListsPerBackend.subscribe(() => m.redraw());

    const fetchBackendsTaskLists = async () => {
        combineLatest(getBackendsTaskLists())
            .pipe(map(Object.fromEntries))
            .subscribe(taskListsPerBackend)
    }

    function getBackendsTaskLists() {
        return Object.keys(storage.getBackends())
            .map(backend => from(storage.list(backend)).pipe(
                startWith([]),
                map(list => [backend, list])));
    }

    const createTaskList = (backend: string) => {
        const taskListName = prompt('Task list name');
        if (taskListName === null) { return }
        location.hash = `#/${backend}/${taskListName}`
    }

    const login = (backend: string) => {
        storage.getAuthenticationUrl(backend)
            .then(url => location.href = url);
    }

    const oncreate = () => fetchBackendsTaskLists();

    const view = () =>
        m('div.egin-home', [
            m('div.egin-home-content', [
                m('h1.egin-home-header', [
                    m('img', { src: '/icon.svg' }),
                    m('span', 'Egin')
                ]),
                m('div', backendsKeys.map(backend => 
                    m('div', [
                        m('h3.egin-home-backend-title', [
                            m('img', { src: `/storageBackends/${backend}.svg` }),
                            m('span', backends[backend].displayName),
                            storage.isAuthenticated(backend)
                                ?  m('button', {type: 'button', onclick: () => createTaskList(backend)}, [
                                    m('span', '+')
                                ])
                                : m('button.is-login', {type: 'button', onclick: () => login(backend)}, [
                                    m('span', 'Login')
                                ])
                        ]),
                        (taskListsPerBackend.value[backend] || []).length === 0
                            ? m('span.egin-home-tasklist-loading', '...')
                            : m('div', taskListsPerBackend.value[backend].map(taskListKey => m('div', [
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
