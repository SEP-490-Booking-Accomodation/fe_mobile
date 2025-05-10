import React from "react";
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function NoteInfo({ note }) {
  const { t } = useTranslation();
  if (!note) return null;

  return (
    <InfoCard title={t('note')}>
      <InfoText>{note}</InfoText>
    </InfoCard>
  );
}

