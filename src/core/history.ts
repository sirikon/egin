import * as jsonpatch from "fast-json-patch"
import { State, state } from "./State"

export class History {
  private previousState: State = jsonpatch.deepClone(state);
  private readonly stateHistory: jsonpatch.Operation[][] = [];
  private delayedCommitTimeout: NodeJS.Timeout | null = null;
  constructor(
    private enabled: boolean) { }

  commit() {
    if (!this.enabled) { return }

    this.cancelDelayedCommit()
    const patches = jsonpatch.compare(state, this.previousState)
    if (patches.length === 0) { return }
    this.stateHistory.push(patches)
    this.savePreviousState()
  }

  rollback() {
    if (!this.enabled) { return }

    this.commit()
    const lastPatch = this.stateHistory.pop()
    if (lastPatch === undefined) { return }
    jsonpatch.applyPatch(state, lastPatch)
    this.savePreviousState()
    this.commit()
  }

  delayedCommit() {
    if (!this.enabled) { return }

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

  private cancelDelayedCommit() {
    if (this.delayedCommitTimeout !== null) {
      clearTimeout(this.delayedCommitTimeout);
      this.delayedCommitTimeout = null;
    }
  }

  private savePreviousState() {
    this.previousState = jsonpatch.deepClone(state)
  }
}

export default new History(true);
