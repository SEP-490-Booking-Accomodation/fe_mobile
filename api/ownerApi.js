import baseApi from "./baseApi";

const ownerApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserIdByOwnerId: builder.query({
      query: (id) => `/owner/${id}`,
      providesTags: ["Owner"],
    }),
  }),
});

export const { useGetUserIdByOwnerIdQuery } = ownerApi;
