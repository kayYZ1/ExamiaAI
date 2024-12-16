import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

const Home = lazy(() => import('./features/home'));
const NotFound = lazy(() => import('./features/not-found'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
