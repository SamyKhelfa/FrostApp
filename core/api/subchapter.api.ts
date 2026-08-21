import { type ISubchapter } from "@/core/interfaces";
import { emptySplitApi } from "@/infra/http";

export const subchapterApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubchapterById: builder.query<ISubchapter, number>({
            query: (id) => ({
                url: `/subchapters/${id}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetSubchapterByIdQuery } = subchapterApi;
