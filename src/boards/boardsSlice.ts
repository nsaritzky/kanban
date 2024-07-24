import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { type RootState } from "../app/store"
import { columnAdded } from "../columns/columnsSlice"

export interface Board {
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
    boardAdded: boardsAdapter.addOne,
    boardUpdated: boardsAdapter.updateOne,
    boardsRemoved: boardsAdapter.removeMany,
    boardRemoved: boardsAdapter.removeOne,
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

export const { boardAdded, boardUpdated, boardsRemoved, boardRemoved } =
  boardsSlice.actions

export default boardsSlice.reducer
