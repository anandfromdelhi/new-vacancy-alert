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
  ShoppingCart, ExternalLink, Cpu, Wrench, Building2, Microscope, Scale
} from 'lucide-react';
import CommentsSection from '../components/CommentsSection';
import SubscribeWidget from '../components/SubscribeWidget';
import ArticleStickyBottomBar from '../components/ArticleStickyBottomBar';

export const MPESB_BOOK_LINKS = {
  EXAMCART_PYQ: "https://www.amazon.in/Examcart-Syllabus-Questions-Chapterwise-Solutions/dp/9375165132?crid=2LKUQ05ZI6F1Y&dib=eyJ2IjoiMSJ9.oMhH3q3KUnMOfKv3e2lfPSaKNZAkWLQ14TbagB-ZxGEq4Sx9WBm6pXpkosPJNpGekntAo_QShGpGEdj6wmHV3w.svSn_fC2aiSZoMPKVCPFAKKkN2G4xqSJqqeVOzrzXY8&dib_tag=se&keywords=Examcart+MPESB+Chapterwise+Solved+PYQs+%282016%E2%80%932025%29&qid=1788086696&sprefix=examcart+mpesb+chapterwise+solved+pyqs+2016+2025+%2Caps%2C750&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=72149f1c1b928253393a3ddf6a83dc5e&ref_=as_li_ss_tl",
  LUCENT_GK: "https://www.amazon.in/Lucents-General-Knowledge-2026-Competitive/dp/B0GDQLFJSB?crid=364TXC0L3MTLS&dib=eyJ2IjoiMSJ9.z9CRJK3L9Cx3omeaNBhHEhOQH87J21zjBZxR9mZOQWNE_wkVo9XxrRcecuA_mjlvCifdA91ZMYfrAwy3udSDhoD7NUAs0t7qjZODn7KwZVfme3NlGdu7Crhwz8bQ9ihNQO1vm8XEm1pzef8LLpDJ5sfHZDGCs4aqcqAQFWQWR0Qpx2d5fyOiXrxaqwNaA4fPlz15_a1bRcvIhLiixmjL_19u4xcBDy3UgPcVktyRGkQ.XVbPFDyMnYKIWigPm6qvBT87fTUTAsadxD5HerTqybQ&dib_tag=se&keywords=Lucent%27s+General+Knowledge+%28Hindi+or+English%29&qid=1788086773&sprefix=lucent%27s+general+knowledge+hindi+or+english+%2Caps%2C252&sr=8-2&linkCode=ll2&tag=newvacancyale-21&linkId=342c07210bab59ac77f4272d42266265&ref_=as_li_ss_tl",
  MCGRAW_HILL_MP_GK: "https://www.amazon.in/Introduction-Pradesh-General-Knowledge-English/dp/935532054X?crid=23EG2N99Q2RWB&dib=eyJ2IjoiMSJ9.u3XsPlyl_qrX0NybjJ5iSA.yLEcu2bEzQBJUwTGPzxSnj9V95UOQOyL82cFPYEFWt8&dib_tag=se&keywords=McGraw+Hill+%E2%80%93+An+Introduction+to+MP+GK+%287th+Ed%29+%2F+Parikshadham+2026&nsdOptOutParam=true&qid=1788086735&sprefix=mcgraw+hill+an+introduction+to+mp+gk+7th+ed+%2F+parikshadham+2026%2Caps%2C269&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=ada6412081f48476416b967dc5d9f822&ref_=as_li_ss_tl",
  PARIKSHADHAM_MP_GK: "https://www.amazon.in/s?k=Parikshadham+Madhya+Pradesh+GK+2026&tag=newvacancyale-21",
  MP_ATLAS: "https://www.amazon.in/s?k=Madhya+Pradesh+Atlas+Map+Book&tag=newvacancyale-21",
  RS_MATHS: "https://www.amazon.in/Quantitative-Aptitude-Revised-2025-Competitive/dp/B0D6VFV3ZP?crid=9PPVBZPHD02C&dib=eyJ2IjoiMSJ9.VkujiB2B1ecVnsMClRRrpNeHUstiJWme5OSH-29Vgk_UwTWBHS_CivtAtcBXwRJ_w8hSbGpmcFeLJkV-B6LaXPKkQxDJu2oHOfXOiiphrzLCNxR26xe85ISG3qp-GNnJCPCLdpA-Hgj6ts_jI4rjrKDDfcyh1x-SE5leBHTXBNRPb1Owjv6zbm-1u1H7NAKe7Yr_qXdIzST6BthuU0B8cVBoBF5S5vKJT9ZcF1NrjR4.KzLY54tiKStrLv_DcD3jXf_nsVFxiyuW2aJVaQOUq4A&dib_tag=se&keywords=R.S.+Aggarwal+%E2%80%93+Quantitative+Aptitude&qid=1788086826&sprefix=r.s.+aggarwal+quantitative+aptitude%2Caps%2C259&sr=8-3&linkCode=ll2&tag=newvacancyale-21&linkId=711b6d22e620612da968c29d77648a1f&ref_=as_li_ss_tl",
  RS_REASONING: "https://www.amazon.in/Approach-Non-Verbal-Reasoning-Questions-Competitive/dp/B0CVGWMLQL?crid=3MVXTGC94A2YR&dib=eyJ2IjoiMSJ9.6D3cK_BLJrnvFNU3fxPIwVmCO6ETfmzNwpLahKlwuA0vPEtzn2rHLN6__wRKznfRCo6srI0aUXRSzbOSf7G9vDiYlmak089WwxFR5whGsebqfqie1HayP-nic8ugYApkgdpML76Hwrgq-Y_tUKIJl7LUy98jamtr3ZYOCDOfQq0zo-DRCclo8qKKzuWDLsvCl1P4sw9VOSKFmpOV2CzV5L9X-MATJt-6miyV0QO23JA.6qUBk_qrVVoWE7i0ztmYOstrHeOotoxslszwqZvUgqk&dib_tag=se&keywords=R.S.+Aggarwal+%E2%80%93+Verbal+%26+Non-Verbal+Reasoning&qid=1788086870&sprefix=r.s.+aggarwal+verbal+%26+non-verbal+reasoning%2Caps%2C298&sr=8-3&linkCode=ll2&tag=newvacancyale-21&linkId=93cb307f912bc4071d5c4e16e82ef083&ref_=as_li_ss_tl",
  SP_BAKSHI_ENGLISH: "https://www.amazon.in/Objective-General-English-SP-Bakshi/dp/9325791714?crid=AXLMIQSZDV8Z&dib=eyJ2IjoiMSJ9.lrl6m-oNeAwW63a3AzrzbRy7yA0r2fogOGb4OiwWpidaqJnegeC_HxuZ1mnEqFY_bVwRwlLeKTJTZEBy-cJxHqNmSzAXcH8FnQqA8cwWqwuxm85gp6ajPP7w_egyV9ZD20X7ij9xwUyCjNmfV3a7s1RiqgRkUvAsd981AHfoEWz12F4xTp5KZy4tz1jSTH68BfWXUP0RYcSbM8OOiB-ZtryS0ByMgEJC2vaXJY2w9l0.3XYpgMOd7IArIdJGMn4CmVfcwA5lSIMfi6LUuYUI-VM&dib_tag=se&keywords=S.P.+Bakshi+%E2%80%93+Objective+General+English&qid=1788086944&sprefix=s.p.+bakshi+objective+general+english%2Caps%2C266&sr=8-3&linkCode=ll2&tag=newvacancyale-21&linkId=dc67bf3e6a009770e082b825f36d6cc4&ref_=as_li_ss_tl",
  LUCENT_HINDI: "https://www.amazon.in/Lucents-Samanya-Gyan-General-Knowledge/dp/B0H9YWR411?crid=1255NHHOV3AQL&dib=eyJ2IjoiMSJ9.TNftVf6msRjczKAEirlX0wlqa65V3csauLDKrosC-GpYr4gxJylyKt2fxsQdmylsU7KEpRVsF6y2RGGd-obYy4ADORzLWa2pdGBozvHzfxBm3pp0mfQdjDmrTc1QxItYildvsC4OY70HItC4jN1CA2VR_CMELsHHrDl6LX1wpDHhLi1dl1CbeydG04-1jygPEw8rnm3esqk6eBj_aAGza8TqxofMTIVzwKLaq4Zrr6Q.PZFIxxjWNQyX2DS-ZgKGOA2zQux1wIDm3Zb1O9vohEg&dib_tag=se&keywords=Lucent%27s+Samanya+Hindi+%2F+Arihant+Samanya+Hindi&qid=1788086909&sprefix=lucent%27s+samanya+hindi+%2F+arihant+samanya+hindi%2Caps%2C260&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=2203b02fd8e40ed60f073e5058679e6a&ref_=as_li_ss_tl",
  NCERT_SCIENCE: "https://www.amazon.in/Study-Package-Science-Objective-Questions/dp/9389187745?crid=25OR3L6CSRTYE&dib=eyJ2IjoiMSJ9.ipgjD6iWItHeTjX9_O7y3jJPw4xXfiiVZ-C-_UzhxoE5XLTuej0Y-7nNIRtPC2r-A8aX86GTZkeHnc0-6JPlDJW9_8jDMrLleCl0Se_zYEgwINVxAOp7M27UpUdQmasy9vLQL10mkBAGhTrWtW04NYjrt3D1um6LAx44u3EfXNxUDjXjbgoBy5NiOwziJ_OteX6Q20tmb7_p_T4FpqlZ6dRHTGHqtKuP57PF8bYSlBB4.bwYFtgnRRENY1cHLqGxraYjNw5UCl9dOyvxS-AiwT-o&dib_tag=se&keywords=NCERT+Class+9+%26+10+Science+%2B+Objective+Practice&nsdOptOutParam=true&qid=1788086980&sprefix=ncert+class+9+%26+10+science+%2B+objective+practice%2Caps%2C269&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=e5063b88515a2fa744d2c28442f2501a&ref_=as_li_ss_tl",
  COMPUTER_AWARENESS: "https://www.amazon.in/Arihant-Computer-Awareness-Revised-Flowcharts/dp/9368405069?crid=1GKG61INS8KEI&dib=eyJ2IjoiMSJ9.cocIbOfHucOL-kwTsrGE8y1AqaQY4yyeePxgK0G4uGb5SvkjVnTUJI4nYSKQxmbRXFfzyPrWJ6Vkd1ePWiCz8ukGr7lLyPn-9vZN-XQnK4_Wgse6GHWpTO3LdUdWE0rj0GSNik77s1x0-q6X982nyKDm7xll1l9-sMuWc0wD-8qrL1VVSjraO34O2UqG1AZwG_E1Qn9tqz-Wk5l-b6eO9a47DbSds_oIRCsxYSE5MTg.dFyZ-YiSSZkL85xBTe_GOydnFn9v2AYrcR8I60IAuY0&dib_tag=se&keywords=Arihant+%2F+Lucent%27s+Computer+Awareness+%2F+Pariksha+Manthan&nsdOptOutParam=true&qid=1788087053&sprefix=arihant+%2F+lucent%27s+computer+awareness+%2F+pariksha+manthan%2Caps%2C312&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=439911cf3ff849c347d60e7db55bee77&ref_=as_li_ss_tl",
  CIVIL_ENGG_BOOK: "https://www.amazon.in/s?k=Civil+Engineering+Handbook+MCQs+Youth+Competition+Times&tag=newvacancyale-21",
  MECH_ENGG_BOOK: "https://www.amazon.in/s?k=Mechanical+Engineering+Objective+Book+RK+Jain+RS+Khurmi&tag=newvacancyale-21",
  ELECT_ENGG_BOOK: "https://www.amazon.in/s?k=Electrical+Engineering+Objective+Book+JB+Gupta+VK+Mehta&tag=newvacancyale-21",
  CS_ENGG_BOOK: "https://www.amazon.in/s?k=Computer+Science+IT+Objective+MCQ+Made+Easy&tag=newvacancyale-21"
};

