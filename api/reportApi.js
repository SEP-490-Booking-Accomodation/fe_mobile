import baseApi from "./baseApi";

const reportApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createReport: builder.mutation({
      query: (data) => ({
        url: "/report/create-report",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Report"],
    }),
  }),
});
export const { useCreateReportMutation } = reportApi;
