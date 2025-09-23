import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Psychologists from "./pages/psychologists/Psychologists.jsx";
import Favorites from "./pages/Favorites.jsx";
import NotFound from "./pages/NotFound.jsx";
import Modal from "./components/modal/Modal.jsx";
import AuthModal from "./components/authModal/AuthModal.jsx";
import { useAuth } from "./store/auth.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Navbar from "./components/navbar/Navbar.jsx";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [lockedTab, setLockedTab] = useState(null);
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) setAuthOpen(false);
  }, [user]);

 
useEffect(() => {
  if (location.state?.requireAuth) {
    setLockedTab("login");
    setAuthOpen(true);
  }
}, [location.state]);

  return (
    <>
   <Navbar
  user={user}
  loading={loading}
  onOpenAuth={(mode) => { setLockedTab(mode); setAuthOpen(true); }}
  onSignOut={signOut}
/>

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
  <AuthModal lockedTab={lockedTab} />
</Modal>
    </>
  );
}
