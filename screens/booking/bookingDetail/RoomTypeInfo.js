import React from "react";
import { Bed } from "lucide-react-native";
import InfoCard from "./InfoCard";
import { InfoText, InfoSecondaryText } from "./InfoContent";

export default function RoomTypeInfo({ typeRoom }) {
  return (
    <InfoCard icon={<Bed size={20} color="#ff385c" />} title="Loại phòng">
      <InfoText>{typeRoom?.name ?? "Không có thông tin"}</InfoText>
      <InfoSecondaryText>{typeRoom?.description ?? ""}</InfoSecondaryText>
    </InfoCard>
  );
}
