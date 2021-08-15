import { useEffect, useState } from "react";
import { BookId, stringify, Task } from "../../core/Book";
import { ioc } from "../../core/IoC";

export default (bookId: BookId) => {
  const bookStorage = ioc.getBookStorage();
  const bookController = ioc.getBookController(bookId);
  const bookTaskStore = ioc.getBookTaskStore(bookId);

  const [data, setData] = useState({
    tasks: [] as Task[]
  })

  useEffect(() => {
    (async () => {
      bookController.initialize();
      await bookStorage.loadBook(bookId);
      setData({
        tasks: bookTaskStore.getAll()
      })
    })()
  }, [stringify(bookId)])

  return data
}
