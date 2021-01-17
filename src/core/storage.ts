import { state } from './state'
import * as history from './history'

import * as local from '../storageBackends/localStorage'
import * as dropbox from '../storageBackends/dropbox'
import { TaskListState } from './models'

const backends = {
    local,
    dropbox
}

const lastSavedTaskListStates = {}

export function load(taskListId) {
    setStorageStatus(taskListId, 'loading')
    const backend = getBackend(taskListId)
    return backend.get(taskListId.split('/')[1])
        .then((taskListState) => {
            setTaskListState(taskListId, taskListState || {tasks:[]})
            setStorageStatus(taskListId, 'pristine')
        })
}

export function save(taskListId) {
    setStorageStatus(taskListId, 'saving')
    const backend = getBackend(taskListId)
    return backend.save(taskListId.split('/')[1], getTaskListState(taskListId))
        .then(() => setStorageStatus(taskListId, 'pristine'))
}

export function list(backend) {
    return backends[backend].list()
}

export function getBackends() {
    return Object.keys(backends)
}

function getBackend(taskListId) {
    return backends[taskListId.split('/')[0]]
}

function getTaskListState(taskListId) {
    return state.taskLists[taskListId]
}

function setTaskListState(taskListId: string, newState: TaskListState) {
    if (!state.taskLists[taskListId]) {
        (state.taskLists[taskListId] as any) = {}
    }
    Object.keys(newState).forEach(k => {
        state.taskLists[taskListId][k] = newState[k]
    })
    lastSavedTaskListStates[taskListId] = JSON.stringify(state.taskLists[taskListId])
    history.reset()
}

function setStorageStatus(taskListId, status) {
    state.storageStatus[taskListId] = status
}
