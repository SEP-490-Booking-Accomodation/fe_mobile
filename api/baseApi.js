import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API config
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.200.2.23:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      // console.log("Current Token:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Role",
    "Booking",
    "Message",
    "PolicySystem",
    "RentalLocation",
    "AccommodationType",
    "Notification"
  ],
  endpoints: () => ({}),
});

export default baseApi;

