import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import AuthGuard from './guards/auth';

const Home = lazy(() => import('./features/home'));
const NotFound = lazy(() => import('./features/not-found'));
const Auth = lazy(() => import('./features/auth'));
const SignIn = lazy(() => import('./features/auth/sign-in'));
const Verify = lazy(() => import('./features/auth/verify'));
const Dashboard = lazy(() => import('./features/dashboard/index'));
const UserPanel = lazy(() => import('./features/dashboard/user-panel'));
const Account = lazy(() => import('./features/dashboard/account'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="auth"
          element={
            <AuthGuard>
              <Auth />
            </AuthGuard>
          }
        >
          <Route path="" element={<SignIn />} />
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
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
