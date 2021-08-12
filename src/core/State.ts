import { Task } from "./Task";

export type BookState = {
  tasks: Task[];
  selectedTaskIndex: number | null;
  storageStatus: "loading" | "saving" | "pristine";
}

export type State = {
  books: Record<string, BookState>
}

export const state: State = {
  books: {}
}
