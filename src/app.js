const {Gtk} = imports.gi;
const Mainloop = imports.mainloop;

async function app() {
    const win = Gtk.Builder.new_from_file('./layouts/Main.glade').get_object('Main');
    win.connect('destroy', () => Gtk.main_quit());
    win.show_all();
    await wait(2000);
    win.resize(800, 600);
}

function wait(millis) {
    return new Promise((resolve) => {
        Mainloop.timeout_add(millis, () => { resolve() }, null);
    });
}
