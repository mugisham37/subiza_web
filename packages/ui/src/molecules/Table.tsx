import type { ReactNode } from "react";
import { RowList } from "./RowList";
import { cx } from "../lib/cx";

export function Table({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="tblwrap">
      <table className={cx("tbl", className)}>{children}</table>
    </div>
  );
}

/** Small-screen counterpart. Callers render both; CSS shows the right one. */
export function ResponsiveRecords({
  table,
  list,
}: {
  table: ReactNode;
  list: ReactNode;
}) {
  return (
    <>
      <div className="records-wide">{table}</div>
      <div className="records-narrow">
        <RowList>{list}</RowList>
      </div>
    </>
  );
}
