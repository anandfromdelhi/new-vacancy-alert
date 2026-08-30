import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  BookOpen, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Target, BarChart2, Calendar, Award, BookCheck, Check, 
  RotateCcw, FileText, Star, Calculator, Flame, Lightbulb, Compass,
  Briefcase, CheckSquare, Zap, AlertTriangle, Library, BookmarkCheck,
  ShoppingCart, ExternalLink, Cpu, Sprout, Landmark, Users, ClipboardCheck
} from 'lucide-react';
import CommentsSection from '../components/CommentsSection';
import SubscribeWidget from '../components/SubscribeWidget';
import ArticleStickyBottomBar from '../components/ArticleStickyBottomBar';

export const BSFC_BOOK_LINKS = {
  LUCENT_GK: "https://www.amazon.in/s?k=Lucent+General+Knowledge+2026&tag=newvacancyale-21",
  MANOHAR_PANDEY_GS: "https://www.amazon.in/s?k=Objective+General+Studies+Manohar+Pandey+Arihant&tag=newvacancyale-21",
  BIHAR_GK: "https://www.amazon.in/s?k=Bihar+Samagra+KBC+Nano+Bihar+GK&tag=newvacancyale-21",
  RS_REASONING: "https://www.amazon.in/s?k=RS+Aggarwal+Verbal+and+Non+Verbal+Reasoning&tag=newvacancyale-21",
  SAMANYA_HINDI: "https://www.amazon.in/s?k=Lucent+Samanya+Hindi&tag=newvacancyale-21",
  SP_BAKSHI_ENGLISH: "https://www.amazon.in/s?k=Objective+General+English+SP+Bakshi+Arihant&tag=newvacancyale-21",
  MANAGEMENT_BOOK: "https://www.amazon.in/s?k=Principles+and+Practice+of+Management+Book&tag=newvacancyale-21",
  TS_GREWAL_ACCOUNTANCY: "https://www.amazon.in/s?k=TS+Grewal+Accountancy+Book&tag=newvacancyale-21",
  AGRICULTURE_BOOK: "https://www.amazon.in/s?k=Competitive+Book+of+Agriculture+Nem+Raj+Sunda&tag=newvacancyale-21",
  COMPUTER_AWARENESS: "https://www.amazon.in/s?k=Objective+Computer+Awareness+Arihant&tag=newvacancyale-21",
  BSFC_PYQ: "https://www.amazon.in/s?k=Bihar+BSFC+BCECEB+Previous+Year+Solved+Papers&tag=newvacancyale-21",
  AUDITING_BOOK: "https://www.amazon.in/s?k=Principles+of+Auditing+Book&tag=newvacancyale-21",
  TAXATION_BOOK: "https://www.amazon.in/s?k=Income+Tax+and+GST+Book+for+Competitive+Exams&tag=newvacancyale-21"
};

