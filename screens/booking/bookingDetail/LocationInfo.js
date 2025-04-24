import React from "react";
import { MapPin } from "lucide-react-native";
import InfoCard from "./InfoCard";
import { InfoText, InfoSecondaryText } from "./InfoContent";

export default function LocationInfo({ rentalData }) {
  const address = `${rentalData.address} ${rentalData.ward}, ${rentalData.district}, ${rentalData.city}`;
  
  return (
    <InfoCard icon={<MapPin size={20} color="#ff385c" />} title="Địa điểm">
      <InfoText>{rentalData.name}</InfoText>
      <InfoSecondaryText>{address}</InfoSecondaryText>
    </InfoCard>
  );
}
