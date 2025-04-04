import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import AuthGuard from './guards/auth';
import ExamHistory from './features/exam/exam-history';

const Home = lazy(() => import('./features/home'));
const NotFound = lazy(() => import('./features/not-found'));
const Auth = lazy(() => import('./features/auth'));
const SignIn = lazy(() => import('./features/auth/sign-in'));
const Verify = lazy(() => import('./features/auth/verify'));
const Dashboard = lazy(() => import('./features/dashboard/index'));
const Panel = lazy(() => import('./features/dashboard/panel'));
const Account = lazy(() => import('./features/dashboard/account'));
const Set = lazy(() => import('./features/dashboard/set'));
const Exam = lazy(() => import('./features/exam'));
const ExamSession = lazy(() => import('./features/exam/exam-session'));

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
          <Route path="" element={<Panel />} />
          <Route path="account" element={<Account />} />
          <Route path="set/:setId" element={<Set />} />
        </Route>
        <Route path="exam" element={<Exam />}>
          <Route path=":connectionCode" element={<ExamSession />} />
          <Route path="history/:examId" element={<ExamHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
