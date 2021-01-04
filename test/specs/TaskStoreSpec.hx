package test.specs;

import test.utils.Utils;
import test.utils.Utils.*;
import core.TaskStore;
import core.Store;
import test.vendor.Jasmine.*;

class TaskStoreSpec {
    var store: Store;
    var utils: Utils;
    var taskStore: TaskStore;

    public function beforeEach() {
        store = new Store();
        utils = new Utils(store, 'test/test');
        taskStore = new TaskStore('test/test', store);
    }

    public function get_should_return_correct_task() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.get(1))
            .toEqual(mockToTask(task('1', false)));
    }

    public function get_all_should_return_correct_tasks() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.getAll())
            .toEqual(mocksToTasks([
                task('0', false),
                task('1', false),
                task('2', false),
            ]));
    }

    public function get_subtasks_should_return_nothing() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.getSubtasks(1))
            .toEqual([]);
    }

    public function get_subtasks_should_return_one_subtask() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false)
            ]),
            task('3', false),
        ]);
        expect(taskStore.getSubtasks(1))
            .toEqual([2]);
    }

    public function get_subtasks_should_return_many_subtasks() {
        utils.givenTasks([
            task('0', false),
            task('1', false, [
                task('2', false),
                task('3', false),
                task('4', false, [
                    task('5', false),
                ]),
                task('6', false),
            ]),
            task('7', false),
        ]);
        expect(taskStore.getSubtasks(1))
            .toEqual([2,3,4,5,6]);
    }

    public function get_possible_previous_position_should_return_null_for_index_0() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.getPossiblePreviousPosition(0))
            .toEqual(null);
    }

    public function get_possible_previous_position_should_return_previous_position_1() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.getPossiblePreviousPosition(1))
            .toEqual(0);
    }

    public function get_possible_previous_position_should_return_previous_position_2() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.getPossiblePreviousPosition(2))
            .toEqual(1);
    }

    public function get_possible_previous_position_should_return_previous_position_skipping_subtasks() {
        utils.givenTasks([
            task('0', false, [
                task('1', false, [
                    task('2', false),
                ]),
                task('3', false),
            ]),
            task('4', false),
            task('5', false),
        ]);
        expect(taskStore.getPossiblePreviousPosition(4))
            .toEqual(0);
    }

    public function get_possible_next_position_should_return_null_for_last_index() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.getPossibleNextPosition(2))
            .toEqual(null);
    }

    public function get_possible_next_position_should_return_correct_last_position() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.getPossibleNextPosition(1))
            .toEqual(3);
    }

    public function get_possible_next_position_should_return_correct_middle_position() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        expect(taskStore.getPossibleNextPosition(0))
            .toEqual(2);
    }

    public function get_possible_next_position_should_return_correct_position_skipping_subtasks() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false, [
                task('3', false),
                task('4', false, [
                    task('5', false),
                ]),
                task('6', false),
            ]),
        ]);
        expect(taskStore.getPossibleNextPosition(1))
            .toEqual(7);
    }

    public function get_possible_next_position_should_return_correct_position_skipping_subtasks_2() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false, [
                task('3', false),
                task('4', false, [
                    task('5', false),
                ]),
                task('6', false),
            ]),
            task('7', false),
        ]);
        expect(taskStore.getPossibleNextPosition(1))
            .toEqual(7);
    }

    public function get_possible_next_position_should_return_correct_position_skipping_subtasks_3() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false, [
                task('3', false),
                task('4', false, [
                    task('5', false),
                ]),
                task('6', false),
            ]),
            task('7', false),
        ]);
        expect(taskStore.getPossibleNextPosition(2))
            .toEqual(8);
    }

    public function move_should_not_do_anything_given_the_same_index() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        taskStore.move(1, 1, 1);
        utils.expectTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
    }

    public function move_should_move_one_task_one_step_up() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        taskStore.move(1, 1, 0);
        utils.expectTasks([
            task('1', false),
            task('0', false),
            task('2', false),
        ]);
    }

    public function move_should_move_one_task_one_step_down() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
        ]);
        taskStore.move(1, 1, 3);
        utils.expectTasks([
            task('0', false),
            task('2', false),
            task('1', false),
        ]);
    }

    public function move_should_move_multiple_tasks_up() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
            task('3', false),
            task('4', false),
            task('5', false),
            task('6', false),
        ]);
        taskStore.move(2, 2, 0);
        utils.expectTasks([
            task('2', false),
            task('3', false),
            task('0', false),
            task('1', false),
            task('4', false),
            task('5', false),
            task('6', false),
        ]);
    }

    public function move_should_move_multiple_tasks_down() {
        utils.givenTasks([
            task('0', false),
            task('1', false),
            task('2', false),
            task('3', false),
            task('4', false),
            task('5', false),
            task('6', false),
        ]);
        taskStore.move(2, 2, 6);
        utils.expectTasks([
            task('0', false),
            task('1', false),
            task('4', false),
            task('5', false),
            task('2', false),
            task('3', false),
            task('6', false),
        ]);
    }
}
