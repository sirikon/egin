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
        
    }

    /**
        
        removeTask(index) {
            (() => {
                const taskIndexesToRemove = [index]
                    .concat(this.taskStore.getSubtasks(index))
                    .sort((a, b) => b - a)
                taskIndexesToRemove.forEach(i => {
                    this.taskStore.remove(i)
                })
        
                if (this.getSelectedTaskIndex() === null) { return }
                if (this.getSelectedTaskIndex() < index) { return }
        
                if (this.taskStore.count() === 0) {
                    setSelectedTaskIndex(null)
                    return
                }
        
                // If selected task index is lower or equal to
                // the highest index of removed tasks...
                if (this.getSelectedTaskIndex() <= taskIndexesToRemove[0]) {
                    this.setSelectedTaskIndex(index-1)
                    return
                }
        
                if (this.getSelectedTaskIndex() > taskIndexesToRemove[0]) {
                    this.setSelectedTaskIndex(this.getSelectedTaskIndex() - taskIndexesToRemove.length)
                }
            })();
            history.commit()
        }
        
        removeTaskIfEmpty(index) {
            const task = this.taskStore.get(index)
            if (task && task.name === '') { this.removeTask(index) }
        }
        
        removeSelectedTask() {
            this.removeTask(this.getSelectedTaskIndex())
        }
        
        jumpToPreviousTask() {
            const previousTaskIndex = this.getSelectedTaskIndex()
            this.setSelectedTaskIndex((this.getSelectedTaskIndex() || 0) > 0
                ? this.getSelectedTaskIndex() - 1
                : 0)
            if (previousTaskIndex !== null) { this.removeTaskIfEmpty(previousTaskIndex) }
        }
        
        jumpToNextTask() {
            const previousTaskIndex = this.getSelectedTaskIndex()
            this.setSelectedTaskIndex((this.getSelectedTaskIndex() || 0) < this.taskStore.count()-1
                ? this.getSelectedTaskIndex() + 1
                : this.taskStore.count()-1)
            if (previousTaskIndex !== null) { this.removeTaskIfEmpty(previousTaskIndex) }
        }
        
        moveSelectedTaskUp() {
            const targetPosition = this.taskStore.getPossiblePreviousPosition(this.getSelectedTaskIndex())
            if (targetPosition === null) { return }
        
            const taskIndexesToMove = [this.getSelectedTaskIndex()]
                .concat(this.taskStore.getSubtasks(this.getSelectedTaskIndex()))
                .length
        
            this.setSelectedTaskIndex(this.taskStore.move(this.getSelectedTaskIndex(), taskIndexesToMove, targetPosition))
            history.commit()
        }
        
        moveSelectedTaskDown() {
            const targetPosition = this.taskStore.getPossibleNextPosition(this.getSelectedTaskIndex())
            if (targetPosition === null) { return }
        
            const taskIndexesToMove = [this.getSelectedTaskIndex()]
                .concat(this.taskStore.getSubtasks(this.getSelectedTaskIndex()))
                .length
        
            this.setSelectedTaskIndex(this.taskStore.move(this.getSelectedTaskIndex(), taskIndexesToMove, targetPosition))
            history.commit()
        }
        
        insertTask() {
            history.commit()
            const indexToInsert = this.getSelectedTaskIndex() !== null
                ? this.getSelectedTaskIndex() + this.taskStore.getSubtasks(this.getSelectedTaskIndex()).length + 1
                : this.taskStore.count()
            const previousTask = this.taskStore.get(indexToInsert-1)
            const newTaskLevel = (this.getSelectedTaskIndex() !== null && indexToInsert > 0)
                ? this.taskStore.get(this.getSelectedTaskIndex()).level
                : 0
        
            if (indexToInsert > 0 && previousTask && previousTask.name === '') {
                return
            }
        
            this.taskStore.insert(indexToInsert, {name: '', done: false, level: newTaskLevel})
            this.setSelectedTaskIndex(indexToInsert)
            history.commit()
        }
        
        indentSelectedTask() {
            if (this.getSelectedTaskIndex() === null) { return }
            if (this.getSelectedTaskIndex() <= 0) { return }
            const selectedTask = this.taskStore.get(this.getSelectedTaskIndex())
            const previousTask = this.taskStore.get(this.getSelectedTaskIndex()-1)
            if (previousTask.level >= selectedTask.level) {
                const taskIndexesToIndent = [this.getSelectedTaskIndex()]
                    .concat(this.taskStore.getSubtasks(this.getSelectedTaskIndex()));
                history.commit()
                taskIndexesToIndent.forEach(i => {
                    this.taskStore.addLevel(i, 1)
                })
                history.commit()
            }
        }
        
        unindentSelectedTask() {
            if (this.getSelectedTaskIndex() === null) { return }
            if (this.getSelectedTaskIndex() <= 0) { return }
            const selectedTask = this.taskStore.get(this.getSelectedTaskIndex())
            if (selectedTask.level <= 0) { return }
            const taskIndexesToUnindent = [this.getSelectedTaskIndex()]
                .concat(this.taskStore.getSubtasks(this.getSelectedTaskIndex()))
            history.commit()
            taskIndexesToUnindent.forEach(i => {
                this.taskStore.addLevel(i, -1)
            })
            history.commit()
        }
    **/
}
