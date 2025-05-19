import { TextInput, TouchableRipple } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { Dispatch, SetStateAction, useState } from "react";
import { View } from "react-native";
import { CatchTime } from "types";

interface Props {
  time: CatchTime;
  setTime: Dispatch<SetStateAction<CatchTime>>;
}

export function TimeInputField({ time, setTime }: Props) {
  const [visible, setVisible] = useState(false);

  const formattedTime = `${String(time.hours).padStart(2, "0")}:${String(
    time.minutes
  ).padStart(2, "0")}`;

  return (
    <View>
      <TouchableRipple onPress={() => setVisible(true)}>
        <TextInput
          label="Time"
          value={formattedTime}
          editable={false}
          pointerEvents="none"
        />
      </TouchableRipple>

      <TimePickerModal
        visible={visible}
        onDismiss={() => setVisible(false)}
        onConfirm={({ hours, minutes }) => {
          setTime({ hours, minutes });
          setVisible(false);
        }}
        hours={time.hours}
        minutes={time.minutes}
        defaultInputType="keyboard"
      />
    </View>
  );
}
