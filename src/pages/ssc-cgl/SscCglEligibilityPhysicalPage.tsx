import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  BookOpen, Clock, Dumbbell, Eye, Scale, HelpCircle, Layers, Sparkles,
  ChevronDown, ChevronUp, UserCheck, HeartPulse, Check, AlertTriangle, FileText
} from 'lucide-react';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';
import CommentsSection from '../../components/CommentsSection';
import ArticleStickyBottomBar from '../../components/ArticleStickyBottomBar';

export default function SscCglEligibilityPhysicalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SSC CGL Eligibility Criteria, Age Limits & Physical Standards (PST/PET) for Inspector & SI Posts",
    "description": "Exhaustive guidelines on SSC CGL education qualification, crucial cut-off dates, category-wise age relaxation, and gender-wise Physical Measurement & Endurance Standards (PST/PET).",
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  const ageRelaxations = [
    { cat: "SC / ST Candidates", relax: "5 Years", maxAge27: "32 Years", maxAge30: "35 Years", maxAge32: "37 Years" },
    { cat: "OBC-NCL (Non-Creamy Layer)", relax: "3 Years", maxAge27: "30 Years", maxAge30: "33 Years", maxAge32: "35 Years" },
    { cat: "PwBD (Unreserved / General)", relax: "10 Years", maxAge27: "37 Years", maxAge30: "40 Years", maxAge32: "42 Years" },
    { cat: "PwBD (OBC-NCL)", relax: "13 Years", maxAge27: "40 Years", maxAge30: "43 Years", maxAge32: "45 Years" },
    { cat: "PwBD (SC / ST)", relax: "15 Years", maxAge27: "42 Years", maxAge30: "45 Years", maxAge32: "47 Years" },
    { cat: "Ex-Servicemen (ESM)", relax: "3 Years after deduction of military service from actual age", maxAge27: "Service + 3 Yrs", maxAge30: "Service + 3 Yrs", maxAge32: "Service + 3 Yrs" },
    { cat: "Defence Personnel Disabled in Action", relax: "3 Years (General/OBC) / 8 Years (SC/ST)", maxAge27: "30 / 35 Yrs", maxAge30: "33 / 38 Yrs", maxAge32: "35 / 40 Yrs" },
    { cat: "Central Govt Civilian Employees (3+ Yrs Service)", relax: "Up to 40 Years of Age (45 Years for SC/ST)", maxAge27: "40 / 45 Yrs", maxAge30: "40 / 45 Yrs", maxAge32: "40 / 45 Yrs" }
  ];

  const faqs = [
    {
      q: "Can final year graduation students apply for SSC CGL?",
      a: "Yes, candidates appearing in their final year can apply, PROVIDED they acquire the essential educational qualification (i.e. their final degree result is declared) on or before the crucial cut-off date specified in the official notification (usually 1st August of the recruitment year)."
    },
    {
      q: "Which SSC CGL posts require Physical Standards (PST) and Endurance Tests (PET)?",
      a: "Physical tests are mandatory for: Inspector Central Excise, Preventive Officer, Examiner in CBIC, Sub-Inspector in CBI, Sub-Inspector in NIA, Sub-Inspector in Narcotics Control Bureau (NCB), and all posts under Border Roads Organisation (BRO). Desk posts like ASO (CSS, MEA, AFHQ), Auditors, and Tax Assistants do NOT require physical endurance tests."
    },
    {
      q: "What happens if a candidate fails the Physical Test (PST/PET)?",
      a: "If a candidate is selected for a post requiring physical standards (e.g. Central Excise Inspector) but fails the Physical/Medical test during departmental verification, they are NOT considered for any other post in that cycle. Therefore, candidates must verify their height, chest, and vision before submitting post preferences!"
    },
    {
      q: "Are color-blind candidates eligible for Inspector posts in CBIC?",
      a: "No. Inspector (Central Excise), Preventive Officer, and Examiner posts under CBIC strictly disqualify candidates with color blindness due to customs port inspection and substance testing requirements. Color-blind candidates can safely opt for ASO in CSS/MEA, Income Tax Inspector, Auditors, and Tax Assistants."
    },
    {
      q: "What is the crucial date for age calculation in SSC CGL?",
      a: "SSC calculates age as of 1st August of the exam year (if the notification is released in the middle/latter half of the year) or 1st January (if released early). Candidates must be within the specified birth date brackets mentioned in the official advertisement."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>SSC CGL Eligibility Criteria, Age Limits & Physical Standards (PST/PET) Guide</title>
        <meta name="description" content="Complete guide to SSC CGL educational eligibility, crucial cut-off dates, category age relaxations, and male/female Physical Measurement and Endurance Standards (PST/PET)." />
        <link rel="canonical" href="https://newvacancyalert.in/ssc-cgl-eligibility-physical-standards-pst-pet" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Top Breadcrumb */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 text-xs font-medium border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link to="/articles" className="hover:text-white transition">Articles</Link>
            <span>/</span>
            <Link to="/ssc-cgl-master-guide" className="text-blue-400 hover:underline font-bold">SSC CGL Master Guide</Link>
            <span>/</span>
            <span className="text-slate-400 truncate">Chapter 3: Eligibility & Physical Standards</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Standards
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
              Chapter 3 of 7
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              18 Min Read
            </span>
            <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-purple-600" /> Physical & Medical Rules Included
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            SSC CGL Eligibility Criteria, Age Limits & Physical Standards (PST/PET)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            An encyclopedic guide covering educational qualifications, crucial degree cut-off rules, post-wise age windows (18-27, 20-30, 18-32), category relaxations, and mandatory male/female Physical Measurement and Endurance Standards (PST/PET) for Inspector and Sub-Inspector posts.
          </p>

          {/* Quick Nav */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-bold">
            <Link to="/ssc-cgl-posts-salary-pay-scale-hierarchy" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Prev: Posts & Salary
            </Link>
            <Link to="/ssc-cgl-master-guide" className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Master Hub
            </Link>
            <Link to="/ssc-cgl-exam-pattern-syllabus-dest-typing" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              Next: Pattern & Syllabus <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Section 1: Educational Qualifications */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><UserCheck className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">1. Educational Qualifications by Post</h2>
              <p className="text-xs text-slate-500 font-medium">General Graduate requirement vs Specialized Posts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">All General Posts (90%+)</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Any Bachelor Degree</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Graduation in any discipline (BA, B.Sc, B.Com, B.Tech, BBA, BCA, MBBS, LLB) from a recognized University. No minimum percentage requirement!</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">Junior Statistical Officer</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Graduation + Maths / Stats</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Bachelor Degree with min 60% Marks in Mathematics at 12th Standard OR Bachelor Degree in any subject with Statistics as a subject in all 3 years.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">Assistant Audit Officer</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Bachelor Degree (Desirable CA/MBA)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Essential: Any Bachelor Degree. Desirable: CA / CMA / CS / M.Com / MBA (Finance) / Masters in Business Economics.</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl text-xs sm:text-sm text-blue-950 space-y-1">
            <strong className="font-extrabold flex items-center gap-1.5 text-blue-900">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" /> The Crucial Date Rule:
            </strong>
            <p className="leading-relaxed">
              Candidates who have appeared in their final semester degree examinations must have their result declared on or before the crucial date specified in the notification (e.g. 1st August). Mere completion of exams without result declaration prior to the crucial date leads to disqualification during Departmental Document Verification.
            </p>
          </div>
        </section>

        {/* Section 2: Age Limits & Relaxations Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold"><Scale className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">2. Category-Wise Age Relaxation Master Matrix</h2>
              <p className="text-xs text-slate-500 font-medium">Upper age ceilings across all 3 SSC CGL post age categories</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Prescribed Relaxation</th>
                  <th className="p-3.5 text-center">Max Age (18–27 Posts)</th>
                  <th className="p-3.5 text-center">Max Age (20–30 Posts)</th>
                  <th className="p-3.5 text-right">Max Age (JSO: 18–32)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {ageRelaxations.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{r.cat}</td>
                    <td className="p-3.5 text-xs text-slate-600">{r.relax}</td>
                    <td className="p-3.5 text-center font-bold text-slate-800">{r.maxAge27}</td>
                    <td className="p-3.5 text-center font-bold text-blue-700">{r.maxAge30}</td>
                    <td className="p-3.5 text-right font-bold text-purple-700">{r.maxAge32}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Comprehensive Physical Standards (PST & PET) Matrix */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold"><Dumbbell className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">3. Physical Measurement & Endurance Standards (PST & PET)</h2>
              <p className="text-xs text-slate-500 font-medium">Mandatory for Central Excise Inspector, Preventive Officer, Examiner, CBI, NIA & BRO</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Male Standards */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-sm text-blue-900">Male Physical Requirements</h4>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">Male Candidates</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Height (Inspector CBIC):</strong>
                  <span>Min 157.5 cms (Relaxable by 5 cms for ST/NE)</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Chest (Inspector CBIC):</strong>
                  <span>81 cms (Fully expanded with min 5 cm expansion)</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Walking Test (CBIC):</strong>
                  <span>1,600 metres in 15 minutes</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Cycling Test (CBIC):</strong>
                  <span>8 Kms in 30 minutes</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Height (SI in CBI):</strong>
                  <span>Min 165 cms (Chest: 76 cms with expansion)</span>
                </li>
                <li className="flex justify-between pb-1">
                  <strong>Height (SI in NIA):</strong>
                  <span>Min 170 cms (Chest: 76 cms with 5 cm expansion)</span>
                </li>
              </ul>
            </div>

            {/* Female Standards */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-sm text-purple-900">Female Physical Requirements</h4>
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-md">Female Candidates</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Height (Inspector CBIC):</strong>
                  <span>Min 152 cms (Relaxable by 2.5 cms for ST/NE)</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Weight (Inspector CBIC):</strong>
                  <span>Min 48 Kgs (Relaxable by 2 Kgs for ST/NE)</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Walking Test (CBIC):</strong>
                  <span>1 Km in 20 minutes</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Cycling Test (CBIC):</strong>
                  <span>3 Kms in 25 minutes</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <strong>Height (SI in CBI):</strong>
                  <span>Min 150 cms (Relaxable for Hillmen/Tribals)</span>
                </li>
                <li className="flex justify-between pb-1">
                  <strong>Height (SI in NIA):</strong>
                  <span>Min 150 cms (Relaxable for Tribals)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Vision & Color Blindness Alert */}
          <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-xl text-xs sm:text-sm text-rose-950 space-y-1.5">
            <strong className="font-extrabold flex items-center gap-1.5 text-rose-900">
              <Eye className="w-4 h-4 text-rose-600 shrink-0" /> Vision Standards & Color Blindness Disqualification Rule:
            </strong>
            <p className="leading-relaxed">
              Eye Vision standards for SI in CBI/NIA require distant vision of 6/6 in one eye and 6/9 in the other eye with or without glasses, with near vision of 0.6 in one eye and 0.8 in the other eye. <strong>Color blindness is an absolute disqualification</strong> for Inspector (Central Excise), Preventive Officer, Examiner, and BRO posts.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-black text-slate-900">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-sm text-slate-900 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 text-xs sm:text-sm text-slate-700 bg-white border-t border-slate-200 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Navigation Deck */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Continue Reading Guide</span>
            <h4 className="text-lg sm:text-xl font-black">Chapter 4: New Exam Pattern, Detailed Syllabus & DEST Typing Benchmark</h4>
          </div>
          <Link
            to="/ssc-cgl-exam-pattern-syllabus-dest-typing"
            className="px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <span>Read Chapter 4</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <MarketingPartnerBanner />
        <div id="comments-section">
          <CommentsSection pageId="ssc-cgl-eligibility-physical-standards-pst-pet" pageTitle="SSC CGL Eligibility & Physical Standards Discussion" />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <ArticleStickyBottomBar 
        title="SSC CGL Eligibility Criteria, Age Limits & Physical Standards (PST/PET)"
        description="Exhaustive guidelines on SSC CGL education qualification, crucial cut-off dates, and Physical Measurement & Endurance Standards."
      />
    </div>
  );
}
