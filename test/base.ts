import { expect } from "chai"

import { BookController } from "../src/core/BookController"
import { BookTaskStore } from "../src/core/BookTaskStore"
import { state } from "../src/core/State"
import { Task } from "../src/core/Task"

const bookId = "test/test"
const actions = getBookController()

export function getBookTaskStore() {
  return new BookTaskStore(state, bookId)
}

export function getBookController() {
  return new BookController(state, getBookTaskStore(), null, bookId);
}

export function givenTasks(mocks: any) {
  state.books[bookId].tasks = mocksToTasks(mocks)
}

export function givenSelectedTaskIndex(index: number | null) {
  state.books[bookId].selectedTaskIndex = index
}

export function expectTasks(mocks: any) {
  expect(state.books[bookId].tasks).to.deep.equal(mocksToTasks(mocks))
}

export function expectSelectedTask(mock: any) {
  expect(actions.getSelectedTask()).to.deep.equal(mocksToTasks([mock])[0])
}

export function expectSelectedTaskIndex(index: number | null) {
  expect(state.books[bookId].selectedTaskIndex).to.equal(index)
}

export function reset() {
  state.books[bookId] = {
    tasks: [],
    selectedTaskIndex: null,
    storageStatus: "pristine"
  }
}

export function mocksToTasks(mocks: any, level?: number) {
  const result: Task[] = []
  mocks.forEach((m: any) => {
    result.push({ name: m[0], done: m[1], level: level || 0, header: false })
    if (m[2]) {
      Array.prototype.push.apply(result, mocksToTasks(m[2], (level || 0)+1))
    }
  })
  return result
}
