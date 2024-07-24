import {
  PayloadAction,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import type { RootState } from "../app/store"

export interface Task {
  id: string
  title: string
  description: string
  subtasks: { title: string; completed: boolean }[]
  column: string
  board: string
}

const tasksAdapter = createEntityAdapter<Task>()

const initialState = tasksAdapter.getInitialState()

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    taskAdded: (state, action) => {
      tasksAdapter.addOne(state, action.payload)
    },
    taskUpdated: {
      reducer: tasksAdapter.updateOne,
      prepare: (task: Task, changes: Partial<Task>) => ({
        payload: { id: task.id, changes, oldColumn: task.column },
      }),
    },
    taskRemoved: (state, action: { payload: { task: Task } }) =>
      tasksAdapter.removeOne(state, action.payload.task.id),
    tasksRemoved: tasksAdapter.removeMany,
    taskMoved: (
      state,
      action: PayloadAction<{ task: Task; newColumnId: string; index: number }>,
    ) => {
      const { task, newColumnId } = action.payload
      state.entities[task.id]!.column = newColumnId
    },
  },
})

export const { selectById: selectTaskById, selectAll: selectAllTasks } =
  tasksAdapter.getSelectors((state: RootState) => state.tasks)

export const selectTasksByIds = createSelector(
  [selectAllTasks, (_state: unknown, ids: string[]) => ids],
  (tasks: Task[], ids: string[]) => {
    return tasks.filter((task) => ids.includes(task.id))
  },
)

export const { taskAdded, taskUpdated, taskMoved, taskRemoved, tasksRemoved } =
  tasksSlice.actions

export default tasksSlice.reducer
