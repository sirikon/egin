import * as actions from '../core/actions'
import { state, volatileState } from '../core/state'
import hotkeys from './hotkeys'
import { load, save } from './localStorage'

window.egin = {
    actions,
    state,
    volatileState,
    hotkeys,
    localStorage: { load, save }
}
