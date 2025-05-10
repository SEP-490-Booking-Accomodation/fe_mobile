import React from "react";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function GuestsInfo({ adultNumber, childNumber }) {
  const { t } = useTranslation();
  return (
    <InfoCard 
      icon={<AntDesign name="user" size={20} color="#ff385c" />} 
      title={t('guests')}
    >
      <InfoText>{t('adults')}: {adultNumber}</InfoText>
      <InfoText>{t('children')}: {childNumber}</InfoText>
    </InfoCard>
  );
}
