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

    public function remove_task_if_empty_should_do_nothing_on_non_empty_task() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.removeTaskIfEmpty(1);
        utils.expectTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
    }

    public function remove_task_if_empty_should_remove_empty_task() {
        utils.givenTasks([
            task('0', false),
            task('', false),
            task('2', false),
        ]);
        actions.removeTaskIfEmpty(1);
        utils.expectTasks([
            task('0', false),
            task('2', false),
        ]);
    }

    public function remove_selected_task_should_do_nothing_when_no_task_is_selected() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.removeSelectedTask();
        utils.expectTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
    }

    public function remove_selected_task_should_work() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.removeSelectedTask();
        utils.expectTasks([
            task('0', false),
            task('2', false),
        ]);
    }

    public function jump_to_previous_task_should_do_nothing_when_first_task_is_selected() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(0);
        actions.jumpToPreviousTask();
        expect(actions.getSelectedTaskIndex()).toEqual(0);
    }

    public function jump_to_previous_task_should_work() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(2);
        actions.jumpToPreviousTask();
        expect(actions.getSelectedTaskIndex()).toEqual(1);
    }

    public function jump_to_next_task_should_do_nothing_when_last_task_is_selected() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(2);
        actions.jumpToNextTask();
        expect(actions.getSelectedTaskIndex()).toEqual(2);
    }

    public function jump_to_next_task_should_work() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(0);
        actions.jumpToNextTask();
        expect(actions.getSelectedTaskIndex()).toEqual(1);
    }

    public function move_selected_task_up_should_do_nothing_on_first_task() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(0);
        actions.moveSelectedTaskUp();
        utils.expectTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(0);
    }

    public function move_selected_task_up_should_work() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.moveSelectedTaskUp();
        utils.expectTasks([
            task('1', false),
            task('0', false),
            task('2', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(0);
    }

    public function move_selected_task_down_should_do_nothing_on_last_task() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(2);
        actions.moveSelectedTaskDown();
        utils.expectTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(2);
    }

    public function move_selected_task_down_should_work() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.moveSelectedTaskDown();
        utils.expectTasks([
            task('0', false),
            task('2', false),
            task('1', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(2);
    }

    public function move_selected_task_up_should_move_subtasks_too() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false, [
                    task('3', false),
                ]),
            ]),
            task('4', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.moveSelectedTaskUp();
        utils.expectTasks([
            task('1', false, [
                task('2', false, [
                    task('3', false),
                ]),
            ]),
            task('0', false),
            task('4', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(0);
    }

    public function move_selected_task_down_should_move_subtasks_too() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false, [
                    task('3', false),
                ]),
            ]),
            task('4', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.moveSelectedTaskDown();
        utils.expectTasks([
            task('0', false),
            task('4', false),
            task('1', false, [
                task('2', false, [
                    task('3', false),
                ]),
            ]),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(2);
    }

    public function move_selected_task_up_should_skip_subtasks() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false, [
                    task('3', false),
                ]),
            ]),
            task('4', false),
        ]);
        actions.setSelectedTaskIndex(4);
        actions.moveSelectedTaskUp();
        utils.expectTasks([
            task('0', false),
            task('4', false),
            task('1', false, [
                task('2', false, [
                    task('3', false),
                ]),
            ]),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(1);
    }

    public function move_selected_task_down_should_skip_subtasks() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false, [
                    task('3', false),
                ]),
            ]),
            task('4', false),
        ]);
        actions.setSelectedTaskIndex(0);
        actions.moveSelectedTaskDown();
        utils.expectTasks([
            task('1', false, [
                task('2', false, [
                    task('3', false),
                ]),
            ]),
            task('0', false),
            task('4', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(3);
    }

    public function move_selected_task_up_should_do_nothing_when_first_task_on_same_level() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
                task('4', false),
            ]),
            task('5', false),
        ]);
        actions.setSelectedTaskIndex(2);
        actions.moveSelectedTaskUp();
        utils.expectTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
                task('4', false),
            ]),
            task('5', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(2);
    }

    public function move_selected_task_up_should_work_on_same_level() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
                task('4', false),
            ]),
            task('5', false),
        ]);
        actions.setSelectedTaskIndex(3);
        actions.moveSelectedTaskUp();
        utils.expectTasks([
            task('0', false),
            task('1', false, [
                task('3', false),
                task('2', false),
                task('4', false),
            ]),
            task('5', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(2);
    }

    public function move_selected_task_down_should_do_nothing_when_last_task_on_same_level() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
                task('4', false),
            ]),
            task('5', false),
        ]);
        actions.setSelectedTaskIndex(4);
        actions.moveSelectedTaskDown();
        utils.expectTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
                task('4', false),
            ]),
            task('5', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(4);
    }

    public function move_selected_task_down_should_work_on_same_level() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
                task('4', false),
            ]),
            task('5', false),
        ]);
        actions.setSelectedTaskIndex(3);
        actions.moveSelectedTaskDown();
        utils.expectTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('4', false),
                task('3', false),
            ]),
            task('5', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(4);
    }

    public function insert_task_should_add_first_task() {
        utils.givenTasks([]);
        actions.insertTask();
        utils.expectTasks([
            task('', false)
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(0);
    }

    public function insert_task_should_not_do_anything_when_selected_task_is_empty() {
        utils.givenTasks([
            task('0', false),
            task('', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.insertTask();
        utils.expectTasks([
            task('0', false),
            task('', false),
            task('2', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(1);
    }

    public function insert_task_should_work() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.insertTask();
        utils.expectTasks([
            task('0', false),
            task('1', false),
            task('', false),
            task('2', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(2);
    }

    public function insert_task_should_work_at_deeper_levels() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
            ]),
            task('4', false),
        ]);
        actions.setSelectedTaskIndex(2);
        actions.insertTask();
        utils.expectTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('', false),
                task('3', false),
            ]),
            task('4', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(3);
    }

    public function insert_task_should_insert_task_at_the_end_of_level_0_if_no_task_selected() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
            ]),
            task('4', false),
        ]);
        actions.insertTask();
        utils.expectTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
            ]),
            task('4', false),
            task('', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(5);
    }

    public function insert_task_should_insert_task_after_selected_task_subtasks() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
            ]),
            task('4', false),
        ]);
        actions.setSelectedTaskIndex(1);
        actions.insertTask();
        utils.expectTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
            ]),
            task('', false),
            task('4', false),
        ]);
        expect(actions.getSelectedTaskIndex()).toEqual(4);
    }
}
