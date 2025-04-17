import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React, {createContext} from 'react';
import './index.css'
import App from './App.jsx'
import LoginPage from './components/LoginPage.jsx'
import AuthStore from './Auth/AuthStore.js'

const router = createBrowserRouter([
  {path: "/", element: <App/>},
  {path: "/login", element: <LoginPage/>}
])

export const auth = new AuthStore();

export const Context = createContext({
  auth,
})

createRoot(document.getElementById('root')).render(
  <Context.Provider value={{auth}}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Context.Provider>
)
