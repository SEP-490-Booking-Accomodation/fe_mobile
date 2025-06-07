import baseApi from "./baseApi";

export const payOSPayment = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    processPayOSPayment: builder.mutation({
      query: ({ data }) => ({
        url: "/booking/payos/payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentPayOS"],
    }),
  }),
});

export const { useProcessPayOSPaymentMutation } = payOSPayment;
