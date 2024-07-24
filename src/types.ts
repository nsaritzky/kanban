export interface Task {
    _id: string
    title: string
    description: string
    subtasks: { title: string; completed: boolean }[]
    status: string
}

export interface Column {
    _id: string
    title: string
    tasks: Task[]
}

export interface Board {
    _id: string
    title: string
    columns: Column[]
}
