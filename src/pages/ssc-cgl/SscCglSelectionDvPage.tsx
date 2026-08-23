import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  BookOpen, Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, UserCheck, CheckSquare, MapPin, Building2, Download
} from 'lucide-react';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';
import CommentsSection from '../../components/CommentsSection';

export default function SscCglSelectionDvPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SSC CGL Admit Card, Selection Stages & Document Verification (DV) Master Checklist",
    "description": "Comprehensive guide to SSC CGL regional admit cards, examination stages from Tier-I to joining, departmental Document Verification (DV) checklist, and OBC/EWS crucial date validity.",
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  const dvChecklist = [
    { doc: "10th Standard Matriculation Certificate", purpose: "Official proof of Date of Birth and Candidate/Parent's name spelling.", status: "Mandatory" },
    { doc: "Graduation Degree Certificate / Provisional", purpose: "Must be issued on or before the crucial cut-off date specified in notification.", status: "Mandatory" },
    { doc: "All Semester / Year-Wise Marksheets", purpose: "Complete proof of having passed all subjects in the Bachelor Degree.", status: "Mandatory" },
    { doc: "OBC-NCL Certificate in Central Govt Format", purpose: "Must be issued within 3 financial years prior to the crucial application deadline.", status: "Category Specific" },
    { doc: "EWS Income & Asset Certificate", purpose: "Must be valid for the current financial year based on income of previous financial year.", status: "Category Specific" },
    { doc: "SC / ST Caste Certificate", purpose: "Official Central Government format certificate from authorized Tehsildar/SDM.", status: "Category Specific" },
    { doc: "NOC for Central/State Govt Employees", purpose: "Mandatory No Objection Certificate from present appointing authority.", status: "Govt Employees" },
    { doc: "Original Photo ID Proof + 4 Passport Photos", purpose: "Aadhaar Card / Voter ID / Passport with matching Date of Birth.", status: "Mandatory" }
  ];

  const faqs = [
    {
      q: "Does SSC conduct Document Verification (DV) now?",
      a: "No! SSC no longer conducts Document Verification. Under the revised recruitment process, Document Verification is conducted directly by the User Department (e.g. Income Tax Dept, Customs, CAG, MEA, MoD) after the final result and department allocation are published by SSC."
    },
    {
      q: "What if my OBC-NCL certificate is issued after the closing date of application?",
      a: "SSC notifications state that the OBC-NCL certificate should be in the prescribed Central format and issued on or before the crucial closing date. However, user departments generally accept certificates issued within the valid financial year or allow provisional acceptance with an affidavit."
    },
    {
      q: "What documents are required to enter the SSC CGL exam hall?",
      a: "You MUST carry: (1) Printed SSC CGL Admit Card, (2) Two recent color passport-size photographs, and (3) At least one original valid Photo ID (Aadhaar, Voter ID, Driving License, Passport) having the exact same Date of Birth as printed on the admit card."
    },
    {
      q: "What is the timeline from Tier-I exam to final joining?",
      a: "Typically, the entire recruitment cycle takes between 8 to 12 months: Tier-I -> (60 days) Tier-II -> (30 days) Post Preference Form -> (30 days) Final Result -> (60–90 days) Departmental DV & Medical -> Joining Letter."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>SSC CGL Admit Card, Selection Process & Document Verification (DV) Checklist</title>
        <meta name="description" content="Complete guide to SSC CGL admit card release, examination stages from Tier-I to joining, departmental Document Verification (DV) checklist, and crucial certificate validity rules." />
        <link rel="canonical" href="https://newvacancyalert.in/ssc-cgl-admit-card-selection-dv-checklist" />
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
            <span className="text-slate-400 truncate">Chapter 7: Selection & DV Checklist</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> DV Verified
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
              Chapter 7 of 7
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              14 Min Read
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Master Checklist Included
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            SSC CGL Admit Card, Selection Stages & Document Verification Master Checklist
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Everything candidates must know regarding city intimation slips, regional admit card portals, the step-by-step journey from Tier-I to department appointment, and the comprehensive Document Verification (DV) dossier.
          </p>

          {/* Nav */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-bold">
            <Link to="/ssc-cgl-preparation-strategy-study-plan-books-mocks" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Prev: 12-Month Plan
            </Link>
            <Link to="/ssc-cgl-master-guide" className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Master Hub Overview
            </Link>
          </div>
        </header>

        {/* Section 1: Step-by-Step Selection Journey Roadmap */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><Layers className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">1. The 6-Stage SSC CGL Selection Journey</h2>
              <p className="text-xs text-slate-500 font-medium">From online application to final joining letter</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { stage: "Stage 1", title: "Online Application & OTR", desc: "One-Time Registration on ssc.gov.in with live webcam photograph capture and fee payment." },
              { stage: "Stage 2", title: "Tier-I Computer Based Examination", desc: "100 Questions, 200 Marks. Strictly qualifying screening test to filter candidates for Tier-II." },
              { stage: "Stage 3", title: "Tier-II Examination & DEST Typing", desc: "The definitive 390-mark merit examination + Computer Module + DEST typing test on the same day." },
              { stage: "Stage 4", title: "Option-cum-Preference Submission", desc: "Candidates submit online post preferences across all 34+ departments on the SSC portal." },
              { stage: "Stage 5", title: "Final Result & Merit Allocation", desc: "SSC computes composite merit and publishes roll numbers with allocated posts/departments." },
              { stage: "Stage 6", title: "Departmental DV, Medical & Joining", desc: "Allocated Ministry/Department conducts final certificate verification, medical check, and issues appointment." }
            ].map((st, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs shrink-0">{st.stage}</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{st.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Document Verification Master Checklist Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"><CheckSquare className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">2. Master Document Verification (DV) Checklist</h2>
              <p className="text-xs text-slate-500 font-medium">Keep both original and 2 sets of self-attested photocopies ready</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Document Name</th>
                  <th className="p-3.5">Purpose & Key Requirement</th>
                  <th className="p-3.5 text-right">Requirement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {dvChecklist.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{d.doc}</td>
                    <td className="p-3.5 text-xs text-slate-600">{d.purpose}</td>
                    <td className="p-3.5 text-right font-black text-xs">
                      <span className={`px-2.5 py-0.5 rounded-md ${
                        d.status === 'Mandatory' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* Hub Return Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Guide Complete</span>
            <h4 className="text-lg sm:text-xl font-black">Explore the Full SSC CGL Master Guide Hub</h4>
          </div>
          <Link
            to="/ssc-cgl-master-guide"
            className="px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <span>Return to Master Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <MarketingPartnerBanner />
        <CommentsSection />
      </div>
    </div>
  );
}
