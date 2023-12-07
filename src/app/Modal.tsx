import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useSelector } from "react-redux"
import { selectIsDarkMode } from "./uiState"

interface Props {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

const Modal = ({ children, open, onClose }: Props) => {
  const darkMode = useSelector(selectIsDarkMode)

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose}>
        <div className={`${darkMode && "dark"}`}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 h-screen w-screen bg-black/50"
              aria-hidden="true"
            />
          </Transition.Child>
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-[16px] w-[480px] rounded bg-white p-[32px] dark:bg-dark-gray">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
