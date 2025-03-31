import baseApi from "./baseApi";

export const BookingApi = baseApi.injectEndpoints({
  overrideExisting: true, // Thêm dòng này
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: ({ data }) => ({
        url: "/booking/create-booking",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const { useCreateBookingMutation } = BookingApi;
