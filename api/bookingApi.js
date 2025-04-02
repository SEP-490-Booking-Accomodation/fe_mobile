import baseApi from "./baseApi";

export const BookingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: ({ data }) => ({
        url: "/booking/create-booking",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),

    getBookingById: builder.query({
      query: (id) => `/booking/${id}`,
      providesTags: ["Booking"],
    }),

    updateBooking: builder.mutation({
      query: ({ id, data }) => ({
        url: `/booking/update-booking/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} = BookingApi;
