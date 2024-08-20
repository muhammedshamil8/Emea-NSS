// import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import './assets/styles/index.css'
import { Home, About, Activitie, Gallery, Report } from "./pages/General";
import { GuestLayout } from "./layout";

import Login from "./pages/General/Login";

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
  { path: "*", element: <Navigate to="/" /> },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
