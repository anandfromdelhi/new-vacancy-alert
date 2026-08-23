import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  Trophy, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  BookOpen, Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Scale, Compass, TrendingUp, MapPin, Building2, Briefcase
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
    { rank: 1, post: "ASO in Central Secretariat Service (CSS)", priority: "Delhi Posting & Fast Promotions", ceiling: "Under Secretary / Joint Secretary", level: "Level 7" },
    { rank: 2, post: "Inspector of Income Tax (CBDT)", priority: "Social Respect, Desk+Field, Home State Chance", ceiling: "Joint Commissioner (IRS equivalent)", level: "Level 7" },
    { rank: 3, post: "ASO in Ministry of External Affairs (MEA)", priority: "Foreign Postings, Hard Currency Allowances", ceiling: "First Secretary / Ambassadorial postings", level: "Level 7" },
    { rank: 4, post: "Assistant Enforcement Officer (AEO in ED)", priority: "High Authority, Financial Crimes, PMLA", ceiling: "Joint Director (ED)", level: "Level 7" },
    { rank: 5, post: "Inspector (Central Excise / GST in CBIC)", priority: "High Vacancy Volume, Enforcement, Uniform", ceiling: "Assistant Commissioner", level: "Level 7" },
    { rank: 6, post: "Sub-Inspector in CBI", priority: "Premier Investigative Agency, 20% Extra Pay", ceiling: "Superintendent of Police (SP)", level: "Level 7" },
    { rank: 7, post: "Assistant Audit Officer (AAO in C&AG)", priority: "Highest Initial Pay (Level 8), Gazetted Rank", ceiling: "Senior Audit Officer / Director", level: "Level 8" },
    { rank: 8, post: "Divisional Accountant (under C&AG)", priority: "Complete Office Autonomy, Home State posting", ceiling: "Senior Divisional Accounts Officer", level: "Level 6" },
    { rank: 9, post: "Auditor in C&AG / CGA / CGDA", priority: "Low Work Stress, Time for UPSC preparation", ceiling: "Senior Auditor / Audit Officer", level: "Level 5" },
    { rank: 10, post: "Tax Assistant (CBDT / CBIC)", priority: "Gateway to Revenue, Faster TA to ITI promotion", ceiling: "Income Tax Officer (ITO)", level: "Level 4" }
  ];

  const faqs = [
    {
      q: "Can I change my post preferences after submitting the SSC CGL Option Form?",
      a: "No! Once the Option-cum-Preference form is finally submitted on the official SSC portal after Tier-II, NO changes are permitted under any circumstances. You are allocated strictly based on your merit rank and the order of preferences submitted."
    },
    {
      q: "Why do many North Indian candidates prefer ASO in CSS over Central Excise Inspector?",
      a: "ASO in CSS guarantees a permanent posting in New Delhi (Central Ministries) with fixed office hours, no field transfers, and institutional promotions. Central Excise Inspectors often face initial postings in South or Western Coastal zones (Chennai, Bengaluru, Mumbai, Kochi) where inter-charge transfers to North India are severely restricted."
    },
    {
      q: "Is Assistant Audit Officer (AAO) mandatory to have a Commerce degree?",
      a: "No. Any graduate can apply for AAO. However, after selection, you must clear the Subordinate Audit/Accounts Service (SAS) examination within your 2-year probation period."
    },
    {
      q: "How does SSC normalise marks in Tier-I?",
      a: "SSC uses a standard deviation-based multi-shift normalisation formula that equalises the difficulty levels across different exam shifts, ensuring candidates in tougher shifts are fairly adjusted."
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
              15 Min Read
            </span>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-600" /> Post Selection Matrix
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            SSC CGL Cut-Off Trends & Practical Post Preference Ranking Guide
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            How to strategically balance starting pay levels, institutional promotion ceilings, home cadre posting security, and field versus desk work when filling your official SSC option-cum-preference form.
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

        {/* Section 1: The 4 Decision Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">Pillar 1</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Location Security</h4>
            <p className="text-xs text-slate-600 leading-relaxed">ASO CSS guarantees 100% Delhi tenure. Inspector CBIC/CBI involves nationwide or coastal postings.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">Pillar 2</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Promotion Speed</h4>
            <p className="text-xs text-slate-600 leading-relaxed">ASO CSS & Income Tax have structured career paths to Under Secretary and Joint Commissioner.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">Pillar 3</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Work-Life Balance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Auditors, Divisional Accountants, and TA offer relaxed work hours ideal for higher exam prep.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">Pillar 4</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Authority & Uniform</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Central Excise, Preventive Officer, and CBI provide active field power, raids, and uniform perks.</p>
          </div>
        </section>

        {/* Section 2: Recommended Practical Ranking Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><Trophy className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Practical Top 10 SSC CGL Post Preference Order</h2>
              <p className="text-xs text-slate-500 font-medium">Ranked by career ceiling, location stability, and candidate demand</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5 text-center">Rank</th>
                  <th className="p-3.5">Post & Organization</th>
                  <th className="p-3.5">Key Advantage & Priority</th>
                  <th className="p-3.5">Career Ceiling / Promotion</th>
                  <th className="p-3.5 text-right">Pay Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {preferenceRanking.map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 text-center font-black text-blue-700 text-sm">#{row.rank}</td>
                    <td className="p-3.5 font-bold text-slate-900">{row.post}</td>
                    <td className="p-3.5 text-xs text-slate-600">{row.priority}</td>
                    <td className="p-3.5 text-xs text-slate-700 font-semibold">{row.ceiling}</td>
                    <td className="p-3.5 text-right font-black text-slate-900">{row.level}</td>
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
        <CommentsSection />
      </div>
    </div>
  );
}
