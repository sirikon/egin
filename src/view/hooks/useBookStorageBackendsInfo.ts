import { useEffect, useState } from "react";
import { BookStorageBackendRecord } from "../../core/BookStorage";
import { ioc } from "../../core/IoC"

export type BookStorageBackendInfo = {
  name: string
  displayName: string
  iconUrl: string
  isAuthenticated: boolean
  books: {
    loading: boolean,
    data: string[]
  }
}

export default function (): BookStorageBackendInfo[] {
  const bookStorage = ioc.getBookStorage();
  const backends = bookStorage.getBackends();
  const backendsNames = Object.keys(backends);

  const [books, setBooks] = useState(recordForEachBackend(backends, {
    loading: true,
    data: [] as string[]
  }))

  useEffect(() => {
    backendsNames.forEach(async (backend) => {
      const books = await bookStorage.listBooks(backend);
      setBooks((b) => ({ ...b, [backend]: {
        loading: false,
        data: books
      } }))
    })
  }, [])

  return Object.entries(bookStorage.getBackends())
    .map(([name, clazz]) => ({
      name,
      displayName: clazz.displayName,
      iconUrl: clazz.iconUrl,
      isAuthenticated: bookStorage.isBackendAuthenticated(name),
      books: books[name]
    }))
}

function recordForEachBackend<T>(backends: BookStorageBackendRecord, initialValue: T) {
  return Object.fromEntries(Object.keys(backends).map(name => [name, initialValue]))
}
