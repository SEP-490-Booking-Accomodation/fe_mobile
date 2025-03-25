import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API config
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.1.11:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log("Current Token:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Role", "Booking", "Message", "PolicySystem"],
  endpoints: () => ({}),
});

export default baseApi;
