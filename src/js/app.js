var root = document.getElementById('app')
var count = 0

const tasks = [
    {id: 1, name: 'Easy task boi', done: false},
    {id: 2, name: 'Harder task boi', done: true}
]

function Task(vnode) {
    const task = () => vnode.attrs.task

    const view = () => m('div.egin-task', [
        m('input', {
            type: 'checkbox',
            checked: task().done,
            onchange: (e) => task().done = e.target.checked
        }),
        m('input', {
            type: 'text',
            value: task().name,
            oninput: (e) => task().name = e.target.value
        })
    ])

    return { view }
}

function Main() {
    // let count = 0;

    // const buttonClick = () => count++;
    // const buttonText = () =>
    //     `${count} click${(count !== 1 ? 's' : '')}`;

    const view = () => [
        m('div.egin-task-list', tasks.map(t => m(Task, {key: t.id, task: t})))
    ]

    return { view }
}

m.mount(root, Main)
