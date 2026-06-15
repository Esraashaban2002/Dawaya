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
import FavoritesContextProvider from "./Context/FavoritesContext";
import ProtectedRoure from "./Components/ProtectedRoure/ProtectedRoute";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import VerifyCompleted from "./Components/VerifyCompleted/VerifyCompleted";
import UserProfile from "./Components/UserProfile/UserProfile";
import AccountType from "./Components/AccountType/AccountType";
import PharmacistRegister from "./Components/PharmacistRegister/PharmacistRegister";
import ThankYou from "./Components/ThankYou/ThankYou";
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Cart from './Pages/Cart';
import Favorites from './Pages/Favorites';
import Checkout from './Pages/Checkout';
import Users from './Pages/Adman/User';
import Dashboard from './Pages/Adman/Dashboard';
import AdminLayout from './Pages/Adman/AdminLayout';
import Contact from './pages/Adman/Contact';
function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
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
          path: "/checkout",
          element: (
            <ProtectedRoure>
              <Checkout />
            </ProtectedRoure>
          )
        },
        {
          path: "/favorites",
          element: <Favorites />
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
          path: "/accountType",
          element: <AccountType />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/pharmacistRegister",
          element: <PharmacistRegister />,
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
          path: "/thankyou",
          element: <ThankYou />,
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
        
        {path:"/contact",
         element:<Contact />
        }
        ,
        { path: "*",
          element: <NotFound />,
        }
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
      <CartContextProvider>
        <FavoritesContextProvider>
          <div dir="rtl">
            <RouterProvider router={router}></RouterProvider>
          </div>
        </FavoritesContextProvider>
      </CartContextProvider>
    </UserContextProvider>
  );
}

export default App;
