import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  BookOpen, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Target, BarChart2, Calendar, Award, BookCheck, Check, 
  RotateCcw, FileText, Star, Calculator, Flame, Lightbulb, Compass,
  Briefcase, CheckSquare, Zap, AlertTriangle, Library, BookmarkCheck
} from 'lucide-react';
import MarketingPartnerBanner from '../components/MarketingPartnerBanner';
import CommentsSection from '../components/CommentsSection';
import SubscribeWidget from '../components/SubscribeWidget';
import ArticleStickyBottomBar from '../components/ArticleStickyBottomBar';

export default function RrbNtpcBestBooksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const topPicks = [
    { rank: 1, book: "Disha Guide to RRB NTPC", bestFor: "Complete preparation", verdict: "⭐⭐⭐⭐⭐", tag: "Best All-in-One" },
    { rank: 2, book: "Arihant Study Package for RRB NTPC", bestFor: "Structured preparation", verdict: "⭐⭐⭐⭐⭐", tag: "Top Alternative" },
    { rank: 3, book: "PW All-in-One RRB NTPC Guide", bestFor: "Beginners & guided preparation", verdict: "⭐⭐⭐⭐½", tag: "Student Favorite" },
    { rank: 4, book: "R.S. Aggarwal Quantitative Aptitude", bestFor: "Maths fundamentals", verdict: "⭐⭐⭐⭐½", tag: "Maths Basics" },
    { rank: 5, book: "R.S. Aggarwal Verbal & Non-Verbal Reasoning", bestFor: "Reasoning fundamentals", verdict: "⭐⭐⭐⭐½", tag: "Reasoning Core" },
    { rank: 6, book: "Lucent General Knowledge", bestFor: "Static GK", verdict: "⭐⭐⭐⭐⭐", tag: "Static GK Standard" },
    { rank: 7, book: "Kiran/Disha RRB NTPC PYQs", bestFor: "Previous-year practice", verdict: "⭐⭐⭐⭐⭐", tag: "Must-Have PYQs" },
    { rank: 8, book: "Fast Track Objective Arithmetic", bestFor: "Faster arithmetic", verdict: "⭐⭐⭐⭐", tag: "Speed Maths" },
    { rank: 9, book: "Magical Book on Quicker Maths", bestFor: "Calculation speed", verdict: "⭐⭐⭐⭐", tag: "Shortcuts" },
    { rank: 10, book: "Manorama Yearbook", bestFor: "Broader general awareness", verdict: "⭐⭐⭐½", tag: "Annual Reference" }
  ];

  const faqs = [
    {
      q: "Which is the best book for RRB NTPC?",
      a: "For an all-in-one preparation approach, Disha's RRB NTPC Guide and Arihant's RRB NTPC Study Package are among the strongest options to consider. PW's All-in-One guide is another useful alternative. The best choice depends on your preparation level."
    },
    {
      q: "Which is the best book for RRB NTPC Maths?",
      a: "For fundamentals, R.S. Aggarwal Quantitative Aptitude is a strong choice. For RRB-specific preparation, combine it with a dedicated RRB NTPC Maths PYQ book. Candidates who already have strong fundamentals can also use resources such as Fast Track Objective Arithmetic or Magical Book on Quicker Maths for speed improvement."
    },
    {
      q: "Which is the best book for RRB NTPC Reasoning?",
      a: "A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal is a strong option for building fundamentals. For exam-specific practice, follow it with RRB NTPC PYQs."
    },
    {
      q: "Is Lucent GK enough for RRB NTPC?",
      a: "No, not by itself. Lucent is excellent for static General Knowledge, but RRB NTPC General Awareness includes current events and a broad range of topics. Use: Lucent + Current Affairs + PYQs instead of Lucent alone."
    },
    {
      q: "Which is the best book for RRB NTPC General Awareness?",
      a: "For static GK, Lucent General Knowledge is one of the most useful choices. For current affairs, use a reliable monthly current-affairs source. For RRB-specific preparation, also solve previous-year GA questions."
    },
    {
      q: "Which is the best book for RRB NTPC CBT 1?",
      a: "For CBT 1, an all-in-one guide such as Disha, Arihant or PW can provide a useful foundation. However, CBT 1 preparation should also include: Subject-wise PYQs, Mock tests, Current affairs, and Speed practice."
    },
    {
      q: "Which is the best book for RRB NTPC CBT 2?",
      a: "The same core books can be used, but CBT 2 requires more intensive practice because it contains 120 questions in 90 minutes. Pay particular attention to General Awareness because CBT 2 currently allocates 50 of its 120 questions to GA."
    },
    {
      q: "Can I prepare for RRB NTPC with only one book?",
      a: "You can start with one all-in-one book, but relying on only one book for the complete preparation is not recommended. At minimum, add: Previous-year papers + current affairs + mock tests."
    },
    {
      q: "Should I buy both Disha and Arihant?",
      a: "Usually, no. Both can function as primary comprehensive resources. Choose one and complete it properly. Use your remaining budget for PYQs and mock tests."
    },
    {
      q: "Is R.S. Aggarwal good for RRB NTPC?",
      a: "Yes. R.S. Aggarwal books are particularly useful for building fundamentals in Mathematics and Reasoning. However, because they are broader competitive-exam books rather than exclusively RRB NTPC books, combine them with RRB-specific PYQs."
    },
    {
      q: "Is an RRB NTPC PYQ book necessary?",
      a: "For serious preparation, yes, highly recommended. PYQs help you understand the actual question style, recurring concepts, difficulty level and time requirements."
    },
    {
      q: "How many books should I use for RRB NTPC?",
      a: "For most candidates, a focused set of around 4–6 core resources is more than enough: One comprehensive guide, One Maths resource if required, One Reasoning resource if required, Lucent/static GK, RRB NTPC PYQs, and Current affairs. You do not need 15 books."
    },
    {
      q: "Which book is best for RRB NTPC beginners?",
      a: "A comprehensive all-in-one guide from a recognized publisher is usually the easiest starting point. Disha, Arihant and PW are the major options currently visible in search results."
    },
    {
      q: "Which book is best for RRB NTPC 12th-level candidates?",
      a: "The core subjects remain Mathematics, General Intelligence & Reasoning and General Awareness. A beginner-friendly all-in-one book combined with PYQs and current affairs is a practical approach."
    },
    {
      q: "Which book is best for RRB NTPC Graduate candidates?",
      a: "Graduate candidates can use the same core subject resources, but should place greater emphasis on: PYQs, CBT 2, Speed, Accuracy, Current affairs, and Post-specific skill-test preparation where applicable."
    }
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Best Books for RRB NTPC 2026: Subject-Wise Best Books for Maths, Reasoning, GK & Previous Year Papers",
    "description": "Comprehensive guide to the best books for RRB NTPC 2026 preparation covering Mathematics, Reasoning, Static GK, Current Affairs, and previous year question papers.",
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
    "datePublished": "2026-08-25",
    "dateModified": "2026-08-25"
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
        <title>Best Books for RRB NTPC 2026: Subject-Wise Maths, Reasoning, GK & PYQs</title>
        <meta name="description" content="Choosing the best books for RRB NTPC 2026: Detailed subject-wise breakdown for Mathematics, Reasoning, General Awareness, PYQs, CBT 1 & CBT 2 study strategies." />
        <link rel="canonical" href="https://newvacancyalert.in/best-books-for-rrb-ntpc" />
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
            <span className="text-amber-400 truncate">Best Books for RRB NTPC 2026</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Syllabus Guide
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">

        {/* Hero Header Card */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200/60">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> RRB NTPC 2026 Special Guide
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200/60">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> 15 min read
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Updated: August 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Best Books for RRB NTPC 2026: Subject-Wise Best Books for Maths, Reasoning, GK & Previous Year Papers
          </h1>

          <div className="prose max-w-none text-slate-700 text-base sm:text-lg leading-relaxed space-y-4 pt-2 border-t border-slate-100">
            <p>
              Choosing the best book for RRB NTPC can save you months of preparation time. But there is one important thing that many candidates get wrong: <strong>there is no single book that is automatically the best for every RRB NTPC aspirant.</strong>
            </p>
            <p>
              A beginner who does not have strong Maths or Reasoning fundamentals needs a different book from a candidate who has already completed the syllabus and only wants to practise previous-year questions. Similarly, a candidate preparing for General Awareness needs a static GK book plus current-affairs preparation rather than relying on one book alone.
            </p>
            <p>
              For RRB NTPC 2026 preparation, the most effective approach is to select a small number of high-quality books and use each book for a specific purpose: <strong>concept building, chapter-wise practice, previous-year questions, revision and mock-test practice.</strong>
            </p>
            <p className="text-slate-600 text-sm italic">
              Based on the current RRB NTPC syllabus, commonly recommended preparation resources and the books appearing prominently in current search results, this guide compares the most useful options and explains which book is best for each type of candidate.
            </p>
          </div>
        </header>

        {/* Quick Answer Banner */}
        <section className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Quick Answer: Which Is the Best Book for RRB NTPC?
            </h2>
          </div>
          <p className="text-slate-700 font-medium">If you want the short answer:</p>
          
          <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200/60 shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">Best All-in-One Book</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Disha Guide to RRB NTPC</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200/60 shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">Best Alternative All-in-One</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Arihant Study Package for RRB NTPC</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200/60 shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Best for Beginners</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">A comprehensive RRB NTPC guide (Disha / Arihant)</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200/60 shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Best for Mathematics</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">R.S. Aggarwal Quantitative Aptitude (Concepts) + Railway PYQ Book</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200/60 shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">Best for Reasoning</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">R.S. Aggarwal Verbal & Non-Verbal Reasoning</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200/60 shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Best for Static GK</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Lucent's General Knowledge</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200/60 shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">Best for Previous Year Questions</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Dedicated RRB NTPC Chapter-wise Solved Papers (Kiran / Disha)</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200/60 shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">Best for Current Affairs</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Monthly current-affairs digest (Avoid old static books)</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-100/70 p-4 rounded-xl border border-amber-300/80 text-amber-900 font-bold text-sm sm:text-base flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Best strategy for serious aspirants: 1 Concept Book + 1 RRB NTPC PYQ Book + Current Affairs + Mocks</span>
          </div>

          <p className="text-xs text-slate-500">
            The Google results reviewed for this article currently highlight Disha's RRB NTPC guide, Arihant's RRB NTPC study package and PW's All-in-One RRB NTPC guide among the prominent comprehensive options.
          </p>
        </section>

        {/* Top Picks Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                RRB NTPC Books 2026: Our Top Picks at a Glance
              </h2>
              <p className="text-sm text-slate-500 mt-1">Quick comparative matrix of top-ranked study resources</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="py-3.5 px-4 font-semibold rounded-tl-xl w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4 font-semibold">Book / Resource</th>
                  <th className="py-3.5 px-4 font-semibold">Best For</th>
                  <th className="py-3.5 px-4 font-semibold rounded-tr-xl text-center">Our Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border border-slate-200">
                {topPicks.map((item, i) => (
                  <tr key={i} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-700 text-center bg-slate-50/50">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        item.rank === 1 ? 'bg-amber-400 text-slate-900' :
                        item.rank === 2 ? 'bg-slate-300 text-slate-800' :
                        item.rank === 3 ? 'bg-amber-600/30 text-amber-900' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.book}
                      <span className="block sm:hidden text-xs text-amber-600 font-normal mt-0.5">{item.tag}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 mr-2">{item.tag}</span>
                      {item.bestFor}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-500 whitespace-nowrap">
                      {item.verdict}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Important:</strong> The ranking above is based on usefulness for RRB NTPC preparation, not simply the number of pages, popularity or price.
          </p>
        </section>

        {/* Why Choosing the Right Book Matters & Exam Pattern */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Why Choosing the Right RRB NTPC Book Matters
          </h2>

          <p className="text-slate-700 leading-relaxed">
            RRB NTPC is not an examination where simply reading a large number of books guarantees a high score. The examination tests three major areas:
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center space-y-1">
              <span className="text-2xl font-black text-blue-700">1</span>
              <h3 className="font-bold text-slate-900">General Awareness</h3>
              <p className="text-xs text-slate-600">40 Qs (CBT 1) | 50 Qs (CBT 2)</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-center space-y-1">
              <span className="text-2xl font-black text-purple-700">2</span>
              <h3 className="font-bold text-slate-900">Mathematics</h3>
              <p className="text-xs text-slate-600">30 Qs (CBT 1) | 35 Qs (CBT 2)</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center space-y-1">
              <span className="text-2xl font-black text-emerald-700">3</span>
              <h3 className="font-bold text-slate-900">General Intelligence & Reasoning</h3>
              <p className="text-xs text-slate-600">30 Qs (CBT 1) | 35 Qs (CBT 2)</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm sm:text-base text-slate-700">
            <p>
              Under the current pattern, <strong>CBT 1 contains 100 questions in 90 minutes</strong> (40 GA, 30 Maths, 30 Reasoning). <strong>CBT 2 contains 120 questions in 90 minutes</strong> (50 GA, 35 Maths, 35 Reasoning). There is also a <strong>1/3-mark negative marking</strong> for every incorrect answer.
            </p>
            <p className="font-semibold text-slate-900">
              That means your preparation needs to accomplish two different things:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-800">
              <li><strong>First:</strong> You need to know the concepts.</li>
              <li><strong>Second:</strong> You need to answer questions quickly and accurately.</li>
            </ul>
            <p className="text-slate-600 pt-1 text-xs sm:text-sm">
              A book that explains concepts beautifully but contains little exam-level practice is not enough. Likewise, a PYQ book containing thousands of questions may not be ideal for a beginner who does not understand the underlying concepts.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-center text-sm sm:text-base tracking-wide shadow-xs">
            ✨ Optimal RRB NTPC Prep Cycle: Concepts → Practice → PYQs → Revision → Mock Tests
          </div>
        </section>

        {/* In-Depth All-in-One Books Reviews */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Detailed Review: Top 3 All-in-One RRB NTPC Books
          </h2>

          {/* Book 1: Disha */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">Rank #1 • Best Overall</span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">1. Disha Guide to RRB NTPC</h3>
              </div>
              <div className="text-amber-500 font-bold text-lg">⭐⭐⭐⭐⭐</div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              If you are looking for one comprehensive RRB NTPC book, Disha's RRB NTPC guide is one of the strongest options to consider. The current Google results prominently identify the Disha Guide to RRB NTPC as a comprehensive option covering theory, chapter-wise MCQs and previous solved papers for Mathematics, Reasoning and General Awareness.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80 space-y-2">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Why We Recommend It
                </h4>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1 list-disc list-inside">
                  <li>Comprehensive theory coverage</li>
                  <li>Chapter-wise questions & MCQs</li>
                  <li>Includes previous-year questions</li>
                  <li>Multi-subject unified syllabus</li>
                  <li>Exam-oriented layout</li>
                </ul>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200/80 space-y-2">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-600" /> Who Should Buy It?
                </h4>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1 list-disc list-inside">
                  <li>Complete beginners starting from scratch</li>
                  <li>Candidates preparing from home</li>
                  <li>Aspirants wanting one primary core book</li>
                  <li>Covers foundation for both CBT 1 & CBT 2</li>
                  <li>Candidates who want to avoid book clutter</li>
                </ul>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1 text-slate-700">
              <p className="font-bold text-slate-900">⚠️ Limitation & Pro-Tip:</p>
              <p>An all-in-one book should be treated as your main preparation book, not your entire preparation ecosystem. For serious preparation, you must still add dedicated PYQ practice, monthly current affairs, and full-length online mocks.</p>
            </div>
          </div>

          {/* Book 2: Arihant */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-full text-xs font-bold">Rank #2 • Top Alternative</span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">2. Arihant Study Package for RRB NTPC</h3>
              </div>
              <div className="text-amber-500 font-bold text-lg">⭐⭐⭐⭐⭐</div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Arihant is another major name in competitive-exam preparation, and its RRB NTPC study package is a strong alternative to Disha. The current search results specifically highlight the Arihant Study Package for RRBs NTPC as a comprehensive resource containing structured theory, practice exercises and previous-year questions for Stage 1 and Stage 2 preparation.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Best for candidates who prefer:</h4>
              <div className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">✓ Structured & organized chapters</div>
                <div className="flex items-center gap-2">✓ Detailed step-by-step explanations</div>
                <div className="flex items-center gap-2">✓ Targeted practice right after theory</div>
                <div className="flex items-center gap-2">✓ Traditional competitive examination style</div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs sm:text-sm space-y-2 text-indigo-950">
              <h4 className="font-bold text-indigo-900">Disha vs Arihant: Which one should you pick?</h4>
              <p>Both are strong choices. If you are confused between them, <strong>don't buy both immediately</strong>. Instead, choose one as your primary book. Then spend the money you save on dedicated PYQ books, mock tests, current affairs, and revision material.</p>
              <p className="italic font-medium">The difference between candidates who succeed and those who keep collecting books is how thoroughly they complete the books they already have.</p>
            </div>
          </div>

          {/* Book 3: PW */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">Rank #3 • Guided Style</span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">3. PW All-in-One RRB NTPC Guide</h3>
              </div>
              <div className="text-amber-500 font-bold text-lg">⭐⭐⭐⭐½</div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              The PW All-in-One RRB NTPC Guide is another prominent option in the current market. Google search results highlight PW's All-in-One guide prominently, including structured preparation material for Graduate and Undergraduate CBT-1 candidates.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Why Consider PW?</span>
                <p className="text-slate-600">Particularly attractive for simpler explanations, shortcut-based approaches, integrated practice sets, and a guided preparation style.</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Best For</span>
                <p className="text-slate-600">Beginners, students who find traditional heavy textbooks difficult, or candidates who combine printed books with online video lectures.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Mathematics */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Best Books for RRB NTPC Mathematics</h2>
              <p className="text-sm text-slate-500">Mastering Quantitative Aptitude for 30 (CBT-1) & 35 (CBT-2) Marks</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2">RRB NTPC Maths Syllabus Topics:</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Number System', 'Decimals & Fractions', 'LCM and HCF', 'Ratio & Proportion', 'Percentage', 'Mensuration', 'Time & Work', 'Time & Distance', 'Simple & Compound Interest', 'Profit & Loss', 'Elementary Algebra', 'Geometry', 'Trigonometry', 'Elementary Statistics'].map((topic, i) => (
                <span key={i} className="px-2.5 py-1 bg-white rounded-md border border-slate-200 text-slate-700 font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Maths Book 1 */}
            <div className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors space-y-2 bg-gradient-to-r from-white to-blue-50/20">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-base sm:text-lg">1. R.S. Aggarwal — Quantitative Aptitude for Competitive Examinations</h4>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold">Concepts</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700"><strong>Best for:</strong> Beginners and concept building. This is one of the most widely used competitive-examination Mathematics books. Its biggest advantage is that it gives candidates a large amount of structured practice.</p>
              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
                <strong>Important warning:</strong> Do not try to finish every single question in a huge general aptitude book. Focus on the chapters and question types strictly relevant to the RRB NTPC syllabus.
              </div>
            </div>

            {/* Maths Book 2 */}
            <div className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-base sm:text-lg">2. Fast Track Objective Arithmetic by Rajesh Verma</h4>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-bold">Speed Arithmetic</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700"><strong>Best for:</strong> Candidates who already understand basic arithmetic and want more speed-oriented preparation. Useful for Percentage, Profit/Loss, Ratio, Average, Time & Work, Interest, and Simplification shortcuts.</p>
            </div>

            {/* Maths Book 3 */}
            <div className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-base sm:text-lg">3. Magical Book on Quicker Maths by M. Tyra</h4>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-bold">Shortcuts</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700"><strong>Best for:</strong> Speed and shortcut techniques. <em>Pro-tip:</em> If you are weak in Maths, master concepts first and shortcuts later. Learning shortcuts without concept clarity causes confusion.</p>
            </div>

            {/* Maths Book 4: PYQs */}
            <div className="p-5 rounded-xl border-2 border-emerald-300 bg-emerald-50/40 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-emerald-950 text-base sm:text-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  4. RRB NTPC Maths Previous Year Questions (PYQs)
                </h4>
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-xs font-bold">Crucial</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700">Arguably more important than buying another general Mathematics book. PYQs show the exact difficulty level, question formats, and repeatedly asked patterns in Railway examinations.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl font-medium text-xs sm:text-sm flex items-center justify-between flex-wrap gap-2">
            <span>📐 Recommended Sequence:</span>
            <span className="text-amber-400 font-bold">R.S. Aggarwal (Concepts) ➔ RRB NTPC Chapter-wise PYQs ➔ Mixed Drills ➔ Full Mocks</span>
          </div>
        </section>

        {/* Section 2: Reasoning */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Best Books for RRB NTPC Reasoning</h2>
              <p className="text-sm text-slate-500">General Intelligence & Reasoning for 30 (CBT-1) & 35 (CBT-2) Marks</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2">RRB NTPC Reasoning Syllabus Topics:</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Analogies', 'Number Series', 'Alphabetical Series', 'Coding-Decoding', 'Mathematical Operations', 'Similarities & Differences', 'Relationships (Blood Relations)', 'Analytical Reasoning', 'Syllogism', 'Jumbling', 'Venn Diagrams', 'Puzzles', 'Data Sufficiency', 'Statement & Conclusion', 'Decision Making', 'Maps & Graphs'].map((topic, i) => (
                <span key={i} className="px-2.5 py-1 bg-white rounded-md border border-slate-200 text-slate-700 font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-purple-700 uppercase">Core Textbook</span>
              <h4 className="font-bold text-slate-900 text-base">R.S. Aggarwal Verbal & Non-Verbal Reasoning</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Extensive topic coverage with tons of practice. Build your foundation here, then transition immediately to Railway PYQs.</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-purple-700 uppercase">Analytical Concept</span>
              <h4 className="font-bold text-slate-900 text-base">Analytical Reasoning by M.K. Pandey</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Useful for deeper conceptual understanding in statements, assumptions, and critical reasoning topics.</p>
            </div>

            <div className="p-5 rounded-xl border-2 border-purple-300 bg-purple-50/40 space-y-2">
              <span className="text-xs font-bold text-purple-700 uppercase">Exam Specialist</span>
              <h4 className="font-bold text-purple-950 text-base">Railway/RRB Reasoning Chapter-Wise PYQs</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">Learn the concept ➔ solve RRB PYQs ➔ identify repeated patterns ➔ practise those patterns ➔ maximize speed.</p>
            </div>
          </div>
        </section>

        {/* Section 3: General Awareness & Current Affairs */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
              <BookCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Best Book for RRB NTPC General Awareness</h2>
              <p className="text-sm text-slate-500">Crucial High-Weightage Section: 40 Qs (CBT 1) & 50 Qs (CBT 2)</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-slate-800 space-y-2 text-sm sm:text-base">
            <p className="font-bold text-amber-950">⚠️ The Biggest Mistake in General Awareness Preparation:</p>
            <p>Static General Knowledge and Current Affairs are <strong>not the same thing</strong>. A book published several years ago cannot prepare you for current events. Divide your GA prep into two distinct pillars:</p>
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-amber-200 font-medium text-xs sm:text-sm">
                📚 <strong>Static GA:</strong> Use standard textbooks (Lucent GK).
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-200 font-medium text-xs sm:text-sm">
                📰 <strong>Current Affairs:</strong> Use recent monthly digests & capsules.
              </div>
            </div>
          </div>

          {/* Lucent Review */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">Best Static GK Book: Lucent General Knowledge</h3>
              <span className="text-amber-500 font-bold">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700">
              <strong>Is Lucent GK enough for RRB NTPC?</strong> Lucent GK is excellent for static GK, but Lucent alone is <em>not enough</em> for the entire General Awareness section.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">✅ Lucent is Great For:</span>
                <p className="text-slate-700">History, Geography, Polity, General Science, Basic Economics, Static Facts, and Important Organizations.</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">❌ Lucent Cannot Substitute:</span>
                <p className="text-slate-700">Current affairs, recent govt schemes, appointments, sports awards, and recent national/international events.</p>
              </div>
            </div>
          </div>

          {/* Current Affairs Breakdown */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">Best Strategy for RRB NTPC Current Affairs</h3>
            <p className="text-xs sm:text-sm text-slate-700">
              Recommending a single permanent book for current affairs would be misleading because it changes every month. Use monthly current affairs PDFs/magazines and revision capsules.
            </p>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900">Key Focus Areas for RRB NTPC Current Affairs:</span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['Government Schemes', 'Railway Developments', 'Appointments & Awards', 'Sports Tournaments', 'Summits & Treaties', 'Science, Defence & Space Missions', 'National Reports & Indexes', 'Economic Developments', 'Environment & Wildlife'].map((item, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                    • {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Why PYQs Are More Important Than More Books */}
        <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-900 rounded-xl font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Why PYQs Are More Important Than Buying More Books</h2>
              <p className="text-xs sm:text-sm text-slate-300">The Power of Targeted Exam Practice vs Resource Hoarding</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Candidate A (Resource Collector)</span>
              <ul className="text-xs sm:text-sm space-y-1 text-slate-300">
                <li>• 3 Maths books + 3 Reasoning books</li>
                <li>• 2 GK books + 2 All-in-One guides</li>
                <li>• Solved only 100 previous-year questions</li>
              </ul>
              <div className="text-xs font-bold text-rose-300 pt-1">❌ High confusion, low exam-speed readiness</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-emerald-400/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Candidate B (Focused Practitioner)</span>
              <ul className="text-xs sm:text-sm space-y-1 text-slate-200">
                <li>• 1 Maths book + 1 Reasoning book</li>
                <li>• 1 GK book + 1 PYQ book</li>
                <li>• Solved thousands of actual RRB questions</li>
              </ul>
              <div className="text-xs font-bold text-emerald-300 pt-1">✅ 3x higher retention, accuracy, and speed</div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The goal is not <em>"How many books have I purchased?"</em> The goal is <strong>"How many relevant questions have I understood and can solve accurately under time pressure?"</strong>
          </p>
        </section>

        {/* Section 5: Customized Book Sets by Situation */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600" />
            Best RRB NTPC Book Sets by Situation & Timeline
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* 3 Months Strategy */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">⏳ If You Have Only 3 Months</h3>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-xs font-bold">Fast-Track</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5">
                <li><strong>Month 1:</strong> Rapid concepts in Maths, Reasoning & Static GK + Current Affairs.</li>
                <li><strong>Month 2:</strong> Chapter-wise PYQs, weak topic drills, arithmetic & reasoning patterns.</li>
                <li><strong>Month 3:</strong> Full-length CBT mocks, formula revision, error correction & speed.</li>
              </ul>
            </div>

            {/* 6 Months Strategy */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">🗓️ If You Have 6 Months</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">Comprehensive</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5">
                <li><strong>Months 1–2:</strong> In-depth concept building per subject.</li>
                <li><strong>Months 3–4:</strong> Complete chapter-wise RRB NTPC PYQs.</li>
                <li><strong>Month 5:</strong> Mixed practice & sectional speed tests.</li>
                <li><strong>Month 6:</strong> Full mocks, error notebook revision & current affairs.</li>
              </ul>
            </div>

            {/* Budget Kit */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">💰 Limited Budget Starter Kit</h3>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-bold">Low Cost</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-1">
                <li>• <strong>Book 1:</strong> One RRB NTPC All-in-One Guide</li>
                <li>• <strong>Book 2:</strong> One RRB NTPC PYQ Book</li>
                <li>• <strong>Book 3:</strong> Lucent General Knowledge</li>
                <li>• <strong>Free:</strong> Monthly Current Affairs PDFs + Online Mocks</li>
              </ul>
            </div>

            {/* Working Aspirants */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">💼 For Working Aspirants</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold">Efficient</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-1">
                <li>• <strong>Weekdays (1–1.5 hrs):</strong> 40m Maths/Reasoning + 30m GA/Current affairs.</li>
                <li>• <strong>Weekends (2–3 hrs):</strong> Full-length mock test + deep error analysis + PYQs.</li>
                <li>• <em>Rule: Limited resources + repeated revision.</em></li>
              </ul>
            </div>
          </div>

          {/* Graduate vs Undergraduate */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
            <h4 className="font-bold text-slate-900 text-base">RRB NTPC Graduate vs Undergraduate (UG): Do You Need Different Books?</h4>
            <p>The core subjects (Maths, Reasoning, GA) remain identical. <strong>Undergraduate candidates (12th level - CEN 07/2025, 3058 posts)</strong> should focus on basic concepts, arithmetic, and PYQs. <strong>Graduate candidates (CEN 06/2025)</strong> should prepare with the same core resources but place higher emphasis on speed, higher-volume practice, and CBT-2 preparation.</p>
          </div>
        </section>

        {/* Section 6: How to Use Books & Error Notebook System */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-600" />
            4-Step System: How to Use Your RRB NTPC Books Effectively
          </h2>

          <div className="grid sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center text-xs">1</span>
              <h3 className="font-bold text-slate-900 text-sm">Step 1: Learn</h3>
              <p className="text-xs text-slate-600">Read concept & understand method. Don't waste hours making fancy notes.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold inline-flex items-center justify-center text-xs">2</span>
              <h3 className="font-bold text-slate-900 text-sm">Step 2: Practise</h3>
              <p className="text-xs text-slate-600">Immediately solve 30–50 questions based on that specific topic.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold inline-flex items-center justify-center text-xs">3</span>
              <h3 className="font-bold text-slate-900 text-sm">Step 3: Solve PYQs</h3>
              <p className="text-xs text-slate-600">Solve actual RRB NTPC previous-year questions for that chapter.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold inline-flex items-center justify-center text-xs">4</span>
              <h3 className="font-bold text-slate-900 text-sm">Step 4: Error Log</h3>
              <p className="text-xs text-slate-600">Maintain an Error Notebook for mistakes, tricks & formulas.</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1.5">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-600" /> The Error Notebook Method:
            </h4>
            <p>For every mistake in a practice set or mock test, record: <em>(1) Question Type, (2) What went wrong, (3) Correct solution/shortcut.</em> Review this notebook every week to eliminate recurring negative marks.</p>
          </div>
        </section>

        {/* Section 7: 7 Checklist Items & Common Mistakes */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Checklist */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                7-Point Pre-Purchase Checklist
              </h3>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
                <li className="flex items-start gap-2"><strong>1.</strong> <span><strong>Latest Edition:</strong> Check publication year and updated patterns.</span></li>
                <li className="flex items-start gap-2"><strong>2.</strong> <span><strong>Syllabus Alignment:</strong> Ensure it's tailored for NTPC, not generic exams.</span></li>
                <li className="flex items-start gap-2"><strong>3.</strong> <span><strong>Contains PYQs:</strong> Past questions provide real exam calibration.</span></li>
                <li className="flex items-start gap-2"><strong>4.</strong> <span><strong>Detailed Solutions:</strong> Avoid books with only answer keys.</span></li>
                <li className="flex items-start gap-2"><strong>5.</strong> <span><strong>Language Preference:</strong> Check if Hindi or English edition fits you best.</span></li>
                <li className="flex items-start gap-2"><strong>6.</strong> <span><strong>Matches Your Level:</strong> Don't buy advanced books if basics are shaky.</span></li>
                <li className="flex items-start gap-2"><strong>7.</strong> <span><strong>No Duplication:</strong> Don't buy a second book with similar content.</span></li>
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                7 Common Mistakes to Avoid
              </h3>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
                <li className="flex items-start gap-2 text-rose-950 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <span><strong>Mistake 1:</strong> Buying too many books and completing none.</span>
                </li>
                <li className="flex items-start gap-2 text-rose-950 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <span><strong>Mistake 2:</strong> Ignoring PYQs and only reading theory.</span>
                </li>
                <li className="flex items-start gap-2 text-rose-950 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <span><strong>Mistake 3:</strong> Treating Lucent as complete General Awareness.</span>
                </li>
                <li className="flex items-start gap-2 text-rose-950 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <span><strong>Mistake 4:</strong> Practicing Maths without a countdown timer.</span>
                </li>
                <li className="flex items-start gap-2 text-rose-950 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <span><strong>Mistake 5:</strong> Reading reasoning solutions instead of solving on paper.</span>
                </li>
                <li className="flex items-start gap-2 text-rose-950 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <span><strong>Mistake 6:</strong> Leaving current affairs until the final exam week.</span>
                </li>
                <li className="flex items-start gap-2 text-rose-950 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <span><strong>Mistake 7:</strong> Preparing only for CBT 1 and forgetting CBT 2.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8: Final Recommended Combination */}
        <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Library className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-black text-white">Our Recommended RRB NTPC Book Combination</h2>
          </div>
          <p className="text-sm text-amber-50 font-medium">
            If we had to build a complete preparation kit for an aspirant today, we would keep it simple:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 text-slate-900 text-xs sm:text-sm">
            <div className="bg-white p-3.5 rounded-xl shadow-xs space-y-1">
              <span className="font-bold text-amber-800 block text-xs uppercase">1. Primary Book</span>
              <p className="font-extrabold text-slate-900">Disha Guide OR Arihant Study Package</p>
              <p className="text-slate-500 text-[11px]">Choose one single comprehensive guide.</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs space-y-1">
              <span className="font-bold text-blue-800 block text-xs uppercase">2. Mathematics</span>
              <p className="font-extrabold text-slate-900">R.S. Aggarwal Quantitative Aptitude</p>
              <p className="text-slate-500 text-[11px]">Only if your Maths fundamentals need boost.</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs space-y-1">
              <span className="font-bold text-purple-800 block text-xs uppercase">3. Reasoning</span>
              <p className="font-extrabold text-slate-900">R.S. Aggarwal Reasoning</p>
              <p className="text-slate-500 text-[11px]">Only if your reasoning basics need clarity.</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs space-y-1">
              <span className="font-bold text-amber-800 block text-xs uppercase">4. General Awareness</span>
              <p className="font-extrabold text-slate-900">Lucent's General Knowledge</p>
              <p className="text-slate-500 text-[11px]">Master static GK subjects.</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs space-y-1">
              <span className="font-bold text-emerald-800 block text-xs uppercase">5. Previous Year Questions</span>
              <p className="font-extrabold text-slate-900">RRB NTPC Chapter-wise Solved Papers</p>
              <p className="text-slate-500 text-[11px]">The ultimate calibration tool.</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl shadow-xs space-y-1">
              <span className="font-bold text-rose-800 block text-xs uppercase">6. Testing & Current Affairs</span>
              <p className="font-extrabold text-slate-900">Monthly CA Digest + Full Mock Tests</p>
              <p className="text-slate-500 text-[11px]">CBT 1 & CBT 2 online test series.</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-amber-100 font-medium pt-2 italic">
            The winning strategy is not to collect the largest library. It is to complete a small number of good resources multiple times.
          </p>
        </section>

        {/* Section 9: The Bottom Line */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">The Bottom Line</h2>
          <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-3">
            <p>
              If you searched for "best book for RRB NTPC", you probably expected a simple answer. But the real answer is slightly different: <strong>The best RRB NTPC book is the book that matches your current level and is actually completed.</strong>
            </p>
            <p>
              For most beginners, a good all-in-one book from Disha, Arihant or PW is a strong starting point. For individual subjects, R.S. Aggarwal remains useful for Mathematics and Reasoning fundamentals, while Lucent is a strong static-GK resource. But no single book should be expected to cover everything, especially current affairs.
            </p>
            <p>
              The most effective combination is: <strong>One good theory book + RRB NTPC PYQs + current affairs + mock tests + repeated revision.</strong>
            </p>
            <p>
              And remember one important point: the current RRB NTPC examination is heavily time-bound. CBT 1 has 100 questions in 90 minutes, while CBT 2 has 120 questions in 90 minutes, with one-third negative marking for wrong answers.
            </p>
            <p className="font-bold text-slate-900">
              So once your concepts are clear, stop buying books and start solving questions. That is where your actual RRB NTPC preparation begins.
            </p>
          </div>

          {/* Recommended Reading Links */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Recommended Reading & Resources:</h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <Link to="/rrb-exam-calendar-2026-27" className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition border border-blue-200/60">
                🚆 RRB Exam Calendar 2026-27
              </Link>
              <Link to="/salary-calculator" className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition border border-emerald-200/60">
                💰 7th Pay Salary Calculator
              </Link>
              <Link to="/ssc-exam-calendar" className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
                📅 SSC Exam Calendar
              </Link>
              <Link to="/articles" className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition border border-amber-200/60">
                📚 All Recruitment Guides
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 italic">
              Book editions, prices, availability and exam-related details can change. Candidates should always check the latest RRB notification and the latest edition of any book before purchasing it.
            </p>
          </div>
        </section>

        {/* Section 10: FAQ Accordion */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions (FAQs)</h2>
          </div>

          <div className="divide-y divide-slate-200">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left flex justify-between items-center gap-4 focus:outline-hidden group cursor-pointer"
                >
                  <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <span className="text-slate-400 group-hover:text-blue-600 transition shrink-0">
                    {openFaq === idx ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="mt-3 text-slate-700 text-xs sm:text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Marketing Banner */}
        <MarketingPartnerBanner />

        {/* Subscribe Widget */}
        <SubscribeWidget />

        {/* Comments Section */}
        <div id="comments-section">
          <CommentsSection pageId="best-books-for-rrb-ntpc" pageTitle="Best Books for RRB NTPC 2026: Subject-Wise Best Books for Maths, Reasoning, GK & Previous Year Papers" />
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <ArticleStickyBottomBar 
        title="Best Books for RRB NTPC 2026: Subject-Wise Best Books for Maths, Reasoning, GK & Previous Year Papers"
        description="Comprehensive guide to the best books for RRB NTPC 2026 preparation: Detailed subject-wise breakdown for Mathematics, Reasoning, General Awareness, PYQs, and CBT 1 & CBT 2 study strategies."
      />
    </div>
  );
}
