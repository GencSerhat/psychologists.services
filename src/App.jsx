import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Psychologists from "./pages/psychologists/Psychologists.jsx";
import Favorites from "./pages/Favorites.jsx";
import NotFound from "./pages/NotFound.jsx";
import Modal from "./components/modal/Modal.jsx";
import AuthModal from "./components/authModal/AuthModal.jsx";
import { useAuth } from "./store/auth.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) setAuthOpen(false);
  }, [user]);

  // RequireAuth, yetkisiz kullanıcıyı "/"a state=requireAuth ile geri yollar.
  // Bunu yakalayıp modalı otomatik açıyoruz.
  useEffect(() => {
    if (location.state?.requireAuth) setAuthOpen(true);
  }, [location.state]);

  return (
    <>
      <nav>
        <Link to="/">Home</Link>{" | "}
        <Link to="/psychologists">Psychologists</Link>{" | "}
        <Link to="/favorites">Favorites</Link>{" | "}
        {!loading && (
          user ? (
            <>
              <span style={{ marginLeft: 8 }}>
                {user.displayName || user.email}
              </span>{" "}
              <button onClick={signOut} style={{ marginLeft: 8 }}>
                Çıkış
              </button>
            </>
          ) : (
            <button onClick={() => setAuthOpen(true)} style={{ marginLeft: 8 }}>
              Giriş / Kayıt
            </button>
          )
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/psychologists" element={<Psychologists />} />
        <Route
          path="/favorites"
          element={
            <RequireAuth>
              <Favorites />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Modal open={authOpen} onClose={() => setAuthOpen(false)}>
        <AuthModal />
      </Modal>
    </>
  );
}
