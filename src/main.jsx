import React, { StrictMode, createContext} from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import AuthStore from './Auth/AuthStore.js'
import AdminPage from './components/Admin/AdminPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CarForm from './components/Admin/CarEdit/CarForm.jsx'
import CarStore from './CarEdit/CarStore.js'
import CarInfo from './components/Admin/CarEdit/CarInfo.jsx'

const router = createBrowserRouter([
  {path: "/", element: <App/>},
  {path: "/login", element: <LoginPage/>},
  {path: "/register", element: <RegisterPage/>},
  {
    path: "/admin", 
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminPage/>
      </ProtectedRoute>
  )},
  {
    path: "/car_edit", 
    element: (
      <ProtectedRoute requiredRole="admin">
        <CarForm/>
      </ProtectedRoute>
  )},
  {path: "/car_info", element: <CarInfo/>},
])

export const auth = new AuthStore();
export const Context = createContext({
  auth,
})

export const carEdit = new CarStore();
export const CarContext = createContext({
    carEdit,
})

createRoot(document.getElementById('root')).render(
  <Context.Provider value={{auth}}>
    <RouterProvider router={router} />
  </Context.Provider>
)
