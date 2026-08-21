import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import * as ReactHelmetAsync from 'react-helmet-async';
const { HelmetProvider } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

const container = document.getElementById('root')!;

const appNode = (
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);

if (container.hasChildNodes() && container.innerHTML.trim().length > 0) {
  try {
    hydrateRoot(container, appNode, {
      onRecoverableError(error) {
        console.warn('React recoverable hydration warning:', error);
      }
    });
  } catch (err) {
    console.warn('Hydration failed, falling back to client-side createRoot:', err);
    createRoot(container).render(appNode);
  }
} else {
  createRoot(container).render(appNode);
}

