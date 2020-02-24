const {Gtk} = imports.gi;

var Task = class {
    constructor(data) {
        const builder = Gtk.Builder.new_from_file('./layouts/Task.glade');
        this.widget = builder.get_object('Task');
        this.checkbox = builder.get_object('Checkbox');
        this.label = builder.get_object('Label');

        this.label.set_label(data.text);
        this.checkbox.set_active(data.done);
    }
}
