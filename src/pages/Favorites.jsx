import { useEffect, useState,useMemo } from "react";
import styles from "../pages/psychologists/Psychologists.module.css";
import { db } from "../services/firebase.js";
import { ref, get } from "firebase/database";
import PsychCard from "../components/psychCard/PsychCard.jsx";
import { useAuth } from "../store/auth.jsx"
import { subscribeFavorites, toggleFavoriteRTDB } from "../services/favorites.js";
import Modal from "../components/modal/Modal.jsx";
import AppointmentModal from "../components/appointmentModal/AppointmentModal.jsx";
export default function Favorites() {
const { user } = useAuth();
  const [all, setAll] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [appTarget, setAppTarget] = useState(null);

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
        console.error("load favorites base failed:", e);
      }
    })();
  }, []);

  // Kullanıcının favorilerini RTDB'den dinle
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeFavorites(user.uid, (setFromDB) => setFavIds(setFromDB));
    return () => unsub && unsub();
  }, [user]);

  // Favori listesi
  const items = useMemo(() => all.filter((p) => favIds.has(p.id)), [all, favIds]);

  const toggleFavorite = async (id) => {
    if (!user) return;
    try {
      await toggleFavoriteRTDB(user.uid, id);
    } catch (e) {
      console.error("toggle favorite failed:", e);
    }
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
              onAppointment={() => setAppTarget(p)}
            />
          ))}
        </div>
      )}

      <Modal open={!!appTarget} onClose={() => setAppTarget(null)}>
        <AppointmentModal psych={appTarget} onClose={() => setAppTarget(null)} />
      </Modal>
    </div>
  );
}
