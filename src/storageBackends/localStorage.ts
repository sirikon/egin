import { StorageBackend, TaskListState } from "../core/models";

export class LocalStorageBackend implements StorageBackend {

    async get(taskListId: string): Promise<TaskListState | null> {
        const data = localStorage.getItem(this.storageKey(taskListId))
        return data !== null
            ? JSON.parse(data)
            : null;
    }

    async save(taskListId: string, taskListState: TaskListState): Promise<void> {
        localStorage.setItem(this.storageKey(taskListId), JSON.stringify(taskListState));
    }

    async list(): Promise<String[]> {
        return Object.keys(localStorage)
            .filter(k => k.indexOf("egin_tasklist_") === 0)
            .map(k => k.substr("egin_tasklist_".length));
    }

    private storageKey(taskListId: string) { return `egin_tasklist_${taskListId}` };
}
