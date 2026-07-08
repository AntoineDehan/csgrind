import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import ReportDetail from "./pages/Report";
import Reports from "./pages/Reports/Reports";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SetGoal from "./pages/SetGoal";
import Profile from "./pages/Profile/Profile";
import Tips from "./pages/Admin/Tips/Tips";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "set-goal", element: <SetGoal /> },
          { path: "reports", element: <Reports /> },
          { path: "reports/:reportId", element: <ReportDetail /> },
          {
            element: <AdminRoute />,
            children: [{ path: "admin/tips", element: <Tips /> }],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
