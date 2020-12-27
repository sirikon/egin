import * as actions from '../core/actions'
import { state, volatileState } from '../core/state'
import hotkeys from './hotkeys'
import { load, save } from './localStorage'
import * as dropbox from './dropbox'

window.egin = {
    actions,
    state,
    volatileState,
    hotkeys,
    localStorage: { load, save },
    dropbox
}
