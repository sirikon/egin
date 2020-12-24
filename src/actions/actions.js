import * as taskStore from '../services/taskStore.js'
import { state, eventHandlers, historify } from '../services/state.js'

export function getSelectedTask() {
    if (state.ui.selectedTaskIndex === null) { return null; }
    return taskStore.get(state.ui.selectedTaskIndex)
}

export function setSelectedTaskIndex(index) {
    const previousIndex = state.ui.selectedTaskIndex
    state.ui.selectedTaskIndex = index
    if (previousIndex !== index) {
        eventHandlers.selectedTaskIndexChanged()
    }
}

export function toggleSelectedTask() {
    if (state.ui.selectedTaskIndex === null) { return }
    taskStore.toggle(state.ui.selectedTaskIndex)
    historify()
}

export function removeTask(index) {
    (() => {
        const task = taskStore.get(index)
        const taskIndexesToRemove = [index]
            .concat(taskStore.findDownwardTaskIndexesWithLevelUnder(index, task.level))
            .sort((a, b) => b - a)
        taskIndexesToRemove.forEach(i => {
            taskStore.remove(i)
        })

        if (state.ui.selectedTaskIndex === null) { return }
        if (state.ui.selectedTaskIndex < index) { return }

        // If selected task index is lower or equal to
        // the highest index of removed tasks...
        if (state.ui.selectedTaskIndex <= taskIndexesToRemove[0]) {
            setSelectedTaskIndex(index-1)
            return
        }

        if (state.ui.selectedTaskIndex > taskIndexesToRemove[0]) {
            setSelectedTaskIndex(state.ui.selectedTaskIndex - taskIndexesToRemove.length)
        }
    })();
    historify()
}

export function removeTaskIfEmpty(index) {
    const task = taskStore.get(index)
    if (task && task.name === '') { removeTask(index) }
}

export function removeSelectedTask() {
    removeTask(state.ui.selectedTaskIndex)
}

export function jumpToPreviousTask() {
    const previousTaskIndex = state.ui.selectedTaskIndex
    setSelectedTaskIndex((state.ui.selectedTaskIndex || 0) > 0
        ? state.ui.selectedTaskIndex - 1
        : 0)
    if (previousTaskIndex !== null) { removeTaskIfEmpty(previousTaskIndex) }
}

export function jumpToNextTask() {
    const previousTaskIndex = state.ui.selectedTaskIndex
    setSelectedTaskIndex((state.ui.selectedTaskIndex || 0) < taskStore.count()-1
        ? state.ui.selectedTaskIndex + 1
        : taskStore.count()-1)
    if (previousTaskIndex !== null) { removeTaskIfEmpty(previousTaskIndex) }
}

export function moveSelectedTaskUp() {
    const selectedTask = taskStore.get(state.ui.selectedTaskIndex)
    const targetPosition = taskStore.findUpwardFirstTaskWithLevel(state.ui.selectedTaskIndex, selectedTask.level)
    if (targetPosition === null) { return }
    taskStore.move(state.ui.selectedTaskIndex, targetPosition)
    setSelectedTaskIndex(targetPosition)
    historify()
}

export function moveSelectedTaskDown() {
    const selectedTask = taskStore.get(state.ui.selectedTaskIndex)
    const targetPosition = taskStore.findDownwardFirstTaskWithLevel(state.ui.selectedTaskIndex, selectedTask.level)
    if (targetPosition === null) { return }
    taskStore.move(state.ui.selectedTaskIndex, targetPosition)
    setSelectedTaskIndex(targetPosition)
    historify()
}

export function insertTaskUnderSelectedTask() {
    historify()
    const indexToInsert = state.ui.selectedTaskIndex !== null
        ? state.ui.selectedTaskIndex + 1
        : taskStore.count()
    if (indexToInsert > 0 && taskStore.get(indexToInsert-1) && taskStore.get(indexToInsert-1).name === '') {
        return
    }

    taskStore.insert(indexToInsert, {name: '', done: false, level: 0})
    setSelectedTaskIndex(indexToInsert)
    historify()
}

export function indentSelectedTask() {
    if (state.ui.selectedTaskIndex === null) { return }
    if (state.ui.selectedTaskIndex <= 0) { return }
    const selectedTask = taskStore.get(state.ui.selectedTaskIndex)
    const previousTask = taskStore.get(state.ui.selectedTaskIndex-1)
    if (previousTask.level >= selectedTask.level) {
        const taskIndexesToIndent = [state.ui.selectedTaskIndex]
            .concat(taskStore.findDownwardTaskIndexesWithLevelUnder(state.ui.selectedTaskIndex, selectedTask.level))
        historify()
        taskIndexesToIndent.forEach(i => {
            taskStore.addLevel(i, 1)
        })
        historify()
    }
}

export function unindentSelectedTask() {
    if (state.ui.selectedTaskIndex === null) { return }
    if (state.ui.selectedTaskIndex <= 0) { return }
    const selectedTask = taskStore.get(state.ui.selectedTaskIndex)
    if (selectedTask.level <= 0) { return }
    const taskIndexesToUnindent = [state.ui.selectedTaskIndex]
        .concat(taskStore.findDownwardTaskIndexesWithLevelUnder(state.ui.selectedTaskIndex, selectedTask.level))
    historify()
    taskIndexesToUnindent.forEach(i => {
        taskStore.addLevel(i, -1)
    })
    historify()
}
