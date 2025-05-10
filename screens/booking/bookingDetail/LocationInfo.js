import React from "react";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { InfoText, InfoSecondaryText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function LocationInfo({ rentalData }) {
  const { t } = useTranslation();
  const address = `${rentalData.address} ${rentalData.ward}, ${rentalData.district}, ${rentalData.city}`;
  
  return (
    <InfoCard icon={<AntDesign name="enviroment" size={20} color="#4E72E3" />} title={t('location')}>
      <InfoText>{rentalData.name}</InfoText>
      <InfoSecondaryText>{address}</InfoSecondaryText>
    </InfoCard>
  );
}
