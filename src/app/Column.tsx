import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Fragment, forwardRef, useState } from "react"
import { useSelector } from "react-redux"
import { selectColumnById, selectColumnTaskIds } from "../columns/columnsSlice"
import { selectTaskById, type Task } from "../tasks/tasksSlice"
import ViewTaskModal from "./ViewTaskModal"
import type { RootState } from "./store"

interface TaskProps {
  taskId: string
  setViewTaskModal?: (val: boolean) => void
  setActiveTask?: (task: Task) => void
  style?: React.CSSProperties
  dragging?: boolean
}

export const TaskElement = forwardRef<HTMLDivElement, TaskProps>(
  ({ taskId, setViewTaskModal, setActiveTask, dragging, ...props }, ref) => {
    const task = useSelector((state: RootState) =>
      selectTaskById(state, taskId),
    )
    const totalSubtasks = task?.subtasks?.length
    const completedSubtasks = task?.subtasks?.filter(
      (subtask) => subtask.completed,
    ).length

    if (!task) {
      return null
    }

    return (
      <div ref={ref} {...props}>
        <button
          onClick={() => {
            if (setActiveTask && setViewTaskModal) {
              setActiveTask(task)
              setViewTaskModal(true)
            }
          }}
          className={`group flex w-full flex-col rounded-lg bg-white py-[23px] pl-[16px] shadow dark:bg-dark-gray`}
        >
          <div className="heading-md mb-[8px] text-left text-black group-hover:text-main-purple dark:text-white">
            {task?.title}
          </div>
          <div className="body-md text-medium-gray">{`${completedSubtasks} of ${totalSubtasks} subtasks`}</div>
        </button>
      </div>
    )
  },
)

interface SortableTaskProps {
  taskId: string
  setViewTaskModal: (val: boolean) => void
  setActiveTask: (task: Task) => void
  dragging?: boolean
}

const SortableTask: React.FunctionComponent<SortableTaskProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.taskId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TaskElement
      ref={setNodeRef}
      {...listeners}
      style={style}
      {...attributes}
      {...props}
    />
  )
}

interface ColumnProps {
  columnId: string
  draggedId: string | null
  draggedOver?: boolean
  placeholderIndex?: number | null
}

const Column: React.FunctionComponent<ColumnProps> = ({
  columnId,
  draggedId,
  draggedOver,
  placeholderIndex,
}) => {
  const [viewTaskModal, setViewTaskModal] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const showPlaceholder = draggedOver && draggedId

  const column = useSelector((state: RootState) =>
    selectColumnById(state, columnId),
  )
  const taskIds = useSelector((state: RootState) =>
    selectColumnTaskIds(state, columnId),
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
        {taskIds.map((id, i) => (
          <Fragment key={id}>
            {showPlaceholder && placeholderIndex == i && (
              <TaskElement taskId={draggedId} />
            )}
            <SortableTask
              setViewTaskModal={setViewTaskModal}
              setActiveTask={setActiveTask}
              taskId={id}
              dragging={draggedId == id}
            />
          </Fragment>
        ))}
      </div>
    </SortableContext>
  )
}

export default Column
