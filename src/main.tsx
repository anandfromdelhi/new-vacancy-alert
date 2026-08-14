import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import * as ReactHelmetAsync from 'react-helmet-async';
const { HelmetProvider } = ReactHelmetAsync;
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);

