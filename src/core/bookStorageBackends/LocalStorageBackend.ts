import icon from "../assets/storageBackends/local.svg"
import { BookStorableState, BookStorageBackend } from "../BookStorage";

export class LocalStorageBackend implements BookStorageBackend {
  static readonly displayName = "Local"
  static readonly iconUrl = icon

  isAuthenticated() { return true; }
  async getAuthenticationUrl() { return ""; }

  async getBook(taskListId: string): Promise<BookStorableState | null> {
    const data = localStorage.getItem(this.storageKey(taskListId))
    return data !== null
      ? JSON.parse(data)
      : null;
  }

  async saveBook(taskListId: string, taskListState: BookStorableState): Promise<void> {
    localStorage.setItem(this.storageKey(taskListId), JSON.stringify(taskListState));
  }

  async listBooks(): Promise<string[]> {
    return Object.keys(localStorage)
      .filter(k => k.indexOf("egin_tasklist_") === 0)
      .map(k => k.substr("egin_tasklist_".length));
  }

  private storageKey(taskListId: string) { return `egin_tasklist_${taskListId}` }
}
