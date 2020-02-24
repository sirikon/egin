const {Gtk} = imports.gi;
const {Window} = imports.components.window;

async function app() {
    const window = new Window();
    window.render();
}
