import React from "react";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { InfoText, InfoSecondaryText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function RoomTypeInfo({ typeRoom }) {
  const { t } = useTranslation();
  return (
    <InfoCard icon={<AntDesign name="home" size={20} color="#ff385c" />} title={t('room_type')}>
      <InfoText>{typeRoom?.name ?? t('no_info')}</InfoText>
      <InfoSecondaryText>{typeRoom?.description ?? ""}</InfoSecondaryText>
    </InfoCard>
  );
}
