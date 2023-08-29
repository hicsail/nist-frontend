import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/error-route';
import { FileView } from './pages/FileView';
import { OrgFileView } from './pages/OrgFileView';
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import Callback from './pages/Callback';
import AccessManager from './pages/AccessManager';
import Account from './pages/Account';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/file-view',
        element: <FileView />
      },
      {
        path: '/access-manager',
        element: <AccessManager />
      },
      {
        path: '/organization/*',
        element: <OrgFileView />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/auth/callback',
        element: <Callback />
      },
      {
        path: '/account',
        element: <Account />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);
