package test.specs;

import core.Actions;
import test.utils.Utils;
import test.utils.Utils.*;
import core.TaskStore;
import core.Store;
import test.vendor.Jasmine.*;

class ActionsSpec {
    var store: Store;
    var utils: Utils;
    var taskStore: TaskStore;
    var actions: Actions;

    public function beforeEach() {
        store = new Store();
        utils = new Utils(store, 'test/test');
        taskStore = new TaskStore('test/test', store);
        actions = new Actions('test/test', store, taskStore);
    }

    public function get_selected_task_by_default_is_null() {
        expect(actions.getSelectedTask()).toEqual(null);
    }

    public function get_selected_task_should_return_correct_task() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        utils.givenSelectedTaskIndex(1);
        expect(actions.getSelectedTask())
            .toEqual(mockToTask(task('1', false)));
    }

    public function set_selected_task_index_should_work() {
        utils.givenSelectedTaskIndex(1);
        actions.setSelectedTaskIndex(2);
        expect(actions.getSelectedTaskIndex()).toEqual(2);
    }
}
