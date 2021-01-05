package core;

import core.Models.Task;

class Actions {
    final taskListId: String;
    final store: Store;
    final taskStore: TaskStore;
    public function new(taskListId: String, store: Store, taskStore: TaskStore) {
        this.taskListId = taskListId;
        this.store = store;
        this.taskStore = taskStore;
    }

    public function getSelectedTaskIndex(): Null<Int> {
        if (store.state.taskLists[taskListId] == null) return null;
        final value = store.state.taskLists[taskListId].selectedTaskIndex;
        return value != null ? value : null;
    }

    public function setSelectedTaskIndex(index: Int) {
        store.state.taskLists[taskListId].selectedTaskIndex = index;
    }

    public function getSelectedTask(): Null<Task> {
        if (getSelectedTaskIndex() == null) { return null; }
        return taskStore.get(getSelectedTaskIndex());
    }

    public function toggleSelectedTask() {
        if (getSelectedTaskIndex() == null) { return; }
        taskStore.toggle(getSelectedTaskIndex());
    }

    public function toggleSelectedTaskHeaderState() {
        if (getSelectedTaskIndex() == null) { return; }
        taskStore.toggleHeader(getSelectedTaskIndex());
    }

    public function removeTask(index: Int) {
        final taskIndexesToRemove = [index]
            .concat(taskStore.getSubtasks(index));
        taskIndexesToRemove.sort((a, b) -> b - a);
        for (i in taskIndexesToRemove) taskStore.remove(i);

        if (getSelectedTaskIndex() == null || getSelectedTaskIndex() < index) { return; }
        if (taskStore.count() == 0) {
            setSelectedTaskIndex(null);
            return;
        }

        // If selected task index is lower or equal to
        // the highest index of removed tasks...
        if (getSelectedTaskIndex() <= taskIndexesToRemove[0]) {
            setSelectedTaskIndex(index-1);
            return;
        }

        if (getSelectedTaskIndex() > taskIndexesToRemove[0]) {
            setSelectedTaskIndex(getSelectedTaskIndex() - taskIndexesToRemove.length);
        }
    }

    public function removeTaskIfEmpty(index: Int) {
        final task = taskStore.get(index);
        if (task != null && task.name == '') removeTask(index);
    }

    public function removeSelectedTask() {
        if (getSelectedTaskIndex() == null) return;
        removeTask(getSelectedTaskIndex());
    }

    public function jumpToPreviousTask() {
        final previousTaskIndex = getSelectedTaskIndex();
        final currentTaskIndex = getSelectedTaskIndex() != null ? getSelectedTaskIndex() : 0;
        setSelectedTaskIndex(currentTaskIndex > 0 ? currentTaskIndex - 1 : 0);
        if (previousTaskIndex != null) removeTaskIfEmpty(previousTaskIndex);
    }

    public function jumpToNextTask() {
        final previousTaskIndex = getSelectedTaskIndex();
        final currentTaskIndex = getSelectedTaskIndex() != null ? getSelectedTaskIndex() : 0;
        setSelectedTaskIndex(currentTaskIndex < taskStore.count()-1
            ? currentTaskIndex+1
            : taskStore.count()-1);
        if (previousTaskIndex != null) removeTaskIfEmpty(previousTaskIndex);
    }

    public function moveSelectedTaskUp() {
        final targetPosition = taskStore.getPossiblePreviousPosition(getSelectedTaskIndex());
        if (targetPosition == null) return;

        final taskIndexesToMove = [getSelectedTaskIndex()]
            .concat(taskStore.getSubtasks(getSelectedTaskIndex()))
            .length;

        setSelectedTaskIndex(taskStore.move(getSelectedTaskIndex(), taskIndexesToMove, targetPosition));
    }

    public function moveSelectedTaskDown() {
        final targetPosition = taskStore.getPossibleNextPosition(getSelectedTaskIndex());
        if (targetPosition == null) return;

        final taskIndexesToMove = [getSelectedTaskIndex()]
            .concat(taskStore.getSubtasks(getSelectedTaskIndex()))
            .length;

        setSelectedTaskIndex(taskStore.move(getSelectedTaskIndex(), taskIndexesToMove, targetPosition));
    }

    public function insertTask() {
        final indexToInsert = getSelectedTaskIndex() != null
            ? getSelectedTaskIndex() + taskStore.getSubtasks(getSelectedTaskIndex()).length + 1
            : taskStore.count();
        final previousTask = taskStore.get(indexToInsert-1);
        final newTaskLevel = (getSelectedTaskIndex() != null && indexToInsert > 0)
            ? taskStore.get(getSelectedTaskIndex()).level
            : 0;
        
        if (indexToInsert > 0 && previousTask != null && previousTask.name == '') return;
        taskStore.insert(indexToInsert, { name: '', done: false, level: newTaskLevel, header: false });
        setSelectedTaskIndex(indexToInsert);
    }

    public function indentSelectedTask() {
        if (getSelectedTaskIndex() == null) return;
        if (getSelectedTaskIndex() <= 0) return;
        final selectedTask = taskStore.get(getSelectedTaskIndex());
        final previousTask = taskStore.get(getSelectedTaskIndex()-1);
        if (previousTask.level >= selectedTask.level) {
            final taskIndexesToIndent = [getSelectedTaskIndex()]
                .concat(taskStore.getSubtasks(getSelectedTaskIndex()));
            for (i in taskIndexesToIndent) taskStore.addLevel(i, 1);
        }
    }

    public function unindentSelectedTask() {
        if (getSelectedTaskIndex() == null) return;
        if (getSelectedTaskIndex() <= 0) return;
        final selectedTask = taskStore.get(getSelectedTaskIndex());
        if (selectedTask.level <= 0) return;
        final taskIndexesToUnindent = [getSelectedTaskIndex()]
            .concat(taskStore.getSubtasks(getSelectedTaskIndex()));
        for (i in taskIndexesToUnindent) taskStore.addLevel(i, -1);
    }
}
