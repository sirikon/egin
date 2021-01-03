import mithril.M;

class TodoComponent implements Mithril
{
    var todos : Array<Todo>;

    public function new(todos) {
        this.todos = todos;
    }

    // When implementing Mithril, the last m() expression 
    // or Array of m() is returned automatically.
    public function view() {
        m("div", [
            m("h1", "To do"),
            m("table", todos.map(function(todo) {
                m("tr", [
                    m("td", m("input[type=checkbox]", {
                        onclick: (e) -> todo.done = e.target.checked,
                        checked: todo.done
                    })),
                    m("td", todo.description)
                ]);
            }))
        ]);
    }
}

typedef Todo = {
    var done : Bool;
    var description : String;
}

class TodoF {
    public static function create(description: String, ?done:Bool): Todo {
        return { description: description, done: done != null ? done : false }
    }
}

class Main
{
    // Program entry point
    static function main() {
        var todos = [
            TodoF.create('Learn Haxe', true),
            TodoF.create('??'),
            TodoF.create('Profit!')
        ];
        
        M.mount(js.Browser.document.body, new TodoComponent(todos));
    }
}
