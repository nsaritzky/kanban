import { Dialog, Listbox, Switch } from "@headlessui/react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "../apiSlice"
import { Column, selectActiveColumns } from "../columns/columnsSlice"
import {
  taskMoved,
  taskRemoved,
  taskUpdated,
  type Task,
} from "../tasks/tasksSlice"
import DeleteTaskModal from "./DeleteModal"
import Modal from "./Modal"
import NewTaskModal from "./NewTaskModal"
import { selectActiveBoardId } from "./uiState"
import Check from "/assets/icon-check.svg"
import ChevronDown from "/assets/icon-chevron-down.svg"
import DotsIcon from "/assets/icon-vertical-ellipsis.svg"

interface Props {
  task?: Task
  open: boolean
  onClose: () => void
}

const ViewTaskModal: React.FunctionComponent<Props> = ({
  task,
  open,
  onClose,
}) => {
  const [editMenuOpen, setEditMenuOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
  const editMenuRef = useRef<HTMLDivElement>(null)

  // const taskId = useSelector(selectViewTaskModal)
  // const task = useSelector((state: RootState) =>
  //   taskId ? selectTaskById(state, taskId) : undefined,
  // )
  const activeColumns = useSelector(selectActiveColumns)
  const activeBoardId = useSelector(selectActiveBoardId)
  const totalSubtasks = task?.subtasks?.length
  const completedSubtasks = task?.subtasks?.filter(
    (subtask) => subtask.completed,
  ).length
  const dispatch = useDispatch()
  const [deleteTask] = useDeleteTaskMutation()
  const [updateTask, { isLoading: updateTaskLoading, error: updateTaskError }] =
    useUpdateTaskMutation()

  // Close the little edit popup menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(event.target as Node)
      ) {
        setEditMenuOpen(false) // Close the component
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editMenuRef])

  if (!task) {
    return null
  }

  const onConfirmDelete = async () => {
    if (task) {
      dispatch(taskRemoved({ task }))
      await deleteTask({ boardId: task.board, taskId: task.id })
    }
  }

  const onColumnNameChange = (newColumn: Column) => {
    if (newColumn) {
      updateTask({
        boardId: activeBoardId!,
        taskId: task.id,
        task: {
          status: newColumn.title,
        },
      })
      dispatch(
        taskMoved({
          task,
          newColumnId: newColumn.id,
          index: 0,
        }),
      )
    }
  }

  const toggleSubtask = (index: number) => {
    updateTask({
      boardId: activeBoardId!,
      taskId: task.id,
      task: {
        subtasks: task.subtasks.map((subtask, i) => {
          if (i === index) {
            return {
              ...subtask,
              completed: !subtask.completed,
            }
          }
          return subtask
        }),
      },
    })
    dispatch(
      taskUpdated(task, {
        subtasks: task.subtasks.map((subtask, i) => {
          if (i === index) {
            return {
              ...subtask,
              completed: !subtask.completed,
            }
          }
          return subtask
        }),
      }),
    )
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setEditMenuOpen(false)
          onClose()
        }}
      >
        <div className="flex w-full items-baseline justify-between">
          <Dialog.Title className="heading-lg mb-[24px] dark:text-white">
            {task.title}
          </Dialog.Title>
          <div className="relative">
            <button
              className="px-2"
              onClick={() => setEditMenuOpen(!editMenuOpen)}
              disabled={editMenuOpen}
            >
              <img src={DotsIcon} />
            </button>

            {editMenuOpen && (
              <div
                ref={editMenuRef}
                className="absolute right-1/2 top-full mt-[10px] flex w-[192px] translate-x-1/2 flex-col items-start gap-[16px] rounded-lg bg-white p-[16px] text-left text-medium-gray dark:bg-very-dark-gray"
              >
                <button
                  onClick={() => {
                    setEditTaskModalOpen(true)
                    onClose()
                    setEditMenuOpen(false)
                  }}
                  className="body-lg text-medium-gray"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    onClose()
                    setEditMenuOpen(false)
                    setDeleteModalOpen(true)
                  }}
                  className="body-lg text-red"
                >
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="body-lg mb-[24px] text-medium-gray">
          {task.description}
        </div>
        <div className="body-md mb-[16px] text-medium-gray">
          Subtasks ({completedSubtasks} of {totalSubtasks})
        </div>
        <div className="flex w-full flex-col gap-[8px]">
          {task.subtasks.map((subtask, i) => (
            <div
              key={i}
              className="flex w-full items-center justify-start rounded-sm bg-light-gray-light-bg p-[12px] hover:bg-main-purple/25 dark:bg-very-dark-gray dark:text-white"
            >
              <Switch
                checked={subtask.completed}
                onChange={() => toggleSubtask(i)}
                className="flex h-[16px] w-[16px] items-center justify-center rounded-[2px] border border-lines-light bg-white ui-checked:border-none ui-checked:bg-main-purple"
              >
                {subtask.completed && <img src={Check} />}
              </Switch>
              <div
                className={`body-md ml-[16px] ${
                  subtask.completed &&
                  "text-black/50 line-through dark:text-white/50"
                }`}
              >
                {subtask.title}
              </div>
            </div>
          ))}
        </div>
        <div className="body-md mb-[8px] mt-[24px] text-medium-gray">
          Current Status
        </div>
        <Listbox
          value={activeColumns.find((col) => col.id == task.column)}
          onChange={onColumnNameChange}
        >
          <div className="relative">
            <Listbox.Button className="font-body-lg flex h-[40px] w-full items-center justify-between rounded border border-medium-gray px-[16px] py-[8px] text-left text-[13px] leading-[23px] dark:text-white">
              <div>
                {activeColumns.find((col) => col.id == task.column)?.title}
              </div>
              <img src={ChevronDown} />
            </Listbox.Button>
            <Listbox.Options className="absolute top-full mt-[10px] w-full rounded-lg rounded-b bg-white text-medium-gray dark:bg-very-dark-gray">
              {activeColumns.map((column) => (
                <Listbox.Option
                  key={column.id}
                  className="body-lg py-[8px] pl-[16px] hover:bg-main-purple/10"
                  value={column}
                >
                  {column.title}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </Modal>
      <NewTaskModal
        taskId={task.id}
        open={editTaskModalOpen}
        onClose={() => setEditTaskModalOpen(false)}
      />
      <DeleteTaskModal
        open={deleteModalOpen}
        onConfirm={onConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Task"
        description="Are you sure you want to delete {task.title}? This action cannot be undone."
      />
    </>
  )
}

export default ViewTaskModal
