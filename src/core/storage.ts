import state from "./State"
import history from "./history"

import { LocalStorageBackend } from "../storageBackends/localStorage"
import { DropboxBackend } from "../storageBackends/dropbox"
import { StorageBackend, StorageBackendInfo, StorageStatus, TaskListState } from "./models"
import { BehaviorSubject } from "rxjs"

const backends: { [key: string]: StorageBackend } = {
  local: new LocalStorageBackend(),
  dropbox: new DropboxBackend(),
}

const lastSavedTaskListStates: { [key: string]: string } = {}
const storageStatus: { [taskListId: string]: BehaviorSubject<StorageStatus> } = {};

export function load(taskListId: string) {
  setStorageStatus(taskListId, "loading")
  const backend = getBackend(taskListId)
  return backend.get(taskListId.split("/")[1])
    .then((taskListState) => {
      setTaskListState(taskListId, taskListState || { tasks:[], selectedTaskIndex: null })
      setStorageStatus(taskListId, "pristine")
    })
}

export function save(taskListId: string) {
  setStorageStatus(taskListId, "saving")
  const backend = getBackend(taskListId)
  return backend.save(taskListId.split("/")[1], getTaskListState(taskListId))
    .then(() => setStorageStatus(taskListId, "pristine"))
}

export function list(backend: string) {
  return backends[backend].list()
}

export function getBackends(): { [backendKey: string]: StorageBackendInfo } {
  return Object.keys(backends)
    .reduce((map, backend) => (map[backend]=backends[backend], map), {} as { [backendKey: string]: StorageBackendInfo })
}

export function isAuthenticated(backend: string) {
  return backends[backend].isAuthenticated()
}

export function getAuthenticationUrl(backend: string) {
  return backends[backend].getAuthenticationUrl()
}

export function getStorageStatus(taskListId: string) {
  if (!storageStatus[taskListId]) {
    storageStatus[taskListId] = new BehaviorSubject<StorageStatus>("loading");
  }
  return storageStatus[taskListId];
}

export function setStorageStatus(taskListId: string, status: StorageStatus) {
  getStorageStatus(taskListId).next(status);
}

function getBackend(taskListId: string) {
  return backends[taskListId.split("/")[0]]
}

function getTaskListState(taskListId: string) {
  return state.taskLists[taskListId]
}

function setTaskListState(taskListId: string, newState: TaskListState) {
  if (!state.taskLists[taskListId]) {
    (state.taskLists[taskListId] as unknown) = {}
  }
  Object.keys(newState).forEach(k => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state.taskLists[taskListId] as any)[k] = (newState as any)[k]
  })
  lastSavedTaskListStates[taskListId] = JSON.stringify(state.taskLists[taskListId])
  history.reset()
}
