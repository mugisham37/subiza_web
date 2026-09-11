"use client";

import { useEffect, useState } from "react";
import { Icon } from "../icons/Icon";
import {
  readTheme,
  writeTheme,
  type ThemePreference,
} from "../lib/preferences";

const OPTIONS: Array<{ value: ThemePreference; icon: "sun" | "moon" | "monitor"; label: string }> = [
  { value: "light", icon: "sun", label: "Light" },
  { value: "dark", icon: "moon", label: "Dark" },
  { value: "system", icon: "monitor", label: "System" },
];

export function ThemeSwitch() {
  const [value, setValue] = useState<ThemePreference>("system");

  useEffect(() => {
    setValue(readTheme());
  }, []);

  return (
    <div className="themebar" role="group" aria-label="Theme">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          data-theme-set={option.value}
          aria-pressed={value === option.value}
          aria-label={option.label}
          onClick={() => {
            writeTheme(option.value);
            setValue(option.value);
          }}
        >
          <Icon name={option.icon} size={15} />
        </button>
      ))}
    </div>
  );
}
