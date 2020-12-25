import { state } from './state.js'

export function getAll() {
    return state.tasks;
}

export function get(index) {
    return state.tasks[index];
}

export function getSubtasks(index) {
    const parentTask = get(index)
    const downwardTasks = state.tasks.slice(index+1)
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

export function getPossiblePreviousPosition(index) {
    const initialTask = get(index)
    let matchingTaskIndex = null
    let i = index-1
    let stop = 0;
    while(i >= 0 && !stop) {
        const task = state.tasks[i]
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

export function getPossibleNextPosition(index) {
    const baseLevel = get(index).level

    let result = null
    let i = index+1;
    let stop = false
    while(i < state.tasks.length && !stop && !result) {
        const task = state.tasks[i]

        if (task.level === baseLevel) {
            result = i+getSubtasks(i).length+1
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

export function count() {
    return state.tasks.length;
}

export function insert(index, task) {
    state.tasks.splice(index, 0, task)
}

export function setDone(index, value) {
    state.tasks[index].done = value;
}

export function setName(index, value) {
    state.tasks[index].name = value;
}

export function addLevel(index, value) {
    state.tasks[index].level = state.tasks[index].level + value;
}

export function toggle(index) {
    state.tasks[index].done = !state.tasks[index].done
}

export function move(index, size, newIndex) {
    if (index === newIndex) { return }
    const finalIndex = newIndex > index
        ? newIndex - size
        : newIndex
    const tasks = state.tasks.splice(index, size)
    Array.prototype.splice.apply(state.tasks, [finalIndex, 0].concat(tasks))
    return finalIndex
}

export function remove(index) {
    state.tasks.splice(index, 1)
}
