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
const RrbNtpcBestBooksPage = lazy(() => import('./pages/RrbNtpcBestBooksPage'));
const MpesbBestBooksPage = lazy(() => import('./pages/MpesbBestBooksPage'));
const BiharBsfcBestBooksPage = lazy(() => import('./pages/BiharBsfcBestBooksPage'));
const BpscTre4BestBooksPage = lazy(() => import('./pages/BpscTre4BestBooksPage'));

// SSC CGL Master Guide Hub & 7 Child Chapter Articles
const SscCglMasterGuidePage = lazy(() => import('./pages/ssc-cgl/SscCglMasterGuidePage'));
const SscCglNotificationVacanciesPage = lazy(() => import('./pages/ssc-cgl/SscCglNotificationVacanciesPage'));
const SscCglPostsSalaryPage = lazy(() => import('./pages/ssc-cgl/SscCglPostsSalaryPage'));
const SscCglEligibilityPhysicalPage = lazy(() => import('./pages/ssc-cgl/SscCglEligibilityPhysicalPage'));
const SscCglExamPatternSyllabusPage = lazy(() => import('./pages/ssc-cgl/SscCglExamPatternSyllabusPage'));
const SscCglCutoffsPreferencePage = lazy(() => import('./pages/ssc-cgl/SscCglCutoffsPreferencePage'));
const SscCglPrepBooksMocksPage = lazy(() => import('./pages/ssc-cgl/SscCglPrepBooksMocksPage'));
const SscCglSelectionDvPage = lazy(() => import('./pages/ssc-cgl/SscCglSelectionDvPage'));

