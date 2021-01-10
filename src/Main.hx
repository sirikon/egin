import views.tasklist.TaskListView;
import js.Browser;
import js.html.Console;
import mithril.M;
import mithril.M.m;

class Main {
    static function main() {
        final route = { view: function(vnode: Vnode<Dynamic>): Vnodes return m(new TaskListView(), {}) };
        M.route.route(Browser.document.getElementById('app'), '/local/patata', {
            "/:backend/:key": route,
        });
    }
}
