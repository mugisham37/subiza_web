import { cx } from "../lib/cx";

const BARS = [
  28, 62, 44, 80, 36, 70, 52, 88, 40, 74, 48, 66, 32, 90, 54, 72, 38, 84, 46, 68, 34, 76, 50, 86, 42, 64, 30, 78,
];

export function Waveform({ muted }: { muted?: boolean }) {
  return (
    <span className={cx("wave", muted && "muted")} aria-hidden>
      {BARS.map((height, index) => (
        <i
          key={index}
          style={{
            ["--h" as string]: `${height}%`,
            ["--d" as string]: `${(index % 7) * 0.08}s`,
          }}
        />
      ))}
    </span>
  );
}
