package core;

import core.Models;

@:expose
class Store {
    public static final instance = new Store();

    public final state: State;

    public function new() {
        state = {
            taskLists: new Map<String, TaskListState>(),
            storageStatus: new Map<String, String>()
        }
    }
}
