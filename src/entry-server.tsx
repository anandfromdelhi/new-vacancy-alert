import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, Routes, Route, Navigate } from 'react-router';
import * as ReactHelmetAsync from 'react-helmet-async';
const { HelmetProvider } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './pages/MainLayout';

// Direct synchronous imports for SSR to avoid Suspense fallbacks during renderToString
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import NorcetCutoffArticle from './pages/NorcetCutoffArticle';
import ArticlesPage from './pages/ArticlesPage';
import SscCalendarArticle from './pages/SscCalendarArticle';
import RrbCalendarArticle from './pages/RrbCalendarArticle';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SalaryCalculatorArticle from './pages/SalaryCalculatorArticle';
import MarketingPartnerPage from './pages/marketing/MarketingPartnerPage';
import MarketingDashboardPage from './pages/marketing/MarketingDashboardPage';
import MarketingTermsPage from './pages/marketing/MarketingTermsPage';
import RssFeedPage from './pages/RssFeedPage';
import ArchivesPage from './pages/ArchivesPage';
import QualificationJobsPage from './pages/QualificationJobsPage';
import StateJobsPage from './pages/StateJobsPage';
import BoardJobsPage from './pages/BoardJobsPage';

// Notification Section Sub-pages
import PostsAndVacancies from './pages/notification-sections/PostsAndVacancies';
import ImportantDates from './pages/notification-sections/ImportantDates';
import ImportantInstructions from './pages/notification-sections/ImportantInstructions';
import GeneralInstructions from './pages/notification-sections/GeneralInstructions';
import VacancyDetails from './pages/notification-sections/VacancyDetails';
import MedicalStandards from './pages/notification-sections/MedicalStandards';
import NationalityCitizenship from './pages/notification-sections/NationalityCitizenship';
import AgeLimit from './pages/notification-sections/AgeLimit';
import AgeRelaxation from './pages/notification-sections/AgeRelaxation';
import EducationalQualification from './pages/notification-sections/EducationalQualification';
import ApplicationFee from './pages/notification-sections/ApplicationFee';
import Reservation from './pages/notification-sections/Reservation';
import ExServiceman from './pages/notification-sections/ExServiceman';
import Pwbd from './pages/notification-sections/Pwbd';
import ScribeFacility from './pages/notification-sections/ScribeFacility';
import RecruitmentProcess from './pages/notification-sections/RecruitmentProcess';
import CbtDetails from './pages/notification-sections/CbtDetails';
import DocumentVerification from './pages/notification-sections/DocumentVerification';
import HowToApply from './pages/notification-sections/HowToApply';
import CreateAccount from './pages/notification-sections/CreateAccount';
import ApplicationGuidelines from './pages/notification-sections/ApplicationGuidelines';
import LivePhotoInstructions from './pages/notification-sections/LivePhotoInstructions';
import DocumentsRequired from './pages/notification-sections/DocumentsRequired';
import ApplicationCorrection from './pages/notification-sections/ApplicationCorrection';
import InvalidApplications from './pages/notification-sections/InvalidApplications';
import ECallLetter from './pages/notification-sections/ECallLetter';
import OriginalDocumentVerification from './pages/notification-sections/OriginalDocumentVerification';
import UnfairMeansAndDebarment from './pages/notification-sections/UnfairMeansAndDebarment';
import RrbWebsites from './pages/notification-sections/RrbWebsites';
import PostParameters from './pages/notification-sections/PostParameters';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jobsIndexData from './data/jobs-index-generated.json';
import { jobDetailsData } from './data/jobDetails.js';
import ZoneWiseVacancy from './pages/notification-sections/ZoneWiseVacancy';
import MergedPostCategories from './pages/notification-sections/MergedPostCategories';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function render(url: string) {
  const helmetContext: any = {};

  const cleanRoute = url.replace(/^\/+|\/+$/g, '');
  const rawId = cleanRoute.toLowerCase();
  const indexKeys = Object.keys(jobsIndexData);

  let matchedKey = indexKeys.find(k => k === url || k.toLowerCase() === rawId);
  if (!matchedKey && rawId) {
    matchedKey = indexKeys.find(k => {
      const kLower = k.toLowerCase();
      return kLower.includes(rawId) || rawId.includes(kLower);
    });
  }
  if (!matchedKey && rawId) {
    const tokens = rawId.split(/[-_\s]+/).filter(t => t.length > 3);
    if (tokens.length > 0) {
      matchedKey = indexKeys.find(k => {
        const kLower = k.toLowerCase();
        return tokens.every(token => kLower.includes(token));
      });
    }
  }

  if (matchedKey && (jobDetailsData as Record<string, any>)[matchedKey]) {
    (globalThis as any).__SSR_JOB_DATA__ = (jobDetailsData as Record<string, any>)[matchedKey];
  }

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <AuthProvider>
            <StaticRouter location={url}>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="index.html" element={<HomePage />} />
                  <Route path="archives" element={<ArchivesPage />} />
                  <Route path="jobs-for/:qualification" element={<QualificationJobsPage />} />
                  <Route path="state/:stateSlug" element={<StateJobsPage />} />
                  <Route path="board/:boardSlug" element={<BoardJobsPage />} />
                  <Route path="articles" element={<ArticlesPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="rss-feed" element={<RssFeedPage />} />

                  <Route path="salary-calculator" element={<SalaryCalculatorArticle />} />
                  <Route path="govt-job-salary-calculator" element={<SalaryCalculatorArticle />} />
                  <Route path="marketing-partner" element={<MarketingPartnerPage />} />
                  <Route path="marketing-partner/dashboard" element={<MarketingDashboardPage />} />
                  <Route path="marketing-partner/terms" element={<MarketingTermsPage />} />
                  <Route path="ssc-exam-calendar" element={<SscCalendarArticle />} />
                  <Route path="ssc-exam-calendar-2026-27" element={<SscCalendarArticle />} />
                  <Route path="rrb-exam-calendar-2026-27" element={<RrbCalendarArticle />} />
                  <Route path="aiims-norcet-11-nursing-officer-2026/cutoff" element={<NorcetCutoffArticle />} />
                  <Route path="aiims-norcet-11-cutoff-marks" element={<NorcetCutoffArticle />} />

                  {/* RRB Technician Notification Detailed Sub-Pages */}
                  <Route path="rrb-technician-cen-02-2026/posts-and-vacancies" element={<PostsAndVacancies />} />
                  <Route path="rrb-technician-cen-02-2026/important-dates" element={<ImportantDates />} />
                  <Route path="rrb-technician-cen-02-2026/important-instructions" element={<ImportantInstructions />} />
                  <Route path="rrb-technician-cen-02-2026/general-instructions" element={<GeneralInstructions />} />
                  <Route path="rrb-technician-cen-02-2026/vacancy-details" element={<VacancyDetails />} />
                  <Route path="rrb-technician-cen-02-2026/medical-standards" element={<MedicalStandards />} />
                  <Route path="rrb-technician-cen-02-2026/nationality-citizenship" element={<NationalityCitizenship />} />
                  <Route path="rrb-technician-cen-02-2026/age-limit" element={<AgeLimit />} />
                  <Route path="rrb-technician-cen-02-2026/age-relaxation" element={<AgeRelaxation />} />
                  <Route path="rrb-technician-cen-02-2026/educational-qualification" element={<EducationalQualification />} />
                  <Route path="rrb-technician-cen-02-2026/application-fee" element={<ApplicationFee />} />
                  <Route path="rrb-technician-cen-02-2026/reservation" element={<Reservation />} />
                  <Route path="rrb-technician-cen-02-2026/ex-serviceman" element={<ExServiceman />} />
                  <Route path="rrb-technician-cen-02-2026/pwbd" element={<Pwbd />} />
                  <Route path="rrb-technician-cen-02-2026/scribe-facility" element={<ScribeFacility />} />
                  <Route path="rrb-technician-cen-02-2026/recruitment-process" element={<RecruitmentProcess />} />
                  <Route path="rrb-technician-cen-02-2026/cbt-details" element={<CbtDetails />} />
                  <Route path="rrb-technician-cen-02-2026/document-verification" element={<DocumentVerification />} />
                  <Route path="rrb-technician-cen-02-2026/how-to-apply" element={<HowToApply />} />
                  <Route path="rrb-technician-cen-02-2026/create-account" element={<CreateAccount />} />
                  <Route path="rrb-technician-cen-02-2026/application-guidelines" element={<ApplicationGuidelines />} />
                  <Route path="rrb-technician-cen-02-2026/live-photo-instructions" element={<LivePhotoInstructions />} />
                  <Route path="rrb-technician-cen-02-2026/documents-required" element={<DocumentsRequired />} />
                  <Route path="rrb-technician-cen-02-2026/application-correction" element={<ApplicationCorrection />} />
                  <Route path="rrb-technician-cen-02-2026/invalid-applications" element={<InvalidApplications />} />
                  <Route path="rrb-technician-cen-02-2026/e-call-letter" element={<ECallLetter />} />
                  <Route path="rrb-technician-cen-02-2026/original-document-verification" element={<OriginalDocumentVerification />} />
                  <Route path="rrb-technician-cen-02-2026/unfair-means-and-debarment" element={<UnfairMeansAndDebarment />} />
                  <Route path="rrb-technician-cen-02-2026/rrb-websites" element={<RrbWebsites />} />
                  <Route path="rrb-technician-cen-02-2026/post-parameters" element={<PostParameters />} />
                  <Route path="rrb-technician-cen-02-2026/zone-wise-vacancy" element={<ZoneWiseVacancy />} />
                  <Route path="rrb-technician-cen-02-2026/merged-post-categories" element={<MergedPostCategories />} />

                  {/* Single Segment ID Route for Job Detail Pages */}
                  <Route path=":id" element={<JobDetailPage />} />

                  {/* Catch-all Wildcard Route */}
                  <Route path="*" element={<JobDetailPage />} />
                </Route>
              </Routes>
            </StaticRouter>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );

  delete (globalThis as any).__SSR_JOB_DATA__;

  return {
    html,
    helmet: helmetContext.helmet
  };
}
