import { BookActions } from "./BookActions"
import { BookHistory } from "./BookHistory";
import { BookStorage, buildBookStorage } from "./BookStorage";
import { BookTaskStore } from "./BookTaskStore";
import { getInitialState, State } from "./State";

type IoCService<T> = (new(...args: never[]) => T) & {
  readonly TYPE: string;
}

type ServiceCache = { [serviceName: string]: { [discriminator: string]: unknown } }

class IoC {

  constructor(
    private state: State) {}

  private serviceCache: ServiceCache = {}

  public getBookStorage() {
    return this.singleton(BookStorage, () =>
      buildBookStorage(this.state));
  }

  public getBookTaskStore(bookId: string) {
    return this.cached(BookTaskStore, bookId, () =>
      new BookTaskStore(
        this.state,
        bookId));
  }

  public getBookHistory(bookId: string) {
    return this.cached(BookHistory, bookId, () =>
      new BookHistory(
        this.state,
        bookId));
  }

  public getBookActions(bookId: string) {
    return this.cached(BookActions, bookId, () =>
      new BookActions(
        this.state,
        this.getBookTaskStore(bookId),
        this.getBookHistory(bookId),
        bookId))
  }

  private singleton<T>(service: IoCService<T>, provider: () => T): T {
    return this.cached(service, "__singleton__", provider);
  }

  private cached<T>(service: IoCService<T>, discriminator: string, provider: () => T): T {
    if (!this.serviceCache[service.TYPE]) { this.serviceCache[service.TYPE] = {} }
    if (!this.serviceCache[service.TYPE][discriminator]) {
      this.serviceCache[service.TYPE][discriminator] = provider();
    }
    return this.serviceCache[service.TYPE][discriminator] as T;
  }

}

export const ioc = new IoC(getInitialState());
