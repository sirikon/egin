import { expect } from "chai"

import {
  getBookActions,
  givenTasks,
  givenSelectedTaskIndex,
  expectSelectedTask,
  expectSelectedTaskIndex,
  expectTasks,
  reset
} from "./base"
const actions = getBookActions()

describe("BookActions", () => {

  describe("#getSelectedTask()", () => {
    beforeEach(() => reset())
    it("should return null at start", () => {
      expect(actions.getSelectedTask()).to.equal(null)
    })
    it("should return correct selected task", () => {
      givenTasks([
        ["foo", false],
        ["bar", false]
      ])
      givenSelectedTaskIndex(1)
      expectSelectedTask(["bar", false])
    })
  })

  describe("#setSelectedTaskIndex", () => {
    beforeEach(() => reset())
    it("should change selected task index", () => {
      givenSelectedTaskIndex(1)
      actions.setSelectedTaskIndex(2)
      expectSelectedTaskIndex(2)
    })
  })

  describe("#toggleSelectedTask", () => {
    beforeEach(() => reset())
    it("should not do anything when there is no selected task", () => {
      actions.toggleSelectedTask()
    })
    it("should enable the given task", () => {
      givenTasks([
        ["foo", false],
        ["bar", false]
      ])
      givenSelectedTaskIndex(1)
      actions.toggleSelectedTask()
      expectTasks([
        ["foo", false],
        ["bar", true]
      ])
    })
    it("should disable the given task", () => {
      givenTasks([
        ["foo", false],
        ["bar", true]
      ])
      givenSelectedTaskIndex(1)
      actions.toggleSelectedTask()
      expectTasks([
        ["foo", false],
        ["bar", false]
      ])
    })
  })

  describe("#removeTask", () => {
    beforeEach(() => reset())

    it("should remove a single task from the list", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      actions.removeTask(1)
      expectTasks([
        ["foo", false],
        ["baz", true]
      ])
      expectSelectedTaskIndex(null)
    })

    it("should remove a single task from the list and change the selected task index", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      givenSelectedTaskIndex(1)
      actions.removeTask(1)
      expectTasks([
        ["foo", false],
        ["baz", true]
      ])
      expectSelectedTaskIndex(0)
    })

    it("should remove a single task from the list and change the selected task index #2", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      givenSelectedTaskIndex(2)
      actions.removeTask(1)
      expectTasks([
        ["foo", false],
        ["baz", true]
      ])
      expectSelectedTaskIndex(1)
    })

    it("should remove a single task from the list and not change the selected task index", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      givenSelectedTaskIndex(0)
      actions.removeTask(1)
      expectTasks([
        ["foo", false],
        ["baz", true]
      ])
      expectSelectedTaskIndex(0)
    })

    it("should remove a task and its childs", () => {
      givenTasks([
        ["foo", false],
        ["bar", true, [
          ["bar-1", true],
          ["bar-2", false]
        ]],
        ["baz", true, [
          ["baz-1", false]
        ]]
      ])
      givenSelectedTaskIndex(null)
      actions.removeTask(1)
      expectTasks([
        ["foo", false],
        ["baz", true, [
          ["baz-1", false]
        ]]
      ])
      expectSelectedTaskIndex(null)
    })

    it("should remove a task and its childs", () => {
      givenTasks([
        ["foo", false],
        ["bar", true, [
          ["bar-1", true],
          ["bar-2", false]
        ]],
        ["baz", true, [
          ["baz-1", false]
        ]]
      ])
      givenSelectedTaskIndex(0)
      actions.removeTask(1)
      expectTasks([
        ["foo", false],
        ["baz", true, [
          ["baz-1", false]
        ]]
      ])
      expectSelectedTaskIndex(0)
    })

    it("should remove a task and its childs moving the index", () => {
      givenTasks([
        ["foo", false],
        ["bar", true, [
          ["bar-1", true],
          ["bar-2", false]
        ]],
        ["baz", true, [
          ["baz-1", false]
        ]]
      ])
      givenSelectedTaskIndex(3)
      actions.removeTask(1)
      expectTasks([
        ["foo", false],
        ["baz", true, [
          ["baz-1", false]
        ]]
      ])
      expectSelectedTaskIndex(0)
    })

    it("should remove a task and its childs moving the index", () => {
      givenTasks([
        ["foo", false],
        ["bar", true, [
          ["bar-1", true],
          ["bar-2", false]
        ]],
        ["baz", true, [
          ["baz-1", false]
        ]]
      ])
      givenSelectedTaskIndex(5)
      actions.removeTask(1)
      expectTasks([
        ["foo", false],
        ["baz", true, [
          ["baz-1", false]
        ]]
      ])
      expectSelectedTaskIndex(2)
    })
  })

  describe("#removeTaskIfEmpty", () => {
    beforeEach(() => reset())

    it("should not remove the task", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      actions.removeTaskIfEmpty(1)
      expectTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      expectSelectedTaskIndex(null)
    })

    it("should remove the task", () => {
      givenTasks([
        ["foo", false],
        ["", true],
        ["baz", true]
      ])
      actions.removeTaskIfEmpty(1)
      expectTasks([
        ["foo", false],
        ["baz", true]
      ])
      expectSelectedTaskIndex(null)
    })
  })

  describe("#removeSelectedTask", () => {
    beforeEach(() => reset())

    it("should remove the task", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      givenSelectedTaskIndex(1)
      actions.removeSelectedTask()
      expectTasks([
        ["foo", false],
        ["baz", true]
      ])
      expectSelectedTaskIndex(0)
    })
  })

  describe("#jumpToPreviousTask && #jumpToNextTask", () => {
    beforeEach(() => reset())

    it("should not jump to the previous task because it is the first one", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      givenSelectedTaskIndex(0)
      actions.jumpToPreviousTask()
      expectSelectedTaskIndex(0)
    })

    it("should jump to the previous task", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      givenSelectedTaskIndex(2)
      actions.jumpToPreviousTask()
      expectSelectedTaskIndex(1)
    })

    it("should not jump to the next task because it is the last one", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      givenSelectedTaskIndex(2)
      actions.jumpToNextTask()
      expectSelectedTaskIndex(2)
    })

    it("should not jump to the next task", () => {
      givenTasks([
        ["foo", false],
        ["bar", true],
        ["baz", true]
      ])
      givenSelectedTaskIndex(0)
      actions.jumpToNextTask()
      expectSelectedTaskIndex(1)
    })
  })

  describe("#moveSelectedTaskUp && #moveSelectedTaskDown", () => {
    beforeEach(() => reset())

    it("should not move the task up because it is the first one", () => {
      givenTasks([
        ["0", false],
        ["1", false],
        ["2", false]
      ])
      givenSelectedTaskIndex(0)
      actions.moveSelectedTaskUp()
      expectTasks([
        ["0", false],
        ["1", false],
        ["2", false]
      ])
      expectSelectedTaskIndex(0)
    })

    it("should move the task up", () => {
      givenTasks([
        ["0", false],
        ["1", false],
        ["2", false]
      ])
      givenSelectedTaskIndex(2)
      actions.moveSelectedTaskUp()
      expectTasks([
        ["0", false],
        ["2", false],
        ["1", false]
      ])
      expectSelectedTaskIndex(1)
    })

    it("should move the task up", () => {
      givenTasks([
        ["0", false],
        ["1", false],
        ["2", false]
      ])
      givenSelectedTaskIndex(1)
      actions.moveSelectedTaskUp()
      expectTasks([
        ["1", false],
        ["0", false],
        ["2", false]
      ])
      expectSelectedTaskIndex(0)
    })

    it("should not move the task down because it is the last one", () => {
      givenTasks([
        ["0", false],
        ["1", false],
        ["2", false]
      ])
      givenSelectedTaskIndex(2)
      actions.moveSelectedTaskDown()
      expectTasks([
        ["0", false],
        ["1", false],
        ["2", false]
      ])
      expectSelectedTaskIndex(2)
    })

    it("should move the task down", () => {
      givenTasks([
        ["0", false],
        ["1", false],
        ["2", false],
      ])
      givenSelectedTaskIndex(1)
      actions.moveSelectedTaskDown()
      expectTasks([
        ["0", false],
        ["2", false],
        ["1", false],
      ])
      expectSelectedTaskIndex(2)
    })

    it("should move the task down", () => {
      givenTasks([
        ["0", false],
        ["1", false],
        ["2", false],
      ])
      givenSelectedTaskIndex(0)
      actions.moveSelectedTaskDown()
      expectTasks([
        ["1", false],
        ["0", false],
        ["2", false],
      ])
      expectSelectedTaskIndex(1)
    })

    it("should not move the task up because it is the first on the same level", () => {
      givenTasks([
        ["0", false, [
          ["1", false],
          ["2", false]
        ]],
      ])
      givenSelectedTaskIndex(1)
      actions.moveSelectedTaskUp()
      expectTasks([
        ["0", false, [
          ["1", false],
          ["2", false]
        ]],
      ])
      expectSelectedTaskIndex(1)
    })

    it("should not move the task down because it is the last on the same level", () => {
      givenTasks([
        ["0", false, [
          ["1", false],
          ["2", false]
        ]],
      ])
      givenSelectedTaskIndex(2)
      actions.moveSelectedTaskDown()
      expectTasks([
        ["0", false, [
          ["1", false],
          ["2", false]
        ]],
      ])
      expectSelectedTaskIndex(2)
    })

    it("should move the task up skipping subtasks", () => {
      givenTasks([
        ["0", false, [
          ["1", false],
          ["2", false]
        ]],
        ["3", false]
      ])
      givenSelectedTaskIndex(3)
      actions.moveSelectedTaskUp()
      expectTasks([
        ["3", false],
        ["0", false, [
          ["1", false],
          ["2", false]
        ]],
      ])
      expectSelectedTaskIndex(0)
    })

    it("should move the task down skipping subtasks", () => {
      givenTasks([
        ["0", false],
        ["1", false, [
          ["2", false],
          ["3", false]
        ]],
      ])
      givenSelectedTaskIndex(0)
      actions.moveSelectedTaskDown()
      expectTasks([
        ["1", false, [
          ["2", false],
          ["3", false]
        ]],
        ["0", false]
      ])
      expectSelectedTaskIndex(3)
    })

    it("should move the task down moving subtasks too", () => {
      givenTasks([
        ["0", false, [
          ["1", false],
          ["2", false]
        ]],
        ["3", false]
      ])
      givenSelectedTaskIndex(0)
      actions.moveSelectedTaskDown()
      expectTasks([
        ["3", false],
        ["0", false, [
          ["1", false],
          ["2", false]
        ]],
      ])
      expectSelectedTaskIndex(1)
    })

    it("should move the task up moving subtasks too", () => {
      givenTasks([
        ["0", false],
        ["1", false, [
          ["2", false],
          ["3", false]
        ]],
      ])
      givenSelectedTaskIndex(1)
      actions.moveSelectedTaskUp()
      expectTasks([
        ["1", false, [
          ["2", false],
          ["3", false]
        ]],
        ["0", false],
      ])
      expectSelectedTaskIndex(0)
    })
  })

  describe("#insertTask", () => {
    beforeEach(() => reset())

    it("should insert the first task", () => {
      givenTasks([])
      givenSelectedTaskIndex(null)
      actions.insertTask()
      expectTasks([
        ["", false]
      ])
      expectSelectedTaskIndex(0)
    })

    it("should not insert a new task if selected task is empty", () => {
      givenTasks([
        ["0", false],
        ["", false],
        ["2", false],
      ])
      givenSelectedTaskIndex(1)
      actions.insertTask()
      expectTasks([
        ["0", false],
        ["", false],
        ["2", false],
      ])
      expectSelectedTaskIndex(1)
    })

    it("should insert a new task", () => {
      givenTasks([
        ["0", false],
        ["1", false],
        ["2", false],
      ])
      givenSelectedTaskIndex(1)
      actions.insertTask()
      expectTasks([
        ["0", false],
        ["1", false],
        ["", false],
        ["2", false],
      ])
      expectSelectedTaskIndex(2)
    })

    it("should insert a new task at the same level", () => {
      givenTasks([
        ["0", false],
        ["1", false, [
          ["2", false],
          ["3", false],                    
        ]],
        ["2", false],
      ])
      givenSelectedTaskIndex(3)
      actions.insertTask()
      expectTasks([
        ["0", false],
        ["1", false, [
          ["2", false],
          ["3", false],
          ["", false],
        ]],
        ["2", false],
      ])
      expectSelectedTaskIndex(4)
    })

    it("should insert a new task at the end at level 0 if no task is selected", () => {
      givenTasks([
        ["0", false],
        ["1", false, [
          ["2", false],
          ["3", false],
        ]],
      ])
      givenSelectedTaskIndex(null)
      actions.insertTask()
      expectTasks([
        ["0", false],
        ["1", false, [
          ["2", false],
          ["3", false],
        ]],
        ["", false]
      ])
      expectSelectedTaskIndex(4)
    })

    it("when inserting a task, insert it after all the selected task subtasks", () => {
      givenTasks([
        ["0", false],
        ["1", false, [
          ["2", false],
          ["3", false],
        ]],
      ])
      givenSelectedTaskIndex(1)
      actions.insertTask()
      expectTasks([
        ["0", false],
        ["1", false, [
          ["2", false],
          ["3", false],
        ]],
        ["", false]
      ])
      expectSelectedTaskIndex(4)
    })
  })

})
