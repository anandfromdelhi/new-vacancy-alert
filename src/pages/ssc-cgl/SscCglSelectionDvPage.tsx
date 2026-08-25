import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  BookOpen, Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, UserCheck, CheckSquare, MapPin, Building2, Download, AlertTriangle, Check
} from 'lucide-react';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';
import CommentsSection from '../../components/CommentsSection';
import ArticleStickyBottomBar from '../../components/ArticleStickyBottomBar';

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
    { doc: "10th Standard Matriculation Certificate & Marksheet", purpose: "Conclusive legal proof of Date of Birth, Candidate Name, and Father/Mother Name spelling.", format: "Original + 2 Self-Attested Sets", status: "Mandatory" },
    { doc: "12th Standard / Higher Secondary Certificate", purpose: "Proof of basic academic foundation and essential Maths/Stats verification for JSO candidates.", format: "Original + 2 Self-Attested Sets", status: "Mandatory" },
    { doc: "Graduation Degree Certificate / Provisional Degree", purpose: "Must be issued by a recognized University on or before the crucial cut-off date.", format: "Original + 2 Self-Attested Sets", status: "Mandatory" },
    { doc: "All Semester / Year-Wise Marksheets", purpose: "Complete chronological proof of having passed all subjects without backlog across all academic years.", format: "Original + 2 Sets", status: "Mandatory" },
    { doc: "OBC-NCL Certificate in Central Govt Prescribed Format", purpose: "Must be issued by authorized Tehsildar/SDM within 3 financial years prior to the crucial application deadline.", format: "Central Format Only", status: "Category Specific" },
    { doc: "EWS Income & Asset Certificate", purpose: "Must be valid for the current recruitment financial year based on gross family income of the preceding financial year.", format: "Annexure Format", status: "Category Specific" },
    { doc: "SC / ST Caste Certificate", purpose: "Permanent Central Government format certificate from authorized revenue authority.", format: "Central Format", status: "Category Specific" },
    { doc: "No Objection Certificate (NOC) for Govt Servants", purpose: "Mandatory NOC from the present appointing authority for candidates currently serving in Central/State Govt/PSU.", format: "Signed by Competent Authority", status: "Govt Employees" },
    { doc: "Ex-Servicemen Discharge Book & Undertaking", purpose: "Armed Forces service book showing duration of military tenure and date of discharge.", format: "Original Service Book", status: "Ex-Servicemen" },
    { doc: "PwBD Disability Certificate", purpose: "Form V/VI/VII certificate from an authorized Medical Board specifying disability percentage (min 40%).", format: "Medical Board Format", status: "PwBD" },
    { doc: "Name Change Gazette Notification / Marriage Certificate", purpose: "Mandatory for candidates whose name differs between 10th Certificate and Graduation Degree.", format: "Gazette Copy / Affidavit", status: "If Applicable" },
    { doc: "Original Valid Photo ID + 6 Recent Passport Photos", purpose: "Aadhaar Card / Voter ID / Passport / Driving License with matching Date of Birth.", format: "Original ID + Photos", status: "Mandatory" }
  ];

  const regionalWebsites = [
    { region: "Northern Region (NR)", hq: "New Delhi", states: "Delhi, Rajasthan, Uttarakhand", url: "sscnr.nic.in" },
    { region: "Central Region (CR)", hq: "Prayagraj", states: "Uttar Pradesh, Bihar", url: "ssc-cr.org" },
    { region: "Eastern Region (ER)", hq: "Kolkata", states: "West Bengal, Odisha, Jharkhand, A&N Islands, Sikkim", url: "sscer.org" },
    { region: "Western Region (WR)", hq: "Mumbai", states: "Maharashtra, Gujarat, Goa, Daman & Diu, Dadra & Nagar Haveli", url: "sscwr.net" },
    { region: "Southern Region (SR)", hq: "Chennai", states: "Andhra Pradesh, Telangana, Tamil Nadu, Puducherry", url: "sscsr.gov.in" },
    { region: "North Western Region (NWR)", hq: "Chandigarh", states: "Punjab, Haryana, Himachal Pradesh, J&K, Ladakh, Chandigarh", url: "sscnwr.org" },
    { region: "MP Sub-Region (MPR)", hq: "Raipur", states: "Madhya Pradesh, Chhattisgarh", url: "sscmpr.org" },
    { region: "KKR Region (KKR)", hq: "Bengaluru", states: "Karnataka, Kerala, Lakshadweep", url: "ssckkr.kar.nic.in" },
    { region: "North Eastern Region (NER)", hq: "Guwahati", states: "Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura", url: "sscner.org.in" }
  ];

  const faqs = [
    {
      q: "Does SSC conduct Document Verification (DV) now?",
      a: "No! SSC no longer conducts Document Verification. Under the revised recruitment procedure, Document Verification is conducted directly by the User Department (e.g. Income Tax Dept, Central Excise, CAG, MEA, MoD) after final merit allocation is declared by SSC."
    },
    {
      q: "What if my OBC-NCL certificate is issued after the crucial closing date?",
      a: "SSC rules specify that OBC-NCL certificates must be issued within 3 years prior to the crucial application deadline. However, user departments generally accept certificates issued within the valid financial year or accept provisional joining subject to an affidavit."
    },
    {
      q: "What is the sliding mechanism in SSC CGL merit allocation?",
      a: "The sliding mechanism (incorporating FIX and FLOAT options) allows candidates who were tentatively allocated a lower preference to automatically slide up to their higher preferred post if vacancies open up from higher-ranked candidates declining offers or failing DV."
    },
    {
      q: "What should I carry to the SSC CGL examination hall?",
      a: "You MUST carry: (1) Printed SSC CGL Admit Card, (2) Two recent passport-size photographs, and (3) At least one original valid Photo ID (Aadhaar, Voter ID, Passport, Driving License) having the exact same Date of Birth as printed on the admit card."
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
              Chapter 7 of 7
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              20 Min Read
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

        {/* Section 1: 6-Stage Selection Lifecycle */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><Layers className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">1. The Complete 6-Stage SSC CGL Selection Roadmap</h2>
              <p className="text-xs text-slate-500 font-medium">From online registration on ssc.gov.in to final joining appointment</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {[
              { stage: "Stage 1", title: "Online Registration (OTR) & Application", desc: "Candidates create One-Time Registration on ssc.gov.in with live webcam photograph capture, signature upload, and pay the ₹100 fee (exempted for Women/SC/ST/PwBD/ESM)." },
              { stage: "Stage 2", title: "Tier-I CBT Examination (Screening)", desc: "100 Questions, 200 Marks in 60 minutes across 4 subjects. Strictly qualifying in nature to shortlist approximately 10 to 12 times the vacancy volume for Tier-II." },
              { stage: "Stage 3", title: "Tier-II CBT Examination & DEST Typing", desc: "Session-I (130 Questions, 390 Marks for composite merit + 60-mark Computer Module) + Session-II (2,000 keystroke DEST typing test in 15 minutes) conducted on the exact same day." },
              { stage: "Stage 4", title: "Option-cum-Preference Submission", desc: "After Tier-II evaluation, SSC opens an online portal where candidates submit their prioritized post and department choices (e.g. B01, B05, B03, A01) across all participating ministries." },
              { stage: "Stage 5", title: "Final Merit List & Department Allocation", desc: "SSC compiles the 390-mark merit list, verifies computer/DEST qualifying cutoffs, and publishes the final result allocating candidates to specific user ministries based on rank and preference." },
              { stage: "Stage 6", title: "Departmental Document Verification (DV) & Joining", desc: "The allocated Ministry (CBDT, CBIC, C&AG, MEA, etc.) conducts physical verification of original degrees, caste certificates, and medical tests, and issues official appointment letters." }
            ].map((st, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-black text-xs shrink-0">{st.stage}</span>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-slate-900 text-sm">{st.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Document Verification Master Checklist */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"><CheckSquare className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">2. Master Departmental Document Verification (DV) Checklist</h2>
              <p className="text-xs text-slate-500 font-medium">Keep both original documents and 2 complete sets of self-attested photocopies ready</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Document Name</th>
                  <th className="p-3.5">Purpose & Critical Verification Criteria</th>
                  <th className="p-3.5">Required Format</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {dvChecklist.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{d.doc}</td>
                    <td className="p-3.5 text-xs text-slate-600">{d.purpose}</td>
                    <td className="p-3.5 text-xs font-semibold text-slate-700">{d.format}</td>
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

        {/* Section 3: Regional SSC Portals Directory */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold"><Building2 className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">3. Official SSC Regional Websites & Jurisdictions</h2>
              <p className="text-xs text-slate-500 font-medium">Download Admit Cards and City Intimation Slips from your respective regional portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {regionalWebsites.map((r, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-xs">{r.region}</span>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{r.hq}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{r.states}</p>
                <div className="text-[11px] font-mono text-slate-700 font-semibold pt-1">{r.url}</div>
              </div>
            ))}
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
        <div id="comments-section">
          <CommentsSection pageId="ssc-cgl-admit-card-selection-dv-checklist" pageTitle="SSC CGL Selection & DV Checklist Discussion" />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <ArticleStickyBottomBar 
        title="SSC CGL Admit Card, Selection Stages & DV Checklist"
        description="Comprehensive guide to SSC CGL regional admit cards, examination stages from Tier-I to joining, departmental Document Verification (DV) checklist."
      />
    </div>
  );
}
