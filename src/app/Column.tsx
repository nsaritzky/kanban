import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectColumnById, selectColumnTaskIds } from "../columns/columnsSlice"
import {
  selectTaskById,
  selectTasksByIds,
  type Task,
} from "../tasks/tasksSlice"
import ViewTaskModal from "./ViewTaskModal"
import type { RootState } from "./store"

interface TaskProps {
  taskId: string
  setViewTaskModal: (val: boolean) => void
  setActiveTask: (task: Task) => void
}

const Task: React.FunctionComponent<TaskProps> = ({
  taskId,
  setViewTaskModal,
  setActiveTask,
}) => {
  const task = useSelector((state: RootState) => selectTaskById(state, taskId))
  const totalSubtasks = task?.subtasks?.length
  const completedSubtasks = task?.subtasks?.filter(
    (subtask) => subtask.completed,
  ).length

  const { listeners, attributes, setNodeRef, transform, transition } =
    useSortable({ id: taskId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!task) {
    return null
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <button
        onClick={() => {
          setActiveTask(task)
          setViewTaskModal(true)
        }}
        className="group flex w-full flex-col rounded-lg bg-white py-[23px] pl-[16px] shadow dark:bg-dark-gray"
      >
        <div className="heading-md mb-[8px] text-left text-black group-hover:text-main-purple dark:text-white">
          {task?.title}
        </div>
        <div className="body-md text-medium-gray">{`${completedSubtasks} of ${totalSubtasks} subtasks`}</div>
      </button>
    </div>
  )
}

const Column = ({ columnId }: { columnId: string }) => {
  const dispatch = useDispatch()
  const [viewTaskModal, setViewTaskModal] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const column = useSelector((state: RootState) =>
    selectColumnById(state, columnId),
  )
  const taskIds = useSelector((state: RootState) =>
    selectColumnTaskIds(state, columnId),
  )
  const tasks = useSelector((state: RootState) =>
    selectTasksByIds(state, taskIds!),
  )
  const activeTaskSelected = useSelector((state: RootState) =>
    activeTask ? selectTaskById(state, activeTask.id) : undefined,
  )

  return (
    <SortableContext items={taskIds} strategy={rectSortingStrategy}>
      <div className="flex w-[280px] shrink-0 flex-col gap-[20px]">
        <div className="heading-sm uppercase">
          {column?.title} ({column!.taskIds?.length})
        </div>
        <ViewTaskModal
          task={activeTaskSelected}
          open={viewTaskModal}
          onClose={() => setViewTaskModal(false)}
        />
        {taskIds.map((id) => (
          <Task
            setViewTaskModal={setViewTaskModal}
            setActiveTask={setActiveTask}
            taskId={id}
            key={id}
          />
        ))}
      </div>
    </SortableContext>
  )
}

export default Column
