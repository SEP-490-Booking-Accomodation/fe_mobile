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
  }),
});

export const { useLazyGetAllPoliciesQuery, useGetPolicyByIdQuery } = policySystemApi;
