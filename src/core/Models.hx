package core;

typedef State = {
    public var taskLists: Map<String, TaskListState>;
    public var storageStatus: Map<String, String>;
}

typedef TaskListState = {
    var tasks: Array<Task>;
    var selectedTaskIndex: Int;
}

typedef Task = {
    var name: String;
    var done: Bool;
    var level: Int;
    var header: Bool;
}
