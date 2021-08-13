export type BookId = {
  backend: string;
  name: string;
}

export const stringify = (bookId: BookId) =>
  `${bookId.backend}/${bookId.name}`;

export type BookState = {
  tasks: Task[];
  selectedTaskIndex: number | null;
  storageStatus: "loading" | "saving" | "pristine";
}

export type Task = {
  name: string;
  done: boolean;
  level: number;
  header: boolean;
}
