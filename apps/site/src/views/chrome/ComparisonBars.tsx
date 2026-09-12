import { barWidthPercent, comparisonWages, formatRwf } from "@subiza/core";

export function ComparisonBars({
  locale,
  labels,
}: {
  locale: string;
  labels: { rep: string; desk: string; us: string };
}) {
  const rows = [
    { key: "rep", value: comparisonWages.supportRepRwf, label: labels.rep, wage: true },
    { key: "desk", value: comparisonWages.receptionistRwf, label: labels.desk, wage: true },
    { key: "us", value: comparisonWages.subizaFromRwf, label: labels.us, wage: false },
  ] as const;

  return (
    <div className="compare-bars" role="img" aria-label={labels.us}>
      {rows.map((row) => (
        <div key={row.key} className="compare-row">
          <b>
            {row.label} · {formatRwf(row.value, locale)}
          </b>
          <div className="compare-track">
            <div
              className={row.wage ? "compare-fill wage" : "compare-fill"}
              style={{ width: `${barWidthPercent(row.value)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
