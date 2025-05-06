import baseApi from "./baseApi";
export const FeedbackApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        createFeedback: builder.mutation({
            query: ({ data }) => ({
                url: "/feedback/create-feedback",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Feedback"],
        }),

        getAllFeedbackByRentalId: builder.query({
            query: (rentalId) => `/feedback/rental/${rentalId}`,
            providesTags: ["Feedback"], // usually we use providesTags for GET queries
        }),

        getAverageFeedbackByRentalId: builder.query({
            query: (rentalId) => `/feedback/rental/${rentalId}/average-rating`,
            providesTags: ["Feedback"],
        }),

        getAllFeedbackByCustomerId: builder.query({
            query: (customerId) => `/feedback/customer/${customerId}`,
            providesTags: ["Feedback"],
        }),
    }),
});

export const {
    useCreateFeedbackMutation,
    useGetAllFeedbackByRentalIdQuery,
    useGetAverageFeedbackByRentalIdQuery,
    useGetAllFeedbackByCustomerIdQuery
} = FeedbackApi;
