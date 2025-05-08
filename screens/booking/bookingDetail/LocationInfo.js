import React from "react";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { InfoText, InfoSecondaryText } from "./InfoContent";

export default function LocationInfo({ rentalData }) {
  const address = `${rentalData.address} ${rentalData.ward}, ${rentalData.district}, ${rentalData.city}`;
  
  return (
    <InfoCard icon={<AntDesign name="enviroment" size={20} color="#ff385c" />} title="Địa điểm">
      <InfoText>{rentalData.name}</InfoText>
      <InfoSecondaryText>{address}</InfoSecondaryText>
    </InfoCard>
  );
}
