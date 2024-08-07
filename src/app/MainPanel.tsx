import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useMoveTaskMutation } from "../apiSlice"
import {
  selectActiveBoardColumnIds,
  selectAllColumns,
} from "../columns/columnsSlice"
import { selectAllTasks, taskMoved } from "../tasks/tasksSlice"
import Column, { TaskElement } from "./Column"
import NewBoardModal from "./NewBoardModal"
import { selectActiveBoardId } from "./uiState"

const MainPanel = () => {
  const dispatch = useDispatch()
  const [editBoardModal, setEditBoardModal] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overContainerId, setOverContainerId] = useState<string | null>(null)
  /* const [_placeHolderIndex, setPlaceHolderIndex] = useState<
   *   number | undefined | null
   * >(null) */
  const activeBoardId = useSelector(selectActiveBoardId)
  const columnIds = useSelector(selectActiveBoardColumnIds)
  const columns = useSelector(selectAllColumns)
  const tasks = useSelector(selectAllTasks)
  const [moveTask] = useMoveTaskMutation()

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { tolerance: 5, delay: 250 },
    }),
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragStart = ({ active }: DragStartEvent) => {
    setDraggedId(active.id as string)
  }

  const onDragOver = ({ over }: DragOverEvent) => {
    if (over?.id && columnIds.includes(over?.id as string)) {
      setOverContainerId(over?.id as string)
    } else {
      const task = tasks.find((task) => task.id == over?.id)
      if (task) {
        setOverContainerId(task.column)
        /* setPlaceHolderIndex(
         *   columns
         *     .find((column) => column.id == task.column)
         *     ?.taskIds.findIndex((id) => id == task.id),
         * ) */
      }
    }
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggedId(null)
    setOverContainerId(null)
    if (over && active.id !== over.id) {
      const task = tasks.find((task) => task.id == active.id)!
      const overTask = tasks.find((task) => task.id == over.id)!
      const targetColumn = columns.find(
        (column) => column.id == overTask?.column,
      )!
      const index = targetColumn?.taskIds.findIndex((id) => id == over?.id)
      dispatch(taskMoved({ task, newColumnId: overTask?.column, index }))
      moveTask({
        boardId: activeBoardId!,
        taskId: task.id,
        newStatus: targetColumn?.title,
        position: index!,
      })
    }
  }

  return (
    <div className=" flex h-full w-full gap-[24px] overflow-x-auto bg-light-gray-light-bg pl-[24px] pt-[24px] dark:bg-very-dark-gray">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {columnIds
          ? columnIds.map((id) => (
              <Column
                draggedId={draggedId}
                key={id}
                columnId={id}
                draggedOver={overContainerId == id}
              />
            ))
          : null}
        <DragOverlay>
          {draggedId ? <TaskElement taskId={draggedId} /> : null}
        </DragOverlay>
      </DndContext>

      <button
        onClick={() => setEditBoardModal(true)}
        className="group mb-[50px] mt-[39px] h-full w-[280px] rounded bg-gradient-to-t from-[#E9EFFA]/50 to-[#E9EFFA] dark:from-[#2B2C3780] dark:to-[#2B2C37]"
      >
        <span className="heading-xl block w-[280px] text-medium-gray group-hover:text-main-purple">
          + New Column
        </span>
      </button>
      <NewBoardModal
        setNewColumn
        boardId={activeBoardId}
        open={editBoardModal}
        onClose={() => setEditBoardModal(false)}
      />
    </div>
  )
}

export default MainPanel
