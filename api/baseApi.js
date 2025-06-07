import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { EXPO_PUBLIC_API_URL } from "@env"; // 👈 import từ .env

// Base API config
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://192.168.1.165:5000/api",
    baseUrl: "https://mean-capsuleroom-webapp.azurewebsites.net/api",
    // baseUrl: EXPO_PUBLIC_API_URL,

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
    "PaymentPayOS",
  ],
  endpoints: () => ({}),
});

export default baseApi;
