import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./useAuth";

export default function ProtectedRoute() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
