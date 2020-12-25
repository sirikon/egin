import './config.js'
import chai from 'chai'
const expect = chai.expect

import * as actions from '../src/actions/actions.js'
import * as state from '../src/services/state.js'

export function givenTasks(mocks) {
    state.state.tasks = mocksToTasks(mocks)
}

export function givenSelectedTaskIndex(index) {
    state.state.ui.selectedTaskIndex = index
}

export function expectTasks(mocks) {
    expect(state.state.tasks).to.deep.equal(mocksToTasks(mocks))
}

export function expectSelectedTask(mock) {
    expect(actions.getSelectedTask()).to.deep.equal(mocksToTasks([mock])[0])
}

export function expectSelectedTaskIndex(index) {
    expect(state.state.ui.selectedTaskIndex).to.equal(index)
}

export function reset() {
    state.state.tasks = []
    state.state.ui = { selectedTaskIndex: null }
}

export function mocksToTasks(mocks, level) {
    const result = []
    mocks.forEach(m => {
        result.push({ name: m[0], done: m[1], level: level || 0 })
        if (m[2]) {
            Array.prototype.push.apply(result, mocksToTasks(m[2], (level || 0)+1))
        }
    })
    return result
}
