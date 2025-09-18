import { useEffect, useState,useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Psychologists.module.css";
import { db } from "../../services/firebase.js";
import { ref, get } from "firebase/database";
import PsychCard from "../../components/psychCard/PsychCard.jsx";
import SortBar from "../../components/sortBar/SortBar.jsx";
import { useAuth } from "../../store/auth.jsx"


export default function Psychologists() {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(3);
  const [sort, setSort] = useState("az");
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const { user } = useAuth();
  const navigate = useNavigate();

  // İlk yüklemede tüm veriyi çek
  useEffect(() => {
    (async () => {
      try {
        const snap = await get(ref(db, "psychologists"));
        if (!snap.exists()) return;
        const obj = snap.val();
        const arr = Object.entries(obj)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([id, v]) => ({ id, ...v }));
        setAllItems(arr);
      } catch (e) {
        console.error("load psychologists failed:", e);
      }
    })();
  }, []);

  // Kullanıcı değişince favorileri localStorage'dan yükle
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    const key = `fav:${user.uid}`;
    try {
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      setFavoriteIds(new Set(arr));
    } catch {
      setFavoriteIds(new Set());
    }
  }, [user]);

  // Sıralama
  const sorted = useMemo(() => {
    const cp = [...allItems];
    switch (sort) {
      case "az":
        cp.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        cp.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price_asc":
        cp.sort((a, b) => Number(a.price_per_hour) - Number(b.price_per_hour));
        break;
      case "price_desc":
        cp.sort((a, b) => Number(b.price_per_hour) - Number(a.price_per_hour));
        break;
      case "rating_asc":
        cp.sort((a, b) => Number(a.rating) - Number(b.rating));
        break;
      case "rating_desc":
        cp.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      default:
        break;
    }
    return cp;
  }, [allItems, sort]);

  // Görüntülenecek dilim
  useEffect(() => {
    setItems(sorted.slice(0, limit));
  }, [sorted, limit]);

  const handleReadMore = (item) => {
    console.log("read more:", item.id);
  };

  const toggleFavorite = (id) => {
    // Yetkisiz → anasayfaya yönlendir, modal otomatik açılsın
    if (!user) {
      navigate("/", { state: { requireAuth: true } });
      return;
    }
    const key = `fav:${user.uid}`;
    const next = new Set(favoriteIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavoriteIds(next);
    localStorage.setItem(key, JSON.stringify([...next]));
  };

  return (
    <div className={styles.wrap}>
      <SortBar value={sort} onChange={setSort} />

      <div className={styles.grid}>
        {items.map((p) => (
          <PsychCard
            key={p.id}
            data={p}
            isFavorite={favoriteIds.has(p.id)}
            onToggleFavorite={() => toggleFavorite(p.id)}
            onReadMore={() => handleReadMore(p)}
          />
        ))}
      </div>

      <div className={styles.more}>
        <button
          className={styles.btnMore}
          onClick={() => setLimit((n) => n + 3)}
          disabled={items.length >= sorted.length}
        >
          Load more
        </button>
      </div>
    </div>
  );
}
