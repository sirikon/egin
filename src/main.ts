import config from './config'

import 'style.scss'
import icon from './assets/icon.svg'

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

const iconEl = document.createElement('link');
iconEl.setAttribute('rel', 'icon');
iconEl.setAttribute('href', icon);
document.head.appendChild(iconEl);

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
