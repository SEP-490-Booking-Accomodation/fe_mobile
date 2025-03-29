import baseApi from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      getNotificationsByUser: builder.query({
        query: (userId) => `/notification/user/${userId}`,
        providesTags: ["Notification"],
      }),
      markNotificationAsRead: builder.mutation({
        query: (notificationId) => ({
          url: `/notification/${notificationId}`,
          method: "PUT",
          body: { isRead: true },
        }),
        invalidatesTags: ["Notification"], 
      }),
    }),
  });
  
export const {
    useGetNotificationsByUserQuery,
    useMarkNotificationAsReadMutation
} = notificationApi;
