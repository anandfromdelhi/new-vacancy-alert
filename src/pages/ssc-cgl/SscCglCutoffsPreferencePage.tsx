import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  Trophy, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  BookOpen, Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Scale, Compass, TrendingUp, MapPin, Building2, Briefcase, Award, Check
} from 'lucide-react';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';
import CommentsSection from '../../components/CommentsSection';

export default function SscCglCutoffsPreferencePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SSC CGL Cut-Off Trends & Post Preference Ranking Guide (Home State vs Promotion vs Salary)",
    "description": "Strategic post preference guide for SSC CGL: Practical rankings across ASO CSS, MEA, Income Tax Inspector, Excise, and AAO with historical cut-off analysis.",
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  const preferenceRanking = [
    { rank: 1, code: "B01", post: "ASO in Central Secretariat Service (CSS)", priority: "100% Delhi Posting & Fast Promotions", ceiling: "Under Secretary / Joint Secretary", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 2, code: "B05", post: "Inspector of Income Tax (CBDT)", priority: "Highest Social Prestige, Raids & Field, Home State Allotment", ceiling: "Joint Commissioner (IRS level)", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 3, code: "B03", post: "ASO in Ministry of External Affairs (MEA)", priority: "Foreign Postings, Hard Currency Foreign Allowance (₹2L-₹4L/mo)", ceiling: "First Secretary / Ambassadorial postings", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 4, code: "B09", post: "Assistant Enforcement Officer (AEO in ED)", priority: "High Power, PMLA / FEMA Investigations, Financial Crimes", ceiling: "Joint Director (ED)", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 5, code: "B06", post: "Inspector (Central Excise / GST in CBIC)", priority: "High Vacancy Volume, Enforcement, Uniform, Industrial Belts", ceiling: "Assistant Commissioner (Customs & GST)", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 6, code: "B10", post: "Sub-Inspector in CBI", priority: "Premier Investigative Agency, 20% Extra Special Security Pay", ceiling: "Superintendent of Police (SP in CBI)", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 7, code: "A01", post: "Assistant Audit Officer (AAO in C&AG)", priority: "Highest Starting Entry Pay (Level 8), Group 'B' Gazetted Rank", ceiling: "Senior Audit Officer / Director (Audit)", level: "Level 8 (₹47.6k-₹1.51L)" },
    { rank: 8, code: "B04", post: "ASO in Armed Forces HQ (AFHQ / MoD)", priority: "Delhi Armed Forces Complex, High Stability, Defence Perks", ceiling: "Director (Armed Forces HQ Service)", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 9, code: "B08", post: "Examiner (Customs Appraising in CBIC)", priority: "Assessment of Import/Export Cargo at Major Ports, Fast Promotion", ceiling: "Assistant Commissioner (Customs)", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 10, code: "B07", post: "Preventive Officer (Customs in CBIC)", priority: "Uniformed Port/Airport Surveillance, Anti-Smuggling, White Uniform", ceiling: "Assistant Commissioner (Customs)", level: "Level 7 (₹44.9k-₹1.42L)" },
    { rank: 11, code: "B13", post: "Divisional Accountant (under C&AG)", priority: "Complete Office Autonomy in State PWD, Home District Chance", ceiling: "Senior Divisional Accounts Officer", level: "Level 6 (₹35.4k-₹1.12L)" },
    { rank: 12, code: "B11", post: "Sub-Inspector in NIA (National Investigation Agency)", priority: "Counter-Terrorism Operations, Central MHA Investigation", ceiling: "Superintendent of Police (NIA)", level: "Level 6 (₹35.4k-₹1.12L)" },
    { rank: 13, code: "C01", post: "Auditor in C&AG / CGDA / CGA", priority: "Low Daily Work Stress, Fixed Hours, Ideal for UPSC/State PSC Prep", ceiling: "Senior Audit Officer / Accounts Officer", level: "Level 5 (₹29.2k-₹92.3k)" },
    { rank: 14, code: "C05", post: "Tax Assistant (CBDT - Direct Taxes)", priority: "Gateway to Direct Taxes, High Home State Chance, Fast TA to ITI", ceiling: "Income Tax Officer (ITO)", level: "Level 4 (₹25.5k-₹81.1k)" },
    { rank: 15, code: "C06", post: "Tax Assistant (CBIC - Indirect Taxes)", priority: "Central GST & Customs Administration, Regular Desk Timing", ceiling: "Superintendent of GST", level: "Level 4 (₹25.5k-₹81.1k)" }
  ];

  const faqs = [
    {
      q: "Can I change my post preferences after submitting the SSC CGL Option Form?",
      a: "No! Once the Option-cum-Preference form is submitted and confirmed on the official SSC portal after Tier-II, NO modification is permitted under any circumstances. You are allocated strictly based on your merit rank and the serial order of preferences submitted."
    },
    {
      q: "Why do North Indian candidates prefer ASO in CSS over Central Excise Inspector?",
      a: "ASO in CSS guarantees a permanent lifetime posting in New Delhi (Central Ministries) with fixed 9-to-5 office hours, no transfer stress, and institutional promotions to Under Secretary. Central Excise Inspectors often face initial postings in Southern or Western coastal zones (Chennai, Bengaluru, Mumbai, Kochi) where inter-charge transfer (ICT) to North India is heavily restricted."
    },
    {
      q: "Is Assistant Audit Officer (AAO) mandatory to have a Commerce degree?",
      a: "No. Any graduate in Arts, Science, Commerce, or Engineering can apply for AAO. However, after joining, you must clear the Subordinate Audit/Accounts Service (SAS) departmental examination within your 2-year probation period to confirm your appointment."
    },
    {
      q: "How does SSC normalise marks in Tier-I?",
      a: "SSC uses a standard deviation-based multi-shift normalisation formula that equalises the difficulty levels across different exam shifts, ensuring candidates appearing in tougher shifts are fairly adjusted."
    },
    {
      q: "What is the sliding mechanism in SSC CGL merit allocation?",
      a: "The sliding mechanism automatically upgrades candidates from a lower preference to a higher preferred post if higher-ranked candidates decline an offer or fail document verification, preventing seat wastage."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>SSC CGL Post Preference & Career Ranking Guide | Home State vs Salary vs Promotion</title>
        <meta name="description" content="Master post preference guide for SSC CGL: How to choose between ASO CSS, MEA, Income Tax, GST Inspector, and AAO based on home state, salary, and career growth." />
        <link rel="canonical" href="https://newvacancyalert.in/ssc-cgl-cutoffs-post-preference-ranking-guide" />
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
            <span className="text-slate-400 truncate">Chapter 5: Cut-Offs & Post Preference</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Strategic Ranking
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
              Chapter 5 of 7
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              18 Min Read
            </span>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-600" /> Post Selection Matrix
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            SSC CGL Cut-Off Trends & Practical Post Preference Ranking Guide
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            How to strategically balance starting pay levels, institutional promotion ceilings, home cadre posting security, and field versus desk work when submitting your official SSC option-cum-preference form.
          </p>

          {/* Nav */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-bold">
            <Link to="/ssc-cgl-exam-pattern-syllabus-dest-typing" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Prev: Pattern & Syllabus
            </Link>
            <Link to="/ssc-cgl-master-guide" className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Master Hub
            </Link>
            <Link to="/ssc-cgl-preparation-strategy-study-plan-books-mocks" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              Next: 12-Month Prep Plan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Section 1: The 4 Strategic Decision Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">Pillar 1</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Location Stability</h4>
            <p className="text-xs text-slate-600 leading-relaxed">ASO CSS & AFHQ guarantee 100% Delhi tenure. CBIC Central Excise & CBI involve pan-India or coastal transfers.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">Pillar 2</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Promotion Ceilings</h4>
            <p className="text-xs text-slate-600 leading-relaxed">ASO CSS & Income Tax Inspector offer fast institutional promotions to Under Secretary / Joint Commissioner.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">Pillar 3</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Work-Life Balance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Auditors, Divisional Accountants, and Tax Assistants provide relaxed hours ideal for UPSC/State PCS study.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">Pillar 4</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Authority & Perks</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Central Excise, CBI, and ED offer enforcement power, raids, uniforms, and specialized security allowances.</p>
          </div>
        </section>

        {/* Section 2: Comprehensive Top 15 Post Preference Matrix */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><Trophy className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Master Top 15 Post Preference Hierarchy Table</h2>
              <p className="text-xs text-slate-500 font-medium">Ranked by career ceiling, location stability, social prestige, and candidate demand</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5 text-center">Rank</th>
                  <th className="p-3.5">Post & Organization</th>
                  <th className="p-3.5">Key Advantage & Priority</th>
                  <th className="p-3.5">Promotion Ceiling</th>
                  <th className="p-3.5 text-right">Pay Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {preferenceRanking.map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 text-center font-black text-blue-700 text-sm">#{row.rank}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">{row.post}</span>
                      <span className="block text-[11px] text-slate-500 font-semibold">{row.code}</span>
                    </td>
                    <td className="p-3.5 text-xs text-slate-600">{row.priority}</td>
                    <td className="p-3.5 text-xs text-slate-700 font-semibold">{row.ceiling}</td>
                    <td className="p-3.5 text-right font-black text-slate-900">{row.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Deep Comparison - Desk vs Field vs Location */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold"><Scale className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">3. In-Depth Comparative Analysis: Top 5 Cadres</h2>
              <p className="text-xs text-slate-500 font-medium">Evaluating trade-offs between initial salary, location lock-in, and transfer rules</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> ASO in CSS (DoPT) vs MEA vs Income Tax Inspector
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>ASO in CSS:</strong> Highest stability. 100% postings in South Block, North Block, and Shastri Bhawan in New Delhi. Fixed 9 AM to 5:30 PM timings, 5-day work week, excellent government quarters in Central Delhi, and institutional promotions to Under Secretary.<br />
                <strong>ASO in MEA:</strong> Candidates undergo 2-3 years in Delhi before mandatory rotational 3-year foreign postings. Offers foreign allowances in USD/Euros, free international housing, and diplomatic passports.<br />
                <strong>Inspector of Income Tax (CBDT):</strong> Direct taxation enforcement with search, seizure, assessment, and investigation powers. Highest social respect among all non-uniform posts with strong home state allocation chances.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> The Central Excise Inspector Transfer Risk
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Central Excise (GST) offers maximum vacancy numbers each cycle. However, since the ban on Inter-Charge Transfers (ICT), candidates allocated to Southern Zones (Chennai, Hyderabad, Kochi, Bengaluru) or Western Zones (Mumbai, Vadodara) cannot easily transfer back to Northern home states (Delhi, UP, Rajasthan, Haryana). Factor in geographic preference before placing CBIC above desk cadres!
              </p>
            </div>
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
            <h4 className="text-lg sm:text-xl font-black">Chapter 6: 12-Month Preparation Roadmap, Daily Timetable & Booklist</h4>
          </div>
          <Link
            to="/ssc-cgl-preparation-strategy-study-plan-books-mocks"
            className="px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <span>Read Chapter 6</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <MarketingPartnerBanner />
        <CommentsSection pageId="ssc-cgl-cutoffs-post-preference-ranking-guide" pageTitle="SSC CGL Cutoffs & Post Preference Discussion" />
      </div>
    </div>
  );
}
