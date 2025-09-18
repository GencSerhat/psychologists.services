import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return (
      <Navigate
        to="/"
        state={{ requireAuth: true, from: location.pathname }}
        replace
      />
    );
  }

  return children;
}
