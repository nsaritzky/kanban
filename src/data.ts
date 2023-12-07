import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setDataLoaded } from "./app/uiState"
import { boardAdded, boardsRemoved } from "./boards/boardsSlice"
import { columnAdded, columnsRemoved } from "./columns/columnsSlice"
import { taskAdded, tasksRemoved } from "./tasks/tasksSlice"

interface Subtask {
  title: string
  isCompleted: boolean
}

interface Task {
  title: string
  description: string
  status: string
  subtasks: Subtask[]
}

interface Column {
  name: string
  tasks: Task[]
}

interface Board {
  name: string
  columns: Column[]
}

export const useData = ({ boards }: { boards: Board[] }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const boardIds: string[] = []
    const columnIds: string[] = []
    const taskIds: string[] = []

    for (const board of boards) {
      const boardAction = boardAdded({ title: board.name, columnIds: [] })
      boardIds.push(boardAction.payload.id)
      dispatch(boardAction)
      for (const column of board.columns) {
        const columnAction = columnAdded({
          title: column.name,
          boardId: boardAction.payload.id,
          taskIds: [],
        })
        columnIds.push(columnAction.payload.id)
        dispatch(columnAction)
        for (const task of column.tasks) {
          const taskAction = taskAdded({
            title: task.title,
            description: task.description,
            column: columnAction.payload.id,
            board: boardAction.payload.id,
            subtasks: task.subtasks.map((subtask) => ({
              title: subtask.title,
              completed: subtask.isCompleted,
            })),
          })
          taskIds.push(taskAction.payload.task.id)
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
  }, [])
}
