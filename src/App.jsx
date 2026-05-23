import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { children } from 'react'
import Home from './Pages/Home'
import About from './Pages/About'
import NotFound from './Pages/NotFound'
import './App.css'
import Layout from './Components/Layout/Layout'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import VerifyOTP from './Components/VerifyOTP/VerifyOTP'


// import React from "react";
// import i18n from "i18next";
// import { useTranslation, initReactI18next } from "react-i18next";

// i18n
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: {
//         translation: {
//           "Welcome to React": "Welcome to React and react-i18next"
//         }
//       },
//       ar: {
//         translation: {
//           "Welcome to React": "مرحبا"
//         }
//       }
//     },
//     lng: "en",

//     interpolation: {
//       escapeValue: false
//     }
//   });


function App() {

  let router = createBrowserRouter([
    {
      path: '/', element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: '/about', element: <About /> },
        { path: '/login', element: <Login /> },
        { path: '/regester', element: <Register /> },
        { path: '/verifyotp', element: <VerifyOTP /> },
        { path: '*', element: <NotFound /> }
      ]
    }
  ])

  return <>
    <div dir="rtl">
      <RouterProvider router={router}></RouterProvider>

    </div>
  </>

}

export default App




// function App() {
//   const { t } = useTranslation();

//   return <h2>{t('Welcome to React')}</h2>;
// }

