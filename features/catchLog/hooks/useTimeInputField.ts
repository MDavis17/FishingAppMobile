import { useState } from "react";
import { CatchTime } from "../../../types";

export default function useTimeInputField() {
  const now = new Date();
  const [time, setTime] = useState<CatchTime>({
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });

  return { time, setTime };
}
