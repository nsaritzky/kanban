import { Dialog } from "@headlessui/react"
import { useDispatch } from "react-redux"
import Modal from "./Modal"

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
}

const DeleteTaskModal: React.FunctionComponent<Props> = ({
  title,
  description,
  onConfirm,
  open,
  onClose,
}) => {
  const dispatch = useDispatch()

  return (
    <Modal open={open} onClose={onClose}>
      <Dialog.Title className="heading-lg mb-[24px] text-red">
        {title}
      </Dialog.Title>
      <Dialog.Description className="body-lg mb-[24px] text-medium-gray">
        {description}
      </Dialog.Description>
      <div className="mb-[8px] flex gap-[16px]">
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="h-[40px] w-1/2 rounded-full bg-red text-[13px] leading-[23px] text-white hover:bg-red-hover"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="h-[40px] w-1/2 rounded-full bg-light-gray-light-bg text-[13px] leading-[23px] text-main-purple hover:bg-main-purple/20"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default DeleteTaskModal
