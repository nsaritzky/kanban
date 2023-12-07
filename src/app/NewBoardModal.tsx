import { Dialog } from "@headlessui/react"
import { useEffect, useMemo } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import {
  boardAdded,
  boardUpdated,
  selectBoardById,
} from "../boards/boardsSlice"
import {
  columnAdded,
  columnsRemoved,
  selectActiveColumns,
} from "../columns/columnsSlice"
import Modal from "./Modal"
import { RootState } from "./store"
import { setActiveBoardId, toggleNewBoardModal } from "./uiState"
import IconCross from "/assets/icon-cross.svg?react"

interface Props {
  boardId?: string
  open: boolean
  onClose: () => void
  setNewColumn: boolean
}

const NewBoardModal: React.FunctionComponent<Props> = ({
  boardId,
  open,
  onClose,
  setNewColumn,
}) => {
  const dispatch = useDispatch()
  const board = useSelector((state: RootState) =>
    boardId ? selectBoardById(state, boardId) : undefined,
  )
  const boardColumns = useSelector(selectActiveColumns)

  interface FormData {
    name: string
    columns: { name: string }[]
  }

  const defaultValues = useMemo(
    () => ({
      name: "",
      columns: [{ name: "" }],
    }),
    [],
  )

  const { register, control, handleSubmit, reset } = useForm<FormData>({
    defaultValues,
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: "columns",
  })

  useEffect(() => {
    if (board) {
      reset({
        name: board.title,
        columns: boardColumns?.map((column) => ({ name: column?.title })) || [
          { name: "" },
        ],
      })
      if (setNewColumn) {
        append({ name: "" })
      }
    } else {
      reset(defaultValues)
    }
  }, [board, boardColumns, reset, defaultValues, setNewColumn, append])

  const onSubmit = handleSubmit((data) => {
    // If the board already exists, update it. Otherwise, create a new board
    if (board) {
      // Preserve the columnIds of the existing columns, then generate new Ids for any new columns
      const columnIds = data.columns.map((columnName, i) => {
        if (i < boardColumns.length) {
          return boardColumns[i].id
        } else {
          const columnAction = columnAdded({
            title: columnName.name,
            taskIds: [],
            boardId: board.id,
          })
          dispatch(columnAction)
          return columnAction.payload.id
        }
      })
      // If there are fewer columns after than before, then delete the extras
      if (columnIds.length < boardColumns.length) {
        const columnsToDelete = boardColumns.slice(columnIds.length)
        dispatch(columnsRemoved(columnsToDelete.map((column) => column.id)))
      }
      dispatch(
        boardUpdated({
          id: board.id,
          changes: { title: data.name, columnIds },
        }),
      )
      onClose()
    } else {
      const addBoardAction = boardAdded({ title: data.name, columnIds: [] })
      dispatch(addBoardAction)
      const newColumnActions = data.columns.map((column) =>
        columnAdded({
          title: column.name,
          taskIds: [],
          boardId: addBoardAction.payload.id,
        }),
      )
      newColumnActions.forEach((action) => dispatch(action))
      dispatch(setActiveBoardId(addBoardAction.payload.id))
      reset()
      dispatch(toggleNewBoardModal())
    }
  })

  return (
    <Modal open={open} onClose={onClose}>
      <Dialog.Title className="heading-lg mb-[24px] dark:text-white">
        {board ? "Edit Board" : "Add New Board"}
      </Dialog.Title>

      <div className="body-md mb-[8px] text-medium-gray">Name</div>
      <form onSubmit={onSubmit}>
        <input
          className="body-lg mb-[24px] w-full rounded-sm border border-medium-gray/25 py-[8px] pl-[16px] outline-none focus:border-main-purple dark:bg-dark-gray dark:text-white"
          placeholder="e.g. Web Design"
          {...register("name", { required: true })}
        />
        <div className="body-md mb-[8px] text-medium-gray">Columns</div>
        {fields.map((field, i) => (
          <div key={field.id} className="mb-[12px] flex w-full items-center">
            <input
              className="body-lg w-full rounded-sm border border-medium-gray/25 py-[8px] pl-[16px] outline-none focus:border-main-purple dark:bg-dark-gray dark:text-white"
              {...register(`columns.${i}.name`, { required: true })}
            />
            <button
              className="ml-[19px] h-[15px] w-[15px]"
              onClick={() => remove(i)}
            >
              <IconCross role="img" className="hover:stroke-red" />
            </button>
          </div>
        ))}
        <button
          className="mb-[24px] h-[40px] w-full rounded-full bg-main-purple/10 text-center text-[13px] font-bold leading-[23px] text-main-purple dark:bg-white"
          onClick={(e) => {
            e.preventDefault()
            append({ name: "" })
          }}
        >
          + Add New Column
        </button>
        <button
          type="submit"
          className="font-plus-jakarta-sans h-[40px] w-full rounded-full bg-main-purple text-center text-[13px] font-bold leading-[23px] text-white hover:bg-main-purple-hover"
        >
          {board ? "Save Changes" : "Create New Board"}
        </button>
      </form>
    </Modal>
  )
}

export default NewBoardModal
