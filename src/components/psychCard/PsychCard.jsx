import styles from "./PsychCard.module.css";

export default function PsychCard({
  data,
  isFavorite = false,
  onToggleFavorite,
  onReadMore
}) {
  const {
    avatar_url,
    name,
    rating,
    price_per_hour,
    experience,
    license,
    specialization,
    initial_consultation,
    about
  } = data;

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

        <button className={styles.read} onClick={onReadMore}>
          Read more
        </button>
      </div>
    </div>
  );
}
