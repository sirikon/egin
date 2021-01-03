import { state } from './state.js'

export default class TaskStore {
    constructor(taskListId) {
        this.taskListId = taskListId
    }

    getAll() {
        if (!state.taskLists[this.taskListId]) { return [] }
        return state.taskLists[this.taskListId].tasks;
    }

    get(index) {
        return this.getAll()[index];
    }

    getSubtasks(index) {
        const parentTask = this.get(index)
        const downwardTasks = this.getAll().slice(index+1)
        const matchingTaskIndexes = []
        let i = 0;
        let stop = 0;
        while(i < downwardTasks.length && !stop) {
            const task = downwardTasks[i]
            if (task.level > parentTask.level) {
                matchingTaskIndexes.push(i + index + 1)
            } else {
                stop = true
            }
            i++
        }
        return matchingTaskIndexes
    }

    getPossiblePreviousPosition(index) {
        const initialTask = this.get(index)
        let matchingTaskIndex = null
        let i = index-1
        let stop = 0;
        while(i >= 0 && !stop) {
            const task = this.getAll()[i]
            if (task.level === initialTask.level) {
                matchingTaskIndex = i
                stop = true
                continue
            }

            if (task.level < initialTask.level) {
                stop = true
                continue
            }

            i--
        }
        return matchingTaskIndex
    }

    getPossibleNextPosition(index) {
        const baseLevel = this.get(index).level

        let result = null
        let i = index+1;
        let stop = false
        while(i < this.getAll().length && !stop && !result) {
            const task = this.getAll()[i]

            if (task.level === baseLevel) {
                result = i+this.getSubtasks(i).length+1
                continue
            }

            if (task.level < baseLevel) {
                stop = true
                continue
            }

            i++
        }

        return result
    }

    count() {
        return this.getAll().length;
    }

    insert(index, task) {
        this.getAll().splice(index, 0, task)
    }

    setDone(index, value) {
        this.getAll()[index].done = value;
    }

    setName(index, value) {
        this.getAll()[index].name = value;
    }

    addLevel(index, value) {
        this.getAll()[index].level = this.getAll()[index].level + value;
    }

    toggle(index) {
        this.getAll()[index].done = !this.getAll()[index].done
    }

    toggleHeader(index) {
        this.getAll()[index].header = !this.getAll()[index].header
    }

    move(index, size, newIndex) {
        if (index === newIndex) { return }
        const finalIndex = newIndex > index
            ? newIndex - size
            : newIndex
        const tasks = this.getAll().splice(index, size)
        Array.prototype.splice.apply(this.getAll(), [finalIndex, 0].concat(tasks))
        return finalIndex
    }

    remove(index) {
        this.getAll().splice(index, 1)
    }
}
