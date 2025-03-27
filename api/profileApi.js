import baseApi from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  overrideExisting: true, // Ensure new endpoints override existing ones
  endpoints: (builder) => ({
    getCustomerDetailById: builder.query({
      query: (id) => `/customer/detail-customer/${id}`, // Corrected the URL
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, updatedUser }) => ({
        url: `/user/edit-user/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: ({ updatedPassword }) => ({
        url: `/user/password`,
        method: "PUT",
        body: updatedPassword,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetCustomerDetailByIdQuery, useUpdateUserMutation, useUpdatePasswordMutation } = profileApi;
