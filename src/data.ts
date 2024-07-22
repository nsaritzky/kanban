import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setDataLoaded } from "./app/uiState"
import { boardAdded, boardsRemoved } from "./boards/boardsSlice"
import { columnAdded, columnsRemoved } from "./columns/columnsSlice"
import { taskAdded, tasksRemoved } from "./tasks/tasksSlice"

interface Subtask {
  title: string
  completed: boolean
}

interface Task {
  _id: string
  title: string
  description: string
  status: string
  subtasks: Subtask[]
}

interface Column {
  _id: string
  title: string
  tasks: Task[]
}

interface Board {
  _id: string
  title: string
  columns: Column[]
}

export const useData = ({ boards }: { boards: Board[] }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const boardIds: string[] = []
    const columnIds: string[] = []
    const taskIds: string[] = []

    for (const board of boards) {
      const boardAction = boardAdded({
        id: board._id,
        title: board.title,
        columnIds: [],
      })
      boardIds.push(boardAction.payload.id)
      dispatch(boardAction)
      for (const column of board.columns) {
        const columnAction = columnAdded({
          id: column._id,
          title: column.title,
          boardId: boardAction.payload.id,
          taskIds: [],
        })
        columnIds.push(columnAction.payload.id)
        dispatch(columnAction)
        for (const task of column.tasks) {
          const taskAction = taskAdded({
            id: task._id,
            title: task.title,
            description: task.description,
            column: columnAction.payload.id,
            board: boardAction.payload.id,
            subtasks: task.subtasks.map((subtask) => ({
              title: subtask.title,
              completed: subtask.completed,
            })),
          })
          taskIds.push(task._id)
          dispatch(taskAction)
        }
      }
    }
    dispatch(setDataLoaded(true))

    return () => {
      dispatch(boardsRemoved(boardIds))
      dispatch(columnsRemoved(columnIds))
      dispatch(tasksRemoved(taskIds))
    }
  }, [boards, dispatch])
}
