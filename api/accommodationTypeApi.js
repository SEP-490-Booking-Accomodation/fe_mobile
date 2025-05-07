import baseApi from "./baseApi";

export const accommodationTypeApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAccommodationTypeById: builder.query({
            query: (id) => `/accommodation-type/${id}`,
            providesTags: ["AccommodationType"],
        }),
        getAllAccommodationTypes: builder.query({
            query: (ownerId) => {
              const url = "/accommodation-type/all-accommodation-types";
              return ownerId ? `${url}?ownerId=${ownerId}` : url;
            },
            providesTags: ["AccommodationType"],
          }),
    }),
});

export const {
    useGetAccommodationTypeByIdQuery,
    useGetAllAccommodationTypesQuery
} = accommodationTypeApi;