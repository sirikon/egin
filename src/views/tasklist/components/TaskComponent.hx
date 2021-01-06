package views.tasklist.components;

import js.html.InputElement;
import js.html.Event;
import core.Models.Task;
import core.Actions;
import core.TaskStore;
import mithril.M.Vnode;
import mithril.M.m;

class TaskComponent {
    static function taskStore(vnode: Vnode<Any>): TaskStore return vnode.attrs.get('taskStore');
    static function actions(vnode: Vnode<Any>): Actions return vnode.attrs.get('actions');
    static function taskIndex(vnode: Vnode<Any>): Int return vnode.attrs.get('key');

    static function task(vnode: Vnode<Any>): Task return taskStore(vnode).get(taskIndex(vnode));
    static function isSelected(vnode: Vnode<Any>): Bool
        return taskIndex(vnode) == actions(vnode).getSelectedTaskIndex();

    static function setDone(vnode: Vnode<Any>, value: Bool) taskStore(vnode).setDone(taskIndex(vnode), value);
    static function setName(vnode: Vnode<Any>, value: String) taskStore(vnode).setName(taskIndex(vnode), value);
    static function select(vnode: Vnode<Any>)
        actions(vnode).setSelectedTaskIndex(taskIndex(vnode));
    static function unselect(vnode: Vnode<Any>)
        actions(vnode).setSelectedTaskIndex(null);
    static function removeTaskOnBlur(vnode: Vnode<Any>)
        if (actions(vnode).getSelectedTaskIndex() == null) actions(vnode).removeTaskIfEmpty(taskIndex(vnode));

    static function classes(vnode: Vnode<Any>) {
        final task = task(vnode);
        final result:Array<String> = [];
        if (isSelected(vnode)) result.push('is-selected');
        if (task.done) result.push('is-done');
        if (task.header) result.push('is-header');
        return result;
    }

    static function style(vnode: Vnode<Any>) {
        return 'margin-left: ${task(vnode).level * 20}px;';
    }

    static function updateFocus(vnode: Vnode<Any>) {
        final textInput = cast(vnode.dom.querySelector('input[type="text"]'), InputElement);
        isSelected(vnode)
            ? textInput.focus()
            : textInput.blur();
    }

    public static function oncreate(vnode: Vnode<Any>) updateFocus(vnode);
    public static function onupdate(vnode: Vnode<Any>) updateFocus(vnode);
    
    public static function view(vnode: Vnode<Any>) {
        return m('div.egin-task', { 'class': classes(vnode), style: style(vnode) }, [
            m('input', {
                type: 'checkbox',
                checked: task(vnode).done,
                onchange: (e: Event) -> setDone(vnode, cast(e.target, InputElement).checked),
                onfocus: () -> select(vnode),
                onblur: () -> { unselect(vnode); removeTaskOnBlur(vnode); }
            }),
            m('input', {
                type: 'text',
                value: task(vnode).name,
                oninput: (e: Event) -> setName(vnode, cast(e.target, InputElement).value),
                onfocus: () -> select(vnode),
                onblur: () -> { unselect(vnode); removeTaskOnBlur(vnode); }
            })
        ]);
    }
}
