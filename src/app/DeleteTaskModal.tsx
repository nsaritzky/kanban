import { Dialog } from "@headlessui/react"
import { useDispatch } from "react-redux"
import { taskRemoved, type Task } from "../tasks/tasksSlice"
import Modal from "./Modal"

interface Props {
  task: Task
  open: boolean
  onClose: () => void
}

const DeleteTaskModal: React.FunctionComponent<Props> = ({
  task,
  open,
  onClose,
}) => {
  const dispatch = useDispatch()

  return (
    <Modal open={open} onClose={onClose}>
      <Dialog.Title className="heading-lg mb-[24px] text-red">
        Delete this task?
      </Dialog.Title>
      <Dialog.Description className="body-lg mb-[24px] text-medium-gray">
        Are you sure you want to delete the '{task.title}' task and its
        subtasks? This action cannot be undone.
      </Dialog.Description>
      <div className="mb-[8px] flex gap-[16px]">
        <button
          onClick={() => {
            dispatch(taskRemoved({ task }))
            onClose()
          }}
          className="h-[40px] w-1/2 rounded-full bg-red text-[13px] leading-[23px] text-white"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="h-[40px] w-1/2 rounded-full bg-light-gray-light-bg text-[13px] leading-[23px] text-main-purple"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default DeleteTaskModal
