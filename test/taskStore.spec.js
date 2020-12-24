import chai from 'chai'
const expect = chai.expect

import {
    reset,
    givenTasks,
    expectTasks,
    mocksToTasks
} from './base.js'
import * as taskStore from '../src/services/taskStore.js'
import * as state from '../src/services/state.js'

describe.only('TaskStore', () => {
    
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

    describe('#findDownwardTaskIndexesWithLevelUnder', () => {
        beforeEach(() => reset())

        it('should return no subtasks', () => {
            givenTasks([
                ['0', false],
                ['1', false],
                ['2', false],
            ])
            expect(taskStore.findDownwardTaskIndexesWithLevelUnder(1, 0))
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
            expect(taskStore.findDownwardTaskIndexesWithLevelUnder(1, 0))
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
            expect(taskStore.findDownwardTaskIndexesWithLevelUnder(1, 0))
                .to.deep.equal([2, 3, 4, 5, 6])
        })
    })
    
})
