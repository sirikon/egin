import { BookId, BookState, stringify } from "./Book";
import { DropboxBackend } from "./bookStorageBackends/DropboxBackend";
import { LocalStorageBackend } from "./bookStorageBackends/LocalStorageBackend";
import { State } from "./State";

export type BookStorableState = Pick<BookState, "tasks">

export type BookStorageBackend = {
  isAuthenticated(): boolean
  getAuthenticationUrl(): Promise<string>
  listBooks(): Promise<string[]>
  getBook(bookName: string): Promise<BookStorableState | null>
  saveBook(bookName: string, state: BookStorableState): Promise<void>
}

export type BookStorageBackendClass = {
  readonly displayName: string
  readonly iconUrl: string
} & (new (...args: never[]) => BookStorageBackend)

type BookStorageBackendRecord = { [name: string]: BookStorageBackendClass }

export class BookStorage {
  static readonly TYPE = "BookStorage"

  constructor(
    private state: State,
    private backends: BookStorageBackendRecord) {}

  private backendCache: { [name: string]: BookStorageBackend } = {};

  public async loadBook(bookId: BookId): Promise<void> {
    this.setBookStorageStatus(bookId, "loading");
    const backend = this.getBackend(bookId.backend);
    const bookStorableState = await backend.getBook(bookId.name);
    if (bookStorableState == null) throw new Error(`Book '${bookId.name}' does not exist in backend '${bookId.backend}'`);
    const bookState = this.getBookState(bookId);
    bookState.tasks = bookStorableState.tasks;
    this.setBookStorageStatus(bookId, "pristine");
  }

  public async saveBook(bookId: BookId): Promise<void> {
    this.setBookStorageStatus(bookId, "saving");
    const bookState = this.getBookState(bookId);
    const backend = this.getBackend(bookId.backend);
    await backend.saveBook(bookId.name, {
      tasks: bookState.tasks
    })
    this.setBookStorageStatus(bookId, "pristine");
  }

  public async listBooks(backendName: string): Promise<string[]> {
    return await this.getBackend(backendName).listBooks();
  }

  public getBackends(): BookStorageBackendRecord {
    return this.backends;
  }

  public isBackendAuthenticated(backendName: string): boolean {
    return this.getBackend(backendName).isAuthenticated();
  }

  public async getBackendAuthenticationUrl(backendName: string): Promise<string> {
    return await this.getBackend(backendName).getAuthenticationUrl();
  }

  private setBookStorageStatus(bookId: BookId, status: BookState["storageStatus"]) {
    this.getBookState(bookId).storageStatus = status;
  }

  private getBookState(bookId: BookId): BookState {
    return this.state.books[stringify(bookId)];
  }

  private getBackend(backendName: string): BookStorageBackend {
    if (!this.backendCache[backendName]) {
      this.backendCache[backendName] = new this.backends[backendName]();
    }
    return this.backendCache[backendName];
  }

}

export const buildBookStorage = (state: State) =>
  new BookStorage(state, {
    local: LocalStorageBackend,
    dropbox: DropboxBackend
  });
