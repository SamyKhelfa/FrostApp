import {
    PaginatedResult,
    PaginationParams,
    type ILesson
} from "@/core/interfaces";
import {emptySplitApi} from "@/infra/http";

const defaultPaginationParams = {
    page: 1,
    limit: 10,
    enablePagination: true
}

export const lessonApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getLesson: builder.query<
            PaginatedResult<ILesson>,
            PaginationParams | void
        >({
            query: (arg) => {
                const page = arg?.page ?? defaultPaginationParams.page
                const limit = arg?.limit ?? defaultPaginationParams.limit
                const enablePagination = arg?.enablePagination ?? defaultPaginationParams.enablePagination

                return {
                    url: "/lessons",
                    method: "GET",
                    params: {page, limit, enablePagination},
                }
            }
        }),
        getLessonById: builder.query<ILesson, number>({
            query: (id) => ({
                url: `/lessons/${id}`,
                method: "GET",
            })
        })
    })
})

export const {useGetLessonQuery, useGetLessonByIdQuery} = lessonApi
