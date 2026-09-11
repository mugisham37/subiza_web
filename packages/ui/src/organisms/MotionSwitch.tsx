"use client";

import { useEffect, useState } from "react";
import { Icon } from "../icons/Icon";
import {
  readMotion,
  writeMotion,
  type MotionPreference,
} from "../lib/preferences";

const OPTIONS: Array<{
  value: MotionPreference;
  icon: "sparkles" | "circle-pause" | "monitor";
  label: string;
}> = [
  { value: "full", icon: "sparkles", label: "Full motion" },
  { value: "reduce", icon: "circle-pause", label: "Reduce motion" },
  { value: "system", icon: "monitor", label: "System motion" },
];

export function MotionSwitch() {
  const [value, setValue] = useState<MotionPreference>("system");

  useEffect(() => {
    setValue(readMotion());
  }, []);

  return (
    <div className="themebar" role="group" aria-label="Motion">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          aria-label={option.label}
          onClick={() => {
            writeMotion(option.value);
            setValue(option.value);
          }}
        >
          <Icon name={option.icon} size={15} />
        </button>
      ))}
    </div>
  );
}
