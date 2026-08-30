import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  BookOpen, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Laptop, Keyboard, BarChart2, Target, Award, Check, FileText
} from 'lucide-react';
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';
import CommentsSection from '../../components/CommentsSection';
import ArticleStickyBottomBar from '../../components/ArticleStickyBottomBar';

export default function SscCglExamPatternSyllabusPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SSC CGL New Exam Pattern, Detailed Syllabus & DEST Typing Benchmark (390-Mark Merit Scheme)",
    "description": "Comprehensive guide to SSC CGL Tier-I qualifying exam, Tier-II 390-mark composite merit, Computer Knowledge module, and DEST typing speed benchmarks.",
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  const cptPosts = [
    "Assistant Section Officer (ASO) in Central Secretariat Service (CSS)",
    "Assistant Section Officer (ASO) in Ministry of External Affairs (MEA)",
    "Assistant Section Officer (ASO) in Armed Forces HQ (AFHQ)",
    "Assistant Section Officer (ASO) in Ministry of Electronics & IT (MeitY)",
    "Assistant / Section Officer in other Ministries & Departments",
    "Inspector Central Excise / GST in Central Board of Indirect Taxes (CBIC)",
    "Preventive Officer in Central Board of Indirect Taxes (CBIC)",
    "Examiner in Central Board of Indirect Taxes (CBIC)",
    "Tax Assistant in Central Board of Direct Taxes (CBDT)",
    "Tax Assistant in Central Board of Indirect Taxes (CBIC)",
    "Executive Assistant in CBIC",
    "Assistant in Serious Fraud Investigation Office (SFIO)"
  ];

  const faqs = [
    {
      q: "Are Tier-I marks added to the final merit list?",
      a: "No! Under the revised SSC CGL exam pattern, Tier-I is strictly qualifying in nature. Its normalized marks are used solely to shortlist candidates for Tier-II. Final selection and merit ranking are computed 100% from the 390 marks in Tier-II Paper-I (Section-I + Section-II)."
    },
    {
      q: "Is Computer Knowledge Test mandatory for all SSC CGL candidates?",
      a: "Yes. Computer Knowledge Module (20 questions, 60 marks, 15 minutes) is mandatory for all candidates appearing in Tier-II. While it is qualifying in nature, SSC applies higher qualifying cut-offs for specific posts like ASO (CSS, MEA), Inspector Central Excise, Examiner, Preventive Officer, and Tax Assistants."
    },
    {
      q: "What is the typing speed required for SSC CGL DEST?",
      a: "The DEST typing test requires 2,000 key depressions in 15 minutes on a computer, which equates to approximately 27 words per minute (WPM). The test is conducted on the same day as Tier-II Session-II."
    },
    {
      q: "What is the negative marking scheme in SSC CGL?",
      a: "In Tier-I, negative marking is 0.50 marks per wrong answer (1/4th of 2 marks). In Tier-II, negative marking is 1 mark per wrong answer for each 3-mark question (1/3rd penalty)."
    },
    {
      q: "Is there sectional timing in SSC CGL Tier-II?",
      a: "Yes! Tier-II has strict 1-hour sectional timing. Section I (Maths & Reasoning) must be completed in exactly 60 minutes. Once Section I time expires, you cannot return to it and the computer automatically switches to Section II (English & GA) for 60 minutes, followed by 15 minutes for Computer Knowledge."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>SSC CGL New Exam Pattern, Syllabus & DEST Typing Speed Test Guide</title>
        <meta name="description" content="Detailed analysis of SSC CGL Tier-I (qualifying) and Tier-II (390 marks merit) pattern, section-wise syllabus, Computer Knowledge CPT rules, and DEST typing error benchmarks." />
        <link rel="canonical" href="https://newvacancyalert.in/articles/ssc-cgl-exam-pattern-syllabus-dest-typing" />
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
            <Link to="/articles/ssc-cgl-master-guide" className="text-blue-400 hover:underline font-bold">SSC CGL Master Guide</Link>
            <span>/</span>
            <span className="text-slate-400 truncate">Chapter 4: Exam Pattern & Syllabus</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Syllabus Verified
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
              Chapter 4 of 7
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              20 Min Read
            </span>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-blue-600" /> Tier-II: 390 Marks Scheme
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            SSC CGL New Exam Pattern, Detailed Syllabus & DEST Typing Benchmark
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Complete architectural guide to Tier-I qualifying structure, Tier-II 390-mark composite merit, sectional timings, negative marking penalties, Computer Knowledge Module (CPT), and DEST 2,000-keystroke typing error limits.
          </p>

          {/* Quick Nav */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-bold">
            <Link to="/articles/ssc-cgl-eligibility-physical-standards-pst-pet" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Prev: Eligibility & PST
            </Link>
            <Link to="/articles/ssc-cgl-master-guide" className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Master Hub
            </Link>
            <Link to="/articles/ssc-cgl-cutoffs-post-preference-ranking-guide" className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1">
              Next: Cutoffs & Preference <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Section 1: Tier-I Exam Pattern (Qualifying) */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold"><Clock className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">1. Tier-I Examination Pattern (Qualifying Stage)</h2>
              <p className="text-xs text-slate-500 font-medium">100 Questions • 200 Marks • 60 Minutes • CBT Mode • -0.50 Negative Marking</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Section</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5 text-center">No. of Questions</th>
                  <th className="p-3.5 text-center">Maximum Marks</th>
                  <th className="p-3.5 text-right">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900">Part A</td>
                  <td className="p-3.5">General Intelligence & Reasoning</td>
                  <td className="p-3.5 text-center font-bold">25</td>
                  <td className="p-3.5 text-center font-bold text-blue-700">50</td>
                  <td className="p-3.5 text-right text-xs text-slate-500" rowSpan={4}>
                    <strong className="text-slate-900 text-sm">60 Minutes</strong><br />(Combined for all 4 parts)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900">Part B</td>
                  <td className="p-3.5">General Awareness</td>
                  <td className="p-3.5 text-center font-bold">25</td>
                  <td className="p-3.5 text-center font-bold text-blue-700">50</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900">Part C</td>
                  <td className="p-3.5">Quantitative Aptitude</td>
                  <td className="p-3.5 text-center font-bold">25</td>
                  <td className="p-3.5 text-center font-bold text-blue-700">50</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900">Part D</td>
                  <td className="p-3.5">English Comprehension</td>
                  <td className="p-3.5 text-center font-bold">25</td>
                  <td className="p-3.5 text-center font-bold text-blue-700">50</td>
                </tr>
                <tr className="bg-slate-100 font-black text-slate-900">
                  <td className="p-3.5" colSpan={2}>Total Tier-I Architecture</td>
                  <td className="p-3.5 text-center text-blue-800 text-base">100</td>
                  <td className="p-3.5 text-center text-blue-800 text-base">200 Marks</td>
                  <td className="p-3.5 text-right text-xs">Negative: -0.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Tier-II Exam Pattern (390-Mark Merit Scheme) */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold"><Award className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">2. Tier-II Paper-I Architecture (The Decisive 390-Mark Merit Stage)</h2>
              <p className="text-xs text-slate-500 font-medium">Session-I (130 Questions • 390 Marks • 2 Hours 15 Mins) + Session-II (DEST Typing)</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Section I */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-black text-sm text-purple-800">Section I: Mathematical Abilities & Reasoning (1 Hour Sectional Clock)</span>
                <span className="text-xs font-bold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-md">60 Qs • 180 Marks</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                  <strong className="block text-slate-900 font-bold">Module I: Mathematical Abilities (30 Qs • 90 Marks)</strong>
                  <p className="text-slate-600">Arithmetic (Number Systems, Percentages, Ratio, Profit & Loss, Time & Work), Advanced Maths (Algebra, Geometry, Coordinate Geometry, Mensuration, Trigonometry), Statistics & Probability (Mean, Median, Mode, Standard Deviation, Simple Probability).</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                  <strong className="block text-slate-900 font-bold">Module II: Reasoning & Intelligence (30 Qs • 90 Marks)</strong>
                  <p className="text-slate-600">Analogies, Similarities and Differences, Spatial Visualization, Spatial Orientation, Problem Solving, Analysis, Judgment, Decision Making, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning, Syllogisms, Coding-Decoding.</p>
                </div>
              </div>
            </div>

            {/* Section II */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-black text-sm text-blue-800">Section II: English Language & General Awareness (1 Hour Sectional Clock)</span>
                <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-md">70 Qs • 210 Marks</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                  <strong className="block text-slate-900 font-bold">Module I: English Comprehension (45 Qs • 135 Marks)</strong>
                  <p className="text-slate-600">Vocabulary, Grammar, Sentence Structure, Spotting the Error, Fill in the Blanks, Synonyms/Antonyms, Idioms & Phrases, One-Word Substitution, Sentence Improvement, Active/Passive Voice, Direct/Indirect Speech, Cloze Test, Reading Comprehension Passages.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                  <strong className="block text-slate-900 font-bold">Module II: General Awareness (25 Qs • 75 Marks)</strong>
                  <p className="text-slate-600">History, Culture, Geography, Economic Scene, General Policy, Scientific Research, Indian Constitution, Books & Authors, Awards & Honors, Government Schemes, Monthly Current Affairs (National & International).</p>
                </div>
              </div>
            </div>

            {/* Section III */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-black text-sm text-emerald-800">Section III: Qualifying Modules (Computer & DEST Typing)</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md">Mandatory for All Posts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                  <strong className="block text-slate-900 font-bold">Module I: Computer Knowledge (20 Qs • 60 Marks • 15 Mins)</strong>
                  <p className="text-slate-600">Computer Basics (CPU, Memory, Ports, Windows Explorer), Software (MS Word, MS Excel, MS PowerPoint), Internet & Emails (Web Browsing, Search Engines, Protocols), Cyber Security (Viruses, Trojans, Firewalls, Phishing).</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                  <strong className="block text-slate-900 font-bold">Module II: DEST Typing Test (2,000 Keystrokes • 15 Mins)</strong>
                  <p className="text-slate-600">Conducted on computer interface. 2,000 key depressions in 15 minutes (~27 WPM). Must clear permissible error percentage.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: CPT Posts List with Higher Standard Benchmark */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold"><Laptop className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">3. Posts Requiring Higher Computer Knowledge (CPT) Cut-Off</h2>
              <p className="text-xs text-slate-500 font-medium">SSC sets elevated qualifying marks for these premier executive cadres</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cptPosts.map((post, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{post}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: DEST Typing Error Tolerance Matrix */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 font-bold"><Keyboard className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">4. DEST Typing Permissible Error Limits Matrix</h2>
              <p className="text-xs text-slate-500 font-medium">Standard qualifying cutoff vs Higher standard CPT/DEST posts</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Candidate Category</th>
                  <th className="p-3.5">Standard Qualifying Max Error %</th>
                  <th className="p-3.5 bg-blue-50/60 text-blue-900 font-black">Higher Standard Cut-Off Posts (TA / CPT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold">Unreserved (UR)</td>
                  <td className="p-3.5 font-bold text-slate-900">20% Max Error</td>
                  <td className="p-3.5 font-black text-blue-700 bg-blue-50/30">5% Max Error (Strict Benchmark)</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold">OBC / EWS</td>
                  <td className="p-3.5 font-bold text-slate-900">25% Max Error</td>
                  <td className="p-3.5 font-black text-blue-700 bg-blue-50/30">7% Max Error</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold">SC / ST / PwBD / ESM</td>
                  <td className="p-3.5 font-bold text-slate-900">30% Max Error</td>
                  <td className="p-3.5 font-black text-blue-700 bg-blue-50/30">10% Max Error</td>
                </tr>
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
            <h4 className="text-lg sm:text-xl font-black">Chapter 5: Cut-Off Trends & Post Preference Ranking Strategy</h4>
          </div>
          <Link
            to="/articles/ssc-cgl-cutoffs-post-preference-ranking-guide"
            className="px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <span>Read Chapter 5</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <MarketingPartnerBanner />
        <div id="comments-section">
          <CommentsSection pageId="ssc-cgl-exam-pattern-syllabus-dest-typing" pageTitle="SSC CGL Exam Pattern & Syllabus Discussion" />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <ArticleStickyBottomBar 
        title="SSC CGL New Exam Pattern, Detailed Syllabus & DEST Typing Benchmark"
        description="Detailed analysis of SSC CGL Tier-I qualifying structure, Tier-II 390-mark composite merit scheme, and DEST typing error benchmarks."
      />
    </div>
  );
}
