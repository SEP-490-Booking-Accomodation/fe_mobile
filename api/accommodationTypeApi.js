import baseApi from "./baseApi";

export const accommodationTypeApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAccommodationTypeById: builder.query({
            query: (id) => `/accommodation-type/${id}`,
            providesTags: ["AccommodationType"],
        }),
        getAllAccommodationTypes: builder.query({
            query: (rentalLocationId) => {
                const url = "/accommodation-type/all-accommodation-types";
                return rentalLocationId ? `${url}?rentalLocationId=${rentalLocationId}` : url;
            },
            providesTags: ["AccommodationType"],
        }),
    }),
});

export const {
    useGetAccommodationTypeByIdQuery,
    useGetAllAccommodationTypesQuery
} = accommodationTypeApi;