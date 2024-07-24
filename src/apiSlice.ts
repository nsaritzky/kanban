import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
    retry,
} from "@reduxjs/toolkit/query/react"
import { RootState } from "./app/store"
import type { Board, Column, Task } from "./types"

const customBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState

    if (state.global.disableFetches) {
        return { data: null }
    }

    const baseQuery = fetchBaseQuery({
        baseUrl: "https://api.requirenathan.com/kanban",
        credentials: "include",
    })
    return baseQuery(args, api, extraOptions)
}

export const apiSlice = createApi({
    baseQuery: retry(customBaseQuery),
    endpoints: (builder) => ({
        getBoards: builder.query<{ boards: Board[] }, void>({
            query: () => "/user/boards",
        }),
        getBoard: builder.query<Board, string>({
            query: (id) => `/board/${id}`,
        }),
        newBoard: builder.mutation<
            Board,
            { title: string; columns: Omit<Column, "_id">[] }
        >({
            query: (body) => ({
                url: "/board/new",
                method: "POST",
                body,
            }),
            transformResponse: (data: { board: Board }) => data.board,
        }),
        newColumn: builder.mutation<string, { boardId: string; title: string }>(
            {
                query: ({ boardId, title }) => ({
                    url: "/column",
                    method: "POST",
                    body: { boardId, title },
                }),
                transformResponse: ({ data }) => data.columnId,
            },
        ),
        deleteColumn: builder.mutation<
            void,
            { boardId: string; columnId: string }
        >({
            query: (body) => ({
                url: "/column",
                method: "DELETE",
                body,
            }),
        }),
        deleteBoard: builder.mutation<void, string>({
            query: (id) => ({
                url: `/board/${id}`,
                method: "DELETE",
            }),
        }),
        newTask: builder.mutation<
            string,
            { boardId: string; task: Omit<Task, "_id"> }
        >({
            query: (body) => ({
                url: "/task",
                method: "POST",
                body: {
                    boardId: body.boardId,
                    task: {
                        title: body.task.title,
                        description: body.task.description || "",
                        subtasks:
                            body.task.subtasks.length == 1 &&
                            body.task.subtasks[0].title == ""
                                ? []
                                : body.task.subtasks,
                        status: body.task.status,
                    },
                },
            }),
            transformResponse: (data: { taskId: string }) => data.taskId,
        }),
        deleteTask: builder.mutation<void, { boardId: string; taskId: string }>(
            {
                query: (body) => ({
                    url: "/task",
                    method: "DELETE",
                    body,
                }),
            },
        ),
        updateTask: builder.mutation<
            void,
            { boardId: string; taskId: string; task: Partial<Task> }
        >({
            query: ({ boardId, taskId, task }) => ({
                url: "/task",
                method: "PATCH",
                body: { boardId, taskId, task },
            }),
        }),
        moveTask: builder.mutation<
            void,
            {
                boardId: string
                taskId: string
                newStatus?: string
                position: number
            }
        >({
            query: ({ boardId, taskId, newStatus, position }) => ({
                url: "/task/move",
                method: "POST",
                body: { boardId, taskId, newStatus, position },
            }),
        }),
    }),
})

export const {
    useGetBoardsQuery,
    useGetBoardQuery,
    useNewBoardMutation,
    useDeleteBoardMutation,
    useNewColumnMutation,
    useDeleteColumnMutation,
    useNewTaskMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
    useMoveTaskMutation,
} = apiSlice
