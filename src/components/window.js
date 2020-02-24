const {Gtk} = imports.gi;
const {Task} = imports.components.task;

const {state} = imports.state;

var Window = class {
    constructor() {
        this.renderedTaskIndex = {};
        this.counter = 2;

        const builder = Gtk.Builder.new_from_file('./layouts/Main.glade');
        this.win = builder.get_object('Main');
        this.container = builder.get_object('Container');
        this.addButton = builder.get_object('AddButton');

        this.win.connect('destroy', () => Gtk.main_quit());
        this.addButton.connect('clicked', this.addTask.bind(this));
        this.win.resize(800, 600);

        state.tasks.subscribe(this.renderTasks.bind(this));
    }

    renderTasks(tasks) {
        tasks.forEach(taskData => {
            if (!this.renderedTaskIndex[taskData.id]) {
                this.renderedTaskIndex[taskData.id] = new Task(taskData);
                this.container.add(this.renderedTaskIndex[taskData.id].widget);
            }
        });
    }

    addTask() {
        this.counter++
        const tasks = state.tasks.getValue();
        tasks.push({id: this.counter, done: false, text: 'YEHE ' + this.counter});
        state.tasks.next(tasks);
    }

    render() {
        this.win.show_all();
    }
}
