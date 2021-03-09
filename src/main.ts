import config from './config'

import m from "mithril"
import Home from './views/home/Home'
import TaskList from './views/tasklist/TaskList'

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
    dsn: config.sentryDSN,
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
