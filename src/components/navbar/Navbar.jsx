import { NavLink, Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar({ user, loading, onOpenAuth, onSignOut }) {
  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <em>psychologists</em>.services
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/psychologists"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            Psychologists
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            Favorites
          </NavLink>
        </nav>

        <div className={styles.right}>
          {!loading && (
            user ? (
              <>
                <span className={styles.user}>{user.displayName || user.email}</span>
                <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onSignOut}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => onOpenAuth("login")}>
                  Log In
                </button>
               <button className={styles.btn} onClick={() => onOpenAuth("register")}>
                  Registration
                </button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
