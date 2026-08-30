import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  BookOpen, Calendar, DollarSign, Dumbbell, Target, Trophy, 
  BookCheck, CheckSquare, ShieldCheck, ArrowRight, Sparkles, 
  BarChart3, ChevronRight, HelpCircle, ChevronDown, ChevronUp,
  Layers, Users, Building2, Flame, Award, Clock, Check, FileText
} from 'lucide-react';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';
import CommentsSection from '../../components/CommentsSection';
import ArticleStickyBottomBar from '../../components/ArticleStickyBottomBar';

export default function SscCglMasterGuidePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Ultimate SSC CGL Master Guide: Complete 360° Handbook & Resource Hub",
    "description": "The definitive, exhaustive compendium for SSC Combined Graduate Level (CGL) examination covering notification timelines, post directories, 7th Pay Commission salaries, physical standards, new 390-mark exam pattern, books, and preparation roadmap.",
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  const chapters = [
    {
      id: "ch1",
      slug: "/articles/ssc-cgl-notification-vacancies-trend",
      number: "Chapter 1",
      title: "Notification Dates & 5-Year Vacancy Trends (2022–2027)",
      desc: "Historical analysis of notification release patterns, 5-year vacancy trends from 36,012 to 12,256, initial vs final vacancy dynamics, and expected timelines.",
      icon: Calendar,
      badge: "Historical Data",
      readTime: "18 Min Read",
      color: "from-blue-500/10 to-blue-600/5 border-blue-200 hover:border-blue-400"
    },
    {
      id: "ch2",
      slug: "/articles/ssc-cgl-posts-salary-pay-scale-hierarchy",
      number: "Chapter 2",
      title: "Posts Directory, Hierarchy & 7th Pay Salary Structure (Levels 4 to 8)",
      desc: "All 34+ posts across Levels 8 to 4 with starting basic pay, in-hand salary calculations across X, Y, Z cities, DA (53%) integration, and promotion ladders.",
      icon: DollarSign,
      badge: "7th CPC Scales",
      readTime: "20 Min Read",
      color: "from-emerald-500/10 to-emerald-600/5 border-emerald-200 hover:border-emerald-400"
    },
    {
      id: "ch3",
      slug: "/articles/ssc-cgl-eligibility-physical-standards-pst-pet",
      number: "Chapter 3",
      title: "Eligibility Criteria, Age Limits & Physical Standards (PST/PET)",
      desc: "Educational qualifications, crucial cut-off rules, category age relaxations, and mandatory Physical Measurement & Endurance standards for Inspector and SI posts.",
      icon: Dumbbell,
      badge: "Medical & PST",
      readTime: "18 Min Read",
      color: "from-purple-500/10 to-purple-600/5 border-purple-200 hover:border-purple-400"
    },
    {
      id: "ch4",
      slug: "/articles/ssc-cgl-exam-pattern-syllabus-dest-typing",
      number: "Chapter 4",
      title: "New Exam Pattern, Detailed Syllabus & DEST Typing Benchmark",
      desc: "Architectural guide to Tier-I qualifying structure, Tier-II 390-mark composite merit scheme, Computer Module, and DEST typing test (27 WPM / 2000 keystrokes).",
      icon: Target,
      badge: "390-Mark Scheme",
      readTime: "20 Min Read",
      color: "from-amber-500/10 to-amber-600/5 border-amber-200 hover:border-amber-400"
    },
    {
      id: "ch5",
      slug: "/articles/ssc-cgl-cutoffs-post-preference-ranking-guide",
      number: "Chapter 5",
      title: "Cut-Off Trends & Practical Post Preference Career Ranking",
      desc: "How to strategically balance starting salary, institutional promotion ceiling, home state cadre stability, and desk vs field work when filling your SSC option form.",
      icon: Trophy,
      badge: "Preference Matrix",
      readTime: "18 Min Read",
      color: "from-indigo-500/10 to-indigo-600/5 border-indigo-200 hover:border-indigo-400"
    },
    {
      id: "ch6",
      slug: "/articles/ssc-cgl-preparation-strategy-study-plan-books-mocks",
      number: "Chapter 6",
      title: "12-Month Preparation Roadmap, Daily Study Timetable & Booklist",
      desc: "A battle-tested study roadmap covering 4 preparation quarters, an 8-hour daily schedule, standard subject-wise booklist, and 3-round mock test optimization.",
      icon: BookCheck,
      badge: "Study Timetable",
      readTime: "20 Min Read",
      color: "from-rose-500/10 to-rose-600/5 border-rose-200 hover:border-rose-400"
    },
    {
      id: "ch7",
      slug: "/articles/ssc-cgl-admit-card-selection-dv-checklist",
      number: "Chapter 7",
      title: "Admit Card, Selection Stages & Document Verification Master Checklist",
      desc: "Everything regarding city intimation slips, regional portal download steps, the 6-stage journey to joining, and the definitive Departmental DV dossier checklist.",
      icon: CheckSquare,
      badge: "DV Checklist",
      readTime: "20 Min Read",
      color: "from-teal-500/10 to-teal-600/5 border-teal-200 hover:border-teal-400"
    }
  ];

  const faqs = [
    {
      q: "What is the SSC CGL examination?",
      a: "The Staff Selection Commission Combined Graduate Level (SSC CGL) examination is India's premier national competitive examination conducted annually to recruit Group 'B' and Group 'C' officers into Central Government Ministries, Departments, and constitutional bodies like C&AG, CBDT, CBIC, MEA, CSS, CBI, and NIA."
    },
    {
      q: "What is the latest exam pattern of SSC CGL?",
      a: "SSC CGL consists of Tier-I (100 Questions, 200 Marks - Qualifying in nature) and Tier-II (Paper-I: 130 Questions, 390 Marks for merit + Computer Knowledge 60 Marks qualifying + DEST Typing 15 Mins). Final selection is determined solely from Tier-II Paper-I marks."
    },
    {
      q: "What is the starting salary in SSC CGL?",
      a: "Starting basic pay ranges from ₹25,500 (Pay Level 4) to ₹47,600 (Pay Level 8). With 53% DA, HRA, and Transport Allowances, starting in-hand monthly salaries range from ~₹44,000 (Tax Assistant in Z City) to ~₹96,000 (Assistant Audit Officer in X City like Delhi/Mumbai)."
    },
    {
      q: "Can any graduate apply for SSC CGL?",
      a: "Yes! More than 90% of SSC CGL posts (such as Income Tax Inspector, Central Excise Inspector, ASO in CSS/MEA, Auditors, Tax Assistants) require only a recognized Bachelor's Degree in any discipline with no minimum percentage requirement."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>The Ultimate SSC CGL Master Guide: 360° Complete Handbook & Resource Hub</title>
        <meta name="description" content="The definitive compendium for SSC CGL: Notification timelines, post directories, 7th Pay Commission salaries, physical standards, new 390-mark exam pattern, books, and preparation roadmap." />
        <link rel="canonical" href="https://newvacancyalert.in/articles/ssc-cgl-master-guide" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Top Header Hero */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-16 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Flagship Master Compendium
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> 337-Page Source Research
            </span>
            <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
              Updated for 2026–2027
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">SSC CGL Master Guide</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed">
            The complete 360° handbook for Staff Selection Commission Combined Graduate Level examination. Navigate every stage from notification dates and salary levels to physical benchmarks, 390-mark exam patterns, booklists, and post preferences.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Pay Band Scope</span>
              <div className="text-lg font-black text-emerald-400">Level 4 to 8</div>
              <p className="text-[11px] text-slate-400">₹44k – ₹96k In-Hand</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Posts Covered</span>
              <div className="text-lg font-black text-blue-400">34+ Officers</div>
              <p className="text-[11px] text-slate-400">ASO, Inspectors, AAO</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tier-II Merit</span>
              <div className="text-lg font-black text-purple-400">390 Marks</div>
              <p className="text-[11px] text-slate-400">130 Questions CBT</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Deep-Dive Chapters</span>
              <div className="text-lg font-black text-amber-400">7 Core Guides</div>
              <p className="text-[11px] text-slate-400">Full Knowledge Hub</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Hub */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10">
        
        {/* Visual Chapter Directory */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" /> Complete Chapter Directory
            </h2>
            <span className="text-xs font-bold text-slate-500">7 Flagship Articles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((ch) => {
              const IconComp = ch.icon;
              return (
                <Link
                  key={ch.id}
                  to={ch.slug}
                  className={`p-5 rounded-2xl border bg-gradient-to-br ${ch.color} bg-white shadow-2xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between space-y-3 cursor-pointer`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        {ch.number}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {ch.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 leading-snug transition-colors">
                      {ch.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-medium">
                      {ch.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Full Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Visual Salary Level Comparison Bar */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"><DollarSign className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">7th Pay Commission Salary Comparison (In-Hand X Cities)</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly in-hand pay across all 5 SSC CGL Pay Levels with 53% DA</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">Pay Level 8 (AAO in C&AG) • GP ₹4,800</span>
                <span className="text-purple-700 font-black">₹88,500 – ₹96,000 / mo</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">Pay Level 7 (Inspectors, ASO, AEO, SI CBI) • GP ₹4,600</span>
                <span className="text-blue-700 font-black">₹82,000 – ₹89,500 / mo</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">Pay Level 6 (JSO, Div. Accountant, SI NIA) • GP ₹4,200</span>
                <span className="text-emerald-700 font-black">₹64,000 – ₹71,000 / mo</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">Pay Level 5 (Auditors, Accountants in CAG/CGA) • GP ₹2,800</span>
                <span className="text-amber-700 font-black">₹53,000 – ₹59,000 / mo</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '61%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">Pay Level 4 (Tax Assistants in CBDT/CBIC, UDCs) • GP ₹2,400</span>
                <span className="text-slate-700 font-black">₹46,000 – ₹51,500 / mo</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-600 h-full rounded-full" style={{ width: '53%' }}></div>
              </div>
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

        <MarketingPartnerBanner />
        <div id="comments-section">
          <CommentsSection pageId="ssc-cgl-master-guide" pageTitle="SSC CGL Master Guide Discussion" />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <ArticleStickyBottomBar 
        title="The Ultimate SSC CGL Master Guide: Complete 360° Handbook & Resource Hub"
        description="The definitive, exhaustive compendium for SSC Combined Graduate Level (CGL) examination."
      />
    </div>
  );
}
