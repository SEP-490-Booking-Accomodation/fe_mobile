import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API config
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.1.72:5000/api",
    //baseUrl: "https://mean-capsuleroom-webapp.azurewebsites.net/api",
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
    "Coupon",
    "Message",
    "CheckAvailable",
    "PolicySystem",
    "RentalLocation",
    "AccommodationType",
    "Booking",
    "Customer",
    "Notification",
    "Payment",
    "Feedback",
  ],
  endpoints: () => ({}),
});

export default baseApi;
