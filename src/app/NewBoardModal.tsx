import { Dialog } from "@headlessui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { boardAdded } from "../boards/boardsSlice"
import { columnAdded } from "../columns/columnsSlice"
import Modal from "./Modal"
import {
  selectNewBoardModalIsOpen,
  setActiveBoardId,
  toggleNewBoardModal,
} from "./uiState"
import IconCross from "/assets/icon-cross.svg"

const NewBoardModal = () => {
  const [columns, setColumns] = useState([""])
  const isOpen = useSelector(selectNewBoardModalIsOpen)
  const dispatch = useDispatch()

  interface FormData {
    name: string
    columns: string[]
  }

  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    const addBoardAction = boardAdded({ title: data.name, columnIds: [] })
    dispatch(addBoardAction)
    const newColumnActions = data.columns.map((column) =>
      columnAdded({
        title: column,
        taskIds: [],
        boardId: addBoardAction.payload.id,
      }),
    )
    newColumnActions.forEach((action) => dispatch(action))
    dispatch(setActiveBoardId(addBoardAction.payload.id))
    reset()
    dispatch(toggleNewBoardModal())
  })

  const handleNewColumn = () => {
    setColumns([...columns, ""])
  }

  const handleDeleteColumn = (i: number) => {
    const newColumns = [...columns]
    newColumns.splice(i, 1)
    setColumns(newColumns)
  }

  return (
    <Modal open={isOpen} onClose={() => dispatch(toggleNewBoardModal())}>
      <Dialog.Title className="heading-lg mb-[24px] dark:text-white">
        Add New Board
      </Dialog.Title>

      <div className="body-md mb-[8px] text-medium-gray">Name</div>
      <form onSubmit={onSubmit}>
        <input
          className="body-lg mb-[24px] w-full rounded-sm border border-medium-gray/25 py-[8px] pl-[16px] outline-none focus:border-main-purple dark:bg-dark-gray dark:text-white"
          placeholder="e.g. Web Design"
          {...register("name", { required: true })}
        />
        <div className="body-md mb-[8px] text-medium-gray">Columns</div>
        {columns.map((_name, i) => (
          <div key={i} className="mb-[12px] flex w-full items-center">
            <input
              className="body-lg w-full rounded-sm border border-medium-gray/25 py-[8px] pl-[16px] outline-none focus:border-main-purple dark:bg-dark-gray dark:text-white"
              {...register(`columns.${i}`, { required: true })}
            />
            <button
              className="ml-[19px] h-[15px] w-[15px]"
              onClick={() => handleDeleteColumn(i)}
            >
              <img className="" src={IconCross} alt="remove column" />
            </button>
          </div>
        ))}
        <button
          className="mb-[24px] h-[40px] w-full rounded-full bg-main-purple/10 text-center text-[13px] font-bold leading-[23px] text-main-purple dark:bg-white"
          onClick={(e) => {
            e.preventDefault()
            handleNewColumn()
          }}
        >
          + Add New Column
        </button>
        <button
          type="submit"
          className="font-plus-jakarta-sans h-[40px] w-full rounded-full bg-main-purple text-center text-[13px] font-bold leading-[23px] text-white hover:bg-main-purple-hover"
        >
          Create New Board
        </button>
      </form>
    </Modal>
  )
}

export default NewBoardModal
