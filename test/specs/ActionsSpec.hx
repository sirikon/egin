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

    public function toggle_selected_task_should_not_do_anything_with_no_task_selected() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
        ]);
        actions.toggleSelectedTask();
        utils.expectTasks([
            task('0', false),
            task('1', false),
        ]);
    }

    public function toggle_selected_task_should_enable_and_disable_selected_task() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.toggleSelectedTask();
        utils.expectTasks([
            task('0', false),
            task('1', true),
            task('2', false),
        ]);
        actions.toggleSelectedTask();
        utils.expectTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
    }

    public function remove_task_should_remove_given_task() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.removeTask(2);
        utils.expectTasks([
            task('0', false),
            task('1', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(1);
    }

    public function remove_task_should_remove_given_task_and_change_selected_task_index() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(2);
        actions.removeTask(1);
        utils.expectTasks([
            task('0', false),
            task('2', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(1);
    }

    public function remove_task_should_remove_given_task_and_its_subtasks() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false, [
                    task('4', false),
                ]),
                task('5', false),
            ]),
            task('6', false, [
                task('7', false),
            ]),
        ]);
        actions.setSelectedTaskIndex(6);
        actions.removeTask(1);
        utils.expectTasks([
            task('0', false),
            task('6', false, [
                task('7', false),
            ]),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(1);
    }
}
