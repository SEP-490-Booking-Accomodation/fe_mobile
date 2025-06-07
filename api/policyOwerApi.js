import baseApi from "./baseApi";

const policyOwerApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPolicyOwer: builder.query({
      query: (id) => `/policy-owner/get-policy-owner-by-owner/${id}`,
    }),
  }),  invalidatesTags: ["PolicyOwner"],
});

export const { useGetPolicyOwerQuery } = policyOwerApi;