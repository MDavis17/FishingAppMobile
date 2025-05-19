import React, { Dispatch, SetStateAction } from "react";
import { FisheryType } from "types";
import { RadioButton } from "react-native-paper";

interface Props {
  fisherySelected: FisheryType;
  setFisherySelected: Dispatch<SetStateAction<FisheryType>>;
}

export default function WaterSelector({
  fisherySelected,
  setFisherySelected,
}: Props) {
  return (
    <RadioButton.Group
      onValueChange={(value) => setFisherySelected(value as FisheryType)}
      value={fisherySelected}
    >
      <RadioButton.Item label="Freshwater" value={FisheryType.Freshwater} />
      <RadioButton.Item label="Saltwater" value={FisheryType.Saltwater} />
      <RadioButton.Item label="Brackish" value={FisheryType.Brackish} />
    </RadioButton.Group>
  );
}
