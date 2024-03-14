import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import '@fontsource/inter';

import Login from './routes/Login';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <NotFound />
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <NotFound />
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
root.render(
    <React.StrictMode>
        <CssVarsProvider defaultMode='dark'>
            <CssBaseline />
            <RouterProvider router={router} />
        </CssVarsProvider>
    </React.StrictMode>
);

reportWebVitals();
