import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./useAuth";

export default function AdminRoute() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
