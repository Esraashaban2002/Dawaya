import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import NotFound from "./Pages/NotFound";
import "./App.css";
import Layout from "./Components/Layout/Layout";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import VerifyOTP from "./Components/VerifyOTP/VerifyOTP";
import UserContextProvider from "./Context/UserContext";
import ProtectedRoure from "./Components/ProtectedRoure/ProtectedRoute";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import VerifyCompleted from "./Components/VerifyCompleted/VerifyCompleted";

import UserProfile from './Components/UserProfile/UserProfile';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Users from './Pages/Adman/User';
import Dashboard from './Pages/Adman/Dashboard';
import AdminLayout from './Pages/Adman/AdminLayout';

function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "/product/:id",
          element: <ProductDetails />
        },
        {
          path: "/about",
          element: (
            <ProtectedRoure>
              <About />
            </ProtectedRoure>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoure>
              <UserProfile />
            </ProtectedRoure>
          ),
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/regester",
          element: <Register />,
        },
        {
          path: "/verifyotp",
          element: <VerifyOTP />,
        },
        {
          path: "/verifycompleted",
          element: <VerifyCompleted />,
        },
        {
          path: "/forgetpassword",
          element: <ForgetPassword />,
        },
        {
          path: "/resetpassword",
          element: <ResetPassword />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },

    // ─── الـ Admin Dashboard — 
    {
      path: "/admin",
      element: (
        <ProtectedRoure>
          <AdminLayout />
        </ProtectedRoure>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "users", element: <Users /> },
      ]
    }
  ]);

  return (
    <UserContextProvider>
      <div dir="rtl">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </UserContextProvider>
  );
}

export default App;