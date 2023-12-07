import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useDispatch, useSelector } from "react-redux"
import {
  selectActiveBoardColumnIds,
  selectAllColumns,
} from "../columns/columnsSlice"
import { selectAllTasks, taskMoved } from "../tasks/tasksSlice"
import Column from "./Column"

const MainPanel = () => {
  const dispatch = useDispatch()
  const columnIds = useSelector(selectActiveBoardColumnIds)
  const columns = useSelector(selectAllColumns)
  const tasks = useSelector(selectAllTasks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
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
    <div className="flex h-full w-full gap-[24px] overflow-x-auto bg-light-gray-light-bg pl-[24px] pt-[24px] dark:bg-very-dark-gray">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        {columnIds
          ? columnIds.map((id) => <Column key={id} columnId={id} />)
          : null}
      </DndContext>
    </div>
  )
}

export default MainPanel
