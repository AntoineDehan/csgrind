import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
