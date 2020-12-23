import taskStore from '../services/taskStore'
import uiState from '../services/uiState'

export function getSelectedTask() {
    return taskStore.get(uiState.selectedTaskIndex)
}

export function toggleSelectedTask() {
    taskStore.toggle(uiState.selectedTaskIndex)
}

export function removeTask(index) {
    taskStore.remove(index)
    if (uiState.selectedTaskIndex !== null && uiState.selectedTaskIndex >= index) {
        uiState.selectedTaskIndex > 0
            ? (uiState.selectedTaskIndex--)
            : (uiState.selectedTaskIndex = null)
    }
}

export function removeTaskIfEmpty(index) {
    if (taskStore.get(index).name === '') { removeTask(index) }
}

export function removeSelectedTask() {
    removeTask(uiState.selectedTaskIndex)
}

export function jumpToPreviousTask() {
    const previousTaskIndex = uiState.selectedTaskIndex
    if (uiState.selectedTaskIndex === null) { uiState.selectedTaskIndex = 0 }
    uiState.selectedTaskIndex = uiState.selectedTaskIndex > 0
        ? uiState.selectedTaskIndex - 1
        : 0
    if (previousTaskIndex !== null) { removeTaskIfEmpty(previousTaskIndex) }
}

export function jumpToNextTask() {
    const previousTaskIndex = uiState.selectedTaskIndex
    if (uiState.selectedTaskIndex === null) { uiState.selectedTaskIndex = 0 }
    uiState.selectedTaskIndex = uiState.selectedTaskIndex < taskStore.count()-1
        ? uiState.selectedTaskIndex + 1
        : taskStore.count()-1
    if (previousTaskIndex !== null) { removeTaskIfEmpty(previousTaskIndex) }
}

export function insertTaskUnderSelectedTask() {
    const indexToInsert = uiState.selectedTaskIndex !== null
        ? uiState.selectedTaskIndex + 1
        : taskStore.count()
    if (indexToInsert > 0 && taskStore.get(indexToInsert-1).name === '') {
        return
    }

    taskStore.insert(indexToInsert, {name: '', done: false})
    uiState.selectedTaskIndex = indexToInsert
}
