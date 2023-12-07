import { Dialog, Listbox } from "@headlessui/react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { selectActiveColumns } from "../columns/columnsSlice"
import { selectTaskById, taskAdded, taskUpdated } from "../tasks/tasksSlice"
import Modal from "./Modal"
import { RootState } from "./store"
import { selectActiveBoardId, toggleNewTaskModalIsOpen } from "./uiState"
import ChevronDown from "/assets/icon-chevron-down.svg"
import IconCross from "/assets/icon-cross.svg?react"

interface FormData {
  title: string
  description: string
  subtasks: string[]
  status: string
}

interface Props {
  taskId?: string
  open: boolean
  onClose: () => void
}

const NewTaskModal: React.FunctionComponent<Props> = ({
  taskId,
  open,
  onClose,
}) => {
  const [subtasks, setSubtasks] = useState([""])
  const task = useSelector((state: RootState) =>
    taskId ? selectTaskById(state, taskId) : undefined,
  )
  const activeBoard = useSelector(selectActiveBoardId)
  const activeColumns = useSelector(selectActiveColumns)
  const dispatch = useDispatch()

  const defaultValues = useMemo(
    () => ({
      title: "",
      description: "",
      subtasks: [""],
      status: activeColumns[0] ? activeColumns[0].title : "",
    }),
    [activeColumns],
  )

  const { register, handleSubmit, control, reset } = useForm<FormData>({
    defaultValues,
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        subtasks: task.subtasks.map((subtask) => subtask.title),
        status: activeColumns.find((col) => col.id == task.column)?.title,
      })
    } else {
      reset(defaultValues)
    }
  }, [task, activeColumns, reset, defaultValues])

  const onSubmit = handleSubmit((data) => {
    if (task) {
      dispatch(
        taskUpdated(task, {
          title: data.title,
          description: data.description,
          subtasks: data.subtasks.map((subtask) => ({
            title: subtask,
            completed: false,
          })),
          column: activeColumns.find((column) => column.title === data.status)!
            .id,
        }),
      )
    } else {
      dispatch(
        taskAdded({
          title: data.title,
          description: data.description,
          subtasks: data.subtasks.map((subtask) => ({
            title: subtask,
            completed: false,
          })),
          column: activeColumns.find((column) => column.title === data.status)!
            .id,
          board: activeBoard!,
        }),
      )
    }
    dispatch(toggleNewTaskModalIsOpen())
    reset()
  })

  const handleNewSubtask = () => setSubtasks([...subtasks, ""])

  const handleDeleteSubtask = (i: number) => {
    const newSubtasks = [...subtasks]
    newSubtasks.splice(i, 1)
    setSubtasks(newSubtasks)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Dialog.Title className="heading-lg mb-[24px] dark:text-white">
        Add New Task
      </Dialog.Title>
      <form onSubmit={onSubmit}>
        <div className="body-md mb-[8px] text-medium-gray">Title</div>
        <input
          className="body-lg mb-[24px] w-full rounded border border-medium-gray/25 py-[8px] pl-[16px] outline-none focus:border-main-purple dark:border-medium-gray/50 dark:bg-dark-gray dark:text-white dark:focus:border-main-purple"
          placeholder="e.g. Take Coffee Break"
          {...register("title")}
        />
        <div className="body-md mb-[8px] text-medium-gray">Description</div>
        <textarea
          className="body-lg mb-[24px] h-[112px] w-full rounded border border-medium-gray/25 py-[8px] pl-[16px] outline-none focus:border-main-purple dark:border-medium-gray/50 dark:bg-dark-gray dark:text-white dark:focus:border-main-purple"
          placeholder="e.g. It’s always good to take a break. This 15 minute break will
recharge the batteries a little."
          {...register("description")}
        />
        <div className="body-md mb-[8px] text-medium-gray">Subtasks</div>
        {subtasks.map((_, i) => (
          <div key={i} className="mb-[16px] flex items-center">
            <input
              className="body-lg w-full rounded border border-medium-gray/25 py-[8px] pl-[16px] outline-none focus:border-main-purple dark:border-medium-gray/50 dark:bg-dark-gray dark:text-white dark:focus:border-main-purple"
              placeholder="e.g. Make Coffee"
              {...register(`subtasks.${i}`)}
            />
            <button
              type="button"
              className="body-md ml-[16px] text-medium-gray hover:text-black"
              onClick={(e) => {
                e.preventDefault()
                handleDeleteSubtask(i)
              }}
            >
              <IconCross className="stroke-2 hover:stroke-red" />
            </button>
          </div>
        ))}
        <button
          className="mb-[24px] h-[40px] w-full rounded-full bg-main-purple/10 text-center text-[13px] font-bold leading-[23px] text-main-purple hover:bg-main-purple/20 dark:bg-white"
          onClick={(e) => {
            e.preventDefault()
            handleNewSubtask()
          }}
        >
          + Add Subtask
        </button>
        <div className="body-md mb-[8px] text-medium-gray">Status</div>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Listbox value={field.value} onChange={field.onChange}>
              <div className="relative">
                <Listbox.Button className="font-body-lg flex h-[40px] w-full items-center justify-between rounded border border-medium-gray/25 px-[16px] py-[8px] text-left text-[13px] leading-[23px] dark:text-white">
                  <div>{field.value}</div>
                  <img src={ChevronDown} />
                </Listbox.Button>
                <Listbox.Options className="absolute top-full mt-[10px] w-full rounded rounded-b bg-white text-medium-gray dark:bg-dark-gray">
                  {activeColumns.map((column) => (
                    <Listbox.Option
                      key={column.id}
                      className="body-lg py-[8px] pl-[16px] hover:bg-main-purple/10"
                      value={column.title}
                    >
                      {column.title}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}
        />
        <button
          type="submit"
          className="mt-[24px] h-[40px] w-full rounded-full bg-main-purple text-center text-[13px] font-bold leading-[23px] text-white hover:bg-main-purple-hover"
        >
          {`${task ? "Save" : "Create"}`} Task
        </button>
      </form>
    </Modal>
  )
}

export default NewTaskModal
