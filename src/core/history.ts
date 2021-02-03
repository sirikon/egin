import * as jsonpatch from 'fast-json-patch'
import { State } from './models'
import { state } from './state'

let previousState: State = jsonpatch.deepClone(state)
const stateHistory: jsonpatch.Operation[][] = []
let delayedCommitTimeout: NodeJS.Timeout | null = null

declare var HISTORIFICATION_ENABLED: boolean;

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
    const lastPatch = stateHistory.pop()
    if (lastPatch === undefined) { return }
    jsonpatch.applyPatch(state, lastPatch)
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
