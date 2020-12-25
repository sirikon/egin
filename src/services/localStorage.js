import { state } from '../core/state'
import * as history from '../core/history'

const LOCALSTORAGE_STATE_KEY = 'egin_state'

export function save() {
    localStorage.setItem(LOCALSTORAGE_STATE_KEY, JSON.stringify(state))
}

export function load() {
    const loadedStateData = localStorage.getItem(LOCALSTORAGE_STATE_KEY)
    if (loadedStateData === null) { return }
    const loadedState = JSON.parse(loadedStateData)
    Object.keys(loadedState).forEach(k => {
        state[k] = loadedState[k]
    })
    history.reset()
}
