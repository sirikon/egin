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
    storageStatus: { [taskListId: string]: string };
}

export interface StorageBackend {
    get(taskListId: string): Promise<TaskListState | null>;
    save(taskListId: string, taskListState: TaskListState): Promise<void>;
    list(): Promise<String[]>;
}
