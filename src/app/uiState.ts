import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"

interface UIState {
  isDarkMode: boolean
  isNavOpen: boolean
  newTaskModalIsOpen: boolean
  newBoardModalIsOpen: boolean
  sidebarIsOpen: boolean
  viewTaskModal?: string | undefined
  editingTask?: string
  activeBoardId: string | null
  dataLoaded: boolean // used to trigger an effect after data is loaded
}

const UISlice = createSlice({
  name: "ui",
  initialState: {
    isDarkMode: false,
    isNavOpen: false,
    newTaskModalIsOpen: false,
    newBoardModalIsOpen: false,
    sidebarIsOpen: true,
    activeBoardId: null,
    dataLoaded: false,
  } as UIState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload
    },
    toggleNav: (state) => {
      state.isNavOpen = !state.isNavOpen
    },
    setActiveBoardId: (state, action: { payload: string }) => {
      state.activeBoardId = action.payload
    },
    toggleNewTaskModalIsOpen: (state) => {
      state.newTaskModalIsOpen = !state.newTaskModalIsOpen
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebarIsOpen = action.payload
    },
    toggleNewBoardModal: (state) => {
      state.newBoardModalIsOpen = !state.newBoardModalIsOpen
    },
    setViewTaskModal: (state, action) => {
      state.viewTaskModal = action.payload
    },
    setEditingTask: (state, action: { payload: string | undefined }) => {
      state.editingTask = action.payload
    },
    setDataLoaded: (state, action: { payload: boolean }) => {
      state.dataLoaded = action.payload
    },
  },
})

export const selectIsDarkMode = (state: RootState) => state.UI.isDarkMode

export const selectIsNavOpen = (state: RootState) => state.UI.isNavOpen

export const selectActiveBoardId = (state: RootState) => state.UI.activeBoardId

export const selectNewTaskModalIsOpen = (state: RootState) =>
  state.UI.newTaskModalIsOpen

export const selectSidebarIsOpen = (state: RootState) => state.UI.sidebarIsOpen

export const selectNewBoardModalIsOpen = (state: RootState) =>
  state.UI.newBoardModalIsOpen

export const selectViewTaskModal = (state: RootState) => state.UI.viewTaskModal

export const selectEditingTask = (state: RootState) => state.UI.editingTask

export const selectDataLoaded = (state: RootState) => state.UI.dataLoaded

export const {
  setDarkMode,
  toggleNav,
  setActiveBoardId,
  toggleNewTaskModalIsOpen,
  toggleNewBoardModal,
  setViewTaskModal,
  setEditingTask,
  setSidebar,
  setDataLoaded,
} = UISlice.actions

export default UISlice.reducer
