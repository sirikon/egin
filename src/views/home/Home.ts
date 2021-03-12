import m from 'mithril'
import { combineLatest, from, Observable } from 'rxjs'
import { map, startWith } from "rxjs/operators";
import * as storage from '../../core/storage'
import { bind } from '../../utils/bind';

interface Backend {
    backend: string;
    list: string[];
    loading: boolean;
}

interface BackendIndex {
    [backend: string]: {
        list: string[];
        loading: boolean;
    }
}

export default function Home() {

    const backends = storage.getBackends();
    const backendsKeys = Object.keys(backends);
    const backendTaskListsIndex = bind({}, combineLatest(getBackendsTaskLists())
        .pipe(map(indexBackends)))

    function getBackendsTaskLists(): Observable<Backend>[] {
        return Object.keys(storage.getBackends())
            .map(backend => from(storage.list(backend))
                .pipe(
                    map(list => {return { backend, list, loading: false }}),
                    startWith({ backend, list: new Array<string>(), loading: true }),
                ));
    }

    function indexBackends(backends: Backend[]): BackendIndex {
        const result: { [backend: string]: { list: string[], loading: boolean } } = {};
        backends.forEach(i => {
            result[i.backend] = {
                list: i.list,
                loading: i.loading
            };
        });
        return result;
    }

    const getTaskLists = (backend: string) =>
        (backendTaskListsIndex.getValue()[backend] || { list: [] }).list;
    const isBackendLoading = (backend: string) =>
        (backendTaskListsIndex.getValue()[backend] || { loading: true }).loading;

    const createTaskList = (backend: string) => {
        const taskListName = prompt('Task list name');
        if (taskListName === null) { return }
        location.hash = `#/${backend}/${taskListName}`
    }

    const login = (backend: string) => {
        storage.getAuthenticationUrl(backend)
            .then(url => location.href = url);
    }

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
                        isBackendLoading(backend)
                            ? m('span.egin-home-tasklist-loading', '...')
                            : m('div', getTaskLists(backend).map(taskListKey => m('div', [
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

    return { view }
}
