import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = useAuth((s) => s.accessToken);

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

