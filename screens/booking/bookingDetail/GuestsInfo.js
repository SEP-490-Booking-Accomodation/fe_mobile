import React from "react";
import { Users } from "lucide-react-native";
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";

export default function GuestsInfo({ adultNumber, childNumber }) {
  return (
    <InfoCard icon={<Users size={20} color="#ff385c" />} title="Số khách">
      <InfoText>Người lớn: {adultNumber}</InfoText>
      <InfoText>Trẻ em: {childNumber}</InfoText>
    </InfoCard>
  );
}
