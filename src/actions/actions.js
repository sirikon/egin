import * as taskStore from '../services/taskStore'
import { state, eventHandlers, historify } from '../services/state'

export function getSelectedTask() {
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
    taskStore.toggle(state.ui.selectedTaskIndex)
    historify()
}

export function removeTask(index) {
    taskStore.remove(index)
    if (state.ui.selectedTaskIndex !== null && state.ui.selectedTaskIndex >= index) {
        state.ui.selectedTaskIndex > 0
            ? (setSelectedTaskIndex(state.ui.selectedTaskIndex-1))
            : (setSelectedTaskIndex(null))
    }
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

export function insertTaskUnderSelectedTask() {
    historify()
    const indexToInsert = state.ui.selectedTaskIndex !== null
        ? state.ui.selectedTaskIndex + 1
        : taskStore.count()
    if (indexToInsert > 0 && taskStore.get(indexToInsert-1).name === '') {
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
