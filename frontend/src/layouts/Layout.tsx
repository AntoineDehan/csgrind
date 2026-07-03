import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar/Navbar";
import { useUser } from "../auth/useAuth";

export default function Layout() {
  const { data: user } = useUser();

  const aside = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/reports", label: "Report" },
      ]
    : [
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register", cta: true },
      ];

  return (
    <div>
      <Navbar aside={aside} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
