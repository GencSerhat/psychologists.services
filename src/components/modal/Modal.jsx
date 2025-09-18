import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={stop}>
        <button aria-label="Close" className={styles.close} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
