import { expect } from 'chai';

import {
    reset,
    givenTasks,
    expectTasks,
    mocksToTasks,
    getTaskStore
} from './base'
const taskStore = getTaskStore()

describe('TaskStore', () => {
    
    describe('#get', () => {
        beforeEach(() => reset())

        it('should return correct task', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.get(1))
                .to.deep.equal(mocksToTasks([
                    ['1', false],
                ])[0])
        })
    })

    describe('#getAll', () => {
        beforeEach(() => reset())

        it('should return all tasks', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.getAll())
                .to.deep.equal(mocksToTasks([
                    ['0', false],
                    ['1', false],
                    ['2', false],
                ]))
        })
    })

    describe('#getSubtasks', () => {
        beforeEach(() => reset())

        it('should return no subtasks', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.getSubtasks(1))
                .to.deep.equal([])
        })

        it('should return one subtask', () => {
            givenTasks([
                ['0', false],
                ['1', false, [
                    ['2', false]
                ]],
                ['3', false],
            ])
            expect(taskStore.getSubtasks(1))
                .to.deep.equal([2])
        })

        it('should return many subtasks', () => {
            givenTasks([
                ['0', false],
                ['1', false, [
                    ['2', false],
                    ['3', false],
                    ['4', false, [
                        ['5', false],
                    ]],
                    ['6', false],
                ]],
                ['7', false],
            ])
            expect(taskStore.getSubtasks(1))
                .to.deep.equal([2, 3, 4, 5, 6])
        })
    })

    describe('#getPossiblePreviousPosition', () => {
        beforeEach(() => reset())

        it('should return null if index is zero', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.getPossiblePreviousPosition(0)).to.equal(null)
        })

        it('should return previous position correctly in simple scenario', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.getPossiblePreviousPosition(1))
                .to.equal(0)
        })

        it('should return previous position correctly in simple scenario', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.getPossiblePreviousPosition(2))
                .to.equal(1)
        })

        it('should return previous position skipping subtasks', () => {
            givenTasks([
                ['0', false, [
                    ['1', false, [
                        ['2', false],
                    ]],
                    ['3', false],
                ]],
                ['4', false],
                ['5', false],
            ])
            expect(taskStore.getPossiblePreviousPosition(4))
                .to.equal(0)
        })
    })

    describe('#getPossibleNextPosition', () => {
        beforeEach(() => reset())

        it('should return null if index is the last one', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.getPossibleNextPosition(2))
                .to.equal(null)
        })

        it('should return next possible position', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.getPossibleNextPosition(1))
                .to.equal(3)
        })

        it('should return next possible position', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.getPossibleNextPosition(0))
                .to.equal(2)
        })

        it('should return next possible position skipping subtasks', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false, [
                    ['3', false],
                    ['4', false, [
                        ['5', false]
                    ]],
                    ['6', false],
                ]],
            ])
            expect(taskStore.getPossibleNextPosition(1))
                .to.equal(7)
        })
        
        it('should return next possible position skipping subtasks', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false, [
                    ['3', false],
                    ['4', false, [
                        ['5', false]
                    ]],
                    ['6', false],
                ]],
                ['7', false],
            ])
            expect(taskStore.getPossibleNextPosition(1))
                .to.equal(7)
        })

        it('should return next possible position skipping subtasks', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false, [
                    ['3', false],
                    ['4', false, [
                        ['5', false]
                    ]],
                    ['6', false],
                ]],
                ['7', false],
            ])
            expect(taskStore.getPossibleNextPosition(2))
                .to.equal(8)
        })
    })

    describe('#move', () => {
        beforeEach(() => reset())

        it('should not move the task when the position is the same', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            taskStore.move(1, 1, 1)
            expectTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
        })

        it('should move the task up', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            taskStore.move(1, 1, 0)
            expectTasks([
                ['1', false],
                ['0', false],
                ['2', false],
            ])
        })

        it('should move the task down', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            taskStore.move(1, 1, 3)
            expectTasks([
                ['0', false],
                ['2', false],
                ['1', false],
            ])
        })

        it('should move multiple tasks up correctly', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
                ['3', false],
                ['4', false],
                ['5', false],
                ['6', false],
            ])
            taskStore.move(2, 2, 0)
            expectTasks([
                ['2', false],
                ['3', false],
                ['0', false],
                ['1', false],
                ['4', false],
                ['5', false],
                ['6', false],
            ])
        })

        it('should move multiple tasks down correctly', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
                ['3', false],
                ['4', false],
                ['5', false],
                ['6', false],
            ])
            taskStore.move(2, 2, 6)
            expectTasks([
                ['0', false],
                ['1', false],
                ['4', false],
                ['5', false],
                ['2', false],
                ['3', false],
                ['6', false],
            ])
        })
    })
    
})
