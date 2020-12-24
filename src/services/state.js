import * as jsonpatch from 'fast-json-patch'

export const state = {
    tasks: [],
    ui: {
        selectedTaskIndex: null,
    }
}

export const eventHandlers = {
    selectedTaskIndexChanged: () => {}
}

let previousState = null
const stateHistory = []
let delayedHistorifyTimeout = null

loadStateFromLocalStorage()
savePreviousState()

export function rollback() {
    historify()
    if (stateHistory.length === 0) { return }
    jsonpatch.applyPatch(state, stateHistory.pop())
    savePreviousState()
    triggerAllEventHandlers()
}

export function delayedHistorify() {
    if (!historification_enabled) { return }
    cancelDelayedHistorify()
    delayedHistorifyTimeout = setTimeout(() => {
        delayedHistorifyTimeout = null;
        historify();
    }, 1000)
}

export function historify() {
    if (!historification_enabled) { return }
    cancelDelayedHistorify()
    const patches = jsonpatch.compare(state, previousState)
    if (patches.length === 0) { return }
    stateHistory.push(patches)
    savePreviousState()
    saveStateToLocalStorage()
}

export function triggerAllEventHandlers() {
    Object.keys(eventHandlers).forEach(k => {
        eventHandlers[k]()
    })
}

function cancelDelayedHistorify() {
    if (!historification_enabled) { return }
    if (delayedHistorifyTimeout !== null) {
        clearTimeout(delayedHistorifyTimeout);
        delayedHistorifyTimeout = null;
    }
}

function savePreviousState() {
    if (!historification_enabled) { return }
    previousState = jsonpatch.deepClone(state)
}

function loadStateFromLocalStorage() {
    if (!localstorage_enabled) { return }
    const persistedStateData = localStorage.getItem("egin_state")
    if (persistedStateData === null) { return; }
    const persistedState = JSON.parse(persistedStateData)
    Object.keys(persistedState).forEach(k => {
        state[k] = persistedState[k]
    })
}

function saveStateToLocalStorage() {
    if (!localstorage_enabled) { return }
    localStorage.setItem("egin_state", JSON.stringify(state))
}
