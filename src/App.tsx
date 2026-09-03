import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import Home from '@/pages/Home';

const Translator = lazy(() => import('@/pages/Translator'));
const Learn = lazy(() => import('@/pages/Learn'));

function Fallback(): ReactNode {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-slate-400 text-sm animate-pulse">Loading…</div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/translate"
                element={<Suspense fallback={<Fallback />}><Translator /></Suspense>}
              />
              <Route
                path="/learn"
                element={<Suspense fallback={<Fallback />}><Learn /></Suspense>}
              />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
