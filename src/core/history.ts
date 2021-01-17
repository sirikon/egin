import * as jsonpatch from 'fast-json-patch'

import { state } from './state'

let previousState = null
const stateHistory = []
let delayedCommitTimeout = null

const historificationEnabled = (window as any).HISTORIFICATION_ENABLED as Boolean;

export function commit() {
    if(!historificationEnabled) { return }

    cancelDelayedCommit()
    const patches = jsonpatch.compare(state, previousState)
    if (patches.length === 0) { return }
    stateHistory.push(patches)
    savePreviousState()
}

export function rollback() {
    if(!historificationEnabled) { return }

    commit()
    if (stateHistory.length === 0) { return }
    jsonpatch.applyPatch(state, stateHistory.pop())
    savePreviousState()
    commit()
}

export function delayedCommit() {
    if(!historificationEnabled) { return }

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
