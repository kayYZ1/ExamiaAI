import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

const Home = lazy(() => import('./features/home'));
const NotFound = lazy(() => import('./features/not-found'));
const Auth = lazy(() => import('./features/auth'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={<Home />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
        <Route
          path="auth"
          element={<Auth />}
        />
      </Routes>
    </BrowserRouter>
  );
}
