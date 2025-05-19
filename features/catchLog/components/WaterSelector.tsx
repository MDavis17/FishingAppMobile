import React, { Dispatch, SetStateAction } from "react";
import { WaterType } from "types";
import { RadioButton } from "react-native-paper";

interface Props {
  waterType: WaterType;
  setWaterType: Dispatch<SetStateAction<WaterType>>;
}

export default function WaterSelector({ waterType, setWaterType }: Props) {
  return (
    <RadioButton.Group
      onValueChange={(value) => setWaterType(value as WaterType)}
      value={waterType}
    >
      <RadioButton.Item label="Freshwater" value={WaterType.Freshwater} />
      <RadioButton.Item label="Saltwater" value={WaterType.Saltwater} />
      <RadioButton.Item label="Brackish" value={WaterType.Brackish} />
    </RadioButton.Group>
  );
}
