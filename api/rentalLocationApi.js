import baseApi from "./baseApi";

export const rentalLocationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllRental: builder.query({
      query: () => `/rental-location/all-rental-location-with-rating`,
      providesTags: ["RentalLocation"],
    }),
    getRentalById: builder.query({
      query: (id) => `/rental-location/${id}`,
      providesTags: ["RentalLocation"],
    }),
    getAllAccommodationTypeOfRentalLocation: builder.query({
      query: (id) =>
        `/rental-location/all-accommodation-type-of-rental-location/${id}`,
      providesTags: ["RentalLocation"],
    }),
  }),
});

export const {
  useGetAllRentalQuery,
  useGetRentalByIdQuery,
  useGetAllAccommodationTypeOfRentalLocationQuery,
} = rentalLocationApi;
