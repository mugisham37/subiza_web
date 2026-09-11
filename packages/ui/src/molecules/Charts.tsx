export function Sparkline({
  points,
  label,
}: {
  points: readonly number[];
  label: string;
}) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = max - min || 1;
  const coords = points.map((value, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * 100;
    const y = 36 - ((value - min) / span) * 28;
    return `${x},${y}`;
  });
  const line = coords.join(" ");
  const area = `0,40 ${line} 100,40`;
  const last = coords.at(-1);

  return (
    <svg className="spark" viewBox="0 0 100 40" role="img" aria-label={label}>
      <path className="ar" d={`M${area}Z`} />
      <path className="ln" d={`M${line}`} />
      {last ? <circle cx={last.split(",")[0]} cy={last.split(",")[1]} r="2.2" /> : null}
    </svg>
  );
}

export function Bars({
  values,
  labels,
}: {
  values: readonly number[];
  labels: readonly string[];
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="bars" role="img" aria-label="Weekly volume">
      {values.map((value, index) => (
        <span className={index === values.length - 1 ? "b on" : "b"} key={labels[index] ?? index}>
          <i style={{ ["--h" as string]: `${Math.round((value / max) * 100)}%` }} />
          <span>{labels[index]}</span>
        </span>
      ))}
    </div>
  );
}

export function Ring({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const c = 2 * Math.PI * 32;
  const off = c - (pct / 100) * c;
  return (
    <div className="ring">
      <svg viewBox="0 0 76 76" aria-hidden>
        <circle className="rtrack" cx="38" cy="38" r="32" />
        <circle
          className="rval"
          cx="38"
          cy="38"
          r="32"
          style={{
            ["--dash" as string]: `${c}`,
            ["--off" as string]: `${off}`,
          }}
        />
      </svg>
      <div>
        <div className="rnum">{pct}%</div>
        <div className="rlab">{label}</div>
      </div>
    </div>
  );
}
