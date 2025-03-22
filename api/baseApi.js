import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API config
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      // process.env.EXPO_PUBLIC_API_URL ||
      "http://192.168.1.23:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log("Current Token:", token); // Kiểm tra token có hay không
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}), // Chưa có endpoints, các file API khác sẽ extend từ đây
});

export default baseApi;
