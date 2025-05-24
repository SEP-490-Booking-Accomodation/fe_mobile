import baseApi from "./baseApi";

export const policySystemApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllPolicies: builder.query({
      query: () => "/policy-system/all-policy-systems",
      transformResponse: (response) => response.data, 
      providesTags: ["PolicySystem"],
    }),
    getPolicyById: builder.query({
      query: (id) => `/policy-system/${id}`,
      transformResponse: (response) => response.data, 
      providesTags: ["PolicySystem"],
    }),
    getPolicyHashTag: builder.query({
      query: (hashtag) =>
        `/policy-system/all-policy-systems-by-hashtag/${hashtag}`,
      transformResponse: (response) => response.data, 
      providesTags: ["PolicySystem"],
    }),
  }),
});

export const {
  useGetPolicyHashTagQuery,
  useLazyGetAllPoliciesQuery,
  useGetPolicyByIdQuery,
} = policySystemApi;