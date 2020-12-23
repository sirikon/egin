var root = document.getElementById('app')
var count = 0

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

    function remove(index) {
        tasks.splice(index, 1)
    }

    return { getAll, get, count, insert, remove }
}
const taskStore = TaskStore()

const uiState = {
    selectedTaskIndex: null
}

function removeTask(index) {
    taskStore.remove(index)
    if (uiState.selectedTaskIndex !== null && uiState.selectedTaskIndex >= index) {
        uiState.selectedTaskIndex > 0
            ? (uiState.selectedTaskIndex--)
            : (uiState.selectedTaskIndex = null)
    }
}

function Task(vnode) {
    const taskIndex = () => vnode.attrs.key
    const task = () => taskStore.get(taskIndex())
    const isSelected = () => taskIndex() === uiState.selectedTaskIndex
    const classes = () => buildClasses({
        'is-selected': isSelected()
    })

    const setSelected = () => uiState.selectedTaskIndex = taskIndex()
    const removeSelected = () => isSelected() && (uiState.selectedTaskIndex = null)
    const removeIfEmpty = () => task().name === '' && removeTask(taskIndex())

    const view = () => m('div.egin-task', {class: classes()}, [
        m('input', {
            type: 'checkbox',
            checked: task().done,
            onchange: (e) => task().done = e.target.checked,
            onfocus: setSelected,
            onblur: () => { removeSelected(); removeIfEmpty() }
        }),
        m('input', {
            type: 'text',
            value: task().name,
            oninput: (e) => task().name = e.target.value,
            onfocus: setSelected,
            onblur: () => { removeSelected(); removeIfEmpty() }
        })
    ])

    return { view }
}

function App() {
    const view = () => [
        m('div.egin-task-list', taskStore.getAll().map((_, i) => m(Task, {key: i})))
    ]

    return { view }
}

function buildClasses(obj) {
    return Object.keys(obj).filter(k => obj[k]).join(' ')
}

function focusSelectedTaskInput() {
    document.querySelector('.egin-task.is-selected input[type="text"]').focus()
}

function blurSelectedTaskInput() {
    document.querySelector('.egin-task.is-selected input[type="text"]').blur()
}

const globalKeyHandlers = {
    ArrowUp: (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (uiState.selectedTaskIndex === null) { uiState.selectedTaskIndex = 0 }
        uiState.selectedTaskIndex = uiState.selectedTaskIndex > 0
            ? uiState.selectedTaskIndex - 1
            : 0
        return focusSelectedTaskInput
    },
    ArrowDown: (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (uiState.selectedTaskIndex === null) { uiState.selectedTaskIndex = 0 }
        uiState.selectedTaskIndex = uiState.selectedTaskIndex < taskStore.count()-1
            ? uiState.selectedTaskIndex + 1
            : taskStore.count()-1
        return focusSelectedTaskInput
    },
    Escape: () => blurSelectedTaskInput(),
    Enter: () => {
        const indexToInsert = uiState.selectedTaskIndex !== null
            ? uiState.selectedTaskIndex + 1
            : taskStore.count()
        if (indexToInsert > 0 && taskStore.get(indexToInsert-1).name === '') {
            return
        }

        taskStore.insert(indexToInsert, {name: '', done: false})
        uiState.selectedTaskIndex = indexToInsert
        return focusSelectedTaskInput
    },
    Backspace: (e) => {
        const currentTask = taskStore.get(uiState.selectedTaskIndex)
        if (currentTask.name === '') {
            e.preventDefault()
            e.stopPropagation()
            removeTask(uiState.selectedTaskIndex)
            return focusSelectedTaskInput
        }
    }
}

document.addEventListener('keydown', (e) => {
    console.log(e.key);
    if (globalKeyHandlers[e.key]) {
        const cb = globalKeyHandlers[e.key](e)
        m.redraw.sync()
        cb && (cb instanceof Function) && cb()
    }
});

m.mount(root, App)
