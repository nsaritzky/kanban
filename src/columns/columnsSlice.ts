import { arrayMove } from "@dnd-kit/sortable"
import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { nanoid } from "nanoid"
import type { RootState } from "../app/store"
import {
  taskAdded,
  taskMoved,
  taskRemoved,
  taskUpdated,
} from "../tasks/tasksSlice"

export interface Column {
  id: string
  title: string
  boardId: string
  taskIds: string[]
}

const columnsAdapter = createEntityAdapter<Column>()

const initialState = columnsAdapter.getInitialState()

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    columnAdded: {
      reducer: columnsAdapter.addOne,
      prepare: (column: Omit<Column, "id">) => ({
        payload: { ...column, id: nanoid() },
      }),
    },
    columnUpdated: columnsAdapter.updateOne,
    columnsRemoved: columnsAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(taskAdded, (state, action) => {
        const { task } = action.payload
        state.entities[task.column]?.taskIds.push(task.id)
      })
      .addCase(taskMoved, (state, action) => {
        const { task, newColumnId, index } = action.payload
        if (task.column !== newColumnId) {
          const oldColumnTaskIds = state.entities[task.column]!.taskIds
          oldColumnTaskIds.splice(oldColumnTaskIds.indexOf(task.id), 1)
          state.entities[newColumnId]!.taskIds.splice(index, 0, task.id)
        } else {
          const taskIds = state.entities[newColumnId]!.taskIds
          const oldIndex = taskIds.indexOf(task.id)
          state.entities[newColumnId]!.taskIds = arrayMove(
            taskIds,
            oldIndex,
            index,
          )
        }
      })
      .addCase(taskUpdated, (state, action) => {
        const { id, changes, oldColumn } = action.payload
        if (changes.column) {
          const oldColumnTaskIds = state.entities[oldColumn]!.taskIds
          oldColumnTaskIds.splice(oldColumnTaskIds.indexOf(id as string), 1)
          state.entities[changes.column]!.taskIds.splice(0, 0, id as string)
        }
      })
      .addCase(taskRemoved, (state, action) => {
        const { task } = action.payload
        const columnTaskIds = state.entities[task.column]!.taskIds
        columnTaskIds.splice(columnTaskIds.indexOf(task.id), 1)
      })
  },
})

export const {
  selectIds: selectColumnIds,
  selectById: selectColumnById,
  selectAll: selectAllColumns,
} = columnsAdapter.getSelectors((state: RootState) => state.columns)

export const selectColumnTaskIds = createSelector(selectColumnById, (column) =>
  column ? column.taskIds : [],
)

const selectActiveBoard = createSelector(
  [
    (state: RootState) => state.boards,
    (state: RootState) => state.UI.activeBoardId,
  ],
  (boards, activeBoardId) =>
    activeBoardId ? boards.entities[activeBoardId] : undefined,
)

export const selectActiveColumns = createSelector(
  [selectAllColumns, selectActiveBoard],
  (columns, activeBoard) =>
    columns.filter((column) => activeBoard?.columnIds.includes(column.id)),
)

export const { columnAdded, columnUpdated, columnsRemoved } =
  columnsSlice.actions

export default columnsSlice.reducer
