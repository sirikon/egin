package test.utils;

import test.vendor.Jasmine.*;
import core.TaskStore;
import core.Models;
import core.Store;
import test.utils.Models;

class Utils {
    final store: Store;
    final taskListId: String;
    public function new(store: Store, taskListId: String) {
        this.store = store;
        this.taskListId = taskListId;
    }

    public static function task(name: String, done: Bool, ?children: Array<MockTask>): MockTask {
        return { name: name, done: done, children: children != null ? children : [] }
    }

    public static function mockToTask(mock: MockTask): Task {
        return { name: mock.name, done: mock.done, level: 0, header: false }
    }

    public static function mocksToTasks(mocks: Array<MockTask>, ?level: Int): Array<Task> {
        final result:Array<Task> = [];
        for (mock in mocks) {
            result.push({ name: mock.name, done: mock.done, level: level != null ? level : 0, header: false });
            final children = mocksToTasks(mock.children, (level != null ? level : 0) + 1);
            for (child in children) { result.push(child); }
        }
        return result;
    }

    public function givenTasks(mocks: Array<MockTask>) {
        if (store.state.taskLists[taskListId] == null) {
            store.state.taskLists[taskListId] = { tasks: [], selectedTaskIndex: null }
        }
        store.state.taskLists[taskListId].tasks = mocksToTasks(mocks);
    }

    public function expectTasks(mocks: Array<MockTask>) {
        expect(store.state.taskLists[taskListId].tasks).toEqual(mocksToTasks(mocks));
    }

    /**
        export function givenTasks(mocks) {
            state.taskLists[taskListId].tasks = mocksToTasks(mocks)
        }
    **/
}
