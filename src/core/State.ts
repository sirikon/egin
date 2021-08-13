import { BookState } from "./Book"

export type State = {
  books: { [bookId: string]: BookState }
}

export const getInitialState = (): State => ({
  books: {}
})
