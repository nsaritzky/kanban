import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
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
  const activeBoardId = useSelector(selectActiveBoardId)
  const columnIds = useSelector(selectActiveBoardColumnIds)
  const columns = useSelector(selectAllColumns)
  const tasks = useSelector(selectAllTasks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragStart = ({ active }: DragStartEvent) => {
    setDraggedId(active.id as string)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggedId(null)
    if (over && active.id !== over.id) {
      const task = tasks.find((task) => task.id == active.id)!
      const overTask = tasks.find((task) => task.id == over.id)!
      const targetColumn = columns.find(
        (column) => column.id == overTask?.column,
      )!
      const index = targetColumn?.taskIds.findIndex((id) => id == over?.id)
      dispatch(taskMoved({ task, newColumnId: overTask?.column, index }))
    }
  }

  return (
    <div className=" flex h-full w-full gap-[24px] overflow-x-auto bg-light-gray-light-bg pl-[24px] pt-[24px] dark:bg-very-dark-gray">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {columnIds
          ? columnIds.map((id) => <Column key={id} columnId={id} />)
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
