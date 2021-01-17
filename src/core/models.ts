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
