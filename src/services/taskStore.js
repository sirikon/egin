function TaskStore() {
    const tasks = [
        {name: 'Easy task boi', done: false},
        {name: 'Harder task boi', done: true}
    ]

    function getAll() {
        return tasks;
    }

    function get(index) {
        return tasks[index];
    }

    function count() {
        return tasks.length;
    }

    function insert(index, task) {
        tasks.splice(index, 0, task)
    }

    function toggle(index) {
        tasks[index].done = !tasks[index].done
    }

    function remove(index) {
        tasks.splice(index, 1)
    }

    return { getAll, get, count, insert, toggle, remove }
}

const taskStore = TaskStore()
export default taskStore

