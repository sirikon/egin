package views.tasklist;

import mithril.M.Mithril;
import views.tasklist.components.TaskComponent;
import core.Actions;
import core.TaskStore;
import core.Store;
import mithril.M.Vnode;
import mithril.M.Vnodes;
import mithril.M.m;

typedef TaskListViewState = {
    var helpMenuVisible: Bool;
}

class TaskListView implements Mithril {
    static function taskListId(vnode: Vnode<Any>): String return vnode.attrs.get("taskListId");
    static function taskStore(vnode: Vnode<Any>) return new TaskStore(taskListId(vnode), Store.instance);
    static function actions(vnode: Vnode<Any>): Actions return new Actions(taskListId(vnode), Store.instance, taskStore(vnode));

    static function mapEachTask<T>(vnode: Vnode<Any>, cb:Int->T): Array<T> {
        final count = taskStore(vnode).count();
        final result = new Array<T>();
        for (i in 0...count) {
            result.push(cb(i));
        }
        return result;
    }
    
    var state: TaskListViewState;
    public function new() {
        state = { helpMenuVisible: false }
    }

    public function view(vnode: Vnode<Dynamic>): Vnodes {
        return [
            m('div.egin-task-list', mapEachTask(vnode,
                (i) -> m(TaskComponent, { key: i, taskStore: taskStore(vnode), actions: actions(vnode) }))),
            m('div.egin-task-list-storage-state', 'wip'),
            m('div', state.helpMenuVisible ? 'help visible' : 'help hidden')
        ];
    }
}