export default function MpesbBestBooksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const topPicks = [
    { rank: 1, book: "MPESB Chapterwise Solved PYQs – Examcart", bestFor: "Previous Year Question Practice", verdict: "⭐⭐⭐⭐⭐", tag: "Best Overall PYQ", link: MPESB_BOOK_LINKS.EXAMCART_PYQ },
    { rank: 2, book: "McGraw Hill – An Introduction to MP GK (7th Ed)", bestFor: "In-Depth MP General Knowledge", verdict: "⭐⭐⭐⭐⭐", tag: "Best Detailed MP GK", link: MPESB_BOOK_LINKS.MCGRAW_HILL_MP_GK },
    { rank: 3, book: "Lucent's General Knowledge (Hindi/English)", bestFor: "Static General Knowledge", verdict: "⭐⭐⭐⭐⭐", tag: "Static GK Core", link: MPESB_BOOK_LINKS.LUCENT_GK },
    { rank: 4, book: "MP Parikshadham GK 2026 (5th Edition)", bestFor: "Fast Hindi Revision & One-Liners", verdict: "⭐⭐⭐⭐½", tag: "Quick Revision", link: MPESB_BOOK_LINKS.PARIKSHADHAM_MP_GK },
    { rank: 5, book: "R.S. Aggarwal – Quantitative Aptitude", bestFor: "Mathematics Fundamentals & Speed", verdict: "⭐⭐⭐⭐½", tag: "Maths Core", link: MPESB_BOOK_LINKS.RS_MATHS },
    { rank: 6, book: "R.S. Aggarwal – Verbal & Non-Verbal Reasoning", bestFor: "Reasoning & Mental Ability", verdict: "⭐⭐⭐⭐½", tag: "Reasoning Core", link: MPESB_BOOK_LINKS.RS_REASONING },
    { rank: 7, book: "Lucent's Samanya Hindi (सामान्य हिन्दी)", bestFor: "General Hindi Section (व्याकरण)", verdict: "⭐⭐⭐⭐½", tag: "Hindi Standard", link: MPESB_BOOK_LINKS.LUCENT_HINDI },
    { rank: 8, book: "S.P. Bakshi – Objective General English", bestFor: "Grammar, Vocab & Error Spotting", verdict: "⭐⭐⭐⭐", tag: "English Standard", link: MPESB_BOOK_LINKS.SP_BAKSHI_ENGLISH },
    { rank: 9, book: "NCERT Class 9 & 10 Science + Objective Practice", bestFor: "General Science Concepts", verdict: "⭐⭐⭐⭐½", tag: "High-Yield Foundation", link: MPESB_BOOK_LINKS.NCERT_SCIENCE },
    { rank: 10, book: "Computer Awareness / Computer Knowledge Book", bestFor: "Computer Section Fundamentals", verdict: "⭐⭐⭐⭐", tag: "Computer Basics", link: MPESB_BOOK_LINKS.COMPUTER_AWARENESS }
  ];

  const faqs = [
    {
      q: "Which is the best book for MPESB?",
      a: "For general MPESB examinations, a combination of an MPESB previous-year solved questions book (like Examcart Chapterwise PYQs), Lucent's General Knowledge, and a dedicated Madhya Pradesh GK book (McGraw Hill or Parikshadham) is vastly superior to relying on any generic 'all-in-one' guide."
    },
    {
      q: "Which book is best for MPESB Group 3 Sub Engineer?",
      a: "For MPESB Group 3, you need two distinct preparation tracks: Track 1 (General Section - 100 Marks) using MPESB PYQs, MP GK, Maths, Reasoning, Hindi, English, Science, and Computers; Track 2 (Technical Section - 100 Marks) using standard textbooks/MCQ guides matching your specific discipline (Civil, Mechanical, Electrical, Computer Science, Electronics, Agriculture, etc.)."
    },
    {
      q: "Which is the best MP GK book for MPESB?",
      a: "For in-depth and conceptual understanding of Madhya Pradesh history, geography, economy, and government schemes, McGraw Hill's 'An Introduction to Madhya Pradesh General Knowledge' (7th Edition 2026 by Snehil Tripathi, Sonali Bansal & Pavan Choudhary) is top-rated. For quick Hindi-medium revision, MP Parikshadham 2026 is an excellent choice."
    },
    {
      q: "Is Lucent General Knowledge enough for MPESB?",
      a: "Lucent is excellent for static all-India GK (History, Geography, Polity, Economics, Science), but it is NOT sufficient for MP-specific GK. In MPESB exams, state-specific questions on MP rivers, tribal communities, art, culture, and state schemes carry significant weight. Always combine Lucent with a dedicated MP GK book."
    },
    {
      q: "Is an MPESB PYQ (Previous Year Questions) book necessary?",
      a: "Yes, solving PYQs is mandatory. MPESB questions follow distinct recurring patterns, terminology, and difficulty levels. Solving chapter-wise PYQs from 2016–2025 gives you real exam familiarity and highlights the highest-yielding topics."
    },
    {
      q: "Can I crack MPESB without coaching by self-study?",
      a: "Absolutely yes. With a disciplined daily timetable, the official syllabus, 4–6 targeted books, consistent previous year paper practice, and mock test analysis, thousands of aspirants clear MPESB exams through self-study."
    },
    {
      q: "How many books should I buy for MPESB preparation?",
      a: "Buy as few as possible. A candidate needs roughly 4–5 books for the General section (PYQ book, MP GK, Lucent GK, Maths/Reasoning, Hindi/English) and 1–2 focused books for their technical engineering trade. Collecting 15 books creates overload; revising 5 books repeatedly brings selection."
    },
    {
      q: "What is the exam pattern for MPESB Group 3 Combined Exam 2026?",
      a: "The exam consists of a single 3-hour Computer-Based Test (CBT) of 200 Questions / 200 Marks: Part A (100 Marks) covers General Knowledge, General Hindi, General English, Mathematics, Reasoning Ability, General Science, and Computer Knowledge; Part B (100 Marks) covers Technical/Trade Subject Questions with 0.25 negative marking."
    },
    {
      q: "Which MPESB books are best for Hindi Medium candidates?",
      a: "For Hindi-medium aspirants: 1. Examcart MPESB Chapterwise Solved PYQs (Hindi), 2. MP Parikshadham GK 2026 (Hindi), 3. Lucent Samanya Gyan (Hindi), 4. Lucent Samanya Hindi, and 5. Technical objective guides in Hindi/Bilingual."
    },
    {
      q: "Should I read R.S. Aggarwal from cover to cover?",
      a: "No. Do not attempt to finish every single chapter or 1,000+ questions in R.S. Aggarwal. Focus only on topics listed in the official MPESB syllabus (Percentages, Ratio, Averages, Profit & Loss, Time & Work, Speed & Distance, Simplification) and practice under timed conditions."
    }
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Best Books for MPESB 2026: Subject-Wise Best Books for MPESB Group 3 Preparation",
    "description": "Looking for the best books for MPESB 2026? Complete guide to subject-wise books for GK, MP GK, Maths, Reasoning, Hindi, English, Science, Computer, and Group 3 Sub Engineer technical streams.",
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
        <title>Best Books for MPESB 2026: Subject-Wise Books for MPESB Group 3 Preparation | NewVacancyAlert</title>
        <meta name="description" content="Looking for the best books for MPESB 2026? Check the best MPESB books for GK, MP GK, Maths, Reasoning, Hindi, English, Science, Computer and Group 3 technical preparation." />
        <link rel="canonical" href="https://newvacancyalert.in/best-books-for-mpesb" />
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
            <span className="text-amber-400 truncate">Best Books for MPESB 2026</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> 2026 Updated Syllabus Guide
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">

        {/* Hero Header Card */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200/60">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> MPESB 2026 Master Guide
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200/60">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> 18 min read
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Updated: August 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Best Books for MPESB 2026: Subject-Wise Best Books for MPESB Group 3 Preparation
          </h1>

          <div className="prose max-w-none text-slate-700 text-base sm:text-lg leading-relaxed space-y-4 pt-2 border-t border-slate-100">
            <p>
              Choosing the right MPESB books can make a major difference in your preparation score and final merit rank. Whether you are preparing for <strong>MPESB Group 3, Sub Engineer (उपयंत्री), Draftsman (मानचित्रकार), Laboratory Technician (प्रयोगशाला तकनीशियन)</strong>, or another MPESB recruitment examination, you should never depend on a single random "all-in-one" guide.
            </p>
            <p>
              The most effective MPESB preparation strategy combines <strong>one reliable book for General Knowledge</strong>, <strong>one dedicated Madhya Pradesh GK book</strong>, standard practice manuals for <strong>Maths, Reasoning, Hindi, English, Science, and Computers</strong>, a dedicated technical subject book tailored to your engineering branch, and most crucially, <strong>MPESB previous year question papers (PYQs) and mock tests</strong>.
            </p>
            <div className="bg-blue-50/80 border-l-4 border-blue-600 p-4 rounded-r-xl text-sm sm:text-base text-blue-950 font-medium space-y-1">
              <p>
                <strong>📢 Official MPESB Group 3 Combined Recruitment 2026 Context:</strong>
              </p>
              <p className="text-blue-900">
                The Madhya Pradesh Employees Selection Board (MPESB, Bhopal) has officially released the detailed rulebook for the <em>Group-03 Sub-Engineer, Draftsman, Lab Technician and Other Equivalent Combined Recruitment Test 2026 (II)</em> offering <strong>1,700 vacancies</strong> across MP government departments. The 200-mark Computer-Based Test (CBT) commences from <strong>07 October 2026</strong>.
              </p>
            </div>
            <p className="text-slate-600 text-sm italic">
              This comprehensive guide explains which books are actually worth buying, which redundant guides you should skip, the best books for each subject, top MPESB books in Hindi, and how to combine them for maximum retention and speed.
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
              Quick Answer: Which Is the Best Book for MPESB?
            </h2>
          </div>
          <p className="text-slate-700 font-medium">
            If you want the short answer, <strong>there is no single best book for every MPESB exam</strong> because MPESB conducts various recruitment tests where the technical/trade component changes according to the post.
          </p>
          
          <div className="overflow-x-auto rounded-xl border border-amber-200/80 bg-white/95 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-amber-100/70 border-b border-amber-200 text-slate-900 font-black">
                  <th className="py-3 px-3 sm:px-4">Subject / Purpose</th>
                  <th className="py-3 px-3 sm:px-4">Recommended Book / Resource</th>
                  <th className="py-3 px-3 sm:px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <BookCheck className="w-4 h-4 text-emerald-600 shrink-0" /> MPESB Solved PYQs
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">Examcart MPESB Chapterwise Solved PYQs (2016–2025)</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.EXAMCART_PYQ} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600 shrink-0" /> Madhya Pradesh GK
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">McGraw Hill – An Introduction to MP GK (7th Ed) / Parikshadham 2026</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.MCGRAW_HILL_MP_GK} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Library className="w-4 h-4 text-blue-600 shrink-0" /> General Knowledge (All India)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">Lucent's General Knowledge (Hindi or English)</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.LUCENT_GK} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-teal-600 shrink-0" /> General Mathematics
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">R.S. Aggarwal – Quantitative Aptitude</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.RS_MATHS} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-purple-600 shrink-0" /> Logical Reasoning
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">R.S. Aggarwal – Verbal & Non-Verbal Reasoning</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.RS_REASONING} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-600 shrink-0" /> Samanya Hindi (सामान्य हिन्दी)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">Lucent's Samanya Hindi / Arihant Samanya Hindi</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.LUCENT_HINDI} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4 text-sky-600 shrink-0" /> General English
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">S.P. Bakshi – Objective General English</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.SP_BAKSHI_ENGLISH} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Microscope className="w-4 h-4 text-emerald-700 shrink-0" /> General Science
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">NCERT Class 9 & 10 Science + Objective Practice</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.NCERT_SCIENCE} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-600 shrink-0" /> Computer Knowledge
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">Arihant / Lucent's Computer Awareness / Pariksha Manthan</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.COMPUTER_AWARENESS} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-orange-600 shrink-0" /> Technical Subject (Group 3)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">Standard Discipline Objective Guide (Civil / Mech / Elect / CS)</td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <a href={MPESB_BOOK_LINKS.CIVIL_ENGG_BOOK} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition">
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
              <strong>If you can buy only TWO resources:</strong>
              <ol className="list-decimal pl-5 mt-1 font-semibold space-y-0.5">
                <li>MPESB Chapterwise Solved PYQs Book (Examcart)</li>
                <li>Latest Madhya Pradesh GK Book (McGraw Hill or Parikshadham)</li>
              </ol>
              <p className="mt-1 font-normal text-xs text-slate-600">
                (And if preparing for Group 3 Sub Engineer or technical posts, add a 3rd book specifically for your technical branch).
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: What Makes a Good MPESB Book */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Target className="w-6 h-6 text-blue-600" />
            What Makes a Good MPESB Book? (3 Non-Negotiable Criteria)
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Before purchasing any book advertised with an attractive cover claiming to be the "Best MPESB Guide", verify that it fulfills these three critical parameters:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">1</div>
              <h3 className="font-bold text-slate-900 text-base">Matches Latest 2026 Syllabus</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                MPESB holds distinct exams. The Group 3 exam includes <strong>Part A (100 Marks General Aptitude)</strong> and <strong>Part B (100 Marks Technical Discipline)</strong>. Outdated guides designed for other tests will misalign your preparation.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">2</div>
              <h3 className="font-bold text-slate-900 text-base">High-Volume Objective MCQs</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Reading passive theory alone never builds competitive exam fitness. You need hundreds of MCQs per chapter to build <strong>speed, accuracy, elimination instinct, and time management</strong> under the 0.25 negative marking scheme.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">3</div>
              <h3 className="font-bold text-slate-900 text-base">Authentic Previous Year Questions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                PYQs reveal the <strong>exact vocabulary, difficulty level, frequently repeated state facts, and question patterns</strong> that MPESB examiners favor. Real MPESB papers prevent studying out-of-syllabus trivia.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Detailed Book-by-Book Review */}
        <section className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Library className="w-7 h-7 text-indigo-600" />
              Detailed Reviews: Best Books for MPESB 2026
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A comprehensive subject-by-subject evaluation of the best physical and digital resources available for MPESB aspirants.
            </p>
          </div>

          {/* Book 1: Examcart PYQs */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  🥇 Top Pick: #1 Overall Practice
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  1. Examcart MPESB Chapterwise Solved PYQs (2016–2025)
                </h3>
              </div>
              <a 
                href={MPESB_BOOK_LINKS.EXAMCART_PYQ} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Check Price on Amazon
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Key Highlights</span>
                <span className="font-extrabold text-slate-800">560 Pages, Hindi Medium, 2016–2025 Chapter-wise Solved Questions</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Best Suited For</span>
                <span className="font-extrabold text-slate-800">Group 3, Group 4, Patwari, Police, Jail Prahari, Sub Engineer</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Editorial Rating</span>
                <span className="font-extrabold text-emerald-600 text-base">★★★★★ 5.0 / 5.0</span>
              </div>
            </div>

            <div className="text-slate-700 text-sm sm:text-base space-y-2">
              <p>
                <strong>Why we recommend it:</strong> The single biggest advantage of this book is that you are not reading dry theoretical text. You are directly studying questions that have actually appeared in previous MPESB examinations.
              </p>
              <p>
                This helps you identify: <strong>frequently tested concepts, recurring topics, exact question difficulty, calculation patterns, and MP-specific questions.</strong>
              </p>
              <p className="text-rose-700 text-xs font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                ⚠️ Important Limitation: Do not treat this as your sole book for Group 3 technical preparation. Sub Engineer candidates still require a dedicated technical engineering subject book.
              </p>
            </div>
          </div>

          {/* Book 2: Lucent General Knowledge */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  🥈 Static GK Standard
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  2. Lucent's General Knowledge (सामान्य ज्ञान)
                </h3>
              </div>
              <a 
                href={MPESB_BOOK_LINKS.LUCENT_GK} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Check Price on Amazon
              </a>
            </div>

            <div className="text-slate-700 text-sm sm:text-base space-y-2">
              <p>
                Lucent's General Knowledge remains the definitive, compact reference for all Indian competitive examinations. It covers <strong>Indian History, Geography, Indian Polity & Constitution, Economy, General Science, and Static GK trivia</strong>.
              </p>
              <p>
                Its high-density, concise bullet-point presentation makes it ideal for a fast study loop: <strong>Read → Revise → Solve MCQs → Revise again</strong>.
              </p>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold">
                ⚠️ <strong>Crucial Warning:</strong> Lucent GK is NOT sufficient for Madhya Pradesh state-specific GK. You must supplement it with a dedicated MP GK book.
              </div>
            </div>
          </div>

          {/* Book 3: McGraw Hill MP GK */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-indigo-100 text-indigo-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  🥉 Detailed MP GK Masterpiece
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  3. McGraw Hill – An Introduction to Madhya Pradesh General Knowledge (7th Ed 2026)
                </h3>
              </div>
              <a 
                href={MPESB_BOOK_LINKS.MCGRAW_HILL_MP_GK} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Check Price on Amazon
              </a>
            </div>

            <p className="text-slate-700 text-sm sm:text-base">
              Authored by <strong>Snehil Tripathi, Sonali Bansal, and Pavan Choudhary</strong>, the newly updated 7th Edition (2026) provides exhaustive coverage of Madhya Pradesh. It covers MP history, dynastic rulers, freedom movement in MP, rivers, drainage systems, dams, forest reserves, national parks, tribal demographics (Gond, Bhil, Baiga, Sahariya), state cultural festivals, administrative architecture, and recent welfare schemes.
            </p>
          </div>

          {/* Book 4: MP Parikshadham */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-purple-100 text-purple-800 font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  ⚡ Best for Rapid Hindi Revision
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  4. MP GK 2026 / MP Parikshadham (5th Edition)
                </h3>
              </div>
              <a 
                href={MPESB_BOOK_LINKS.PARIKSHADHAM_MP_GK} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Check Price on Amazon
              </a>
            </div>

            <p className="text-slate-700 text-sm sm:text-base">
              For candidates who prefer exam-oriented one-liners, flowcharts, tables, and short factual points in pure Hindi, the 5th Edition (2026) of MP Parikshadham is unbeatable for quick recall in the final 30 days.
            </p>

            {/* Comparison Box: McGraw Hill vs Parikshadham */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 mt-3">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 font-black text-slate-800 border-b border-slate-200">
                    <th className="py-2.5 px-3 sm:px-4">Feature</th>
                    <th className="py-2.5 px-3 sm:px-4">McGraw Hill MP GK</th>
                    <th className="py-2.5 px-3 sm:px-4">Parikshadham MP GK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  <tr>
                    <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Detailed Explanations</td>
                    <td className="py-2 px-3 sm:px-4 text-emerald-700 font-bold">⭐⭐⭐⭐⭐ Comprehensive</td>
                    <td className="py-2 px-3 sm:px-4 text-slate-600">⭐⭐⭐⭐ Moderate</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Quick Revision Speed</td>
                    <td className="py-2 px-3 sm:px-4 text-slate-600">⭐⭐⭐⭐ Moderate</td>
                    <td className="py-2 px-3 sm:px-4 text-emerald-700 font-bold">⭐⭐⭐⭐⭐ Ultra Fast</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Hindi-Medium Flow</td>
                    <td className="py-2 px-3 sm:px-4 text-slate-600">⭐⭐⭐⭐ Good</td>
                    <td className="py-2 px-3 sm:px-4 text-emerald-700 font-bold">⭐⭐⭐⭐⭐ Native Hindi</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">Best Strategy</td>
                    <td className="py-2 px-3 sm:px-4 text-blue-700">If you have 60+ days prep time</td>
                    <td className="py-2 px-3 sm:px-4 text-purple-700">If exam is in next 30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Book 5 to 11: Maths, Reasoning, Hindi, English, Science, Computer */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Maths */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-teal-100 text-teal-800 font-bold text-xs px-2.5 py-0.5 rounded">Mathematics</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐½</span>
                </div>
                <h4 className="font-black text-slate-900 text-lg">5. R.S. Aggarwal – Quantitative Aptitude</h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Focus on high-yield MPESB chapters: Number System, Simplification, Percentage, Ratio & Proportion, Average, Profit & Loss, Simple & Compound Interest, Time & Work, Speed-Time-Distance, and 2D/3D Mensuration.
                </p>
              </div>
              <a href={MPESB_BOOK_LINKS.RS_MATHS} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>

            {/* Reasoning */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-0.5 rounded">Logical Reasoning</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐½</span>
                </div>
                <h4 className="font-black text-slate-900 text-lg">6. R.S. Aggarwal – Verbal & Non-Verbal Reasoning</h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Build concepts in Coding-Decoding, Blood Relations, Direction Sense, Series Completion, Syllogisms, Venn Diagrams, and Non-Verbal Pattern Folding, then solve with a timer.
                </p>
              </div>
              <a href={MPESB_BOOK_LINKS.RS_REASONING} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>

            {/* Hindi */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-rose-100 text-rose-800 font-bold text-xs px-2.5 py-0.5 rounded">General Hindi</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐½</span>
                </div>
                <h4 className="font-black text-slate-900 text-lg">7. Lucent's Samanya Hindi (सामान्य हिन्दी)</h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Covers संधि, समास, उपसर्ग-प्रत्यय, पर्यायवाची, विलोम शब्द, मुहावरे, लोकोक्तियाँ, वाक्य शुद्धि, शब्द शुद्धि, तत्सम-तद्भव, रस, छंद एवं अलंकार with chapter-wise objective exercises.
                </p>
              </div>
              <a href={MPESB_BOOK_LINKS.LUCENT_HINDI} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>

            {/* English */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-sky-100 text-sky-800 font-bold text-xs px-2.5 py-0.5 rounded">General English</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐</span>
                </div>
                <h4 className="font-black text-slate-900 text-lg">8. S.P. Bakshi – Objective General English</h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Ideal for Tenses, Active/Passive Voice, Direct/Indirect Narration, Subject-Verb Agreement, Prepositions, Error Detection, Vocabulary, Synonyms & Antonyms.
                </p>
              </div>
              <a href={MPESB_BOOK_LINKS.SP_BAKSHI_ENGLISH} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>

            {/* Science */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded">General Science</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐½</span>
                </div>
                <h4 className="font-black text-slate-900 text-lg">9. NCERT Class 9 & 10 Science Textbooks</h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Provides unbeatable conceptual clarity for Physics (Motion, Force, Electricity, Optics), Chemistry (Acids/Bases, Metals, Chemical Reactions), and Biology (Human Anatomy, Diseases, Cells).
                </p>
              </div>
              <a href={MPESB_BOOK_LINKS.NCERT_SCIENCE} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>

            {/* Computer Knowledge */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-cyan-100 text-cyan-800 font-bold text-xs px-2.5 py-0.5 rounded">Computer Knowledge</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐</span>
                </div>
                <h4 className="font-black text-slate-900 text-lg">10. Arihant / Lucent's Computer Awareness</h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Covers Computer Architecture, Windows OS, MS Word, Excel, PowerPoint, Networking protocols, Internet, Cyber Security, Shortcuts, and basic binary representations.
                </p>
              </div>
              <a href={MPESB_BOOK_LINKS.COMPUTER_AWARENESS} target="_blank" rel="noopener noreferrer nofollow" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy on Amazon
              </a>
            </div>

          </div>
        </section>

        {/* Section 3: Group 3 Technical Subjects Guide */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-lg space-y-6">
          <div className="space-y-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Group 3 Engineering Special
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              The Most Important Strategy for MPESB Group 3 Sub Engineer
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              The MPESB Group 3 Combined Examination consists of a <strong>200-mark paper</strong> divided into <strong>TWO distinct 100-mark halves</strong>:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">Track 1 (100 Marks)</span>
              <h4 className="font-extrabold text-white text-base">General Aptitude & Abilities</h4>
              <p className="text-xs text-slate-300">
                General Knowledge, MP GK, General Hindi, General English, Mathematics, Reasoning, Science, and Computer Knowledge.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-2">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block">Track 2 (100 Marks)</span>
              <h4 className="font-extrabold text-white text-base">Discipline Technical Domain</h4>
              <p className="text-xs text-slate-300">
                100 Questions from your core Diploma/Degree branch (Civil, Electrical, Mechanical, CS/IT, Agriculture, etc.).
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 space-y-3">
            <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <Wrench className="w-5 h-5" /> Discipline-Wise Recommended Books for Sub Engineer:
            </h3>

            <div className="grid md:grid-cols-3 gap-3.5 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-1.5">
                <span className="font-black text-cyan-300 block text-sm">Civil Engineering</span>
                <p className="text-slate-300">Building Materials, Surveying, Strength of Materials (SOM), RCC & Steel Design, Hydraulics, Soil Mechanics, Highway Engg.</p>
                <p className="text-amber-300 font-bold pt-1">Recommended: Youth Competition Times Civil Engg / Made Easy Objective</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-1.5">
                <span className="font-black text-emerald-300 block text-sm">Mechanical Engineering</span>
                <p className="text-slate-300">Engineering Mechanics, SOM, Thermodynamics, IC Engines, Fluid Mechanics, Theory of Machines, Manufacturing Science.</p>
                <p className="text-amber-300 font-bold pt-1">Recommended: R.K. Jain Objective / R.S. Khurmi Mechanical</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-1.5">
                <span className="font-black text-purple-300 block text-sm">Electrical Engineering</span>
                <p className="text-slate-300">Circuits & Fields, AC/DC Machines, Power Systems, Transmission & Distribution, Measurements, Power Electronics, Control.</p>
                <p className="text-amber-300 font-bold pt-1">Recommended: J.B. Gupta Objective / V.K. Mehta Electrical</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            * Always match the prescribed syllabus in the official MPESB Rulebook against your book index before buying.
          </p>
        </section>

        {/* Section 4: Recommended Combinations */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Layers className="w-6 h-6 text-indigo-600" />
            Best MPESB Book Combination for Beginners
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Option 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">Option 1</span>
                <h3 className="font-black text-slate-900 text-lg mt-1">Minimum Budget</h3>
                <ul className="text-xs text-slate-700 space-y-2 mt-3">
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Examcart MPESB PYQ Book</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Parikshadham MP GK</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> One Core Branch Technical Book</li>
                  <li className="flex items-start gap-1.5 text-slate-500 font-medium">+ Free NCERTs for Science & Maths</li>
                </ul>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-200 text-center">Cost: ~₹900 - ₹1,200</span>
            </div>

            {/* Option 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5 space-y-3 flex flex-col justify-between relative shadow-xs">
              <div className="absolute -top-3 right-4 bg-blue-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Recommended
              </div>
              <div>
                <span className="bg-blue-200 text-blue-900 text-[10px] font-black uppercase px-2 py-0.5 rounded">Option 2</span>
                <h3 className="font-black text-slate-900 text-lg mt-1">Serious Full Preparation</h3>
                <ul className="text-xs text-slate-700 space-y-2 mt-3">
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" /> Examcart MPESB Solved PYQs</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" /> McGraw Hill MP GK (7th Ed)</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" /> Lucent's General Knowledge</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" /> R.S. Aggarwal Maths + Reasoning</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" /> Lucent Samanya Hindi + SP Bakshi</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" /> Core Branch Technical Guide</li>
                </ul>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-white p-2 rounded-lg border border-blue-200 text-center">Cost: ~₹2,200 - ₹2,800</span>
            </div>

            {/* Option 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">Option 3</span>
                <h3 className="font-black text-slate-900 text-lg mt-1">Hindi Medium Focus</h3>
                <ul className="text-xs text-slate-700 space-y-2 mt-3">
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> Examcart Hindi PYQs</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> MP Parikshadham GK 2026</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> Lucent Samanya Gyan (Hindi)</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> Lucent Samanya Hindi</li>
                  <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> Bilingual Technical Notes / Guide</li>
                </ul>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-200 text-center">Cost: ~₹1,400 - ₹1,800</span>
            </div>
          </div>
        </section>

        {/* Section 5: Top 10 Ranked Books Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Award className="w-6 h-6 text-amber-500" />
            Top 10 MPESB Books: Our Final Ranking
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 font-black text-slate-800 border-b border-slate-200">
                  <th className="py-3 px-3 sm:px-4 text-center">Rank</th>
                  <th className="py-3 px-3 sm:px-4">Book / Resource</th>
                  <th className="py-3 px-3 sm:px-4">Best For</th>
                  <th className="py-3 px-3 sm:px-4 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {topPicks.map((pick) => (
                  <tr key={pick.rank} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 sm:px-4 text-center font-black text-slate-900">
                      {pick.rank === 1 ? '🥇 1' : pick.rank === 2 ? '🥈 2' : pick.rank === 3 ? '🥉 3' : pick.rank}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                      <a href={pick.link} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-blue-600 transition flex items-center gap-1.5">
                        {pick.book}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                    <td className="py-2.5 px-3 sm:px-4">{pick.bestFor}</td>
                    <td className="py-2.5 px-3 sm:px-4 text-center text-amber-500 font-bold">{pick.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Study Cycle & PYQ Importance */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <RotateCcw className="w-6 h-6 text-emerald-600" />
            Why Previous Year Questions Beat Buying More Books (The 5-Step Study Cycle)
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Many candidates fall into the trap of purchasing <em>Book 1 → Book 2 → Book 3 → Book 4</em> but never solving enough timed questions. Real mastery comes from this continuous loop:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
              <span className="text-xs font-black text-blue-700 block">Step 1</span>
              <span className="font-extrabold text-slate-900 text-sm">Study Concept</span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5">
              <span className="text-xs font-black text-indigo-700 block">Step 2</span>
              <span className="font-extrabold text-slate-900 text-sm">Practice 50 MCQs</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
              <span className="text-xs font-black text-purple-700 block">Step 3</span>
              <span className="font-extrabold text-slate-900 text-sm">Analyze Errors</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <span className="text-xs font-black text-amber-700 block">Step 4</span>
              <span className="font-extrabold text-slate-900 text-sm">Revise Weak Spot</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 col-span-2 sm:col-span-1">
              <span className="text-xs font-black text-emerald-700 block">Step 5</span>
              <span className="font-extrabold text-slate-900 text-sm">Re-Test & Retain</span>
            </div>
          </div>
        </section>

        {/* Section 7: 30-Day MPESB Study Plan */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            30-Day MPESB Crash Study Roadmap
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs shrink-0">Days 1–7</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">MP GK + Static GK High-Yield Topics</h4>
                <p className="text-xs text-slate-600 mt-0.5">MP rivers, dams, national parks, tribal culture, state schemes, Indian polity articles, and freedom movement.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-black text-xs shrink-0">Days 8–14</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Maths + Reasoning + Hindi Grammar</h4>
                <p className="text-xs text-slate-600 mt-0.5">Daily 50 Arithmetic MCQs, 50 Reasoning puzzles, and Hindi vocabulary/grammar rules.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-black text-xs shrink-0">Days 15–21</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Technical Domain Core Chapters</h4>
                <p className="text-xs text-slate-600 mt-0.5">Dedicate 60% of study hours strictly to your engineering trade (Civil / Mech / Electrical / CS).</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-black text-xs shrink-0">Days 22–26</span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Full-Length Timed PYQ Papers</h4>
                <p className="text-xs text-slate-600 mt-0.5">Solve full 200-question papers in 3-hour exam conditions and record mistakes in a separate log.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs shrink-0">Days 27–30</span>
              <div>
                <h4 className="font-black text-emerald-950 text-sm">Formula Revision & Error Log Mastery</h4>
                <p className="text-xs text-emerald-800 mt-0.5">Zero new topics. Pure revision of formulas, short notes, MP current affairs, and wrong answer log.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Common Mistakes to Avoid */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            Top 5 Common Mistakes While Choosing MPESB Books
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">1. Buying a book merely because it says "MPESB"</h4>
              <p className="text-slate-600">The title on the cover does not guarantee quality. Always verify the publishing year, syllabus index, and solutions quality.</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">2. Preparing only National GK and ignoring MP GK</h4>
              <p className="text-slate-600">MP-specific geography, tribal heritage, history, and government schemes carry critical weight in MPESB scoring.</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">3. Neglecting the Technical Section in Group 3</h4>
              <p className="text-slate-600">For Sub Engineer & Lab Technician, the technical paper carries 100 out of 200 marks (50% of the entire paper!).</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
              <h4 className="font-bold text-rose-900">4. Taking Mock Tests without Analyzing Mistakes</h4>
              <p className="text-slate-600">A mock test is useless if you just glance at the raw score. Maintain an Error Diary and re-test every question you got wrong.</p>
            </div>
          </div>
        </section>

        {/* Section 9: FAQs Accordion */}
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
            <h2 className="text-xl sm:text-2xl font-black">Final Verdict: Build a Small, High-Yield Bookshelf</h2>
          </div>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            The biggest mistake is endlessly searching for a magical "Best MPESB Book". The winning formula is simple: <strong>One MPESB Chapterwise PYQ Book + One Detailed MP GK Book + Lucent Static GK + R.S. Aggarwal Maths/Reasoning + Core Discipline Technical Guide</strong>. Spend 70% of your prep time solving questions, analyzing mistakes, and taking mocks!
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link 
              to="/mpesb-group-3-sub-engineer-recruitment-2026" 
              className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" /> View MPESB Group 3 Vacancy (1,700 Posts)
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
            pageId="best-books-for-mpesb" 
            pageTitle="Best Books for MPESB 2026: Subject-Wise Best Books for MPESB Group 3 Preparation"
          />
        </div>

        {/* Subscription Newsletter */}
        <SubscribeWidget />

      </div>

      {/* Sticky Bottom Bar */}
      <ArticleStickyBottomBar 
        title="Best Books for MPESB 2026: Subject-Wise Best Books for MPESB Group 3 Preparation"
        description="Comprehensive guide to the best books for MPESB Group 3 Preparation: Subject-wise book recommendations, MP GK, PYQs, and 30-day study timetable."
      />
    </div>
  );
}
