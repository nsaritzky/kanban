import { Switch, Tab } from "@headlessui/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectAllBoards, selectBoardIds } from "../boards/boardsSlice"
import useScreenSize from "../utilities/useScreenSize"
import NewBoardModal from "./NewBoardModal"
import {
  selectActiveBoardId,
  selectIsDarkMode,
  selectSidebarIsOpen,
  setActiveBoardId,
  setDarkMode,
  setSidebar,
} from "./uiState"
import BoardIcon from "/assets/icon-board.svg?react"
import MoonIcon from "/assets/icon-dark-theme.svg"
import IconHideSidebar from "/assets/icon-hide-sidebar.svg?react"
import SunIcon from "/assets/icon-light-theme.svg"
import VisibleIcon from "/assets/icon-show-sidebar.svg"

const BoardList = () => {
  const [newBoardModalOpen, setNewBoardModalOpen] = useState(false)

  const boards = useSelector(selectAllBoards)
  const darkMode = useSelector(selectIsDarkMode)
  const boardIds = useSelector(selectBoardIds)
  const activeBoardId = useSelector(selectActiveBoardId)
  const sidebarIsOpen = useSelector(selectSidebarIsOpen)
  const dispatch = useDispatch()

  const { width: screenWidth } = useScreenSize()
  const isSmallScreen = screenWidth < 640

  const setSelectedBoardIndex = (index: number) => {
    dispatch(setActiveBoardId(boardIds[index] as string))
  }

  if (sidebarIsOpen && !isSmallScreen) {
    return (
      <div className="flex h-full w-[260px] shrink-0 flex-col justify-between border-r border-lines-light pb-[32px] pr-[24px] pt-[15px] dark:border-lines-dark dark:bg-dark-gray lg:w-[300px]">
        <div>
          <h2 className="heading-sm mb-[19px] ml-[32px] uppercase">
            All Boards ({boards.length})
          </h2>
          <Tab.Group
            vertical
            selectedIndex={
              activeBoardId
                ? boardIds.findIndex((val) => val == activeBoardId)
                : undefined
            }
            onChange={setSelectedBoardIndex}
          >
            <Tab.List>
              {boards.map((board) => (
                <Tab
                  className="heading-md group flex
              h-[48px] w-full items-center rounded-r-full pl-[32px]
              text-medium-gray ui-selected:bg-main-purple ui-selected:text-white ui-not-selected:hover:bg-light-gray-light-bg
              ui-not-selected:hover:stroke-main-purple ui-not-selected:hover:text-main-purple"
                  key={board.id}
                >
                  <BoardIcon className="mr-[16px] ui-selected:stroke-white group-hover:ui-not-selected:stroke-main-purple" />
                  <div>{board.title}</div>
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
          <button
            className="heading-md flex h-[48px] items-center pl-[32px] text-main-purple"
            onClick={() => setNewBoardModalOpen(true)}
          >
            <BoardIcon className="mr-[16px] stroke-main-purple" />
            <div>+ Create New Board</div>
          </button>
          <NewBoardModal
            open={newBoardModalOpen}
            onClose={() => setNewBoardModalOpen(false)}
          />
        </div>
        <div>
          <div className="mx-[13px] mb-[8px] box-border flex h-[48px] w-[235px] items-center justify-center rounded bg-light-gray-light-bg dark:bg-very-dark-gray lg:w-[250px]">
            <img src={SunIcon} alt="light mode icon" />
            <Switch
              checked={darkMode}
              onChange={(val) => dispatch(setDarkMode(val))}
              className={`
          border-transparent relative mx-[18px] box-content inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full bg-main-purple transition-colors duration-200 ease-in-out focus:outline-none`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${darkMode ? "translate-x-[19px]" : "translate-x-0"}
            pointer-events-none ml-[2px] mt-[2px] box-content inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
            <img src={MoonIcon} alt="dark mode icon" />
          </div>
          <button
            onClick={() => dispatch(setSidebar(false))}
            className="group flex h-[48px] w-full items-center gap-[10px] rounded-r-full pl-[24px] hover:bg-main-purple/10 dark:hover:bg-white"
          >
            <IconHideSidebar className="group-hover:stroke-main-purple" />
            <div className="heading-md text-medium-gray group-hover:text-main-purple">
              Hide Sidebar
            </div>
          </button>
        </div>
      </div>
    )
  } else if (!sidebarIsOpen && !isSmallScreen) {
    return (
      <button
        onClick={() => dispatch(setSidebar(true))}
        className="fixed bottom-[32px] left-0 flex h-[48px] w-[56px] items-center justify-center rounded-r-full bg-main-purple hover:bg-main-purple-hover"
      >
        <img src={VisibleIcon} alt="show sidebar" />
      </button>
    )
  }
}

export default BoardList
