import styles from "./SortBar.module.css";

const OPTIONS = [
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "price_asc", label: "Fiyat (Artan)" },
  { value: "price_desc", label: "Fiyat (Azalan)" },
  { value: "rating_asc", label: "Popülerlik (Düşük → Yüksek)" },
  { value: "rating_desc", label: "Popülerlik (Yüksek → Düşük)" }
];

export default function SortBar({ value = "az", onChange }) {
  return (
    <div className={styles.bar}>
      <span className={styles.label}>Sırala:</span>
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label="Sıralama türü"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
