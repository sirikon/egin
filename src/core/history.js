import * as jsonpatch from 'fast-json-patch'

import { state } from './state.js'

let previousState = null
const stateHistory = []
let delayedCommitTimeout = null

export function commit() {
    if(!HISTORIFICATION_ENABLED) { return }

    cancelDelayedCommit()
    const patches = jsonpatch.compare(state, previousState)
    if (patches.length === 0) { return }
    stateHistory.push(patches)
    savePreviousState()
}

export function rollback() {
    if(!HISTORIFICATION_ENABLED) { return }

    commit()
    if (stateHistory.length === 0) { return }
    jsonpatch.applyPatch(state, stateHistory.pop())
    savePreviousState()
    commit()
}

export function delayedCommit() {
    if(!HISTORIFICATION_ENABLED) { return }

    cancelDelayedCommit()
    delayedCommitTimeout = setTimeout(() => {
        delayedCommitTimeout = null;
        commit();
    }, 1000)
}

export function reset() {
    cancelDelayedCommit();
    savePreviousState();
    stateHistory.splice(0, stateHistory.length);
}

function cancelDelayedCommit() {
    if (delayedCommitTimeout !== null) {
        clearTimeout(delayedCommitTimeout);
        delayedCommitTimeout = null;
    }
}

function savePreviousState() {
    previousState = jsonpatch.deepClone(state)
}

savePreviousState();
