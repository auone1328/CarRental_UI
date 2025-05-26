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
import Departments from './components/Admin/Department/Departments.jsx'
import DepartmentsEdit from './components/Admin/Department/DepartmentsEdit.jsx'
import Rents from './components/Admin/Rent/Rents.jsx'
import AddPenalty from './components/Admin/Rent/Penalty.jsx'
import MechanicForm from './components/Mechanic/MechanicForm.jsx'
import RentsForUsers from './components/RentsForUsers.jsx'
import ServicePage from './components/Mechanic/ServicePage.jsx'

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
  {
    path: "/departments", 
    element: (
      <ProtectedRoute requiredRole="admin">
        <Departments/>
      </ProtectedRoute>
  )},
  {
    path: "/departments_edit", 
    element: (
      <ProtectedRoute requiredRole="admin">
        <DepartmentsEdit/>
      </ProtectedRoute>
  )},
  {
    path: "/rents", 
    element: (
      <ProtectedRoute requiredRole="admin">
        <Rents/>
      </ProtectedRoute>
  )},
  {
    path: "/service", 
    element: (
      <ProtectedRoute requiredRole="mechanic">
        <ServicePage/>
      </ProtectedRoute>
  )},
  {
    path: "/maintenance", 
    element: (
      <ProtectedRoute requiredRole="mechanic">
        <MechanicForm/>
      </ProtectedRoute>
  )},
  {
    path: "/penalty", 
    element: (
      <ProtectedRoute requiredRole="admin">
        <AddPenalty/>
      </ProtectedRoute>
  )},
  {path: "/car_info", element: <CarInfo/>},
  {path: "/user_rents", element: <RentsForUsers/>}
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
