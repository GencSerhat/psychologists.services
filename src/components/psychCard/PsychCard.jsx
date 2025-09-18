import { useMemo, useState } from "react";
import styles from "./PsychCard.module.css";

export default function PsychCard({
  data,
  isFavorite = false,
  onToggleFavorite,
  onReadMore,           // artık gerekmiyor, ama kalsın (çağırmayacağız)
  onAppointment
}) {
  const [expanded, setExpanded] = useState(false);

  const {
    avatar_url,
    name,
    rating,
    price_per_hour,
    experience,
    license,
    specialization,
    initial_consultation,
    about,
    reviews
  } = data;

  const safeReviews = useMemo(() => {
    const arr = Array.isArray(reviews)
      ? reviews
      : typeof reviews === "object" && reviews !== null
      ? Object.values(reviews)
      : [];
    return arr.slice(0, 3); // makete benzer şekilde birkaçını göster
  }, [reviews]);

  return (
    <div className={styles.card}>
      <img className={styles.avatar} src={avatar_url} alt={name} />

      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.role}>Psychologist</div>

          <div className={styles.right}>
            <div className={styles.rating}>⭐ {Number(rating).toFixed(1)}</div>
            <div className={styles.price}>Price / 1 hour: {price_per_hour}$</div>
            <button
              aria-label="Favorilere ekle/çıkar"
              className={`${styles.favBtn} ${isFavorite ? styles.favActive : ""}`}
              onClick={onToggleFavorite}
            >
              {isFavorite ? "♥" : "♡"}
            </button>
          </div>
        </div>

        <div className={styles.name}>{name}</div>

        <div className={styles.pills}>
          <span className={styles.pill}>Experience: {experience} years</span>
          <span className={styles.pill}>License: {license}</span>
          <span className={styles.pill}>Specialization: {specialization}</span>
          <span className={styles.pill}>Initial consultation: {initial_consultation}</span>
        </div>

        <div className={styles.about}>{about}</div>

        {!expanded ? (
          <button className={styles.read} onClick={() => setExpanded(true)}>
            Read more
          </button>
        ) : (
          <>
            <div className={styles.details}>
              <div className={styles.reviews}>
                {safeReviews.length === 0 ? (
                  <div className={styles.reviewText}>Henüz yorum yok.</div>
                ) : (
                  safeReviews.map((r, i) => {
                    const author = r.author || r.user || "Anonymous";
                    const initial = author.trim().charAt(0).toUpperCase();
                    const stars = Number(r.rating || r.stars || 0).toFixed(1);
                    return (
                      <div key={i} className={styles.reviewItem}>
                        <div className={styles.reviewAvatar}>{initial}</div>
                        <div className={styles.reviewBody}>
                          <div className={styles.reviewHead}>
                            <span className={styles.reviewName}>{author}</span>
                            <span>⭐ {stars}</span>
                          </div>
                          <div className={styles.reviewText}>
                            {r.comment || r.text || ""}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className={styles.cta}>
                <button
                  className={styles.appointBtn}
                  onClick={onAppointment}
                >
                  Make an appointment
                </button>
              </div>
            </div>

            <button className={styles.read} onClick={() => setExpanded(false)}>
              Hide
            </button>
          </>
        )}
      </div>
    </div>
  );
}
