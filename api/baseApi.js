import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API config
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://172.168.98.220:5000/api",
    baseUrl: "https://mean-capsuleroom-webapp.azurewebsites.net/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
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
    "Report",
    "Owner",
    "PolicyOwner",
  ],
  endpoints: () => ({}),
});

export default baseApi;
