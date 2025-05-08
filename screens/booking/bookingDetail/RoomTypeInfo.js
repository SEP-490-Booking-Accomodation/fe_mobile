import React from "react";
import { Bed } from '@expo/vector-icons/AntDesign';
import InfoCard from "./InfoCard";
import { InfoText, InfoSecondaryText } from "./InfoContent";

export default function RoomTypeInfo({ typeRoom }) {
  return (
    <InfoCard icon={<Bed name="home" size={20} color="#ff385c" />} title="Loại phòng">
      <InfoText>{typeRoom?.name ?? "Không có thông tin"}</InfoText>
      <InfoSecondaryText>{typeRoom?.description ?? ""}</InfoSecondaryText>
    </InfoCard>
  );
}
