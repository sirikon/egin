export interface Task {
    name: string;
    done: Boolean;
    level: number;
    header: Boolean;
}

export interface TaskListState {
    tasks: Task[];
    selectedTaskIndex: number;
}

export interface State {
    taskLists: { [taskListId: string]: TaskListState };
    storageStatus: { [taskListId: string]: StorageStatus };
}

export type StorageStatus = 'loading' | 'saving' | 'pristine';

export interface StorageBackendInfo {
    readonly displayName: string;
}

export interface StorageBackend extends StorageBackendInfo {
    isAuthenticated(): boolean;
    getAuthenticationUrl(): string;
    get(taskListId: string): Promise<TaskListState | null>;
    save(taskListId: string, taskListState: TaskListState): Promise<void>;
    list(): Promise<string[]>;
}
