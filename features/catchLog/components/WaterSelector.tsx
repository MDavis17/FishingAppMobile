import React, { Dispatch, SetStateAction, useState } from "react";
import { WaterType } from "types";
import { Menu, RadioButton } from "react-native-paper";
// import TertiaryButton from "common/components/buttons/TertiaryButton";

interface Props {
  waterType: WaterType;
  setWaterType: Dispatch<SetStateAction<WaterType>>;
}

export default function WaterSelector({ waterType, setWaterType }: Props) {
  // const [visible, setVisible] = useState(false);
  return (
    <RadioButton.Group
      onValueChange={(value) => setWaterType(value as WaterType)}
      value={waterType}
    >
      <RadioButton.Item label="Freshwater" value={WaterType.Freshwater} />
      <RadioButton.Item label="Saltwater" value={WaterType.Saltwater} />
      <RadioButton.Item label="Brackish" value={WaterType.Brackish} />
    </RadioButton.Group>
    // <Menu
    //   visible={visible}
    //   onDismiss={() => setVisible(false)}
    //   anchor={
    //     <TertiaryButton
    //       onPress={() => {
    //         console.log("pressed", visible);

    //         setVisible(true);
    //       }}
    //     >
    //       {waterType}
    //     </TertiaryButton>
    //   }
    //   style={{ position: "absolute", zIndex: 10 }}
    // >
    //   <Menu.Item
    //     key={1}
    //     onPress={() => {
    //       setWaterType(WaterType.Freshwater);
    //       setVisible(false);
    //     }}
    //     title="Freshwater"
    //   />
    //   <Menu.Item
    //     key={2}
    //     onPress={() => {
    //       setWaterType(WaterType.Saltwater);
    //       setVisible(false);
    //     }}
    //     title="Saltwater"
    //   />
    //   <Menu.Item
    //     key={3}
    //     onPress={() => {
    //       setWaterType(WaterType.Brackish);
    //       setVisible(false);
    //     }}
    //     title="Brackish"
    //   />
    // </Menu>
  );
}
