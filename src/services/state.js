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

window.stateHistory = stateHistory

savePreviousState()

export function rollback() {
    historify()
    if (stateHistory.length === 0) { return }
    jsonpatch.applyPatch(state, stateHistory.pop())
    savePreviousState()
    triggerAllEventHandlers()
}

export function delayedHistorify() {
    cancelDelayedHistorify()
    delayedHistorifyTimeout = setTimeout(() => {
        delayedHistorifyTimeout = null;
        historify();
    }, 1000)
}

export function historify() {
    cancelDelayedHistorify()
    const patches = jsonpatch.compare(state, previousState)
    if (patches.length === 0) { return }
    stateHistory.push(patches)
    savePreviousState()
}

function cancelDelayedHistorify() {
    if (delayedHistorifyTimeout !== null) {
        clearTimeout(delayedHistorifyTimeout);
        delayedHistorifyTimeout = null;
    }
}

function savePreviousState() {
    previousState = jsonpatch.deepClone(state)
}

function triggerAllEventHandlers() {
    Object.keys(eventHandlers).forEach(k => {
        eventHandlers[k]()
    })
}
