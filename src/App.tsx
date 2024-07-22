import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useGetBoardsQuery } from "./apiSlice"
import MainPanel from "./app/MainPanel"
import Nav from "./app/Nav"
import Sidebar from "./app/Sidebar"
import {
  selectDataLoaded,
  selectIsDarkMode,
  setActiveBoardId,
} from "./app/uiState"
import { selectBoardIds } from "./boards/boardsSlice"
import { useData } from "./data"
import Login from "./login"
import { isAuthenticated } from "./utilities/isAuthenticated"

const router = createBrowserRouter([
  { path: "/kanban", Component: App },
  {
    path: "/kanban/login",
    Component: Login,
  },
])

function App() {
  const { data: boards } = useGetBoardsQuery()
  useData(boards || { boards: [] })
  const darkMode = useSelector(selectIsDarkMode)
  const boardIds = useSelector(selectBoardIds)
  const dataLoaded = useSelector(selectDataLoaded)
  const dispatch = useDispatch()

  useEffect(() => {
    if (boardIds.length > 0) {
      dispatch(setActiveBoardId(boardIds[0] as string))
    }
  }, [dataLoaded, boardIds, dispatch])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.navigate("/kanban/login")
    }
  }, [])

  return (
    <div
      className={`font-plus-jakarta-sans flex h-screen flex-col ${
        darkMode && "dark"
      }`}
    >
      <Nav />
      <div className="flex w-full grow">
        <Sidebar />
        <MainPanel />
      </div>
    </div>
  )
}

const AppWithRouter = () => <RouterProvider router={router} />

export default AppWithRouter
