import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RouterProvider, createHashRouter } from "react-router-dom"
import demoData from "../data.json"
import { useGetBoardsQuery } from "./apiSlice"
import MainPanel from "./app/MainPanel"
import Nav from "./app/Nav"
import Sidebar from "./app/Sidebar"
import { setDisableFetches } from "./app/store"
import {
  selectDataLoaded,
  selectIsDarkMode,
  setActiveBoardId,
} from "./app/uiState"
import { selectBoardIds } from "./boards/boardsSlice"
import { useData } from "./data"
import Login from "./login"
import { isAuthenticated } from "./utilities/isAuthenticated"

const App = ({ demo }: { demo: boolean }) => {
  const { data: boards } = useGetBoardsQuery()
  useData(demo ? demoData : boards || { boards: [] })
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
    if (!isAuthenticated() && !demo) {
      router.navigate("/kanban/login")
    }
  }, [demo])

  useEffect(() => {
    dispatch(setDisableFetches(demo))
  }, [demo, dispatch])

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

const router = createHashRouter([
  {
    path: "",
    element: <App demo={false} />,
  },
  {
    path: "/demo",
    element: <App demo={true} />,
  },
  {
    path: "/login",
    Component: Login,
  },
])

const AppWithRouter = () => <RouterProvider router={router} />

export default AppWithRouter
