import views.tasklist.TaskListView;
import js.Browser;
import mithril.M;
import mithril.M.m;

class Main {
    static function main() {
        final taskListView = new TaskListView();
        final route = { view: function(vnode: Vnode<Dynamic>): Vnodes return m(taskListView, { taskListId: "local/patata" }) };
        M.route.route(Browser.document.getElementById('app'), '/local/patata', {
            "/:backend/:key": route,
        });
    }
}
