import './config'

import m from "mithril"
import Home from './views/home/Home'
import TaskList from './views/tasklist/TaskList'

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
    dsn: "https://b3f8579e83e242fa88ce024467a1ab12@o546900.ingest.sentry.io/5668801",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
});

Sentry.captureException(new Error('Testing sentry'));

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
