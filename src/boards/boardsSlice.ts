import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { nanoid } from "nanoid"
import { type RootState } from "../app/store"
import { columnAdded } from "../columns/columnsSlice"

interface Board {
  id: string
  title: string
  columnIds: string[]
}

const boardsAdapter = createEntityAdapter<Board>()

const initialState = boardsAdapter.getInitialState()

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    boardAdded: {
      reducer: boardsAdapter.addOne,
      prepare: (board: Omit<Board, "id">) => ({
        payload: { ...board, id: nanoid() },
      }),
    },
    boardUpdated: boardsAdapter.updateOne,
    boardsRemoved: boardsAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder.addCase(columnAdded, (state, action) => {
      state.entities[action.payload.boardId]!.columnIds.push(action.payload.id)
    })
  },
})

export const {
  selectAll: selectAllBoards,
  selectIds: selectBoardIds,
  selectById: selectBoardById,
} = boardsAdapter.getSelectors((state: RootState) => state.boards)

export const selectBoardColumns = createSelector(
  selectBoardById,
  (board) => board?.columnIds,
)

export const { boardAdded, boardUpdated, boardsRemoved } = boardsSlice.actions

export default boardsSlice.reducer
