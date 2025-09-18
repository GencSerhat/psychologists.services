import styles from "./PsychDetailsModal.module.css";

export default function PsychDetailsModal({ data, onAppointment, onClose }) {
  if (!data) return null;

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

  const safeReviews = Array.isArray(reviews)
    ? reviews
    : typeof reviews === "object" && reviews !== null
    ? Object.values(reviews)
    : [];

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <img className={styles.avatar} src={avatar_url} alt={name} />
        <div className={styles.title}>
          <div className={styles.name}>{name}</div>
          <div className={styles.sub}>
            ⭐ {Number(rating).toFixed(1)} • ${price_per_hour}/h
          </div>
        </div>
      </div>

      <div className={styles.pills}>
        <span className={styles.pill}>Experience: {experience} years</span>
        <span className={styles.pill}>License: {license}</span>
        <span className={styles.pill}>Specialization: {specialization}</span>
        <span className={styles.pill}>Initial consultation: {initial_consultation}</span>
      </div>

      <div className={styles.sectionTitle}>About</div>
      <div className={styles.about}>{about}</div>

      <div className={styles.sectionTitle}>Reviews</div>
      <div className={styles.reviews}>
        {safeReviews.length === 0 ? (
          <div className={styles.sub}>Henüz yorum yok.</div>
        ) : (
          safeReviews.map((r, i) => (
            <div key={i} className={styles.review}>
              <div className={styles.reviewHead}>
                <span>{r.author || r.user || "Anonymous"}</span>
                <span>⭐ {Number(r.rating || r.stars || 0).toFixed(1)}</span>
              </div>
              <div className={styles.reviewBody}>{r.comment || r.text || ""}</div>
            </div>
          ))
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.btn} onClick={onClose}>Kapat</button>
        <button className={`${styles.btn} ${styles.primary}`} onClick={onAppointment}>
          Make an appointment
        </button>
      </div>
    </div>
  );
}
