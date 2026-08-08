import { Outlet, useNavigate } from "react-router-dom";
import Navbar, { type NavItem } from "../components/ui/Navbar/Navbar";
import Footer from "../components/ui/Footer/Footer";
import { useUser, useLogout } from "../auth/useAuth";

export default function Layout() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const logout = useLogout();

  const aside: NavItem[] = user
    ? [
        { to: "/dashboard", label: "Dashboard", mobileHidden: true },
        { to: "/reports", label: "Report", mobileHidden: true },
        {
          to: "/profile",
          avatar: user.image,
          menu: [
            {
              label: "Dashboard",
              onSelect: () => navigate("/dashboard"),
              mobileOnly: true,
            },
            {
              label: "Report",
              onSelect: () => navigate("/reports"),
              mobileOnly: true,
            },
            { label: "Profile", onSelect: () => navigate("/profile") },
            {
              label: "Disconnect",
              variant: "destructive",
              onSelect: () => {
                logout();
                navigate("/");
              },
            },
          ],
        },
      ]
    : [
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register", cta: true },
      ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar aside={aside} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
