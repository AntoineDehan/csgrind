import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home/Home";
import ReportDetail from "./pages/Report/Report";
import Reports from "./pages/Reports/Reports";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SteamLink from "./pages/SteamLink/SteamLink";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/Profile";
import LegalNotice from "./pages/Legal/LegalNotice";
import Privacy from "./pages/Legal/Privacy";
import Terms from "./pages/Legal/Terms";
import Tips from "./pages/Admin/Tips/Tips";
import Tasks from "./pages/Admin/Tasks/Tasks";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "legal-notice", element: <LegalNotice /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "reports", element: <Reports /> },
          { path: "reports/:reportId", element: <ReportDetail /> },
          {
            element: <AdminRoute />,
            children: [
              { path: "admin/tips", element: <Tips /> },
              { path: "admin/tasks", element: <Tasks /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/steam-link", element: <SteamLink /> },
  { path: "/verify-email", element: <VerifyEmail /> },
]);
