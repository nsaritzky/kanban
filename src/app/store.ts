import { configureStore } from "@reduxjs/toolkit"

import { apiSlice } from "../apiSlice"
import boardsReducer from "../boards/boardsSlice"
import columnsReducer from "../columns/columnsSlice"
import tasksReducer from "../tasks/tasksSlice"
import uiReducer from "./uiState"

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    columns: columnsReducer,
    boards: boardsReducer,
    UI: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export default store

export type RootState = ReturnType<typeof store.getState>
