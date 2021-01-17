package views.tasklist;

import js.Browser;
import haxe.macro.Expr.Function;
import js.html.Location;
import views.tasklist.TaskListView.TaskListViewState;
import core.Actions;
import js.html.Event;

typedef Hotkey = {
    name: String,
    action: (e: Event) -> Void,
}

class HotkeysBuilder {
    public static function build(actions: Actions, taskListState: TaskListViewState): Map<String, Hotkey> {
        return [
            "ArrowUp" => {
                name: 'Jump to task above',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.jumpToPreviousTask();
                }
            },
            "ArrowDown" => {
                name: 'Jump to task below',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.jumpToNextTask();
                }
            },
            "Escape" => {
                name: 'Unselect task',
                action: (e: Event) -> actions.setSelectedTaskIndex(null)
            },
            "Enter" => {
                name: 'Insert task',
                action: (e: Event) -> {
                    actions.insertTask();
                }
            },
            "Backspace" => {
                name: 'Remove task (if the name is empty)',
                action: (e: Event) -> {
                    final selectedTask = actions.getSelectedTask();
                    if (selectedTask.name == '') {
                        e.preventDefault();
                        e.stopPropagation();
                        actions.removeSelectedTask();
                    }
                }
            },
            "Ctrl_Space" => {
                name: 'Toggle task (done/to-do)',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.toggleSelectedTask();
                }
            },
            "Ctrl_KeyH" => {
                name: 'Turn task into Header and viceversa',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.toggleSelectedTaskHeaderState();
                }
            },
            // Ctrl_KeyS: {
            //     name: 'Save',
            //     action: (e: Event) -> {
            //         e.preventDefault()
            //         e.stopPropagation()
            //         storage.save(taskListId)
            //             .then(() => console.log('Done'))
            //     }
            // },
            "Ctrl_KeyZ" => {
                name: 'Undo',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    // history.rollback();
                }
            },
            "Tab" => {
                name: 'Indent task',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.indentSelectedTask();
                }
            },
            "Shift_Tab" => {
                name: 'Unindent task',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.unindentSelectedTask();
                }
            },
            "Ctrl_ArrowUp" => {
                name: 'Move task up',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.moveSelectedTaskUp();
                }
            },
            "Ctrl_ArrowDown" => {
                name: 'Move task down',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.moveSelectedTaskDown();
                }
            },
            "Ctrl_Alt_KeyH" => {
                name: 'Toggle help',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    taskListState.helpMenuVisible = !taskListState.helpMenuVisible;
                }
            },
            "Ctrl_Alt_KeyM" => {
                name: 'Menu',
                action: (e: Event) -> {
                    e.preventDefault();
                    e.stopPropagation();
                    Browser.location.href  = '#/';
                }
            }
        ];
    }
}
