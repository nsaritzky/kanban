import { useState } from "react"
import { useSelector } from "react-redux"
import { selectAllBoards } from "../boards/boardsSlice"
import useScreenSize from "../utilities/useScreenSize"
import MobileMenu from "./MobileMenu"
import NewTaskModal from "./NewTaskModal"
import { type RootState } from "./store"
import { selectActiveBoardId } from "./uiState"
import chevronDown from "/assets/icon-chevron-down.svg"
import threeDots from "/assets/icon-vertical-ellipsis.svg"
import logoDark from "/assets/logo-dark.svg"
import logoLight from "/assets/logo-light.svg"
import logoMobile from "/assets/logo-mobile.svg"

const Nav = () => {
  const [newTaskModal, setNewTaskModal] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  // const newTaskModalIsOpen = useSelector(selectNewTaskModalIsOpen)
  const activeBoardId = useSelector(selectActiveBoardId)
  const boards = useSelector(selectAllBoards)
  const activeBoard = boards.find((board) => board.id === activeBoardId)
  const darkMode = useSelector((state: RootState) => state.UI.isDarkMode)

  const { width: screenWidth } = useScreenSize()
  const isSmallScreen = screenWidth < 640

  return (
    <>
      <div className=" flex h-[64px] items-center dark:bg-dark-gray md:h-[96px]">
        <div className="flex h-full w-fit shrink-0 items-center border-lines-light px-[16px] py-[16px]  dark:border-lines-dark sm:w-[260px] sm:border-r sm:px-[26px] lg:w-[300px]">
          {isSmallScreen ? (
            <img src={logoMobile} />
          ) : (
            <img src={darkMode ? logoLight : logoDark} alt="Kanban Logo" />
          )}
        </div>
        <div className="flex w-full items-center justify-between pr-[16px] sm:pl-[24px] sm:pr-[23px]">
          <div className="">
            <button
              className="flex items-center"
              onClick={() => setMobileMenu(true)}
              disabled={!isSmallScreen}
            >
              <div className="heading-xl dark:text-white">
                {activeBoard ? activeBoard.title : ""}
              </div>
              {isSmallScreen && <img className="ml-[8px]" src={chevronDown} />}
            </button>
          </div>
          <div className="flex items-center">
            <button
              className={`heading-md mr-[16px] h-[32px] w-[48px] rounded-full bg-main-purple text-white hover:bg-main-purple-hover sm:mr-[24px] sm:h-[48px] sm:w-[164px] ${
                !activeBoard && "opacity-50"
              }}`}
              onClick={() => setNewTaskModal(true)}
              disabled={!activeBoard}
            >
              +{!isSmallScreen && " Add New Task"}
            </button>
            <NewTaskModal
              taskId=""
              open={newTaskModal}
              onClose={() => setNewTaskModal(false)}
            />
            <img className="h-min" src={threeDots} alt="three dots" />
          </div>
        </div>
      </div>
      <MobileMenu open={mobileMenu} setOpen={setMobileMenu} />
    </>
  )
}

export default Nav
