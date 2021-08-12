import { expect } from "chai"

import { Actions } from "../src/core/Actions"
import { History } from "../src/core/history"
import { TaskStore } from "../src/core/TaskStore"
import { state } from "../src/core/State"

const bookId = "test/test"
const actions = getActions()

export function getTaskStore() {
  return new TaskStore(state, bookId)
}

export function getActions() {
  return new Actions(bookId, getTaskStore(), new History(false));
}

export function givenTasks(mocks) {
  state.books[bookId].tasks = mocksToTasks(mocks)
}

export function givenSelectedTaskIndex(index) {
  state.books[bookId].selectedTaskIndex = index
}

export function expectTasks(mocks) {
  expect(state.books[bookId].tasks).to.deep.equal(mocksToTasks(mocks))
}

export function expectSelectedTask(mock) {
  expect(actions.getSelectedTask()).to.deep.equal(mocksToTasks([mock])[0])
}

export function expectSelectedTaskIndex(index) {
  expect(state.books[bookId].selectedTaskIndex).to.equal(index)
}

export function reset() {
  state.books[bookId] = {
    tasks: [],
    selectedTaskIndex: null,
    storageStatus: "pristine"
  }
}

export function mocksToTasks(mocks, level?) {
  const result = []
  mocks.forEach(m => {
    result.push({ name: m[0], done: m[1], level: level || 0, header: false })
    if (m[2]) {
      Array.prototype.push.apply(result, mocksToTasks(m[2], (level || 0)+1))
    }
  })
  return result
}
