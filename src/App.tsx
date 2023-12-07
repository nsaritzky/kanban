import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import data from "../data.json"
import MainPanel from "./app/MainPanel"
import Nav from "./app/Nav"
import NewBoardModal from "./app/NewBoardModal"
import Sidebar from "./app/Sidebar"
import {
  selectDataLoaded,
  selectIsDarkMode,
  setActiveBoardId,
} from "./app/uiState"
import { selectBoardIds } from "./boards/boardsSlice"
import { useData } from "./data"

function App() {
  useData(data)
  const darkMode = useSelector(selectIsDarkMode)
  const boardIds = useSelector(selectBoardIds)
  const dataLoaded = useSelector(selectDataLoaded)
  const dispatch = useDispatch()

  useEffect(() => {
    if (boardIds.length > 0) {
      dispatch(setActiveBoardId(boardIds[0] as string))
      console.log("set active board id")
    }
  }, [dataLoaded])

  return (
    <div
      className={`font-plus-jakarta-sans flex h-screen flex-col ${
        darkMode && "dark"
      }`}
    >
      <NewBoardModal />
      <Nav />
      <div className="flex w-full grow">
        <Sidebar />
        <MainPanel />
      </div>
    </div>
  )
}

export default App
