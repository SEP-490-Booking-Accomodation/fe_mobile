import baseApi from "./baseApi";

export const momoPayment = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    processMomoPayment: builder.mutation({
      query: ({ data }) => ({
        url: "/booking/momo/payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),
    notifyMomoPayment: builder.mutation({
      query: ({ data }) => ({
        url: "/booking/momo/notify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const { useNotifyMomoPaymentMutation, useProcessMomoPaymentMutation } =
  momoPayment;
