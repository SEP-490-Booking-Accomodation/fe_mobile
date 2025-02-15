import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API config
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "192.168.1.32:5000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}), // Chưa có endpoints, các file API khác sẽ extend từ đây
});

export default baseApi;
