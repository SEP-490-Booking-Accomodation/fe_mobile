import baseApi from "./baseApi";

export const rentalLocationApi = baseApi.injectEndpoints({
  overrideExisting: true, // Thêm dòng này
  endpoints: (builder) => ({
    getAllRental: builder.query({
      query: () => `/rental-location/all-rental-location`,
      providesTags: ["RentalLocation"],
    }),
  }),
});

export const { useGetAllRentalQuery } = rentalLocationApi;
