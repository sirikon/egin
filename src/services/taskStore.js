import { state } from './state'

export function getAll() {
    return state.tasks;
}

export function get(index) {
    return state.tasks[index];
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

export function toggle(index) {
    state.tasks[index].done = !state.tasks[index].done
}

export function remove(index) {
    state.tasks.splice(index, 1)
}
