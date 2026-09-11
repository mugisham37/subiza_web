export type ThemePreference = "light" | "dark" | "system";
export type MotionPreference = "full" | "reduce" | "system";

export const THEME_KEY = "subiza-theme";
export const MOTION_KEY = "subiza-motion";

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;else document.documentElement.removeAttribute("data-theme");}catch(e){}})();`;

export const motionInitScript = `(function(){try{var t=localStorage.getItem("${MOTION_KEY}");if(t==="full"||t==="reduce")document.documentElement.dataset.motion=t;else document.documentElement.removeAttribute("data-motion");}catch(e){}})();`;

export function readTheme(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === "light" || value === "dark" || value === "system") return value;
  } catch {
    /* private mode */
  }
  return "system";
}

export function writeTheme(value: ThemePreference): void {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    /* private mode */
  }
  if (value === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.dataset["theme"] = value;
}

export function readMotion(): MotionPreference {
  try {
    const value = localStorage.getItem(MOTION_KEY);
    if (value === "full" || value === "reduce" || value === "system") return value;
  } catch {
    /* private mode */
  }
  return "system";
}

export function writeMotion(value: MotionPreference): void {
  try {
    localStorage.setItem(MOTION_KEY, value);
  } catch {
    /* private mode */
  }
  if (value === "system") document.documentElement.removeAttribute("data-motion");
    else document.documentElement.dataset["motion"] = value;
}

export function resolvedMotion(
  preference: MotionPreference,
  osReduce: boolean,
): "full" | "reduce" {
  if (preference === "full") return "full";
  if (preference === "reduce") return "reduce";
  return osReduce ? "reduce" : "full";
}
