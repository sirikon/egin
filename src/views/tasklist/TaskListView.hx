package views.tasklist;

import js.html.Console;
import js.Browser;
import views.tasklist.HotkeysBuilder.Hotkey;
import js.html.KeyboardEvent;
import js.html.KeyEvent;
import js.html.Event;
import views.tasklist.components.TaskComponent;
import core.Actions;
import core.TaskStore;
import core.Store;
import mithril.M;
import mithril.M.Vnode;
import mithril.M.Vnodes;
import mithril.M.m;

typedef TaskListViewState = {
    var helpMenuVisible: Bool;
}

class TaskListView {
    static function taskListId(vnode: Vnode<Any>): String return vnode.attrs.get("taskListId");
    static function taskStore(vnode: Vnode<Any>) return new TaskStore(taskListId(vnode), Store.instance);
    static function actions(vnode: Vnode<Any>): Actions return new Actions(taskListId(vnode), Store.instance, taskStore(vnode));
    static function hotkeys(vnode: Vnode<Any>, state: TaskListViewState): Map<String, Hotkey>
        return HotkeysBuilder.build(actions(vnode), state);

    static function keydownListenerBuilder(hk: Map<String, Hotkey>) {
        return (e: KeyboardEvent) -> {
            final handlerNameParts = new Array<String>();
            if (e.ctrlKey) handlerNameParts.push('Ctrl');
            if (e.shiftKey) handlerNameParts.push('Shift');
            if (e.altKey) handlerNameParts.push('Alt');
            handlerNameParts.push(e.code);
            final handlerName = handlerNameParts.join('_');
            
            if (hk.exists(handlerName)) {
                hk.get(handlerName).action(e);
                M.redraw();
            }
        }
    }

    static function mapEachTask<T>(vnode: Vnode<Any>, cb:Int->T): Array<T> {
        final count = taskStore(vnode).count();
        final result = new Array<T>();
        for (i in 0...count) {
            result.push(cb(i));
        }
        return result;
    }
    
    var state: TaskListViewState;
    var keydownListener: (e: KeyboardEvent) -> Void;
    public function new() {
        state = { helpMenuVisible: false }
    }

    @:keep public function oncreate(vnode: Vnode<Dynamic>) {
        Console.log("Heyo oncreate");
        keydownListener = keydownListenerBuilder(hotkeys(vnode, state));
        Browser.document.addEventListener('keydown', keydownListener, true);
    }

    @:keep public function onremove(vnode: Vnode<Dynamic>) {
        Browser.document.removeEventListener('keydown', keydownListener, true);
    }

    public function view(vnode: Vnode<Dynamic>): Vnodes {
        Console.log("Heyo view");
        return [
            m('div.egin-task-list', mapEachTask(vnode,
                (i) -> m(TaskComponent, { key: i, taskStore: taskStore(vnode), actions: actions(vnode) }))),
            m('div.egin-task-list-storage-state', 'wip'),
            m('div', state.helpMenuVisible ? 'help visible' : 'help hidden')
        ];
    }
}
