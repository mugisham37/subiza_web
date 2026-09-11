"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "../lib/cx";

export function Sheet({
  open,
  onClose,
  title,
  children,
  variant = "auto",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: "sheet" | "modal" | "auto";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx(variant === "modal" ? "modal" : "sheet")}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <h3>{title}</h3>
      {children}
    </dialog>
  );
}

export function Drawer({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <div className="navscrim" data-open={open || undefined} />
      <aside className="nav" data-open={open || undefined}>
        {children}
      </aside>
    </>
  );
}
