import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './pages/error-route';
import Dashboard from './pages/Dashboard';
import Organization from './pages/Organization';
import Access from './pages/Access';
import Login from './pages/Login';
import Callback from './pages/Callback';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/access",
        element: <Access />,
      },
      {
        path: "/organization/:orgId",
        element: <Organization />,
      },
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: "/auth/callback",
        element: <Callback />,
      },
    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>,
)
