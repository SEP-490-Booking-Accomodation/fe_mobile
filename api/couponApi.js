import baseApi from "./baseApi";

export const CouponApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCoupon: builder.query({
      query: () => `/coupon/all-coupons`,
      providesTags: ["Coupon"],
    }),
    getCouponById: builder.query({
      query: (id) => `/coupon/${id}`,
      providesTags: ["Coupon"],
    }),
  }),
});

export const { useGetAllCouponQuery, useGetCouponByIdQuery } = CouponApi;
