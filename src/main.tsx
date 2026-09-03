import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<div style="padding:2rem;color:#f87171;font-family:monospace">Root element not found</div>';
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error('Render error:', err);
    rootEl.innerHTML = `<div style="padding:2rem;color:#f87171;font-family:monospace;white-space:pre-wrap">Render error: ${String(err)}</div>`;
  }
}
