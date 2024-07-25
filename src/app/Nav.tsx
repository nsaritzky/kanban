import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useDeleteBoardMutation } from "../apiSlice"
import { boardRemoved, selectAllBoards } from "../boards/boardsSlice"
import useScreenSize from "../utilities/useScreenSize"
import DeleteModal from "./DeleteModal"
import MobileMenu from "./MobileMenu"
import NewBoardModal from "./NewBoardModal"
import NewTaskModal from "./NewTaskModal"
import { type RootState } from "./store"
import { selectActiveBoardId, setActiveBoardId } from "./uiState"
import chevronDown from "/assets/icon-chevron-down.svg"
import threeDots from "/assets/icon-vertical-ellipsis.svg"
import logoDark from "/assets/logo-dark.svg"
import logoLight from "/assets/logo-light.svg"
import logoMobile from "/assets/logo-mobile.svg"

const Nav = () => {
  const dispatch = useDispatch()

  const [newTaskModal, setNewTaskModal] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [editBoardPopup, setEditBoardPopup] = useState(false)
  const [editBoardModalOpen, setEditBoardModalOpen] = useState(false)
  const [deleteBoardModalOpen, setDeleteBoardModalOpen] = useState(false)
  // const newTaskModalIsOpen = useSelector(selectNewTaskModalIsOpen)
  const activeBoardId = useSelector(selectActiveBoardId)
  const boards = useSelector(selectAllBoards)
  const activeBoard = boards.find((board) => board.id === activeBoardId)
  const darkMode = useSelector((state: RootState) => state.UI.isDarkMode)
  const demo = useSelector((state: RootState) => state.global.disableFetches)
  const [deleteBoard] = useDeleteBoardMutation()

  const { width: screenWidth } = useScreenSize()
  const isSmallScreen = screenWidth < 640

  const editMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(event.target as Node)
      ) {
        setEditBoardPopup(false) // Close the component
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editMenuRef])

  const navigate = useNavigate()

  const handleLogout = async () => {
    if (!demo) {
      await fetch("https://api.requirenathan.com/kanban/logout")
    }
    navigate("/login")
  }

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
            <button
              onClick={() => setEditBoardPopup(true)}
              disabled={!activeBoardId}
            >
              <img
                className="mr-[16px] h-min"
                src={threeDots}
                alt="three dots"
              />
            </button>
            <button
              onClick={handleLogout}
              className="hover:text-main-purple dark:text-white dark:hover:text-main-purple"
            >
              Logout
            </button>
            {editBoardPopup && (
              <div
                ref={editMenuRef}
                className="fixed right-[24px] top-[90px] mt-[10px] flex w-[192px] flex-col items-start gap-[16px] rounded-lg bg-white p-[16px] text-left text-medium-gray dark:bg-very-dark-gray"
              >
                <button
                  onClick={() => {
                    setEditBoardModalOpen(true)
                    setEditBoardPopup(false)
                  }}
                  className="body-lg text-medium-gray"
                >
                  Edit Board
                </button>
                <button
                  onClick={() => {
                    setDeleteBoardModalOpen(true)
                    setEditBoardPopup(false)
                  }}
                  className="body-lg text-red"
                >
                  Delete Board
                </button>
              </div>
            )}
            <NewBoardModal
              boardId={activeBoardId}
              open={editBoardModalOpen}
              onClose={() => setEditBoardModalOpen(false)}
            />
            <DeleteModal
              title="Delete Board"
              description={`Are you sure you want to delete the '${activeBoard?.title}' board? This action will remove all columns and tasks and cannot be reversed.`}
              onConfirm={async () => {
                await deleteBoard(activeBoardId!)
                dispatch(boardRemoved(activeBoardId!))
                dispatch(setActiveBoardId(undefined))
              }}
              open={deleteBoardModalOpen}
              onClose={() => setDeleteBoardModalOpen(false)}
            />
          </div>
        </div>
      </div>
      <MobileMenu open={mobileMenu} setOpen={setMobileMenu} />
    </>
  )
}

export default Nav
