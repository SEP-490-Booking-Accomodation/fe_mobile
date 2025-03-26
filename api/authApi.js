import baseApi from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true, // Thêm dòng này
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: ({ data }) => ({
        url: "/user/register",
        method: "POST",
        body: data,
      }),
    }),
    sendOtp: builder.mutation({
      query: ({ data }) => ({
        url: "/user/send-otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmailOtp: builder.mutation({
      query: ({ data }) => ({
        url: "/user/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    forgetPasswordToken: builder.mutation({
      query: ({ data }) => ({
        url: "/user/forgot-password-token",
        method: "POST",
        body: data,
      }),
    }),
    refreshTokenWithParam: builder.mutation({
      query: ({ data }) => ({
        url: "/user/refresh-token-with-param",
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.query({
      query: (id) => `/user/${id}`,
      // providesTags: ["User"],
    }),

    getRoleById: builder.query({
      query: (roleId) => `/role/${roleId}`,
      providesTags: ["Role"],
    }),

    logout: builder.query({
      query: () => ({
        url: "/user/logout",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutQuery,
  useLazyGetUserQuery,
  useLazyGetRoleByIdQuery,
  useForgetPasswordTokenMutation,
  useGetUserQuery,
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyEmailOtpMutation,
  useRefreshTokenWithParamMutation,
} = authApi;
