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
                        onclick: function(e) todo.done = e.target.checked,
                        checked: todo.done
                    })),
                    m("td", todo.description)
                ]);
            }))
        ]);
    }    
}

class Todo
{
    public var done : Bool = false;
    public var description : String;

    public function new(description, ?done) {
        this.description = description;
        if(done != null) this.done = done;
    }
}

class Main
{
    // Program entry point
    static function main() {
        var todos = [
            new Todo("Learn Haxe"),
            new Todo("??"),
            new Todo("Profit!")
        ];
        
        M.mount(js.Browser.document.body, new TodoComponent(todos));
    }
}
