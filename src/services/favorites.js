import { ref, onValue, get, set, remove } from "firebase/database";
import { db } from "./firebase.js";

export function subscribeFavorites(uid, handler) {
  const r = ref(db, `users/${uid}/favorites`);
  return onValue(r, (snap) => {
    const val = snap.val() || {};
    handler(new Set(Object.keys(val)));
  });
}

export async function toggleFavoriteRTDB(uid, psyId) {
  const r = ref(db, `users/${uid}/favorites/${psyId}`);
  const snap = await get(r);
  if (snap.exists()) {
    await remove(r);
    return false;
  } else {
    await set(r, true);
    return true;
  }
}
