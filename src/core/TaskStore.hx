package core;

import core.Models;

class TaskStore {
    var taskListId: String;
    var store: Store;

    public function new(taskListId: String) {
        this.taskListId = taskListId;
        this.store = Store.instance;
    }

    public function getAll(): Array<Task> {
        if (!store.state.taskLists.exists(taskListId)) { return []; }
        return store.state.taskLists.get(taskListId).tasks;
    }

    public function get(index: Int): Task {
        return getAll()[index];
    }

    public function getSubtasks(index: Int): Array<Int> {
        final parentTask = get(index);
        final downwardTasks = getAll().slice(index+1);
        final marchingTaskIndexes = [];

        var i = 0;
        var stop = false;

        while (i < downwardTasks.length && !stop) {
            final task = downwardTasks[i];
            if (task.level > parentTask.level) {
                marchingTaskIndexes.push(i + index + 1);
            } else {
                stop = true;
            }
            i++;
        }

        return marchingTaskIndexes;
    }

    public function getPossiblePreviousPosition(index: Int): Null<Int> {
        final initialTask = get(index);
        var matchingTaskIndex:Null<Int> = null;

        var i = index-1;
        var stop = false;

        while (i >= 0 && !stop) {
            final task = getAll()[i];
            if (task.level == initialTask.level) {
                matchingTaskIndex = i;
                stop = true;
                continue;
            }

            if (task.level < initialTask.level) {
                stop = true;
                continue;
            }

            i--;
        }

        return matchingTaskIndex;
    }

    public function getPossibleNextPosition(index: Int): Null<Int> {
        final baseLevel = get(index).level;
        final all = getAll();
        
        var result:Null<Int> = null;
        var i = index + 1;
        var stop = false;

        while (i < all.length && !stop && result != null) {
            final task = all[i];

            if (task.level == baseLevel) {
                result = i+getSubtasks(i).length+1;
                continue;
            }

            if (task.level < baseLevel) {
                stop = true;
                continue;
            }

            i++;
        }

        return result;
    }

    public function count(): Int {
        return getAll().length;
    }

    public function insert(index: Int, task: Task) {
        getAll().insert(index, task);
    }

    public function setDone(index: Int, value: Bool) {
        get(index).done = value;
    }

    public function setName(index: Int, value: String) {
        get(index).name = value;
    }

    public function addLevel(index: Int, value: Int) {
        get(index).level += value;
    }

    public function toggle(index: Int) {
        final task = get(index);
        task.done = !task.done;
    }

    public function toggleHeader(index: Int) {
        final task = get(index);
        task.header = !task.header;
    }

    public function move(index: Int, size: Int, newIndex: Int): Null<Int> {
        if (index == newIndex) { return null; }
        final all = getAll();
        final finalIndex = newIndex > index
            ? newIndex - size
            : newIndex;
        final tasks = all.splice(index, size);
        for (index => task in tasks) {
            tasks.insert(finalIndex+index, task);
        }
        return finalIndex;
    }

    public function remove(index: Int) {
        getAll().splice(index, 1);
    }
}
