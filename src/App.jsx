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
import CartContextProvider from "./Context/CartContext";
import ProtectedRoure from "./Components/ProtectedRoure/ProtectedRoute";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import VerifyCompleted from "./Components/VerifyCompleted/VerifyCompleted";

import UserProfile from './Components/UserProfile/UserProfile';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Cart from './Pages/Cart';

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
          path: "/cart",
          element: <Cart />
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
  ]);

  return (
    <UserContextProvider>
      <CartContextProvider>
        <div dir="rtl">
          <RouterProvider router={router}></RouterProvider>
        </div>
      </CartContextProvider>
    </UserContextProvider>
  );
}

export default App;