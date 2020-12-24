import { state } from './state.js'

export function getAll() {
    return state.tasks;
}

export function get(index) {
    return state.tasks[index];
}

export function findDownwardTaskIndexesWithLevelUnder(index, level) {
    const downwardTasks = state.tasks.slice(index+1)
    const matchingTaskIndexes = []
    let i = 0;
    let stop = 0;
    while(i < downwardTasks.length && !stop) {
        const task = downwardTasks[i]
        if (task.level > level) {
            matchingTaskIndexes.push(i + index + 1)
        } else {
            stop = true
        }
        i++
    }
    return matchingTaskIndexes
}

export function findUpwardFirstTaskWithLevel(index, level) {
    const upwardTasks = state.tasks.slice(0, index)
    let matchingTaskIndex = null
    let i = upwardTasks.length-1;
    let stop = 0;
    while(i >= 0 && !stop) {
        const task = upwardTasks[i]
        if (task.level === level) {
            matchingTaskIndex = i + index + 1
            stop = true
            continue
        }

        if (task.level < level) {
            stop = true
            continue
        }

        i--
    }
    return matchingTaskIndex
}

export function findDownwardFirstTaskWithLevel(index, level) {
    const downwardTasks = state.tasks.slice(index+1)
    let matchingTaskIndex = null
    let i = 0;
    let stop = 0;
    while(i < downwardTasks.length && !stop) {
        const task = downwardTasks[i]
        if (task.level === level) {
            matchingTaskIndex = i + index + 1
            stop = true
            continue
        }

        if (task.level < level) {
            stop = true
            continue
        }

        i++
    }
    return matchingTaskIndex
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

export function move(index, steps) {
    const task = state.tasks.splice(index, 1)[0]
    state.tasks.splice(index+steps, 0, task)
}

export function remove(index) {
    state.tasks.splice(index, 1)
}
