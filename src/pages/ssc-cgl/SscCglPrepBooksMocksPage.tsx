import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  BookOpen, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Target, BarChart2, Calendar, Award, BookCheck, Check, RotateCcw, FileText
} from 'lucide-react';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';
import CommentsSection from '../../components/CommentsSection';

export default function SscCglPrepBooksMocksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SSC CGL 12-Month Preparation Roadmap, Daily Study Timetable, Best Books & Mock Test Strategy",
    "description": "Comprehensive study guide for SSC CGL: 12-month zero-to-hero plan, daily 8-hour timetable, subject-wise booklist, and 3-round mock test taking technique.",
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  const bookList = [
    { subject: "Quantitative Aptitude", standard: "Pinnacle SSC Maths 6800+ Chapterwise PYQ / Rakesh Yadav 7300+", theory: "Gagan Pratap Class Notes / Abhinay Sharma Formula Book", priority: "Solve past 5 years TCS questions with 3-step timer method" },
    { subject: "English Language", standard: "Neetu Singh (Plinth to Paramount Vol-1 & 2)", vocab: "Blackbook of English Vocabulary (Nikhil Gupta) + Word Power Made Easy (Norman Lewis)", priority: "Daily 50 Vocab Words + 1 Editorial + 10 Error Rule Drills" },
    { subject: "Reasoning", standard: "Pinnacle SSC Reasoning 7200+ Chapterwise PYQ", theory: "Focus heavily on Syllogisms, Coding-Decoding, Number Puzzles & Critical Reasoning", priority: "Sectional Speed Tests (Aim: 25 Qs in 14 minutes with 100% accuracy)" },
    { subject: "General Awareness", standard: "Lucent's General Knowledge (Yellow Book) + Pinnacle SSC GS PYQ", current: "Monthly Current Affairs Compilations + Static GK Encyclopedia (Parmar SSC / Khan Sir Notes)", priority: "Prioritize Indian Polity (Articles/Amendments), Modern History & General Science" },
    { subject: "Computer Knowledge", standard: "Lucent Computer Awareness / Pinnacle SSC Computer Module", practical: "Basics of MS Office (Word, Excel, PowerPoint, Shortcuts) & Networking Protocols", priority: "Must Clear CPT Higher Qualifying Cut-Off Benchmark" }
  ];

  const dailySchedule = [
    { time: "06:30 AM – 08:30 AM", slot: "Slot 1: Quantitative Aptitude", activity: "New concept learning, theory notes & formula derivation (Geometry / Algebra / Arithmetic).", focus: "Concept Mastery" },
    { time: "08:30 AM – 09:30 AM", slot: "Break & Breakfast", activity: "Relaxation, healthy meal, mental recharge.", focus: "Wellness" },
    { time: "09:30 AM – 11:30 AM", slot: "Slot 2: English Language", activity: "Vocabulary (50 words from Blackbook), Grammar rules from Neetu Singh, and 1 The Hindu editorial analysis.", focus: "Vocab & Grammar" },
    { time: "11:30 AM – 12:30 PM", slot: "Slot 3: Typing Practice (DEST)", activity: "15-20 minutes continuous touch typing on typing software (Target: 35 WPM / 2000 keystrokes).", focus: "Speed Calibration" },
    { time: "12:30 PM – 02:00 PM", slot: "Slot 4: Reasoning Speed Drills", activity: "Solve 50 chapterwise PYQs with stopwatch timer (Puzzles, Syllogisms, Analogies).", focus: "Speed & Accuracy" },
    { time: "02:00 PM – 03:30 PM", slot: "Lunch & Power Nap", activity: "Rest and rejuvenation.", focus: "Rest" },
    { time: "03:30 PM – 05:30 PM", slot: "Slot 5: General Awareness", activity: "Static GK (Polity / History / Geography from Lucent) + Monthly Current Affairs notes.", focus: "Retention & Flashcards" },
    { time: "06:00 PM – 08:00 PM", slot: "Slot 6: Full Mock Test", activity: "1 Hour Full-Length CBT Mock Test in strict exam environment.", focus: "Exam Simulation" },
    { time: "08:30 PM – 10:00 PM", slot: "Slot 7: In-Depth Mock Analysis", activity: "Note down every wrong and unattempted question in the Error Notebook.", focus: "Error Correction" }
  ];

  const faqs = [
    {
      q: "How many months of preparation are required to clear SSC CGL from scratch?",
      a: "With dedicated 6 to 8 hours daily, an average beginner can thoroughly master the complete syllabus, solve past 5 years' PYQs, and attain a top-ranking score in 8 to 12 months."
    },
    {
      q: "Should I prepare for Tier-I and Tier-II separately?",
      a: "No! Never prepare for Tier-I and Tier-II separately. Since Tier-I is qualifying and Tier-II has identical syllabus topics with higher depth, prepare for Tier-II from Day 1. Speed comes naturally from concept clarity."
    },
    {
      q: "How many mock tests should I take before the SSC CGL exam?",
      a: "Aim to solve a minimum of 40 to 50 full-length Tier-I mocks and 25 to 30 Tier-II full-length mocks. More importantly, spend at least 2 hours analyzing every single mock test to fix recurring mistakes."
    },
    {
      q: "What is the 3-round strategy in SSC CGL mock tests?",
      a: "Round 1 (First 35 mins): Solve all easy, direct, 100% confident questions without getting stuck. Round 2 (Next 15 mins): Solve moderate questions requiring 50-50 elimination or small calculations. Round 3 (Last 10 mins): Attempt remaining lengthy questions."
    },
    {
      q: "What is the Error Notebook system?",
      a: "An Error Notebook is a dedicated physical notebook where you write down every question you got wrong or skipped during mocks, along with the exact trick or formula needed. Reviewing this before exam day prevents 90% of recurring negative marks."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>SSC CGL 12-Month Preparation Roadmap, Books & Mock Strategy | Study Plan</title>
        <meta name="description" content="Step-by-step SSC CGL study plan: 12-month zero-to-hero roadmap, daily 8-hour timetable, subject-wise booklist, and 3-round mock test taking technique." />
        <link rel="canonical" href="https://newvacancyalert.in/ssc-cgl-preparation-strategy-study-plan-books-mocks" />
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
            <span className="text-slate-400 truncate">Chapter 6: Preparation Plan & Books</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Proven Methodology
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
              Chapter 6 of 7
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              20 Min Read
            </span>
            <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
              <BookCheck className="w-3.5 h-3.5 text-purple-600" /> Complete Study Roadmap
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            SSC CGL 12-Month Preparation Roadmap, Daily Study Plan & Booklist
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            A comprehensive, battle-tested preparation framework for beginners and repeaters covering syllabus coverage phases, an 8-hour daily schedule, recommended books, and mock test score optimization.
          </p>

          {/* Nav */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-bold">
            <Link to="/ssc-cgl-cutoffs-post-preference-ranking-guide" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Prev: Preference Guide
            </Link>
            <Link to="/ssc-cgl-master-guide" className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Master Hub
            </Link>
            <Link to="/ssc-cgl-admit-card-selection-dv-checklist" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              Next: Selection & DV <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Section 1: 12-Month Phased Roadmap in 4 Quarters */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><Calendar className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">1. The 12-Month Zero-to-Hero Preparation Roadmap</h2>
              <p className="text-xs text-slate-500 font-medium">4 distinct preparation quarters for guaranteed syllabus mastery</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">Quarter 1 (Months 1 to 3): Foundation</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Concept Clarity & Core Theory Coverage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Complete all arithmetic and advanced maths theory from basics. Finish English grammar rules and build daily 50-word vocab habit. Complete static GK subjects (Polity & History).</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">Quarter 2 (Months 4 to 6): PYQ Mastery</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Solving 5 Years of Past Questions (TCS Era)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Solve chapter-wise PYQs from Pinnacle/Kiran. Identify weak areas in Maths (Geometry/Trigo) and English. Start daily 15-minute typing drills for DEST (27 WPM benchmark).</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">Quarter 3 (Months 7 to 9): Tier-I Speed & Mocks</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Full-Length Mocks & Speed Calibration</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Take 3 Tier-I full-length mocks per week. Target 150+ raw score in mocks. Refine 3-round exam strategy to complete paper in 52 minutes with high accuracy.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">Quarter 4 (Months 10 to 12): Tier-II Peak</span>
              <h4 className="font-extrabold text-slate-900 text-sm">390-Mark Mastery + Computer Practice</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Take Tier-II 390-mark full tests with Computer & DEST on same seating. Revise high-weightage topics and short formula notebooks daily.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Daily 8-Hour Timetable */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold"><Clock className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">2. Ideal Daily 8-Hour Study Timetable for Serious Aspirants</h2>
              <p className="text-xs text-slate-500 font-medium">Balanced slot allocation across Quant, English, Reasoning, GS, Mocks & Typing</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Time Window</th>
                  <th className="p-3.5">Study Slot & Subject</th>
                  <th className="p-3.5">Recommended Activity</th>
                  <th className="p-3.5 text-right">Core Objective</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {dailySchedule.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{s.time}</td>
                    <td className="p-3.5 font-semibold text-blue-900">{s.slot}</td>
                    <td className="p-3.5 text-xs text-slate-600">{s.activity}</td>
                    <td className="p-3.5 text-right text-xs font-bold text-slate-700">{s.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Recommended Books */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"><BookOpen className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">3. Subject-Wise Official Recommended Booklist</h2>
              <p className="text-xs text-slate-500 font-medium">Standard resource kit avoiding book hoarding</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Primary Practice Book</th>
                  <th className="p-3.5">Theory & Vocabulary Source</th>
                  <th className="p-3.5">Strategic Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {bookList.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{b.subject}</td>
                    <td className="p-3.5 text-xs text-slate-700 font-semibold">{b.standard}</td>
                    <td className="p-3.5 text-xs text-slate-600">{b.theory || b.vocab || b.current || b.practical}</td>
                    <td className="p-3.5 text-xs text-blue-700 font-bold">{b.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: 3-Round Mock Test Strategy */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 font-bold"><Target className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">4. The 3-Round Mock Test Strategy (Zero Panic Method)</h2>
              <p className="text-xs text-slate-500 font-medium">How to optimize attempt rate and minimize negative marking under time pressure</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">Round 1: First 35 Minutes</span>
              <h4 className="font-extrabold text-slate-900 text-sm">100% Confident Questions Only</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Solve all easy, direct questions in Reasoning, English, and GA. In Maths, solve only 1-step direct arithmetic questions. Skip anything requiring more than 40 seconds!</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">Round 2: Next 15 Minutes</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Moderate & Calculation Questions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Attempt questions flagged for review where you eliminated 2 options, or geometry/algebra questions requiring standard formula calculations.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">Round 3: Last 10 Minutes</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Final Sprint & Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Solve remaining questions with calculated risks. Verify that no responses were accidentally left unsubmitted.</p>
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
            <h4 className="text-lg sm:text-xl font-black">Chapter 7: Admit Card, Selection Stages & Document Verification Checklist</h4>
          </div>
          <Link
            to="/ssc-cgl-admit-card-selection-dv-checklist"
            className="px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <span>Read Chapter 7</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <MarketingPartnerBanner />
        <CommentsSection pageId="ssc-cgl-preparation-strategy-study-plan-books-mocks" pageTitle="SSC CGL 12-Month Preparation Plan Discussion" />
      </div>
    </div>
  );
}
