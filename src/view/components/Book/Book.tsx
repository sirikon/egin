import React from "react"
import { useParams } from "react-router"
import { BookId, Task } from "../../../core/Book"

import "Book.scss"
import useBook from "../../hooks/useBook"

export default () => {
  const bookId = useParams<BookId>();
  const { tasks } = useBook(bookId);

  return (
    <div className="egin-task-list">
      {tasks.map((task) => <BookTask task={task} />)}
    </div>
  )
}

const BookTask = ({ task }: { task: Task }) => {
  return (
    <div className="egin-task" style={{ marginLeft: task.level * 20 }}>
      <input type="checkbox" checked={task.done} />
      <textarea className="egin-task-name" value={task.name} />
    </div>
  )
}
