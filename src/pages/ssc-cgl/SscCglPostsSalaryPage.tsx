import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  Building2, DollarSign, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft,
  BookOpen, Clock, BarChart3, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Briefcase, Award, TrendingUp, Users, MapPin, Calculator, FileCheck, Check
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
      level: "Pay Level 8 (GP ₹4,800)",
      basic: "₹47,600",
      group: "Group 'B' Gazetted (Non-Ministerial)",
      posts: "Assistant Audit Officer (AAO) & Assistant Accounts Officer (AAO) in C&AG of India",
      da: "₹25,228 (53%)",
      hraX: "₹14,280 (30%)",
      hraY: "₹9,520 (20%)",
      hraZ: "₹4,760 (10%)",
      tpta: "₹5,508 (X) / ₹2,754 (Y/Z)",
      grossX: "₹92,616",
      inHandX: "₹88,500 – ₹96,000",
      inHandY: "₹79,000 – ₹86,000",
      inHandZ: "₹73,000 – ₹79,500"
    },
    {
      level: "Pay Level 7 (GP ₹4,600)",
      basic: "₹44,900",
      group: "Group 'B' Non-Gazetted",
      posts: "Inspector (Income Tax - CBDT), Inspector (Central Excise / GST - CBIC), Preventive Officer, Examiner, ASO (CSS, MEA, AFHQ, IB, MHA), Asst Enforcement Officer (ED), Sub-Inspector (CBI)",
      da: "₹23,797 (53%)",
      hraX: "₹13,470 (30%)",
      hraY: "₹8,980 (20%)",
      hraZ: "₹4,490 (10%)",
      tpta: "₹5,508 (X) / ₹2,754 (Y/Z)",
      grossX: "₹87,675",
      inHandX: "₹82,000 – ₹89,500",
      inHandY: "₹73,500 – ₹80,000",
      inHandZ: "₹68,000 – ₹74,000"
    },
    {
      level: "Pay Level 6 (GP ₹4,200)",
      basic: "₹35,400",
      group: "Group 'B' Non-Gazetted",
      posts: "Junior Statistical Officer (JSO - MoSPI), Statistical Investigator Gr. II, Divisional Accountant (under C&AG), Sub-Inspector (NIA), Executive Assistant (CBIC), Assistant / Section Officer (Other Ministries)",
      da: "₹18,762 (53%)",
      hraX: "₹10,620 (30%)",
      hraY: "₹7,080 (20%)",
      hraZ: "₹3,540 (10%)",
      tpta: "₹5,508 (X) / ₹2,754 (Y/Z)",
      grossX: "₹70,290",
      inHandX: "₹64,000 – ₹71,000",
      inHandY: "₹57,500 – ₹63,500",
      inHandZ: "₹53,000 – ₹58,500"
    },
    {
      level: "Pay Level 5 (GP ₹2,800)",
      basic: "₹29,200",
      group: "Group 'C'",
      posts: "Auditor (Offices under C&AG, CGDA, CGA), Accountant / Junior Accountant (Offices under C&AG, CGA, Other Ministries)",
      da: "₹15,476 (53%)",
      hraX: "₹8,760 (30%)",
      hraY: "₹5,840 (20%)",
      hraZ: "₹2,920 (10%)",
      tpta: "₹2,754 (X) / ₹1,377 (Y/Z)",
      grossX: "₹56,190",
      inHandX: "₹53,000 – ₹59,000",
      inHandY: "₹47,500 – ₹52,500",
      inHandZ: "₹44,000 – ₹48,500"
    },
    {
      level: "Pay Level 4 (GP ₹2,400)",
      basic: "₹25,500",
      group: "Group 'C'",
      posts: "Tax Assistant (CBDT - Direct Taxes & CBIC - Indirect Taxes), Upper Division Clerk (UDC) / Senior Administrative Assistant (Central Govt Ministries & Departments)",
      da: "₹13,515 (53%)",
      hraX: "₹7,650 (30%)",
      hraY: "₹5,100 (20%)",
      hraZ: "₹2,550 (10%)",
      tpta: "₹2,754 (X) / ₹1,377 (Y/Z)",
      grossX: "₹49,419",
      inHandX: "₹46,000 – ₹51,500",
      inHandY: "₹41,500 – ₹46,000",
      inHandZ: "₹38,000 – ₹42,500"
    }
  ];

  const fullPostDirectory = [
    { code: "A01", name: "Assistant Audit Officer (AAO)", dept: "Indian Audit & Accounts Dept under C&AG", level: "Level 8 (₹47.6k-₹1.51L)", group: "B (Gazetted)", age: "18–30 Yrs", type: "Desk & Audit Tours" },
    { code: "A02", name: "Assistant Accounts Officer (AAO)", dept: "Indian Audit & Accounts Dept under C&AG", level: "Level 8 (₹47.6k-₹1.51L)", group: "B (Gazetted)", age: "18–30 Yrs", type: "Desk & Accounts" },
    { code: "B01", name: "Assistant Section Officer (ASO)", dept: "Central Secretariat Service (CSS / DoPT)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "20–30 Yrs", type: "100% Delhi Posting" },
    { code: "B02", name: "Assistant Section Officer (ASO)", dept: "Intelligence Bureau (MHA)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "18–30 Yrs", type: "Intelligence HQ / Desk" },
    { code: "B03", name: "Assistant Section Officer (ASO)", dept: "Ministry of External Affairs (MEA)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "20–30 Yrs", type: "Delhi + Foreign Missions" },
    { code: "B04", name: "Assistant Section Officer (ASO)", dept: "Armed Forces HQ (AFHQ / MoD)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "20–30 Yrs", type: "Armed Forces HQ Delhi" },
    { code: "B05", name: "Inspector of Income Tax (ITI)", dept: "Central Board of Direct Taxes (CBDT)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "18–30 Yrs", type: "Assessments, Raids & Field" },
    { code: "B06", name: "Inspector Central Excise / GST", dept: "Central Board of Indirect Taxes (CBIC)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "18–30 Yrs", type: "Uniform, GST, Range Offices" },
    { code: "B07", name: "Preventive Officer (Customs)", dept: "Central Board of Indirect Taxes (CBIC)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "18–30 Yrs", type: "Uniform, Ports & Airports" },
    { code: "B08", name: "Examiner (Customs Appraising)", dept: "Central Board of Indirect Taxes (CBIC)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "18–30 Yrs", type: "Cargo Assessment & Docks" },
    { code: "B09", name: "Assistant Enforcement Officer (AEO)", dept: "Directorate of Enforcement (ED / MoF)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "18–30 Yrs", type: "PMLA, FEMA & Raids" },
    { code: "B10", name: "Sub-Inspector (SI in CBI)", dept: "Central Bureau of Investigation (CBI)", level: "Level 7 (₹44.9k-₹1.42L)", group: "B (Non-Gazetted)", age: "20–30 Yrs", type: "Investigation (+20% Allowance)" },
    { code: "B11", name: "Sub-Inspector (SI in NIA)", dept: "National Investigation Agency (MHA)", level: "Level 6 (₹35.4k-₹1.12L)", group: "B (Non-Gazetted)", age: "Up to 30 Yrs", type: "Counter-Terrorism & Field" },
    { code: "B12", name: "Junior Statistical Officer (JSO)", dept: "Ministry of Statistics & PI (MoSPI)", level: "Level 6 (₹35.4k-₹1.12L)", group: "B (Non-Gazetted)", age: "Up to 32 Yrs", type: "NSSO Surveys & Field" },
    { code: "B13", name: "Divisional Accountant (DA)", dept: "Offices under C&AG (State PWDs)", level: "Level 6 (₹35.4k-₹1.12L)", group: "B (Non-Gazetted)", age: "18–30 Yrs", type: "High Autonomy in State PWD" },
    { code: "C01", name: "Auditor (CAG)", dept: "Indian Audit & Accounts Dept under C&AG", level: "Level 5 (₹29.2k-₹92.3k)", group: "Group C", age: "18–27 Yrs", type: "State Capitals & Audit" },
    { code: "C02", name: "Auditor (CGDA)", dept: "Controller General of Defence Accounts", level: "Level 5 (₹29.2k-₹92.3k)", group: "Group C", age: "18–27 Yrs", type: "Defence Accounts & Cantonments" },
    { code: "C03", name: "Auditor (CGA)", dept: "Controller General of Accounts", level: "Level 5 (₹29.2k-₹92.3k)", group: "Group C", age: "18–27 Yrs", type: "Civil Ministries Accounts" },
    { code: "C04", name: "Accountant / Jr Accountant", dept: "Offices under CGA & Other Ministries", level: "Level 5 (₹29.2k-₹92.3k)", group: "Group C", age: "18–27 Yrs", type: "Accounts & Financial Sanctions" },
    { code: "C05", name: "Tax Assistant (CBDT)", dept: "Central Board of Direct Taxes", level: "Level 4 (₹25.5k-₹81.1k)", group: "Group C", age: "18–27 Yrs", type: "Direct Tax Processing & Typing" },
    { code: "C06", name: "Tax Assistant (CBIC)", dept: "Central Board of Indirect Taxes", level: "Level 4 (₹25.5k-₹81.1k)", group: "Group C", age: "18–27 Yrs", type: "GST/Customs Documentation" },
    { code: "C07", name: "Upper Division Clerk (UDC)", dept: "Central Govt Ministries / Dte General", level: "Level 4 (₹25.5k-₹81.1k)", group: "Group C", age: "18–27 Yrs", type: "Administration & Dispatch" }
  ];

  const faqs = [
    {
      q: "Which post in SSC CGL has the highest starting pay?",
      a: "Assistant Audit Officer (AAO) and Assistant Accounts Officer under the Comptroller and Auditor General (C&AG) of India are the highest-paying posts in SSC CGL. They belong to Pay Level 8 (Starting Basic: ₹47,600, Gross Salary: ~₹93,000+ in X cities) and are the only Group 'B' Gazetted posts recruited through SSC CGL."
    },
    {
      q: "What is the difference between X, Y, and Z cities for SSC CGL salary?",
      a: "Central Government classifies cities for House Rent Allowance (HRA) and Transport Allowance (TA): X Cities (Tier-1 like Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad) receive 30% HRA and higher TA; Y Cities (Tier-2 with population >5 lakhs) receive 20% HRA; Z Cities (Tier-3 towns/rural areas) receive 10% HRA."
    },
    {
      q: "Does CBI Sub-Inspector get extra salary allowance?",
      a: "Yes. Sub-Inspectors in the Central Bureau of Investigation (CBI) and National Investigation Agency (NIA) receive a Special Security Allowance (SSA) equal to 20% of Basic Pay + DA, plus compensation for 13 months' salary per calendar year due to demanding operational hours."
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
            <ShieldCheck className="w-3.5 h-3.5" /> 7th CPC & DA 53% Verified
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
              20 Min Read
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> DA: 53% Integrated
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            SSC CGL Posts Directory, Hierarchy & 7th Pay Salary Structure (Levels 4 to 8)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            An exhaustive encyclopedic analysis of all 34+ Central Government posts recruited through SSC CGL. Includes 7th Pay Commission pay bands, in-hand salary calculations across X, Y, and Z cities, allowances (DA 53%, HRA 30%/20%/10%, TA), and institutional promotion ladders.
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

        {/* Section 1: Complete 7th Pay Salary Master Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"><DollarSign className="w-5 h-5" /></div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">1. 7th Pay Commission Salary Master Breakdown</h2>
                <p className="text-xs text-slate-500 font-medium">Basic Pay, 53% DA, HRA, Transport Allowance & In-Hand net salary</p>
              </div>
            </div>

            {/* City Filter Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <span className="px-2 text-slate-500">City Class:</span>
              {(['X', 'Y', 'Z'] as const).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
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
                  <th className="p-3.5">Pay Level</th>
                  <th className="p-3.5">Starting Basic</th>
                  <th className="p-3.5">DA (53%)</th>
                  <th className="p-3.5">HRA ({selectedCity} City)</th>
                  <th className="p-3.5">Gross Pay</th>
                  <th className="p-3.5 bg-blue-50/50 text-blue-900 font-black text-right">
                    In-Hand Net Pay ({selectedCity})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {salaryTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{row.level}</div>
                      <div className="text-[11px] text-slate-500">{row.group}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{row.basic}</td>
                    <td className="p-3.5 text-slate-700">{row.da}</td>
                    <td className="p-3.5 text-slate-700">
                      {selectedCity === 'X' ? row.hraX : selectedCity === 'Y' ? row.hraY : row.hraZ}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{row.grossX}</td>
                    <td className="p-3.5 font-black text-blue-700 bg-blue-50/30 text-sm text-right">
                      {selectedCity === 'X' ? row.inHandX : selectedCity === 'Y' ? row.inHandY : row.inHandZ}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exact Math Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" /> Official Net In-Hand Salary Calculation Formula:
            </h4>
            <div className="font-mono bg-white p-4 rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed space-y-1">
              <div><strong>1. Gross Earnings</strong> = Basic Pay + Dearness Allowance (53% of Basic) + House Rent Allowance (30%/20%/10%) + Transport Allowance (₹3,600 or ₹1,800 + DA on TA)</div>
              <div><strong>2. Mandatory Deductions</strong> = NPS Employee Contribution (10% of [Basic + DA]) + CGHS Medical Facility (₹250 to ₹650) + CGEGIS Insurance (₹30 to ₹120) + Professional Tax (₹200)</div>
              <div className="text-blue-700 font-bold pt-1"><strong>3. Final In-Hand Bank Credit</strong> = Total Gross Earnings – Total Statutory Deductions</div>
            </div>
          </div>
        </section>

        {/* Section 2: Complete 34+ Post Directory */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><Building2 className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">2. Complete 34+ SSC CGL Post Directory by Ministry</h2>
              <p className="text-xs text-slate-500 font-medium">Designation, Department, Pay Band, Group, Age Window & Work Environment</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Post Code & Designation</th>
                  <th className="p-3.5">Participating Ministry / Cadre</th>
                  <th className="p-3.5">Pay Band & Group</th>
                  <th className="p-3.5">Age Limit</th>
                  <th className="p-3.5">Nature of Work</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {fullPostDirectory.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">{p.name}</span>
                      <span className="block text-[11px] text-blue-600 font-semibold">{p.code}</span>
                    </td>
                    <td className="p-3.5 text-xs text-slate-700">{p.dept}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">{p.level}</span>
                      <span className="block text-[11px] text-slate-500">{p.group}</span>
                    </td>
                    <td className="p-3.5 text-xs text-slate-700 font-bold">{p.age}</td>
                    <td className="p-3.5 text-xs text-slate-600">{p.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Promotion Hierarchy Trees */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">3. Career Progression & Promotion Ceilings</h2>
              <p className="text-xs text-slate-500 font-medium">How officers advance from entry-level posts to Director and Commissioner ranks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm text-blue-900">Central Secretariat (CSS)</h4>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0" /> ASO (Level 7) • Entry</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Section Officer (Level 8/10)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Under Secretary (Level 11)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Deputy Secretary (Level 12)</li>
                <li className="flex items-center gap-1.5 font-bold text-slate-900"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Director (Level 13) • Peak</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm text-emerald-900">Income Tax (CBDT)</h4>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Inspector of Income Tax (Level 7)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Income Tax Officer - ITO (Level 8)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Asst Commissioner - ACIT (Level 10)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Deputy Commissioner - DCIT (Level 11)</li>
                <li className="flex items-center gap-1.5 font-bold text-slate-900"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Joint Commissioner • Peak</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm text-purple-900">Audit Cadre (C&AG)</h4>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Asst Audit Officer - AAO (Level 8)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Audit Officer - AO (Level 9)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Sr Audit Officer - SAO (Level 10)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Dy Accountant General - DAG (Level 11)</li>
                <li className="flex items-center gap-1.5 font-bold text-slate-900"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Sr DAG / Director • Peak</li>
              </ul>
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
            <h4 className="text-lg sm:text-xl font-black">Chapter 3: Eligibility Criteria, Age Limits & Physical Standards (PST/PET)</h4>
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
        <CommentsSection pageId="ssc-cgl-posts-salary-pay-scale-hierarchy" pageTitle="SSC CGL Posts & Salary Structure Discussion" />
      </div>
    </div>
  );
}
