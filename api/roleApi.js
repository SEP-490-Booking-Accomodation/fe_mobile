import baseApi from "./baseApi";

export const roleApi = baseApi.injectEndpoints({
  overrideExisting: true, // Thêm dòng này
  endpoints: (builder) => ({
    getRoleById: builder.query({
      query: (roleId) => `/role/${roleId}`,
      providesTags: ["Role"],
    }),
  }),
});

export const { useLazyGetRoleByIdQuery } = roleApi;
