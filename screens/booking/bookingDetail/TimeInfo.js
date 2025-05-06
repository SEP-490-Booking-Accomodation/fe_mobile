import React from "react";
import { Clock } from "lucide-react-native";
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";

export default function TimeInfo({ bookingData }) {
  return (
    <InfoCard icon={<Clock size={20} color="#ff385c" />} title="Thời gian thuê">
      <InfoText>Check-in: {bookingData.checkInHour}</InfoText>
      <InfoText>Check-out: {bookingData.checkOutHour}</InfoText>
      <InfoText>Thời gian thuê: {bookingData.durationBookingHour} giờ</InfoText>
    </InfoCard>
  );
}

