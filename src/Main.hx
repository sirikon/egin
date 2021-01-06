import js.html.Console;
import mithril.M;
import mithril.M.m;

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
            m("table", todos.map((todo) -> m(TodoItemComponent, { todo: todo })))
        ]);
    }
}

class TodoItemComponent {
    public static function view(vnode: Vnode<Any>) {
        var todo = getTodo(vnode);
        return m("tr", [
            m("td", m("input[type=checkbox]", {
                onclick: (e) -> todo.done = e.target.checked,
                checked: todo.done
            })),
            m("td", todo.description)
        ]);
    }

    static function getTodo(vnode: Vnode<Any>): Todo
        return vnode.attrs.get('todo');
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

@:expose
class Main
{
    // Program entry point
    static final todos = [
        TodoF.create('Learn Haxe', true),
        TodoF.create('??'),
        TodoF.create('Profit!')
    ];
    static function main() {
        M.mount(js.Browser.document.body, new TodoComponent(todos));
    }
}
