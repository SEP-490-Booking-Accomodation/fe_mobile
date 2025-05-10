import React from "react";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function TimeInfo({ bookingData }) {
  const { t } = useTranslation();
  return (
    <InfoCard 
      icon={<AntDesign name="clockcircle" size={20} color="#4E72E3" />} 
      title={t('rental_time')}
    >
      <InfoText>{t('check_in')}: {bookingData.checkInHour}</InfoText>
      <InfoText>{t('check_out')}: {bookingData.checkOutHour}</InfoText>
      <InfoText>
        {t('rental_duration')}: {bookingData.durationBookingHour} {t('hours_text')}
      </InfoText>
    </InfoCard>
  );
}

