import baseApi from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotificationsByUser: builder.query({
      query: (userId) => `/notification/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: 'Notification', id: 'LIST' },
        ...(result?.data || []).map((notification) => ({
          type: 'Notification',
          id: notification._id,
        })),
      ],
    }),

    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notification/${notificationId}`,
        method: "PUT",
        body: { isRead: true },
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' },
      ],
      async onQueryStarted(notificationId, { dispatch, queryFulfilled, getState }) {
        const state = getState();
        const userId = state.auth?.userId;

        if (userId) {
          const patchResult = dispatch(
            notificationApi.util.updateQueryData('getNotificationsByUser', userId, (draft) => {
              if (draft?.data) {
                const notification = draft.data.find(n => n._id === notificationId);
                if (notification) {
                  notification.isRead = true;
                }
              }
            })
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        }
      },
    }),

    createNotification: builder.mutation({
      query: (notification) => ({
        url: "/notification/create-notification",
        method: "POST",
        body: notification,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotificationsByUserQuery,
  useMarkNotificationAsReadMutation,
  useCreateNotificationMutation,
} = notificationApi;
