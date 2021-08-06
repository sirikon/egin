import { Task } from "./models";
import state from "./state"

export class TaskStore {
  constructor(private taskListId: string) {}

  getAll(): Task[] {
    if (!state.taskLists[this.taskListId]) { return [] }
    return state.taskLists[this.taskListId].tasks;
  }

  get(index: number): Task {
    return this.getAll()[index];
  }

  getSubtasks(index: number): number[] {
    const parentTask = this.get(index)
    const downwardTasks = this.getAll().slice(index+1)
    const matchingTaskIndexes: number[] = [];
    let i = 0;
    let stop = false;
    while(i < downwardTasks.length && !stop) {
      const task = downwardTasks[i]
      if (task.level > parentTask.level) {
        matchingTaskIndexes.push(i + index + 1)
      } else {
        stop = true
      }
      i++
    }
    return matchingTaskIndexes
  }

  getPossiblePreviousPosition(index: number): number | null {
    const initialTask = this.get(index)
    let matchingTaskIndex = null
    let i = index-1
    let stop = false;
    while(i >= 0 && !stop) {
      const task = this.getAll()[i]
      if (task.level === initialTask.level) {
        matchingTaskIndex = i
        stop = true
        continue
      }

      if (task.level < initialTask.level) {
        stop = true
        continue
      }

      i--
    }
    return matchingTaskIndex
  }

  getPossibleNextPosition(index: number): number | null {
    const baseLevel = this.get(index).level

    let result = null
    let i = index+1;
    let stop = false
    while(i < this.getAll().length && !stop && !result) {
      const task = this.getAll()[i]

      if (task.level === baseLevel) {
        result = i+this.getSubtasks(i).length+1
        continue
      }

      if (task.level < baseLevel) {
        stop = true
        continue
      }

      i++
    }

    return result
  }

  count(): number {
    return this.getAll().length;
  }

  insert(index: number, task: Task) {
    this.getAll().splice(index, 0, task)
  }

  setDone(index: number, value: boolean) {
    this.getAll()[index].done = value;
  }

  setName(index: number, value: string) {
    this.getAll()[index].name = value;
  }

  addLevel(index: number, value: number) {
    this.getAll()[index].level = this.getAll()[index].level + value;
  }

  toggle(index: number) {
    this.getAll()[index].done = !this.getAll()[index].done
  }

  toggleHeader(index: number) {
    this.getAll()[index].header = !this.getAll()[index].header
  }

  move(index: number, size: number, newIndex: number): number {
    if (index === newIndex) { return index; }
    const finalIndex = newIndex > index
      ? newIndex - size
      : newIndex
    const tasks = this.getAll().splice(index, size)
    Array.prototype.splice.apply(this.getAll(), ([finalIndex, 0] as unknown[]).concat(tasks))
    return finalIndex
  }

  remove(index: number) {
    this.getAll().splice(index, 1)
  }
}
