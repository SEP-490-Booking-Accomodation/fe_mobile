import baseApi from "./baseApi";

export const CouponApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCoupon: builder.query({
      query: (customerId) => `/coupon/all-coupons`,
      providesTags: ["Coupon"],
    }),
  }),
});

export const { useGetAllCouponQuery } = CouponApi;