export default function BiharBsfcBestBooksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const topPicks = [
    { rank: 1, book: "Bihar BSFC Previous Year Papers & Solved Sets", bestFor: "Actual Question Style & Exam Pattern", verdict: "⭐⭐⭐⭐⭐", tag: "Must-Have PYQ", link: BSFC_BOOK_LINKS.BSFC_PYQ },
    { rank: 2, book: "Lucent's General Knowledge (Hindi/English)", bestFor: "Static General Studies (History, Polity, Geography)", verdict: "⭐⭐⭐⭐⭐", tag: "Static GK Standard", link: BSFC_BOOK_LINKS.LUCENT_GK },
    { rank: 3, book: "Bihar Samagra / Dedicated Bihar-Specific GK Book", bestFor: "Bihar History, Geography, Economy & Culture", verdict: "⭐⭐⭐⭐⭐", tag: "State GK Must", link: BSFC_BOOK_LINKS.BIHAR_GK },
    { rank: 4, book: "R.S. Aggarwal – Verbal & Non-Verbal Reasoning", bestFor: "Mental Ability & Logical Reasoning", verdict: "⭐⭐⭐⭐½", tag: "Reasoning Core", link: BSFC_BOOK_LINKS.RS_REASONING },
    { rank: 5, book: "Objective General Studies – Manohar Pandey", bestFor: "General Studies MCQ Practice", verdict: "⭐⭐⭐⭐½", tag: "Best GS MCQs", link: BSFC_BOOK_LINKS.MANOHAR_PANDEY_GS },
    { rank: 6, book: "Samanya Hindi / Sampurna Hindi Vyakaran", bestFor: "Hindi Language & Grammar Section", verdict: "⭐⭐⭐⭐½", tag: "Hindi Standard", link: BSFC_BOOK_LINKS.SAMANYA_HINDI },
    { rank: 7, book: "S.P. Bakshi – Objective General English", bestFor: "English Grammar, Vocab & Error Spotting", verdict: "⭐⭐⭐⭐", tag: "English Standard", link: BSFC_BOOK_LINKS.SP_BAKSHI_ENGLISH },
    { rank: 8, book: "Objective Computer Awareness (Arihant / Lucent)", bestFor: "BSFC LDC Computer Proficiency", verdict: "⭐⭐⭐⭐⭐", tag: "LDC Essential", link: BSFC_BOOK_LINKS.COMPUTER_AWARENESS },
    { rank: 9, book: "Fundamentals of Management (Standard Text)", bestFor: "Assistant Manager Section B (Management)", verdict: "⭐⭐⭐⭐⭐", tag: "Asst Mgr Core", link: BSFC_BOOK_LINKS.MANAGEMENT_BOOK },
    { rank: 10, book: "T.S. Grewal – Accountancy + Auditing Book", bestFor: "Accountant & Assistant Accounts Officer (AAO)", verdict: "⭐⭐⭐⭐⭐", tag: "Commerce Core", link: BSFC_BOOK_LINKS.TS_GREWAL_ACCOUNTANCY },
    { rank: 11, book: "Competitive Book of Agriculture – Nem Raj Sunda", bestFor: "Quality Controller & Assistant Manager Agriculture", verdict: "⭐⭐⭐⭐⭐", tag: "Agri Essential", link: BSFC_BOOK_LINKS.AGRICULTURE_BOOK }
  ];

  const faqs = [
    {
      q: "Which is the best book for Bihar BSFC 2026?",
      a: "There is no single best book for every BSFC post. For common preparation, Lucent GK + a dedicated Bihar GK book + R.S. Aggarwal Reasoning + BSFC PYQs provide the strongest foundation. Then add post-specific books for Management, Accountancy, Agriculture, Taxation, or Computers based on your applied post."
    },
    {
      q: "Which book is best for BSFC LDC (Lower Division Clerk)?",
      a: "For LDC (123 vacancies), focus on General Studies (Lucent GK), Bihar GK, Mental Ability (R.S. Aggarwal), Samanya Hindi/English, and Objective Computer Awareness, along with regular computer typing practice and BSFC previous year questions."
    },
    {
      q: "Which book is best for BSFC Assistant Manager?",
      a: "Assistant Manager (81 vacancies) candidates must prepare across 3 key sections: Section A (General Studies & Mental Ability - 30 Marks), Section B (Indian Language & Management - 40 Marks), and Section C (Indian Economy & Indian Agriculture - 30 Marks). Use standard texts like Fundamentals of Management and a competitive Indian Agriculture book."
    },
    {
      q: "Which book is best for BSFC Accountant and Assistant Accounts Officer (AAO)?",
      a: "For Accountant (11 posts) and AAO (6 posts), general GK alone is insufficient. Candidates need standard accounting and auditing textbooks such as T.S. Grewal Accountancy, standard Auditing texts, and Income Tax/GST reference materials alongside General Studies and Reasoning."
    },
    {
      q: "Which book is best for BSFC Quality Controller?",
      a: "For Quality Controller (38 vacancies), a high-quality agriculture book like 'A Competitive Book of Agriculture' by Nem Raj Sunda is essential because Indian Agriculture accounts for 30 marks out of the 100-mark paper (along with 50 Marks for GS & Mental Ability and 20 Marks for Indian Language)."
    },
    {
      q: "Is Lucent General Knowledge enough for Bihar BSFC?",
      a: "No. While Lucent is exceptional for all-India static GK (History, Polity, Geography, Science), BSFC examinations include specific questions on Bihar history (Magadha, Champaran), geography (rivers, climate, soil), economy, and state welfare schemes. You must supplement Lucent with a dedicated Bihar GK book."
    },
    {
      q: "Are BSFC previous-year papers (PYQs) important?",
      a: "Yes, absolutely vital. Solving previous year papers helps you understand the exact difficulty level, question framing, recurring topics, and time constraints. PYQs should be studied from day one rather than kept only for the last week."
    },
    {
      q: "How many books should I buy for BSFC preparation?",
      a: "Avoid buying 15–20 books. An LDC candidate needs 5–7 core resources, an Assistant Manager needs 6–8 resources, and technical accounting/agriculture candidates need 1–2 specialized domain books. Mastering 5 focused books with repeated revision is far more effective than collecting an unmanageable library."
    },
    {
      q: "Which BSFC books are best for Hindi Medium candidates?",
      a: "For Hindi-medium candidates: 1. Lucent Samanya Gyan (Hindi), 2. Bihar Samagra (Hindi), 3. R.S. Aggarwal Reasoning (Hindi Edition), 4. Lucent Samanya Hindi, 5. Objective Computer Awareness (Hindi), and 6. BSFC Solved Papers in Hindi."
    },
    {
      q: "Is typing practice necessary during written exam preparation for LDC?",
      a: "Yes. The LDC post requires qualifying computer typing in Hindi and English. Do not wait for written results to begin typing practice; dedicate 30 minutes daily to build speed and accuracy simultaneously."
    }
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Best Books for Bihar BSFC 2026: Subject-Wise Books for LDC, Assistant Manager, Accountant & Other Posts",
    "description": "Looking for the best books for Bihar BSFC 2026? Complete guide to subject-wise books for BSFC LDC, Assistant Manager, Accountant, AAO, and Quality Controller preparation.",
    "author": {
      "@type": "Organization",
      "name": "NewVacancyAlert Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newvacancyalert.in/logo.png"
      }
    },
    "datePublished": "2026-08-30",
    "dateModified": "2026-08-30"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>Best Books for Bihar BSFC 2026: Subject-Wise Books for LDC, Asst Manager, Accountant | NewVacancyAlert</title>
        <meta name="description" content="Looking for the best books for Bihar BSFC 2026? Check the best BSFC books for LDC, Assistant Manager, Accountant, Assistant Accounts Officer and Quality Controller preparation." />
        <link rel="canonical" href="https://newvacancyalert.in/best-books-for-bihar-bsfc" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Top Breadcrumb */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 text-xs font-medium border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link to="/articles" className="hover:text-white transition">Articles</Link>
            <span>/</span>
            <span className="text-amber-400 truncate">Best Books for Bihar BSFC 2026</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> BCECEB BSFC 2026 Guide
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">

        {/* Hero Header Card */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200/60">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Bihar BSFC 2026 Master Guide
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200/60">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> 18 min read
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200/60">
              <Users className="w-3.5 h-3.5 text-emerald-600" /> 259 Vacancies (Advt 01/2026)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Updated: August 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Best Books for Bihar BSFC 2026: Subject-Wise Books for LDC, Assistant Manager, Accountant & Other Posts
          </h1>

          <div className="prose max-w-none text-slate-700 text-base sm:text-lg leading-relaxed space-y-4 pt-2 border-t border-slate-100">
            <p>
              Choosing the right books for Bihar BSFC preparation is one of the first and most critical decisions candidates need to make after applying for the recruitment. However, <strong>there is no single book that can be called the best BSFC book for every candidate</strong> because the syllabus and question weightage differ significantly across <strong>Assistant Manager, Assistant Accounts Officer (AAO), Accountant, Quality Controller, and Lower Division Clerk (LDC)</strong>.
            </p>
            <p>
              For example, an <strong>LDC candidate</strong> needs to concentrate heavily on General Studies, Mental Ability, Indian Language, and Computer Proficiency with typing speed, while an <strong>Assistant Manager candidate</strong> has to prepare General Studies & Mental Ability, Indian Language & Management, and Indian Economy & Indian Agriculture. <strong>Accountant and AAO candidates</strong> need substantial preparation in Accounting, Auditing & Taxation, while <strong>Quality Controller candidates</strong> require dedicated Indian Agriculture mastery.
            </p>
            <div className="bg-blue-50/80 border-l-4 border-blue-600 p-4 rounded-r-xl text-sm sm:text-base text-blue-950 font-medium space-y-1">
              <p>
                <strong>📢 Official Bihar BSFC Recruitment 2026 Context:</strong>
              </p>
              <p className="text-blue-900">
                The Bihar State Food & Civil Supplies Corporation Limited (BSFC) has announced recruitment through the Bihar Combined Entrance Competitive Examination Board (BCECEB) under Advertisement No. <code>BCECEB(BSFC)-2026/01</code> dated <strong>24 August 2026</strong> for <strong>259 total posts</strong>.
              </p>
            </div>
            <p className="text-slate-600 text-sm italic">
              This guide covers the best books for Bihar BSFC 2026, including post-wise recommended combinations, subject-wise breakdowns, 30-day study strategy, previous year question techniques, and common pitfalls to avoid.
            </p>
          </div>
        </header>

        {/* Quick Answer Banner */}
        <section className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Quick Answer: Which Are the Best Books for Bihar BSFC?
            </h2>
          </div>
          <p className="text-slate-700 font-medium">
            If you want a quick recommendation before reading the complete post-wise breakdown, these are the highest-rated resources across subjects:
          </p>
          
          <div className="overflow-x-auto rounded-xl border border-amber-200/80 bg-white/95 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-amber-100/70 border-b border-amber-200 text-slate-900 font-black">
                  <th className="py-3 px-3 sm:px-4">Subject</th>
                  <th className="py-3 px-3 sm:px-4">Recommended Book</th>
                  <th className="py-3 px-3 sm:px-4">Best For</th>
                  <th className="py-3 px-3 sm:px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">General Studies</td>
                  <td className="py-2.5 px-3 sm:px-4">Lucent's General Knowledge</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">Static All-India GK</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.LUCENT_GK} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">GS Practice</td>
                  <td className="py-2.5 px-3 sm:px-4">Objective General Studies – Manohar Pandey</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">MCQ speed & testing</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.MANOHAR_PANDEY_GS} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">Bihar GK</td>
                  <td className="py-2.5 px-3 sm:px-4">Bihar Samagra / Bihar-Specific GK Book</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">Bihar history, geography, economy & schemes</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.BIHAR_GK} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">Mental Ability</td>
                  <td className="py-2.5 px-3 sm:px-4">R.S. Aggarwal – Verbal & Non-Verbal Reasoning</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">Reasoning fundamentals & speed</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.RS_REASONING} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">Hindi Language</td>
                  <td className="py-2.5 px-3 sm:px-4">Samanya Hindi / Sampurna Hindi Vyakaran</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">Hindi grammar & vocabulary</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.SAMANYA_HINDI} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">English Language</td>
                  <td className="py-2.5 px-3 sm:px-4">S.P. Bakshi – Objective General English</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">English grammar & error detection</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.SP_BAKSHI_ENGLISH} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">Management</td>
                  <td className="py-2.5 px-3 sm:px-4">Fundamentals of Management (Standard Text)</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">Assistant Manager Section B</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.MANAGEMENT_BOOK} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">Accounting</td>
                  <td className="py-2.5 px-3 sm:px-4">T.S. Grewal – Accountancy</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">Accountant / AAO</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.TS_GREWAL_ACCOUNTANCY} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">Agriculture</td>
                  <td className="py-2.5 px-3 sm:px-4">Competitive Book of Agriculture – Nem Raj Sunda</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">Quality Controller / AM / AAO</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.AGRICULTURE_BOOK} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">Computer</td>
                  <td className="py-2.5 px-3 sm:px-4">Objective Computer Awareness (Arihant)</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">Lower Division Clerk (LDC)</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.COMPUTER_AWARENESS} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">PYQs & Mocks</td>
                  <td className="py-2.5 px-3 sm:px-4">Bihar BSFC Solved Papers & Online Test Series</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600">All candidates (All 5 posts)</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={BSFC_BOOK_LINKS.BSFC_PYQ} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-100/60 p-4 rounded-xl border border-amber-300/70 text-slate-800 text-sm font-bold flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Rule of Thumb:</strong> Most candidates should NOT buy every book in this table. Your applied post strictly determines which ones you actually need!
            </div>
          </div>
        </section>

        {/* Section 1: Vacancy Matrix & Why Selection Matters */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Target className="w-6 h-6 text-blue-600" />
            Bihar BSFC Recruitment 2026: Why Book Selection Matters
          </h2>
          <p className="text-slate-700 leading-relaxed">
            The Bihar State Food & Civil Supplies Corporation Limited has announced recruitment through BCECEB under Advertisement No. <code>BCECEB(BSFC)-2026/01</code>. The recruitment distributes <strong>259 vacancies across 5 distinct posts</strong>:
          </p>

          <div className="grid sm:grid-cols-5 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 font-bold block">Assistant Manager</span>
              <span className="text-2xl font-black text-slate-900">81</span>
              <span className="text-[11px] text-blue-600 font-bold block mt-0.5">Pay Level 7</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 font-bold block">Asst Accounts Officer</span>
              <span className="text-2xl font-black text-slate-900">06</span>
              <span className="text-[11px] text-blue-600 font-bold block mt-0.5">Pay Level 7</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 font-bold block">Accountant</span>
              <span className="text-2xl font-black text-slate-900">11</span>
              <span className="text-[11px] text-blue-600 font-bold block mt-0.5">Pay Level 4</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 font-bold block">Quality Controller</span>
              <span className="text-2xl font-black text-slate-900">38</span>
              <span className="text-[11px] text-blue-600 font-bold block mt-0.5">Pay Level 5</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <span className="text-xs text-blue-700 font-bold block">Lower Division Clerk</span>
              <span className="text-2xl font-black text-blue-900">123</span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">Pay Level 2 (Typing)</span>
            </div>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm italic">
            * This wide variation means buying a generic "BSFC All-in-One Guide" will leave critical domain portions uncovered.
          </p>
        </section>

        {/* Section 2: Detailed Subject Reviews */}
        <section className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Library className="w-7 h-7 text-indigo-600" />
              Detailed Subject Reviews: Best Books for Bihar BSFC 2026
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A comprehensive evaluation of the standard books recommended for each subject in the BSFC recruitment syllabus.
            </p>
          </div>

          {/* 1. Lucent GK */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Static GS Standard
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  1. Lucent's General Knowledge (सामान्य ज्ञान)
                </h3>
              </div>
              <a 
                href={BSFC_BOOK_LINKS.LUCENT_GK} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Check Price on Amazon
              </a>
            </div>

            <div className="text-slate-700 text-sm sm:text-base space-y-2">
              <p>
                Lucent's General Knowledge is one of the most useful resources for the static-GK portion of competitive examinations. It covers <strong>Indian History, Indian Geography, Indian Polity, Indian Economy, General Science, and Static GK trivia</strong>.
              </p>
              <p>
                <strong>Why it is useful for BSFC:</strong> General Studies is common across all BSFC posts. Rather than reading a massive general studies encyclopedia, candidates can use a concise book like Lucent for the basic static portion and supplement it with Bihar-specific GK and current affairs.
              </p>
              <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold">
                ⚠️ <strong>What you should NOT do:</strong> Don't assume finishing Lucent completes your GK preparation. You still need <strong>Bihar-specific GK, current affairs, agricultural awareness (where applicable), and government schemes</strong>.
              </div>
            </div>
          </div>

          {/* 2. Manohar Pandey Objective GS */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  GS MCQ Practice
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  2. Objective General Studies – Manohar Pandey (Arihant)
                </h3>
              </div>
              <a 
                href={BSFC_BOOK_LINKS.MANOHAR_PANDEY_GS} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Check Price on Amazon
              </a>
            </div>

            <div className="text-slate-700 text-sm sm:text-base space-y-2">
              <p>
                If Lucent is useful for learning facts, an objective General Studies book is essential for testing those facts under objective CBT conditions.
              </p>
              <p>
                <strong>Best Strategy:</strong> Don't simply read the answers passively. Use the 5-step cycle: <em>Attempt $\rightarrow$ Check $\rightarrow$ Mark wrong questions $\rightarrow$ Revise concept $\rightarrow$ Attempt again</em>.
              </p>
            </div>
          </div>

          {/* 3. Bihar Specific GK */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  State GK Must-Have
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  3. Dedicated Bihar-Specific GK Book (Bihar Samagra / KBC Nano)
                </h3>
              </div>
              <a 
                href={BSFC_BOOK_LINKS.BIHAR_GK} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Check Price on Amazon
              </a>
            </div>

            <div className="text-slate-700 text-sm sm:text-base space-y-2">
              <p>
                A common mistake is preparing only national General Knowledge. For a Bihar government recruitment, you must separately prepare Bihar-specific topics:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-900 block">Bihar History & Freedom Struggle</span>
                  <p className="text-slate-600">Ancient Bihar (Magadha, Mauryan, Gupta), Medieval Bihar, Champaran Satyagraha, Quit India Movement in Bihar, and post-independence development.</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-900 block">Bihar Geography & Agriculture</span>
                  <p className="text-slate-600">Ganga and its tributaries (Gandak, Kosi, Son), agro-climatic zones, soil types, major crops (paddy, maize, pulses), and mineral resources.</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-900 block">Bihar Economy & Industry</span>
                  <p className="text-slate-600">State budget highlights, Bihar Economic Survey, food processing, industrial policies, and rural development schemes.</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-900 block">Bihar Culture & Welfare Schemes</span>
                  <p className="text-slate-600">Chhath Puja, Madhubani painting, folk dances, languages (Bhojpuri, Maithili, Magahi), and flagship schemes (Saat Nischay-2, etc.).</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Reasoning & Language */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Reasoning */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded">Mental Ability</span>
                <h4 className="font-black text-slate-900 text-base">4. R.S. Aggarwal – Verbal & Non-Verbal Reasoning</h4>
                <p className="text-slate-600 text-xs">
                  Prioritize Series, Coding-Decoding, Blood Relations, Direction Tests, Ranking, Venn Diagrams, and Syllogisms under timed conditions.
                </p>
              </div>
              <a href={BSFC_BOOK_LINKS.RS_REASONING} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>

            {/* Hindi */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded">Indian Language (Hindi)</span>
                <h4 className="font-black text-slate-900 text-base">5. Samanya Hindi (Lucent / Arihant)</h4>
                <p className="text-slate-600 text-xs">
                  Covers संधि, समास, उपसर्ग-प्रत्यय, पर्यायवाची, विलोम शब्द, मुहावरे, लोकोक्तियां, वाक्य शुद्धि, तत्सम-तद्भव with practice MCQs.
                </p>
              </div>
              <a href={BSFC_BOOK_LINKS.SAMANYA_HINDI} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>

            {/* English */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5 rounded">Indian Language (English)</span>
                <h4 className="font-black text-slate-900 text-base">6. S.P. Bakshi – Objective General English</h4>
                <p className="text-slate-600 text-xs">
                  Focus on Tenses, Prepositions, Voice, Narration, Subject-Verb Agreement, Error Detection, Synonyms/Antonyms, and Reading Comprehension.
                </p>
              </div>
              <a href={BSFC_BOOK_LINKS.SP_BAKSHI_ENGLISH} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>
          </div>
        </section>

        {/* Section 3: Post-Wise Dedicated Book Guides */}
        <section className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Briefcase className="w-7 h-7 text-blue-600" />
              Post-Wise Dedicated Book Guides
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Detailed preparation requirements for each of the 5 posts in BCECEB BSFC 2026.
            </p>
          </div>

          {/* 1. BSFC LDC */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-blue-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Post 1: Lower Division Clerk (123 Vacancies)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Best Books for Bihar BSFC LDC 2026
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                Pay Level 2 + Typing Test
              </span>
            </div>

            <p className="text-slate-700 text-sm sm:text-base">
              The Lower Division Clerk is the largest vacancy category with <strong>123 posts</strong>. The exam tests <strong>General Studies & Mental Ability, Indian Language, and Computer Proficiency</strong>.
            </p>

            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
              <h4 className="font-black text-blue-950 text-sm flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600" /> Best Computer Book for BSFC LDC:
              </h4>
              <p className="text-xs sm:text-sm text-blue-900">
                Use <strong>Objective Computer Awareness by Arihant / Lucent</strong> covering: Hardware/Software, CPU, Memory, Windows OS, MS Word, MS Excel, MS PowerPoint, Internet/Email protocols, Cyber Security, and Keyboard Shortcuts (<code>Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z, Ctrl+A, Ctrl+S, Ctrl+P, Alt+Tab</code>).
              </p>
            </div>

            <div className="text-xs text-slate-600">
              <strong>Recommended LDC Booklist:</strong> Lucent GK + Bihar GK + Manohar Pandey Objective GS + R.S. Aggarwal Reasoning + Samanya Hindi + Objective Computer Awareness + BSFC Solved Papers.
            </div>
          </div>

          {/* 2. BSFC Assistant Manager */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-indigo-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="bg-indigo-100 text-indigo-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Post 2: Assistant Manager (81 Vacancies)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Best Books for Bihar BSFC Assistant Manager 2026
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                Pay Level 7
              </span>
            </div>

            <p className="text-slate-700 text-sm sm:text-base">
              The 2026 Assistant Manager syllabus is structured into 3 distinct sections (100 Marks total):
            </p>

            <div className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-black text-slate-900 block">Section A (30 Marks)</span>
                <span className="text-slate-600">General Studies & Mental Ability</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-black text-slate-900 block">Section B (40 Marks)</span>
                <span className="text-slate-600">Indian Language & Management</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-black text-slate-900 block">Section C (30 Marks)</span>
                <span className="text-slate-600">Indian Economy & Indian Agriculture</span>
              </div>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 space-y-2 text-xs sm:text-sm text-indigo-950">
              <h4 className="font-black text-indigo-900">Key Domain Resources for Assistant Manager:</h4>
              <ul className="list-disc pl-5 space-y-1 text-indigo-900 font-medium">
                <li><strong>Management:</strong> Fundamentals of Management (Planning, Organizing, Staffing, Directing, Controlling, Leadership, Motivation, Decision Making).</li>
                <li><strong>Indian Economy:</strong> NCERT Economics + Competitive Indian Economy (GDP, Inflation, Banking, Monetary Policy, Food Security).</li>
                <li><strong>Indian Agriculture:</strong> A Competitive Book of Agriculture by Nem Raj Sunda (Cropping patterns, irrigation, fertilizers, agricultural marketing, food storage).</li>
              </ul>
            </div>
          </div>

          {/* 3. BSFC Accountant & AAO */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-teal-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="bg-teal-100 text-teal-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Posts 3 & 4: Accountant (11 Posts) & Assistant Accounts Officer (6 Posts)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Best Books for BSFC Accountant & AAO 2026
                </h3>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
                Commerce / Finance Domain
              </span>
            </div>

            <p className="text-slate-700 text-sm sm:text-base">
              General GK alone is not sufficient for Accountant and AAO candidates. The paper gives substantial weight to <strong>Accounting, Auditing, and Taxation</strong>:
            </p>

            <div className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-black text-slate-900 block">1. Accountancy</span>
                <p className="text-slate-600">Journal, Ledger, Trial Balance, Final Accounts, Depreciation, Bank Reconciliation, Partnership & Company Accounts (T.S. Grewal).</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-black text-slate-900 block">2. Auditing</span>
                <p className="text-slate-600">Audit principles, internal control, vouching, verification of assets & liabilities, auditor responsibilities.</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-black text-slate-900 block">3. Taxation & GST</span>
                <p className="text-slate-600">Income Tax basics, GST mechanisms, TDS deductions, return filing rules, and corporate taxation basics.</p>
              </div>
            </div>
          </div>

          {/* 4. BSFC Quality Controller */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Post 5: Quality Controller (38 Vacancies)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Best Books for BSFC Quality Controller 2026
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Pay Level 5
              </span>
            </div>

            <p className="text-slate-700 text-sm sm:text-base">
              The Quality Controller examination allocates <strong>50 marks for General Studies & Mental Ability, 20 marks for Indian Language, and 30 marks for Indian Agriculture</strong>.
            </p>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-1 text-xs sm:text-sm text-emerald-950">
              <h4 className="font-black text-emerald-900">Recommended Agriculture Resource:</h4>
              <p>
                <strong>A Competitive Book of Agriculture by Nem Raj Sunda</strong> covers Agronomy, Soil Science, Horticulture, Plant Pathology, Entomology, Food Grain Storage & Pest Management, Seed Technology, and Agricultural Economics.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Post-Wise Book Selection Matrix Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <ClipboardCheck className="w-6 h-6 text-indigo-600" />
            BSFC Book Selection: Master Post-Wise Guide
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Check exactly which resources you need based on the post you are applying for:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 font-black text-slate-800 border-b border-slate-200">
                  <th className="py-2.5 px-3 sm:px-4">Book / Resource</th>
                  <th className="py-2.5 px-2 text-center">LDC</th>
                  <th className="py-2.5 px-2 text-center">Asst Mgr</th>
                  <th className="py-2.5 px-2 text-center">Accountant</th>
                  <th className="py-2.5 px-2 text-center">AAO</th>
                  <th className="py-2.5 px-2 text-center">Quality Ctrl</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Lucent GK</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Bihar GK Book</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Objective GS (Manohar Pandey)</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">R.S. Aggarwal Reasoning</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Hindi / English Book</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-black">✅</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Computer Awareness</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-slate-400">Optional</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Management Text</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Accountancy & Auditing</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Taxation & GST</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-blue-600 font-bold">As Syllabus</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Indian Agriculture</td>
                  <td className="py-2 px-2 text-center text-slate-300">❌</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-blue-600 font-bold">As Syllabus</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">BSFC PYQs & Mock Tests</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                  <td className="py-2 px-2 text-center text-amber-500 font-bold">⭐⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Study Method & 3-Notebook System */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <RotateCcw className="w-6 h-6 text-emerald-600" />
            Study Strategy: The 40-40-20 Rule & 3-Notebook System
          </h2>

          <p className="text-slate-700 leading-relaxed">
            A common mistake is spending 80% of your study time passively reading books. For an objective Computer-Based Test (CBT), distribute your daily study hours using the <strong>40-40-20 Rule</strong>:
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1">
              <span className="text-2xl font-black text-blue-700">40%</span>
              <span className="font-extrabold text-slate-900 text-sm block">Learn Concepts</span>
              <p className="text-xs text-slate-600">Read chapters, understand theories & core fundamentals.</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-1">
              <span className="text-2xl font-black text-indigo-700">40%</span>
              <span className="font-extrabold text-slate-900 text-sm block">Practice MCQs</span>
              <p className="text-xs text-slate-600">Solve chapter-wise objective questions & PYQ sets.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
              <span className="text-2xl font-black text-emerald-700">20%</span>
              <span className="font-extrabold text-slate-900 text-sm block">Revise & Error Log</span>
              <p className="text-xs text-slate-600">Review mistakes, formulas, dates & weak topics.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookCheck className="w-5 h-5 text-indigo-600" /> Maintain the 3-Notebook System:
            </h3>
            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-black text-blue-700 block">Notebook 1: Facts & Schemes</span>
                <p className="text-slate-600">Bihar GK figures, rivers, historical dates, state welfare schemes, national appointments, and formulas.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-black text-rose-700 block">Notebook 2: Mistake Log</span>
                <p className="text-slate-600">Every single MCQ or mock test question you marked incorrectly or guessed, with the correct explanation.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-black text-emerald-700 block">Notebook 3: Quick Revision</span>
                <p className="text-slate-600">Ultra-short keywords, mnemonics, accounting golden rules, computer shortcuts, and grammar rules for final 48-hour revision.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: 30-Day BSFC Study Plan */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            30-Day Bihar BSFC Preparation Roadmap
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs shrink-0">Days 1–7</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">General Studies + Bihar GK</h4>
                <p className="text-xs text-slate-600 mt-0.5">Indian History, Geography, Polity, Bihar history (Magadha, Champaran), Bihar geography, economy & current affairs.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-black text-xs shrink-0">Days 8–14</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Reasoning + Indian Language (Hindi/English)</h4>
                <p className="text-xs text-slate-600 mt-0.5">Series, Coding-Decoding, Blood Relations, Syllogisms, Hindi grammar (Sandhi, Samas, Muhavare), and English error detection.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-black text-xs shrink-0">Days 15–21</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Post-Specific Domain Subject</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  <strong>LDC:</strong> Computer Awareness & typing | <strong>Asst Mgr:</strong> Management & Agriculture | <strong>Accountant/AAO:</strong> Accounting & Auditing | <strong>QC:</strong> Agriculture.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-black text-xs shrink-0">Days 22–26</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Previous-Year Question Papers (Timed Mode)</h4>
                <p className="text-xs text-slate-600 mt-0.5">Solve full past papers under strict timer conditions, check accuracy, and analyze mistakes.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs shrink-0">Days 27–30</span>
              <div>
                <h4 className="font-black text-emerald-950 text-sm">Full-Length Mock Tests & Mistake Log Mastery</h4>
                <p className="text-xs text-emerald-800 mt-0.5">Take 1 mock test daily, revise Error Notebook and Bihar GK short facts. No new topics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Common Mistakes to Avoid */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            Top 6 Common Mistakes Candidates Make
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">1. Buying too many overlapping books</h4>
              <p className="text-slate-600">More books do not mean better preparation. Re-reading 5 targeted books 4 times yields vastly higher scores than reading 15 books once.</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">2. Ignoring Bihar-Specific GK</h4>
              <p className="text-slate-600">National GK alone will leave you struggling in state-specific questions on Bihar history, rivers, schemes, and economy.</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">3. Using an outdated BSFC syllabus</h4>
              <p className="text-slate-600">Always consult the official BCECEB 2026 prospectus dated 24 August 2026 rather than syllabus tables printed in old books.</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">4. Treating all BSFC posts as identical</h4>
              <p className="text-slate-600">LDC ≠ Assistant Manager ≠ Accountant ≠ Quality Controller. Match your book purchases strictly to your applied post.</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">5. Leaving PYQs until the final week</h4>
              <p className="text-slate-600">Solve previous year questions from day one to develop exam instincts, understand question depth, and highlight high-yield topics.</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">6. Not practising typing for LDC</h4>
              <p className="text-slate-600">Typing speed cannot be mastered in 10 days after written results. Practice typing on a physical keyboard 30 minutes daily.</p>
            </div>
          </div>
        </section>

        {/* Section 8: FAQs Accordion */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Frequently Asked Questions (FAQs)
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-2 text-xs sm:text-sm text-slate-700 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Verdict Card */}
        <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black">Final Verdict: Choose Post-Specific Books, Not Hype</h2>
          </div>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Don't search for a single magical "Bihar BSFC Book". Follow this simple formula: <strong>Lucent GK + Dedicated Bihar GK + R.S. Aggarwal Reasoning + Language Book + Your Post-Specific Domain Resource + BSFC Solved Papers</strong>. Practice questions daily, track mistakes in your error notebook, and take regular mock tests!
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link 
              to="/bihar-state-food-civil-supplies-corporation-ltd-bsfc-under-the-food-consumer-protection-department-govt-of-bihar-259-accountant-lower-grade-cle-recruitment-2026" 
              className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" /> View Bihar BSFC Vacancy (259 Posts)
            </Link>
            <Link 
              to="/articles" 
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Browse All Exam Guides
            </Link>
          </div>
        </section>

        {/* Comments Section */}
        <div id="comments-section">
          <CommentsSection 
            pageId="best-books-for-bihar-bsfc" 
            pageTitle="Best Books for Bihar BSFC 2026: Subject-Wise Books for LDC, Assistant Manager, Accountant & Other Posts"
          />
        </div>

        {/* Subscription Newsletter */}
        <SubscribeWidget />

      </div>

      {/* Sticky Bottom Bar */}
      <ArticleStickyBottomBar 
        title="Best Books for Bihar BSFC 2026: Subject-Wise Books for LDC, Assistant Manager, Accountant"
        description="Comprehensive guide to the best books for Bihar BSFC 2026 preparation: Subject-wise book recommendations for LDC, AM, Accountant, and Quality Controller."
      />
    </div>
  );
}
