import React from "react";
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";

export default function NoteInfo({ note }) {
  if (!note) return null;
  
  return (
    <InfoCard title="Ghi chú">
      <InfoText>{note}</InfoText>
    </InfoCard>
  );
}

