import TaskStore from './TaskStore'
import { state } from './state'
import * as history from './history'
import { Task } from './models';

export default class Actions {
    private taskStore: TaskStore;
    constructor(private taskListId: string) {
        this.taskStore = new TaskStore(taskListId)
    }

    getSelectedTaskIndex(): number | null {
        const value = state.taskLists[this.taskListId].selectedTaskIndex
        return value !== undefined ? value : null
    }

    setSelectedTaskIndex(index: number | null) {
        state.taskLists[this.taskListId].selectedTaskIndex = index
    }

    getSelectedTask(): Task | null {
        const selectedTaskIndex = this.getSelectedTaskIndex()
        if (selectedTaskIndex === null) { return null; }
        return this.taskStore.get(selectedTaskIndex)
    }

    toggleSelectedTask() {
        const selectedTaskIndex = this.getSelectedTaskIndex()
        if (selectedTaskIndex === null) { return }
        this.taskStore.toggle(selectedTaskIndex)
        history.commit()
    }
    
    toggleSelectedTaskHeaderState() {
        const selectedTaskIndex = this.getSelectedTaskIndex()
        if (selectedTaskIndex === null) { return }
        this.taskStore.toggleHeader(selectedTaskIndex)
        history.commit()
    }

    removeTask(index: number) {
        (() => {
            const taskIndexesToRemove = [index]
                .concat(this.taskStore.getSubtasks(index))
                .sort((a, b) => b - a)
            taskIndexesToRemove.forEach(i => {
                this.taskStore.remove(i)
            })

            const selectedTaskIndex = this.getSelectedTaskIndex()
    
            if (selectedTaskIndex === null) { return }
            if (selectedTaskIndex < index) { return }
    
            if (this.taskStore.count() === 0) {
                this.setSelectedTaskIndex(null)
                return
            }
    
            // If selected task index is lower or equal to
            // the highest index of removed tasks...
            if (selectedTaskIndex <= taskIndexesToRemove[0]) {
                this.setSelectedTaskIndex(index-1)
                return
            }
    
            if (selectedTaskIndex > taskIndexesToRemove[0]) {
                this.setSelectedTaskIndex(selectedTaskIndex - taskIndexesToRemove.length)
            }
        })();
        history.commit()
    }
    
    removeTaskIfEmpty(index: number) {
        const task = this.taskStore.get(index)
        if (task && task.name === '') { this.removeTask(index) }
    }
    
    removeSelectedTask() {
        const selectedTaskIndex = this.getSelectedTaskIndex()
        if (selectedTaskIndex === null) { return }
        this.removeTask(selectedTaskIndex)
    }
    
    jumpToPreviousTask() {
        const previousTaskIndex = this.getSelectedTaskIndex()
        const selectedTaskIndex = this.getSelectedTaskIndex() || 0
        this.setSelectedTaskIndex(selectedTaskIndex > 0
            ? selectedTaskIndex - 1
            : 0)
        if (previousTaskIndex !== null) { this.removeTaskIfEmpty(previousTaskIndex) }
    }
    
    jumpToNextTask() {
        const previousTaskIndex = this.getSelectedTaskIndex()
        const selectedTaskIndex = this.getSelectedTaskIndex() || 0
        this.setSelectedTaskIndex(selectedTaskIndex < this.taskStore.count()-1
            ? selectedTaskIndex + 1
            : this.taskStore.count()-1)
        if (previousTaskIndex !== null) { this.removeTaskIfEmpty(previousTaskIndex) }
    }
    
    moveSelectedTaskUp() {
        const selectedTaskIndex = this.getSelectedTaskIndex()
        if (selectedTaskIndex === null) { return; }

        const targetPosition = this.taskStore.getPossiblePreviousPosition(selectedTaskIndex)
        if (targetPosition === null) { return }
    
        const taskIndexesToMove = [selectedTaskIndex]
            .concat(this.taskStore.getSubtasks(selectedTaskIndex))
            .length
    
        this.setSelectedTaskIndex(this.taskStore.move(selectedTaskIndex, taskIndexesToMove, targetPosition))
        history.commit()
    }
    
    moveSelectedTaskDown() {
        const selectedTaskIndex = this.getSelectedTaskIndex()
        if (selectedTaskIndex === null) { return; }

        const targetPosition = this.taskStore.getPossibleNextPosition(selectedTaskIndex)
        if (targetPosition === null) { return }
    
        const taskIndexesToMove = [this.getSelectedTaskIndex()]
            .concat(this.taskStore.getSubtasks(selectedTaskIndex))
            .length
    
        this.setSelectedTaskIndex(this.taskStore.move(selectedTaskIndex, taskIndexesToMove, targetPosition))
        history.commit()
    }

    insertTask() {
        history.commit()
        const selectedTaskIndex = this.getSelectedTaskIndex()
        const indexToInsert = selectedTaskIndex !== null
            ? selectedTaskIndex + this.taskStore.getSubtasks(selectedTaskIndex).length + 1
            : this.taskStore.count()
        const previousTask = this.taskStore.get(indexToInsert-1)
        const newTaskLevel = (selectedTaskIndex !== null && indexToInsert > 0)
            ? this.taskStore.get(selectedTaskIndex).level
            : 0
    
        if (indexToInsert > 0 && previousTask && previousTask.name === '') {
            return
        }
    
        this.taskStore.insert(indexToInsert, { name: '', done: false, level: newTaskLevel, header: false })
        this.setSelectedTaskIndex(indexToInsert)
        history.commit()
    }
    
    indentSelectedTask() {
        const selectedTaskIndex = this.getSelectedTaskIndex()
        if (selectedTaskIndex === null) { return }
        if (selectedTaskIndex <= 0) { return }
        const selectedTask = this.taskStore.get(selectedTaskIndex)
        const previousTask = this.taskStore.get(selectedTaskIndex-1)
        if (previousTask.level >= selectedTask.level) {
            const taskIndexesToIndent = [selectedTaskIndex]
                .concat(this.taskStore.getSubtasks(selectedTaskIndex));
            history.commit()
            taskIndexesToIndent.forEach(i => {
                this.taskStore.addLevel(i, 1)
            })
            history.commit()
        }
    }
    
    unindentSelectedTask() {
        const selectedTaskIndex = this.getSelectedTaskIndex()
        if (selectedTaskIndex === null) { return }
        if (selectedTaskIndex <= 0) { return }
        const selectedTask = this.taskStore.get(selectedTaskIndex)
        if (selectedTask.level <= 0) { return }
        const taskIndexesToUnindent = [selectedTaskIndex]
            .concat(this.taskStore.getSubtasks(selectedTaskIndex))
        history.commit()
        taskIndexesToUnindent.forEach(i => {
            this.taskStore.addLevel(i, -1)
        })
        history.commit()
    }
}
