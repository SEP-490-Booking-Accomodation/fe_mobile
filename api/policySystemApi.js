import baseApi from "./baseApi";

export const policySystemApi = baseApi.injectEndpoints({
  overrideExisting: true, // Ensure new endpoints override existing ones
  endpoints: (builder) => ({
    getAllPolicies: builder.query({
      query: () => "/policy-system/all-policy-systems", // Corrected the URL
      providesTags: ["PolicySystem"],
    }),
    getPolicyById: builder.query({
      query: (id) => `/policy-system/${id}`, // Corrected the URL
      providesTags: ["PolicySystem"],
    }),
    getPolicyHashTag: builder.query({
      query: (hashtag) =>
        `/policy-system/all-policy-systems-by-hashtag/${hashtag}`, // Corrected the URL
      providesTags: ["PolicySystem"],
    }),
  }),
});

export const { useGetPolicyHashTagQuery,useLazyGetAllPoliciesQuery, useGetPolicyByIdQuery } =
  policySystemApi;
