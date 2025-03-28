import baseApi from "./baseApi";

export const rentalLocationApi = baseApi.injectEndpoints({
  overrideExisting: true, // Thêm dòng này
  endpoints: (builder) => ({
    getAllRental: builder.query({
      query: () => `/rental-location/all-rental-location`,
      providesTags: ["RentalLocation"],
    }),
    getRentalById: builder.query({
      query: (id) => `/rental-location/${id}`,
      providesTags: ["RentalLocation"],
    }),
  }),
});

export const { useGetAllRentalQuery, useGetRentalByIdQuery } =
  rentalLocationApi;
