import assert from 'assert'
import chai from 'chai'
const expect = chai.expect

import './init.js'
import * as actions from '../src/actions/actions.js'
import * as state from '../src/services/state.js'

describe('Actions', () => {

    describe('#getSelectedTask()', () => {
        beforeEach(() => reset())
        it('should return null at start', () => {
            expect(actions.getSelectedTask()).to.equal(null)
        })
        it('should return correct selected task', () => {
            givenTasks([
                ['foo', false],
                ['bar', false]
            ])
            givenSelectedTaskIndex(1)
            expectSelectedTask(['bar', false])
        })
    })

    describe('#setSelectedTaskIndex', () => {
        beforeEach(() => reset())
        it('should change selected task index and not call event handler when it is the same', () => {
            state.eventHandlers.selectedTaskIndexChanged =
                () => { throw new Error("This event should not trigger") }
            givenSelectedTaskIndex(1)
            actions.setSelectedTaskIndex(1)
        })
        it('should change selected task index and call event handler when it is different', () => {
            let called = false
            state.eventHandlers.selectedTaskIndexChanged =
                () => { called = true }
            givenSelectedTaskIndex(1)
            actions.setSelectedTaskIndex(2)
            expect(called).to.equal(true)
        })
    })

    describe('#toggleSelectedTask', () => {
        beforeEach(() => reset())
        it('should not do anything when there is no selected task', () => {
            actions.toggleSelectedTask()
        })
        it('should enable the given task', () => {
            givenTasks([
                ['foo', false],
                ['bar', false]
            ])
            givenSelectedTaskIndex(1)
            actions.toggleSelectedTask()
            expectTasks([
                ['foo', false],
                ['bar', true]
            ])
        })
        it('should disable the given task', () => {
            givenTasks([
                ['foo', false],
                ['bar', true]
            ])
            givenSelectedTaskIndex(1)
            actions.toggleSelectedTask()
            expectTasks([
                ['foo', false],
                ['bar', false]
            ])
        })
    })

    describe('#removeTask', () => {
        beforeEach(() => reset())

        it('should remove a single task from the list', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            actions.removeTask(1)
            expectTasks([
                ['foo', false],
                ['baz', true]
            ])
            expectSelectedTaskIndex(null)
        })

        it('should remove a single task from the list and change the selected task index', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            givenSelectedTaskIndex(1)
            actions.removeTask(1)
            expectTasks([
                ['foo', false],
                ['baz', true]
            ])
            expectSelectedTaskIndex(0)
        })

        it('should remove a single task from the list and change the selected task index #2', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            givenSelectedTaskIndex(2)
            actions.removeTask(1)
            expectTasks([
                ['foo', false],
                ['baz', true]
            ])
            expectSelectedTaskIndex(1)
        })

        it('should remove a single task from the list and not change the selected task index', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            givenSelectedTaskIndex(0)
            actions.removeTask(1)
            expectTasks([
                ['foo', false],
                ['baz', true]
            ])
            expectSelectedTaskIndex(0)
        })

        it('should remove a task and its childs', () => {
            givenTasks([
                ['foo', false],
                ['bar', true, [
                    ['bar-1', true],
                    ['bar-2', false]
                ]],
                ['baz', true, [
                    ['baz-1', false]
                ]]
            ])
            givenSelectedTaskIndex(null)
            actions.removeTask(1)
            expectTasks([
                ['foo', false],
                ['baz', true, [
                    ['baz-1', false]
                ]]
            ])
            expectSelectedTaskIndex(null)
        })

        it('should remove a task and its childs', () => {
            givenTasks([
                ['foo', false],
                ['bar', true, [
                    ['bar-1', true],
                    ['bar-2', false]
                ]],
                ['baz', true, [
                    ['baz-1', false]
                ]]
            ])
            givenSelectedTaskIndex(0)
            actions.removeTask(1)
            expectTasks([
                ['foo', false],
                ['baz', true, [
                    ['baz-1', false]
                ]]
            ])
            expectSelectedTaskIndex(0)
        })

        it('should remove a task and its childs moving the index', () => {
            givenTasks([
                ['foo', false],
                ['bar', true, [
                    ['bar-1', true],
                    ['bar-2', false]
                ]],
                ['baz', true, [
                    ['baz-1', false]
                ]]
            ])
            givenSelectedTaskIndex(3)
            actions.removeTask(1)
            expectTasks([
                ['foo', false],
                ['baz', true, [
                    ['baz-1', false]
                ]]
            ])
            expectSelectedTaskIndex(0)
        })

        it('should remove a task and its childs moving the index', () => {
            givenTasks([
                ['foo', false],
                ['bar', true, [
                    ['bar-1', true],
                    ['bar-2', false]
                ]],
                ['baz', true, [
                    ['baz-1', false]
                ]]
            ])
            givenSelectedTaskIndex(5)
            actions.removeTask(1)
            expectTasks([
                ['foo', false],
                ['baz', true, [
                    ['baz-1', false]
                ]]
            ])
            expectSelectedTaskIndex(2)
        })
    })

    describe('#removeTaskIfEmpty', () => {
        beforeEach(() => reset())

        it('should not remove the task', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            actions.removeTaskIfEmpty(1)
            expectTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            expectSelectedTaskIndex(null)
        })

        it('should remove the task', () => {
            givenTasks([
                ['foo', false],
                ['', true],
                ['baz', true]
            ])
            actions.removeTaskIfEmpty(1)
            expectTasks([
                ['foo', false],
                ['baz', true]
            ])
            expectSelectedTaskIndex(null)
        })
    })

    describe('#removeSelectedTask', () => {
        beforeEach(() => reset())

        it('should remove the task', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            givenSelectedTaskIndex(1)
            actions.removeSelectedTask()
            expectTasks([
                ['foo', false],
                ['baz', true]
            ])
            expectSelectedTaskIndex(0)
        })
    })

    describe('#jumpToPreviousTask && #jumpToNextTask', () => {
        beforeEach(() => reset())

        it('should not jump to the previous task because it is the first one', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            givenSelectedTaskIndex(0)
            actions.jumpToPreviousTask()
            expectSelectedTaskIndex(0)
        })

        it('should jump to the previous task', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            givenSelectedTaskIndex(2)
            actions.jumpToPreviousTask()
            expectSelectedTaskIndex(1)
        })

        it('should not jump to the next task because it is the last one', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            givenSelectedTaskIndex(2)
            actions.jumpToNextTask()
            expectSelectedTaskIndex(2)
        })

        it('should not jump to the next task', () => {
            givenTasks([
                ['foo', false],
                ['bar', true],
                ['baz', true]
            ])
            givenSelectedTaskIndex(0)
            actions.jumpToNextTask()
            expectSelectedTaskIndex(1)
        })
    })

})

function givenTasks(mocks) {
    state.state.tasks = mocksToTasks(mocks)
}

function givenSelectedTaskIndex(index) {
    state.state.ui.selectedTaskIndex = index
}

function expectTasks(mocks) {
    expect(state.state.tasks).to.deep.equal(mocksToTasks(mocks))
}

function expectSelectedTask(mock) {
    expect(actions.getSelectedTask()).to.deep.equal(mocksToTasks([mock])[0])
}

function expectSelectedTaskIndex(index) {
    expect(state.state.ui.selectedTaskIndex).to.equal(index)
}

function mocksToTasks(mocks, level) {
    const result = []
    mocks.forEach(m => {
        result.push({ name: m[0], done: m[1], level: level || 0 })
        if (m[2]) {
            Array.prototype.push.apply(result, mocksToTasks(m[2], (level || 0)+1))
        }
    })
    return result
}

function reset() {
    state.state.tasks = []
    state.state.ui = { selectedTaskIndex: null }
    state.eventHandlers.selectedTaskIndexChanged = () => {}
}
