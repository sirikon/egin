import * as jsonpatch from "fast-json-patch"
import { BookState, State } from "./State"

type BookHistoryState = Pick<BookState, "tasks" | "selectedTaskIndex">

export class BookHistory {

  private previousState: BookHistoryState
  private readonly stateHistory: jsonpatch.Operation[][] = [];
  private delayedCommitTimeout: NodeJS.Timeout | null = null;

  constructor(
    private state: State,
    private bookId: string)
  {
    this.previousState = jsonpatch.deepClone(state);
  }

  commit() {
    this.cancelDelayedCommit()
    const patches = jsonpatch.compare(this.getState(), this.previousState)
    if (patches.length === 0) { return }
    this.stateHistory.push(patches)
    this.savePreviousState()
  }

  rollback() {
    this.commit()
    const lastPatch = this.stateHistory.pop()
    if (lastPatch === undefined) { return }
    jsonpatch.applyPatch(this.getState(), lastPatch)
    this.savePreviousState()
    this.commit()
  }

  delayedCommit() {
    this.cancelDelayedCommit()
    this.delayedCommitTimeout = setTimeout(() => {
      this.delayedCommitTimeout = null;
      this.commit();
    }, 1000)
  }

  reset() {
    this.cancelDelayedCommit();
    this.savePreviousState();
    this.stateHistory.splice(0, this.stateHistory.length);
  }

  private getState(): BookHistoryState {
    const bookState = this.state.books[this.bookId];
    return {
      tasks: bookState.tasks,
      selectedTaskIndex: bookState.selectedTaskIndex
    }
  }

  private cancelDelayedCommit() {
    if (this.delayedCommitTimeout !== null) {
      clearTimeout(this.delayedCommitTimeout);
      this.delayedCommitTimeout = null;
    }
  }

  private savePreviousState() {
    this.previousState = jsonpatch.deepClone(this.state)
  }
}