const MarketingPartnerPage = lazy(() => import('./pages/marketing/MarketingPartnerPage'));
const MarketingDashboardPage = lazy(() => import('./pages/marketing/MarketingDashboardPage'));
const MarketingTermsPage = lazy(() => import('./pages/marketing/MarketingTermsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const RssFeedPage = lazy(() => import('./pages/RssFeedPage'));
const QualificationJobsPage = lazy(() => import('./pages/QualificationJobsPage'));
const StateJobsPage = lazy(() => import('./pages/StateJobsPage'));
const BoardJobsPage = lazy(() => import('./pages/BoardJobsPage'));

// Notification Section Sub-pages for RRB Technician CEN 02/2026
const PostsAndVacancies = lazy(() => import('./pages/notification-sections/PostsAndVacancies'));
const ImportantDates = lazy(() => import('./pages/notification-sections/ImportantDates'));
const ImportantInstructions = lazy(() => import('./pages/notification-sections/ImportantInstructions'));
const GeneralInstructions = lazy(() => import('./pages/notification-sections/GeneralInstructions'));
const VacancyDetails = lazy(() => import('./pages/notification-sections/VacancyDetails'));
const MedicalStandards = lazy(() => import('./pages/notification-sections/MedicalStandards'));
const NationalityCitizenship = lazy(() => import('./pages/notification-sections/NationalityCitizenship'));
const AgeLimit = lazy(() => import('./pages/notification-sections/AgeLimit'));
const AgeRelaxation = lazy(() => import('./pages/notification-sections/AgeRelaxation'));
const EducationalQualification = lazy(() => import('./pages/notification-sections/EducationalQualification'));
const ApplicationFee = lazy(() => import('./pages/notification-sections/ApplicationFee'));
const Reservation = lazy(() => import('./pages/notification-sections/Reservation'));
const ExServiceman = lazy(() => import('./pages/notification-sections/ExServiceman'));
const Pwbd = lazy(() => import('./pages/notification-sections/Pwbd'));
const ScribeFacility = lazy(() => import('./pages/notification-sections/ScribeFacility'));
const RecruitmentProcess = lazy(() => import('./pages/notification-sections/RecruitmentProcess'));
const CbtDetails = lazy(() => import('./pages/notification-sections/CbtDetails'));
const DocumentVerification = lazy(() => import('./pages/notification-sections/DocumentVerification'));
const HowToApply = lazy(() => import('./pages/notification-sections/HowToApply'));
const CreateAccount = lazy(() => import('./pages/notification-sections/CreateAccount'));
const ApplicationGuidelines = lazy(() => import('./pages/notification-sections/ApplicationGuidelines'));
const LivePhotoInstructions = lazy(() => import('./pages/notification-sections/LivePhotoInstructions'));
const DocumentsRequired = lazy(() => import('./pages/notification-sections/DocumentsRequired'));
const ApplicationCorrection = lazy(() => import('./pages/notification-sections/ApplicationCorrection'));
const InvalidApplications = lazy(() => import('./pages/notification-sections/InvalidApplications'));
const ECallLetter = lazy(() => import('./pages/notification-sections/ECallLetter'));
const OriginalDocumentVerification = lazy(() => import('./pages/notification-sections/OriginalDocumentVerification'));
const UnfairMeansAndDebarment = lazy(() => import('./pages/notification-sections/UnfairMeansAndDebarment'));
const RrbWebsites = lazy(() => import('./pages/notification-sections/RrbWebsites'));
const PostParameters = lazy(() => import('./pages/notification-sections/PostParameters'));
const ZoneWiseVacancy = lazy(() => import('./pages/notification-sections/ZoneWiseVacancy'));
const MergedPostCategories = lazy(() => import('./pages/notification-sections/MergedPostCategories'));

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
                  <Route path="jobs-for/:qualification" element={<QualificationJobsPage />} />
                  <Route path="state/:stateSlug" element={<StateJobsPage />} />
                  <Route path="board/:boardSlug" element={<BoardJobsPage />} />
                  {/* Articles Hub & Individual Article Pages */}
                  <Route path="articles" element={<ArticlesPage />} />
                  <Route path="blog" element={<Navigate to="/articles" replace />} />
                  <Route path="blogs" element={<Navigate to="/articles" replace />} />
                  <Route path="articles/salary-calculator" element={<SalaryCalculatorArticle />} />
                  <Route path="articles/ssc-exam-calendar" element={<SscCalendarArticle />} />
                  <Route path="articles/rrb-exam-calendar-2026-27" element={<RrbCalendarArticle />} />
                  <Route path="articles/best-books-for-rrb-ntpc" element={<RrbNtpcBestBooksPage />} />
                  <Route path="articles/best-books-for-mpesb" element={<MpesbBestBooksPage />} />
                  <Route path="articles/best-books-for-bihar-bsfc" element={<BiharBsfcBestBooksPage />} />
                  <Route path="articles/best-books-for-bpsc-tre-4" element={<BpscTre4BestBooksPage />} />
                  <Route path="articles/bpsc-tre-4-best-books" element={<BpscTre4BestBooksPage />} />
                  <Route path="articles/aiims-norcet-11-nursing-officer-2026/cutoff" element={<NorcetCutoffArticle />} />
                  <Route path="articles/aiims-norcet-11-cutoff-marks" element={<NorcetCutoffArticle />} />

                  {/* SSC CGL Master Compendium Hub & 7 Child Chapter Articles */}
                  <Route path="articles/ssc-cgl-master-guide" element={<SscCglMasterGuidePage />} />
                  <Route path="articles/ssc-cgl-notification-vacancies-trend" element={<SscCglNotificationVacanciesPage />} />
                  <Route path="articles/ssc-cgl-posts-salary-pay-scale-hierarchy" element={<SscCglPostsSalaryPage />} />
                  <Route path="articles/ssc-cgl-eligibility-physical-standards-pst-pet" element={<SscCglEligibilityPhysicalPage />} />
                  <Route path="articles/ssc-cgl-exam-pattern-syllabus-dest-typing" element={<SscCglExamPatternSyllabusPage />} />
                  <Route path="articles/ssc-cgl-cutoffs-post-preference-ranking-guide" element={<SscCglCutoffsPreferencePage />} />
                  <Route path="articles/ssc-cgl-preparation-strategy-study-plan-books-mocks" element={<SscCglPrepBooksMocksPage />} />
                  <Route path="articles/ssc-cgl-admit-card-selection-dv-checklist" element={<SscCglSelectionDvPage />} />

                  {/* Backward-Compatible Redirects from Legacy Paths to /articles/... */}
                  <Route path="salary-calculator" element={<Navigate to="/articles/salary-calculator" replace />} />
                  <Route path="govt-job-salary-calculator" element={<Navigate to="/articles/salary-calculator" replace />} />
                  <Route path="ssc-exam-calendar" element={<Navigate to="/articles/ssc-exam-calendar" replace />} />
                  <Route path="ssc-exam-calendar-2026-27" element={<Navigate to="/articles/ssc-exam-calendar" replace />} />
                  <Route path="rrb-exam-calendar-2026-27" element={<Navigate to="/articles/rrb-exam-calendar-2026-27" replace />} />
                  <Route path="best-books-for-rrb-ntpc" element={<Navigate to="/articles/best-books-for-rrb-ntpc" replace />} />
                  <Route path="rrb-ntpc-best-books" element={<Navigate to="/articles/best-books-for-rrb-ntpc" replace />} />
                  <Route path="best-books-for-mpesb" element={<Navigate to="/articles/best-books-for-mpesb" replace />} />
                  <Route path="best-books-for-mpesb-group-3" element={<Navigate to="/articles/best-books-for-mpesb" replace />} />
                  <Route path="mpesb-best-books" element={<Navigate to="/articles/best-books-for-mpesb" replace />} />
                  <Route path="best-books-for-bihar-bsfc" element={<Navigate to="/articles/best-books-for-bihar-bsfc" replace />} />
                  <Route path="bihar-bsfc-best-books" element={<Navigate to="/articles/best-books-for-bihar-bsfc" replace />} />
                  <Route path="best-books-for-bsfc" element={<Navigate to="/articles/best-books-for-bihar-bsfc" replace />} />
                  <Route path="best-books-for-bpsc-tre-4" element={<Navigate to="/articles/best-books-for-bpsc-tre-4" replace />} />
                  <Route path="bpsc-tre-4-best-books" element={<Navigate to="/articles/best-books-for-bpsc-tre-4" replace />} />
                  <Route path="bpsc-tre-4-books" element={<Navigate to="/articles/best-books-for-bpsc-tre-4" replace />} />
                  <Route path="aiims-norcet-11-nursing-officer-2026/cutoff" element={<Navigate to="/articles/aiims-norcet-11-nursing-officer-2026/cutoff" replace />} />
                  <Route path="aiims-norcet-11-cutoff-marks" element={<Navigate to="/articles/aiims-norcet-11-cutoff-marks" replace />} />
                  <Route path="ssc-cgl-master-guide" element={<Navigate to="/articles/ssc-cgl-master-guide" replace />} />
                  <Route path="ssc-cgl-notification-vacancies-trend" element={<Navigate to="/articles/ssc-cgl-notification-vacancies-trend" replace />} />
                  <Route path="ssc-cgl-posts-salary-pay-scale-hierarchy" element={<Navigate to="/articles/ssc-cgl-posts-salary-pay-scale-hierarchy" replace />} />
                  <Route path="ssc-cgl-eligibility-physical-standards-pst-pet" element={<Navigate to="/articles/ssc-cgl-eligibility-physical-standards-pst-pet" replace />} />
                  <Route path="ssc-cgl-exam-pattern-syllabus-dest-typing" element={<Navigate to="/articles/ssc-cgl-exam-pattern-syllabus-dest-typing" replace />} />
                  <Route path="ssc-cgl-cutoffs-post-preference-ranking-guide" element={<Navigate to="/articles/ssc-cgl-cutoffs-post-preference-ranking-guide" replace />} />
                  <Route path="ssc-cgl-preparation-strategy-study-plan-books-mocks" element={<Navigate to="/articles/ssc-cgl-preparation-strategy-study-plan-books-mocks" replace />} />
                  <Route path="ssc-cgl-admit-card-selection-dv-checklist" element={<Navigate to="/articles/ssc-cgl-admit-card-selection-dv-checklist" replace />} />

                  <Route path="marketing-partner" element={<MarketingPartnerPage />} />
                  <Route path="marketing-partner/dashboard" element={<MarketingDashboardPage />} />
                  <Route path="marketing-partner/terms" element={<MarketingTermsPage />} />
                  <Route path="anand" element={<AdminPage />} />

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

                  {/* Catch-all Wildcard Route to prevent any blank unrendered pages */}
                  <Route path="*" element={<JobDetailPage />} />
                </Route>
              </Routes>
            </Suspense>
          </NavigationProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
