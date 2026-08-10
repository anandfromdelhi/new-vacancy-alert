import fs from 'fs';
import path from 'path';

const pages = [
  { url: 'posts-and-vacancies', component: 'PostsAndVacancies', title: 'Posts and Vacancies' },
  { url: 'important-dates', component: 'ImportantDates', title: 'Important Dates' },
  { url: 'important-instructions', component: 'ImportantInstructions', title: 'Important Instructions' },
  { url: 'general-instructions', component: 'GeneralInstructions', title: 'General Instructions' },
  { url: 'vacancy-details', component: 'VacancyDetails', title: 'Vacancy Details' },
  { url: 'medical-standards', component: 'MedicalStandards', title: 'Medical Standards' },
  { url: 'nationality-citizenship', component: 'NationalityCitizenship', title: 'Nationality / Citizenship' },
  { url: 'age-limit', component: 'AgeLimit', title: 'Age Limit' },
  { url: 'age-relaxation', component: 'AgeRelaxation', title: 'Age Relaxation' },
  { url: 'educational-qualification', component: 'EducationalQualification', title: 'Educational Qualification' },
  { url: 'application-fee', component: 'ApplicationFee', title: 'Application Fee' },
  { url: 'reservation', component: 'Reservation', title: 'Reservation' },
  { url: 'ex-serviceman', component: 'ExServiceman', title: 'Ex-Serviceman' },
  { url: 'pwbd', component: 'Pwbd', title: 'Persons with Benchmark Disabilities (PwBD)' },
  { url: 'scribe-facility', component: 'ScribeFacility', title: 'Scribe Facility' },
  { url: 'recruitment-process', component: 'RecruitmentProcess', title: 'Recruitment Process' },
  { url: 'cbt-details', component: 'CbtDetails', title: 'CBT Details' },
  { url: 'document-verification', component: 'DocumentVerification', title: 'Document Verification' },
  { url: 'how-to-apply', component: 'HowToApply', title: 'How to Apply' },
  { url: 'create-account', component: 'CreateAccount', title: 'Create an Account' },
  { url: 'application-guidelines', component: 'ApplicationGuidelines', title: 'Application Guidelines' },
  { url: 'live-photo-instructions', component: 'LivePhotoInstructions', title: 'Live Photo Instructions' },
  { url: 'documents-required', component: 'DocumentsRequired', title: 'Documents Required' },
  { url: 'application-correction', component: 'ApplicationCorrection', title: 'Modification of Application' },
  { url: 'invalid-applications', component: 'InvalidApplications', title: 'Invalid Applications / Rejections' },
  { url: 'e-call-letter', component: 'ECallLetter', title: 'E-Call Letter' },
  { url: 'original-document-verification', component: 'OriginalDocumentVerification', title: 'Original Document Verification' },
  { url: 'unfair-means-and-debarment', component: 'UnfairMeansAndDebarment', title: 'Unfair Practices & Debarment' },
  { url: 'rrb-websites', component: 'RrbWebsites', title: 'Official RRB Websites' },
  { url: 'post-parameters', component: 'PostParameters', title: 'Annexure A: Post Parameters' },
  { url: 'zone-wise-vacancy', component: 'ZoneWiseVacancy', title: 'Annexure B: Zone Wise Vacancy' },
  { url: 'merged-post-categories', component: 'MergedPostCategories', title: 'Annexure C: Merged Post Categories' }
];

const dir = path.join(process.cwd(), 'src', 'pages', 'notification-sections');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

pages.forEach(p => {
  const content = `import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';

export default function ${p.component}() {
  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen pb-12">
      <Helmet>
        <title>${p.title} | RRB Technician CEN 02/2026</title>
        <meta name="description" content="Detailed information about ${p.title} for RRB Technician Recruitment 2026." />
      </Helmet>
      
      <div className="w-full max-w-[1000px] mx-auto p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/rrb-technician-cen-02-2026" className="inline-flex items-center text-sm font-semibold text-blue-700 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Notification Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-blue-800 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-8xl">🚆</span>
            </div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">${p.title}</h1>
              <p className="text-blue-200 text-sm font-medium">RRB Technician CEN 02/2026 Official Notification</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Introduction */}
            <div className="prose max-w-none text-slate-700">
              <p>This section provides comprehensive details regarding ${p.title} as outlined in the official RRB Technician CEN 02/2026 notification.</p>
              
              <MarketingPartnerBanner className="my-6" />

              {/* Note to AI: Replace this section with detailed PDF content */}
              <div className="mt-8 p-6 bg-slate-100 rounded-lg border border-slate-200 text-center">
                <p className="text-slate-500 font-medium">Detailed content for this section is being populated from the official PDF...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  
  const filePath = path.join(dir, p.component + '.tsx');
  fs.writeFileSync(filePath, content);
});

let imports = '';
let routes = '';

pages.forEach(p => {
  imports += 'import ' + p.component + ' from "./pages/notification-sections/' + p.component + '";\n';
  routes += '            <Route path="rrb-technician-cen-02-2026/' + p.url + '" element={<' + p.component + ' />} />\n';
});

fs.writeFileSync(path.join(process.cwd(), 'output.txt'), imports + '\n\nROUTES:\n' + routes);
