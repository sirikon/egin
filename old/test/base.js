import './config.js'
import chai from 'chai'
const expect = chai.expect

import Actions from '../src/core/Actions.js'
import { state } from '../src/core/state.js'
import TaskStore from '../src/core/TaskStore.js'

const taskListId = 'test/test'
const actions = getActions()

export function getTaskStore() {
    return new TaskStore(taskListId)
}

export function getActions() {
    return new Actions(taskListId)
}

export function givenTasks(mocks) {
    state.taskLists[taskListId].tasks = mocksToTasks(mocks)
}

export function givenSelectedTaskIndex(index) {
    state.taskLists[taskListId].selectedTaskIndex = index
}

export function expectTasks(mocks) {
    expect(state.taskLists[taskListId].tasks).to.deep.equal(mocksToTasks(mocks))
}

export function expectSelectedTask(mock) {
    expect(actions.getSelectedTask()).to.deep.equal(mocksToTasks([mock])[0])
}

export function expectSelectedTaskIndex(index) {
    expect(state.taskLists[taskListId].selectedTaskIndex).to.equal(index)
}

export function reset() {
    state.taskLists[taskListId] = {
        tasks: [],
        selectedTaskIndex: null
    }
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
