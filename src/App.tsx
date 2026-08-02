/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import MainLayout from './pages/MainLayout';
import Analytics from './components/Analytics';

const HomePage = lazy(() => import('./pages/HomePage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const NorcetCutoffArticle = lazy(() => import('./pages/NorcetCutoffArticle'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const SscCalendarArticle = lazy(() => import('./pages/SscCalendarArticle'));
const RrbCalendarArticle = lazy(() => import('./pages/RrbCalendarArticle'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const SalaryCalculatorArticle = lazy(() => import('./pages/SalaryCalculatorArticle'));
const MarketingPartnerPage = lazy(() => import('./pages/marketing/MarketingPartnerPage'));
const MarketingDashboardPage = lazy(() => import('./pages/marketing/MarketingDashboardPage'));
const MarketingTermsPage = lazy(() => import('./pages/marketing/MarketingTermsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const RssFeedPage = lazy(() => import('./pages/RssFeedPage'));
const ArchivesPage = lazy(() => import('./pages/ArchivesPage'));

// A lightweight loading spinner fallback
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <NavigationProvider>
            <Analytics />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="index.html" element={<Navigate to="/" replace />} />
                  <Route path="archives" element={<ArchivesPage />} />
                  <Route path="articles" element={<ArticlesPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="rss-feed" element={<RssFeedPage />} />
                  <Route path="admin" element={<AdminPage />} />

                  <Route path="salary-calculator" element={<SalaryCalculatorArticle />} />
                  <Route path="govt-job-salary-calculator" element={<Navigate to="/salary-calculator" replace />} />
                  <Route path="marketing-partner" element={<MarketingPartnerPage />} />
                  <Route path="marketing-partner/dashboard" element={<MarketingDashboardPage />} />
                  <Route path="marketing-partner/terms" element={<MarketingTermsPage />} />
                  <Route path="ssc-exam-calendar" element={<SscCalendarArticle />} />
                  <Route path="ssc-exam-calendar-2026-27" element={<Navigate to="/ssc-exam-calendar" replace />} />
                  <Route path="rrb-exam-calendar-2026-27" element={<RrbCalendarArticle />} />
                  <Route path="aiims-norcet-11-nursing-officer-2026/cutoff" element={<NorcetCutoffArticle />} />
                  <Route path="aiims-norcet-11-cutoff-marks" element={<Navigate to="/aiims-norcet-11-nursing-officer-2026/cutoff" replace />} />
                  <Route path=":id" element={<JobDetailPage />} />
                </Route>
              </Routes>
            </Suspense>
          </NavigationProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}


