import { useEffect, useState } from "react";
import styles from "../pages/psychologists/Psychologists.module.css";
import { db } from "../services/firebase.js";
import { ref, get } from "firebase/database";
import PsychCard from "../components/psychCard/PsychCard.jsx";
import { useAuth } from "../store/auth.jsx"

export default function Favorites() {
  const { user } = useAuth();
  const [all, setAll] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [items, setItems] = useState([]);

  // Tüm psikologları yükle
  useEffect(() => {
    (async () => {
      try {
        const snap = await get(ref(db, "psychologists"));
        if (!snap.exists()) return;
        const obj = snap.val();
        const arr = Object.entries(obj)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([id, v]) => ({ id, ...v }));
        setAll(arr);
      } catch (e) {
        console.error("load fav base failed:", e);
      }
    })();
  }, []);

  // Kullanıcının favorilerini localStorage'dan yükle
  useEffect(() => {
    if (!user) return;
    const key = `fav:${user.uid}`;
    try {
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      setFavIds(new Set(arr));
    } catch {
      setFavIds(new Set());
    }
  }, [user]);

  // Favori id’lere göre filtrele
  useEffect(() => {
    if (!all.length) { setItems([]); return; }
    setItems(all.filter((p) => favIds.has(p.id)));
  }, [all, favIds]);

  const toggleFavorite = (id) => {
    if (!user) return;
    const key = `fav:${user.uid}`;
    const next = new Set(favIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavIds(next);
    localStorage.setItem(key, JSON.stringify([...next]));
  };

  const handleReadMore = (item) => {
    console.log("read more:", item.id);
  };

  return (
    <div className={styles.wrap}>
      {items.length === 0 ? (
        <p>Henüz favori psikoloğunuz yok.</p>
      ) : (
        <div className={styles.grid}>
          {items.map((p) => (
            <PsychCard
              key={p.id}
              data={p}
              isFavorite={favIds.has(p.id)}
              onToggleFavorite={() => toggleFavorite(p.id)}
              onReadMore={() => handleReadMore(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
