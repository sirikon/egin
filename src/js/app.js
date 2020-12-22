var root = document.getElementById('app')
var count = 0

function Hello() {
    let count = 0;

    const buttonClick = () => count++;
    const buttonText = () =>
        `${count} click${(count !== 1 ? 's' : '')}`;

    function view() {
        return [
            m("h1", {class: "title"}, "My first app"),
            m("button", { onclick: buttonClick }, buttonText())
        ]
    }

    return { view }
}

m.mount(root, Hello)
