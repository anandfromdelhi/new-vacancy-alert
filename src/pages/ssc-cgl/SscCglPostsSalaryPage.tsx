import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  Building2, DollarSign, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft,
  BookOpen, Clock, BarChart3, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Briefcase, Award, TrendingUp, Users, MapPin
} from 'lucide-react';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';
import CommentsSection from '../../components/CommentsSection';

export default function SscCglPostsSalaryPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<'X' | 'Y' | 'Z'>('X');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SSC CGL Posts Directory, Hierarchy & 7th Pay Commission Salary Structure (Pay Levels 4 to 8)",
    "description": "Exhaustive guide to all 34+ SSC CGL posts across Level 8, 7, 6, 5, and 4 with 7th Pay Commission in-hand salary calculations, DA (53%), HRA, and career hierarchy.",
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  const salaryTable = [
    {
      level: "Pay Level 8",
      basic: "₹47,600",
      gradePay: "₹4,800",
      group: "Group B Gazetted",
      posts: "Assistant Audit Officer (AAO), Assistant Accounts Officer (AAO)",
      inHandX: "₹88,500 – ₹96,000",
      inHandY: "₹79,000 – ₹86,000",
      inHandZ: "₹73,000 – ₹79,500"
    },
    {
      level: "Pay Level 7",
      basic: "₹44,900",
      gradePay: "₹4,600",
      group: "Group B Non-Gazetted",
      posts: "Inspector (Income Tax, Excise, PO, Examiner), ASO (CSS, MEA, AFHQ, IB), AEO (ED), SI (CBI)",
      inHandX: "₹82,000 – ₹89,500",
      inHandY: "₹73,500 – ₹80,000",
      inHandZ: "₹68,000 – ₹74,000"
    },
    {
      level: "Pay Level 6",
      basic: "₹35,400",
      gradePay: "₹4,200",
      group: "Group B Non-Gazetted",
      posts: "Junior Statistical Officer (JSO), Statistical Investigator, Divisional Accountant (CAG), SI (NIA)",
      inHandX: "₹64,000 – ₹71,000",
      inHandY: "₹57,500 – ₹63,500",
      inHandZ: "₹53,000 – ₹58,500"
    },
    {
      level: "Pay Level 5",
      basic: "₹29,200",
      gradePay: "₹2,800",
      group: "Group C",
      posts: "Auditor (C&AG, CGA, CGDA), Accountant / Junior Accountant",
      inHandX: "₹53,000 – ₹59,000",
      inHandY: "₹47,500 – ₹52,500",
      inHandZ: "₹44,000 – ₹48,500"
    },
    {
      level: "Pay Level 4",
      basic: "₹25,500",
      gradePay: "₹2,400",
      group: "Group C",
      posts: "Tax Assistant (CBDT, CBIC), Upper Division Clerk (UDC), Senior Administrative Assistant",
      inHandX: "₹46,000 – ₹51,500",
      inHandY: "₹41,500 – ₹46,000",
      inHandZ: "₹38,000 – ₹42,500"
    }
  ];

  const faqs = [
    {
      q: "Which is the highest-paying post in SSC CGL?",
      a: "Assistant Audit Officer (AAO) and Assistant Accounts Officer under the Comptroller and Auditor General (C&AG) of India are the highest-paying posts in SSC CGL. They are in Pay Level 8 (Starting Basic: ₹47,600, Gross Salary: ~₹98,000 in X cities) and are the only Group 'B' Gazetted posts recruited through SSC CGL."
    },
    {
      q: "What is the difference between X, Y, and Z cities for SSC CGL salary?",
      a: "Central Government classifies cities for House Rent Allowance (HRA) and Transport Allowance (TA): X Cities (Tier-1 like Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad) receive 30% HRA and higher TA; Y Cities (Tier-2 with population >5 lakhs) receive 20% HRA; Z Cities (Tier-3 towns/rural areas) receive 10% HRA."
    },
    {
      q: "Does an Income Tax Inspector or GST Inspector get uniform allowance?",
      a: "Yes. CBIC Inspector posts (Central Excise, Preventive Officer, Examiner) and Sub-Inspectors in CBI/NIA receive standard uniform allowances. Income Tax Inspectors (CBDT) have a formal executive dress code rather than an enforcement uniform."
    },
    {
      q: "What is the promotion hierarchy for an ASO in Central Secretariat Service (CSS)?",
      a: "Assistant Section Officer (ASO) Level 7 -> Section Officer (SO) Level 8/10 -> Under Secretary (US) Level 11 -> Deputy Secretary (DS) Level 12 -> Director Level 13. CSS offers the fastest institutional promotion path to Under Secretary rank in Central Ministries."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>SSC CGL Posts Directory, Hierarchy & 7th Pay Commission Salary Structure</title>
        <meta name="description" content="Complete directory of all 34+ SSC CGL posts across Level 8 to Level 4 with starting basic, in-hand salary for X/Y/Z cities, DA (53%), allowances, and promotion paths." />
        <link rel="canonical" href="https://newvacancyalert.in/ssc-cgl-posts-salary-pay-scale-hierarchy" />
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
            <span className="text-slate-400 truncate">Chapter 2: Posts & Salary Matrix</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> 7th CPC Verified
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Article Header */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
              Chapter 2 of 7
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              15 Min Read
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> DA: 53% Integrated
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            SSC CGL Posts Directory, Hierarchy & 7th Pay Salary Structure (Levels 4 to 8)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            An exhaustive analysis of all 34+ Central Government posts recruited through SSC CGL, covering 7th Pay Commission pay bands, in-hand salary calculations across X, Y, and Z cities, DA allowances, and career progression ladders.
          </p>

          {/* Nav Strip */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-bold">
            <Link to="/ssc-cgl-notification-vacancies-trend" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Prev: Dates & Vacancies
            </Link>
            <Link to="/ssc-cgl-master-guide" className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Master Hub
            </Link>
            <Link to="/ssc-cgl-eligibility-physical-standards-pst-pet" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              Next: Eligibility & PST <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Pay Level Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">Pay Level 8 (Gazetted)</span>
              <span className="text-xs font-bold text-slate-500">GP ₹4,800</span>
            </div>
            <div className="text-2xl font-black text-slate-900">₹88.5k – ₹96k</div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">Assistant Audit Officer (AAO) & Accounts Officer in C&AG. Highest initial entry salary.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">Pay Level 7 (Most Popular)</span>
              <span className="text-xs font-bold text-slate-500">GP ₹4,600</span>
            </div>
            <div className="text-2xl font-black text-slate-900">₹82k – ₹89.5k</div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">Inspectors (Income Tax, GST, PO, Examiner), ASO (CSS, MEA, AFHQ, IB), SI (CBI), AEO (ED).</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">Pay Levels 4 to 6</span>
              <span className="text-xs font-bold text-slate-500">GP ₹2,400 to ₹4,200</span>
            </div>
            <div className="text-2xl font-black text-slate-900">₹46k – ₹71k</div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">JSO, Divisional Accountant, Auditors (CAG/CGA/CGDA), Tax Assistants (CBDT/CBIC), UDCs.</p>
          </div>
        </section>

        {/* Section 1: Complete 7th Pay Salary Master Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"><DollarSign className="w-5 h-5" /></div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">1. Complete 7th Pay Commission Salary Table</h2>
                <p className="text-xs text-slate-500 font-medium">Starting basic, allowances, and in-hand salary across X, Y, Z cities</p>
              </div>
            </div>

            {/* City Filter Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <span className="px-2 text-slate-500">Filter City:</span>
              {(['X', 'Y', 'Z'] as const).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedCity === city
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {city} City ({city === 'X' ? '30%' : city === 'Y' ? '20%' : '10%'} HRA)
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Pay Level & Grade Pay</th>
                  <th className="p-3.5">Starting Basic</th>
                  <th className="p-3.5">Key Posts Included</th>
                  <th className="p-3.5 bg-blue-50/50 text-blue-900 font-black">
                    Approx. In-Hand ({selectedCity} City)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {salaryTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{row.level}</div>
                      <div className="text-xs text-slate-500">{row.gradePay} • {row.group}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{row.basic}</td>
                    <td className="p-3.5 text-xs text-slate-600 max-w-xs">{row.posts}</td>
                    <td className="p-3.5 font-black text-blue-700 bg-blue-50/30 text-sm">
                      {selectedCity === 'X' ? row.inHandX : selectedCity === 'Y' ? row.inHandY : row.inHandZ}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Salary Formula Breakdown Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" /> How In-Hand Net Salary Is Calculated:
            </h4>
            <p className="font-mono bg-white p-3 rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">
              Gross Salary = Basic Pay + DA (53% of Basic) + HRA (30%/20%/10%) + Transport Allowance (₹1,350 to ₹7,200 + DA on TA)<br />
              Deductions = NPS Employee Share (10% of Basic + DA) + CGEGIS (₹30 to ₹120) + CGHS Medical (₹250 to ₹650)<br />
              <strong>Net In-Hand = Gross Salary – Total Deductions</strong>
            </p>
          </div>
        </section>

        {/* Section 2: Comprehensive 34+ Post Directory */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><Building2 className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">2. Complete 34+ SSC CGL Posts Directory by Department</h2>
              <p className="text-xs text-slate-500 font-medium">Department, Group, Age Limit, and Physical Test requirements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Central Secretariat & MEA */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-black text-sm">
                <Briefcase className="w-4 h-4" /> Central Ministries & Desk Cadres
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">ASO in CSS (DoPT)</strong>
                  <span>Level 7 • 20–30 Yrs • Delhi Posting</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">ASO in MEA (External Affairs)</strong>
                  <span>Level 7 • 20–30 Yrs • Foreign Postings</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">ASO in AFHQ (MoD)</strong>
                  <span>Level 7 • 20–30 Yrs • Armed Forces HQ</span>
                </li>
                <li className="flex justify-between pb-1">
                  <strong className="text-slate-800">ASO in IB & MHA</strong>
                  <span>Level 7 • 18–30 Yrs • Intelligence Cadre</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Revenue & Enforcement Inspectors */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                <ShieldCheck className="w-4 h-4" /> Revenue & Enforcement Inspectors
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">Inspector of Income Tax (CBDT)</strong>
                  <span>Level 7 • 18–30 Yrs • Direct Taxes</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">Inspector Central Excise / GST (CBIC)</strong>
                  <span>Level 7 • 18–30 Yrs • Physical Test</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">Preventive Officer & Examiner (CBIC)</strong>
                  <span>Level 7 • 18–30 Yrs • Ports & Customs</span>
                </li>
                <li className="flex justify-between pb-1">
                  <strong className="text-slate-800">Asst Enforcement Officer (ED)</strong>
                  <span>Level 7 • 18–30 Yrs • PMLA / FEMA</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Investigation Agencies */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-purple-800 font-black text-sm">
                <ShieldCheck className="w-4 h-4" /> Investigative & Specialized Wings
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">Sub-Inspector (CBI)</strong>
                  <span>Level 7 • 20–30 Yrs • Special Allowance +20%</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">Sub-Inspector (NIA)</strong>
                  <span>Level 6 • Up to 30 Yrs • Counter-Terrorism</span>
                </li>
                <li className="flex justify-between pb-1">
                  <strong className="text-slate-800">Junior Statistical Officer (MoSPI)</strong>
                  <span>Level 6 • Up to 32 Yrs • Stats Paper Required</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Audit & Accounts Cadres */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                <Building2 className="w-4 h-4" /> Audit, Accounts & Tax Assistant
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">Auditor (CAG, CGDA, CGA)</strong>
                  <span>Level 5 • 18–27 Yrs • Non-Interview</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong className="text-slate-800">Divisional Accountant (CAG)</strong>
                  <span>Level 6 • 18–30 Yrs • High Autonomy</span>
                </li>
                <li className="flex justify-between pb-1">
                  <strong className="text-slate-800">Tax Assistant (CBDT & CBIC)</strong>
                  <span>Level 4 • 18–27 Yrs • DEST Typing Required</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
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
            <h4 className="text-lg sm:text-xl font-black">Chapter 3: Eligibility, Age Limits & Physical Standards (PST/PET)</h4>
          </div>
          <Link
            to="/ssc-cgl-eligibility-physical-standards-pst-pet"
            className="px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <span>Read Chapter 3</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <MarketingPartnerBanner />
        <CommentsSection />
      </div>
    </div>
  );
}
