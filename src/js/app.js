var root = document.getElementById('app')
var count = 0

const tasks = [
    {name: 'Easy task boi', done: false},
    {name: 'Harder task boi', done: true}
]

const uiState = {
    selectedTaskKey: null
}

function Task(vnode) {
    const task = () => vnode.attrs.task
    const isSelected = () => vnode.attrs.key === uiState.selectedTaskKey
    const classes = () => buildClasses({
        'is-selected': isSelected()
    })

    const setSelected = () => uiState.selectedTaskKey = vnode.attrs.key
    const removeSelected = () => isSelected() && (uiState.selectedTaskKey = null)

    const view = () => m('div.egin-task', {class: classes()}, [
        m('input', {
            type: 'checkbox',
            checked: task().done,
            onchange: (e) => task().done = e.target.checked,
            onfocus: setSelected,
            onblur: removeSelected
        }),
        m('input', {
            type: 'text',
            value: task().name,
            oninput: (e) => task().name = e.target.value,
            onfocus: setSelected,
            onblur: removeSelected
        })
    ])

    return { view }
}

function App() {
    const view = () => [
        m('div.egin-task-list', tasks.map((task, i) => m(Task, {key: i, task})))
    ]

    return { view }
}

function buildClasses(obj) {
    return Object.keys(obj).filter(k => obj[k]).join(' ')
}

const globalKeyHandlers = {
    ArrowUp: () => {
        if (uiState.selectedTaskKey === null) { uiState.selectedTaskKey = 0 }
        uiState.selectedTaskKey = uiState.selectedTaskKey > 0
            ? uiState.selectedTaskKey - 1
            : 0
    },
    ArrowDown: () => {
        if (uiState.selectedTaskKey === null) { uiState.selectedTaskKey = 0 }
        uiState.selectedTaskKey = uiState.selectedTaskKey < tasks.length-1
            ? uiState.selectedTaskKey + 1
            : tasks.length-1
    },
    Escape: () => uiState.selectedTaskKey = null
}

document.addEventListener('keydown', (e) => {
    if (globalKeyHandlers[e.key]) {
        e.preventDefault()
        e.stopPropagation()
        globalKeyHandlers[e.key](e)
        m.redraw.sync()
        document.querySelector('.egin-task.is-selected input[type="text"]').focus()
    }
});

m.mount(root, App)
