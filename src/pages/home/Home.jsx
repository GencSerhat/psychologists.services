import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.wrap}>
      <section className={styles.hero}>
        <div>
          <h1 className={styles.title}>
            The road to the <span className={styles.accent}>depths</span> of the human soul
          </h1>
          <p className={styles.subtitle}>
            We help you to reveal your potential, overcome challenges and find a guide
            in your own life with the help of our experienced psychologists.
          </p>
          <Link className={styles.cta} to="/psychologists">Get started ↗</Link>
        </div>

        <div className={styles.media}>
          {/* İstersen burada kendi görselini kullan: /public/hero.jpg */}
          <img src="https://images.unsplash.com/photo-1590648982820-9f1f9b4e5b09?q=80&w=1200&auto=format&fit=crop" alt="Psychologist session" />
        </div>
      </section>
    </main>
  );
}
