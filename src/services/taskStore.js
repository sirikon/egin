const tasks = [
    {name: 'Easy task boi', done: false},
    {name: 'Harder task boi', done: true}
]

export function getAll() {
    return tasks;
}

export function get(index) {
    return tasks[index];
}

export function count() {
    return tasks.length;
}

export function insert(index, task) {
    tasks.splice(index, 0, task)
}

export function setDone(index, value) {
    tasks[index].done = value;
}

export function setName(index, value) {
    tasks[index].name = value;
}

export function toggle(index) {
    tasks[index].done = !tasks[index].done
}

export function remove(index) {
    tasks.splice(index, 1)
}
