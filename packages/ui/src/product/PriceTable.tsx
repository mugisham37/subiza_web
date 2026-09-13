import { Icon } from "../icons/Icon";
import { Tag } from "../atoms/Tag";

export type PriceTableRow = {
  id: string;
  name: string;
  amount: number | null;
  flagged: boolean;
};

export function PriceTable({
  rows,
  heading,
  flagLabel,
  nameName = "priceName",
  amountName = "priceAmount",
  idName = "priceId",
}: {
  rows: readonly PriceTableRow[];
  heading: string;
  flagLabel?: string;
  nameName?: string;
  amountName?: string;
  idName?: string;
}) {
  const flagged = rows.filter((row) => row.flagged).length;
  return (
    <div className="ptable">
      <div className="ph">
        <Icon name="list-checks" size={16} />
        <b>{heading}</b>
        {flagged > 0 && flagLabel ? (
          <span className="pc">
            <Tag tone="warn">{flagLabel}</Tag>
          </span>
        ) : null}
      </div>
      {rows.map((row) => (
        <div key={row.id} className={row.flagged ? "prow check" : "prow"}>
          <input type="hidden" name={idName} value={row.id} />
          <input name={nameName} defaultValue={row.name} aria-label={row.name} />
          <input
            className="pp"
            name={amountName}
            defaultValue={row.amount === null ? "?" : String(row.amount)}
            inputMode="numeric"
            aria-label={row.name}
          />
          <span className="pf">
            {row.flagged ? <Icon name="circle-alert" size={14} /> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
