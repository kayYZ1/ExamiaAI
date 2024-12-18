import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import AuthGuard from './guards/auth-guard';

const Home = lazy(() => import('./features/home'));
const NotFound = lazy(() => import('./features/not-found'));
const Auth = lazy(() => import('./features/auth'));
const Verify = lazy(() => import('./features/auth/verify'));
const Dashboard = lazy(() => import('./features/dashboard/index'));
const UserPanel = lazy(() => import('./features/dashboard/user-panel'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="auth">
          <Route path="" element={<Auth />} />
          <Route path="verify/:token" element={<Verify />} />
        </Route>
        <Route
          path="dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        >
          <Route path="" element={<UserPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
