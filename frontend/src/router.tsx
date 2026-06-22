import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import ReportDetail from "./pages/Report";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "reports/:reportId", element: <ReportDetail /> },
      { path: "*", element: <NotFound /> },
      { path: "login", element: <Login /> },
    ],
  },
]);
