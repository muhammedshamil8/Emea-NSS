// import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import './assets/styles/index.css'

import { Home, About, Activitie, Gallery, Report , Login } from "./pages/General";
import { GuestLayout, AdminLayout, VolunteerLayout } from "./layout";
import { AdminDashboard, AdminBanners, AdminEvents, AdminReports, AdminVolunteers } from "./pages/Admin";
import { VolunteerDashboard, VolunteerEvents, VolunteerProfile } from "./pages/Volunteer";

import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Navigate to="/#home" /> },
      { path: "/about", element: <About /> },
      { path: "/activities", element: <Activitie /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/reports", element: <Report /> },
      { path: "/contact", element: <Navigate to="/home/#contact" /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "banners", element: <AdminBanners /> },
      { path: "events", element: <AdminEvents /> },
      { path: "reports", element: <AdminReports /> },
      { path: "volunteers", element: <AdminVolunteers /> }

    ]
  },
  {
    path: "/volunteer",
    element: <VolunteerLayout />,
    children: [
      { path: "", element: <VolunteerDashboard /> },
      { path: "events", element: <VolunteerEvents /> },
      { path: "profile", element: <VolunteerProfile /> }
    ]
  },
  { path: "/404", element: <div>404</div>, },
  { path: "*", element: <Navigate to="/" /> },
]);

export default function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}
