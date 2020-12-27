import m from 'mithril'

import TaskList from './components/TaskList'
import * as dropbox from './services/dropbox'

export default function App() {

    let loading = false;

    let saveInterval = null

    const beforeunloadListener = () => /*save()*/{}
    const oninit = () => {
        if (!dropbox.isAuthenticated()) { return }
        loading = true;
        dropbox.load().then(() => {
            loading = false;
            saveInterval = setInterval(() => {
                dropbox.save()
            }, 15000)
            m.redraw()
        });
        window.onbeforeunload = beforeunloadListener
    }
    const onremove = () => {
        clearInterval(saveInterval)
        window.onbeforeunload = () => {}
    }

    const view = () => dropbox.isAuthenticated()
        ? (loading ? m('span', 'Loading...') : m(TaskList))
        : m('a', {href: dropbox.getAuthUrl()}, 'Login with Dropbox')
    return { view, oninit, onremove }
}
