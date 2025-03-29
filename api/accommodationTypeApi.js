import baseApi from "./baseApi";

export const accommodationTypeApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAccommodationTypeById: builder.query({
            query: (id) => `/accommodation-type/${id}`,
            providesTags: ["AccommodationType"],
        }),
    }),
});

export const {
    useGetAccommodationTypeByIdQuery 
} = accommodationTypeApi;