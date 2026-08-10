import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { 
  Calendar, Search, Clock, ArrowRight, Download, Share2, Printer, Copy, Check,
  ChevronDown, ChevronUp, ChevronRight, FileText, CheckCircle2, AlertCircle,
  HelpCircle, ExternalLink, ShieldAlert, Award, Rocket, Train, Filter,
  Building2, Users, Layers, Target, FileCheck, ArrowUp, Flag, MapPin, Sparkles,
  Info, Bell, Zap, Eye, RefreshCw, Sun, Moon, ListFilter, Bookmark
} from 'lucide-react';
import SubscribeWidget from '../components/SubscribeWidget';
import CommentsSection from '../components/CommentsSection';
import MarketingPartnerBanner from '../components/MarketingPartnerBanner';
import { useAuth } from '../context/AuthContext';

export default function RrbCalendarArticle() {
  const { requireAuthForAction } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [pageSearch, setPageSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Master Table filters
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategoryFilter, setTableCategoryFilter] = useState('All');
  const [tableSortColumn, setTableSortColumn] = useState<string>('recruitment');
  const [tableSortOrder, setTableSortOrder] = useState<'asc' | 'desc'>('asc');

  // FAQ search & expanded state
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});

  // Expandable Recruitment Sections state
  const [expandedRecruitment, setExpandedRecruitment] = useState<Record<string, boolean>>({
    'ntpc': true,
    'groupd': true,
    'technician': true,
    'alp': true
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(scroll);

      if (totalScroll > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleAllFaqs = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    FAQS.forEach((_, idx) => { next[idx] = expand; });
    setExpandedFaqs(next);
  };

  const toggleRecruitment = (key: string) => {
    setExpandedRecruitment(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Master Table Data
  const MASTER_CALENDAR = [
    {
      recruitment: 'RRB Technician (CEN 02/2026)',
      notification: '30 Jun 2026',
      application: '30 Jun - 29 Jul 2026',
      correction: '01 Aug - 10 Aug 2026',
      citySlip: 'Expected Oct 2026',
      admitCard: 'Expected Oct 2026',
      exam: 'Nov - Dec 2026',
      answerKey: 'Dec 2026',
      result: 'Jan 2027',
      status: 'Correction Window (1-10 Aug)',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'Technician'
    },
    {
      recruitment: 'RRB Section Controller (03/2026)',
      notification: '15 Jul 2026',
      application: '15 Jul - 14 Aug 2026',
      correction: '15 Aug - 21 Aug 2026',
      citySlip: 'Expected Nov 2026',
      admitCard: 'Expected Nov 2026',
      exam: 'Dec 2026',
      answerKey: 'Jan 2027',
      result: 'Feb 2027',
      status: 'Applications Open',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'Officer'
    },
    {
      recruitment: 'RRB NTPC Graduate (CEN 05/2026)',
      notification: 'Expected Aug 2026',
      application: 'Aug - Sep 2026',
      correction: 'Sep 2026',
      citySlip: 'Expected Dec 2026',
      admitCard: 'Expected Dec 2026',
      exam: 'Jan - Feb 2027',
      answerKey: 'Feb 2027',
      result: 'Mar 2027',
      status: 'Upcoming',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'NTPC'
    },
    {
      recruitment: 'RRB NTPC Under Graduate (CEN 06/2026)',
      notification: 'Expected Sep 2026',
      application: 'Sep - Oct 2026',
      correction: 'Oct 2026',
      citySlip: 'Expected Jan 2027',
      admitCard: 'Expected Jan 2027',
      exam: 'Feb - Mar 2027',
      answerKey: 'Mar 2027',
      result: 'Apr 2027',
      status: 'Upcoming',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'NTPC'
    },
    {
      recruitment: 'RRB ALP (Assistant Loco Pilot CEN 01/2026)',
      notification: 'Expected Aug 2026',
      application: 'Aug - Sep 2026',
      correction: 'Sep 2026',
      citySlip: 'Expected Nov 2026',
      admitCard: 'Expected Nov 2026',
      exam: 'Dec 2026',
      answerKey: 'Jan 2027',
      result: 'Feb 2027',
      status: 'Expected Soon',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'ALP'
    },
    {
      recruitment: 'RRB Junior Engineer (JE CEN 07/2026)',
      notification: 'Expected Oct 2026',
      application: 'Oct - Nov 2026',
      correction: 'Nov 2026',
      citySlip: 'Expected Feb 2027',
      admitCard: 'Expected Feb 2027',
      exam: 'Mar 2027',
      answerKey: 'Apr 2027',
      result: 'May 2027',
      status: 'Upcoming',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'JE'
    },
    {
      recruitment: 'RRB Level 1 / Group D (CEN 08/2026)',
      notification: 'Expected Oct-Nov 2026',
      application: 'Nov - Dec 2026',
      correction: 'Dec 2026',
      citySlip: 'Expected Mar 2027',
      admitCard: 'Expected Mar 2027',
      exam: 'Apr - May 2027',
      answerKey: 'Jun 2027',
      result: 'Jul 2027',
      status: 'Upcoming',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'Group D'
    },
    {
      recruitment: 'RRB Paramedical Categories (CEN 04/2026)',
      notification: 'Expected Aug-Sep 2026',
      application: 'Sep 2026',
      correction: 'Oct 2026',
      citySlip: 'Expected Dec 2026',
      admitCard: 'Expected Dec 2026',
      exam: 'Jan 2027',
      answerKey: 'Feb 2027',
      result: 'Mar 2027',
      status: 'Expected Soon',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'Paramedical'
    },
    {
      recruitment: 'RRB Ministerial & Isolated Categories',
      notification: 'Expected Nov 2026',
      application: 'Nov - Dec 2026',
      correction: 'Dec 2026',
      citySlip: 'Expected Feb 2027',
      admitCard: 'Expected Feb 2027',
      exam: 'Mar 2027',
      answerKey: 'Apr 2027',
      result: 'May 2027',
      status: 'Upcoming',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      officialLink: 'https://rrbapply.gov.in',
      cat: 'Ministerial'
    }
  ];

  const filteredMasterTable = useMemo(() => {
    return MASTER_CALENDAR.filter(item => {
      const matchesCat = tableCategoryFilter === 'All' || item.cat === tableCategoryFilter;
      const matchesSearch = tableSearch === '' || 
        item.recruitment.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.status.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.exam.toLowerCase().includes(tableSearch.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      let valA = (a as any)[tableSortColumn] || '';
      let valB = (b as any)[tableSortColumn] || '';
      if (tableSortOrder === 'asc') return valA.localeCompare(valB);
      return valB.localeCompare(valA);
    });
  }, [tableSearch, tableCategoryFilter, tableSortColumn, tableSortOrder]);

  // 40+ Comprehensive FAQs
  const FAQS = [
    { q: 'What is the RRB Annual Exam Calendar 2026-27?', a: 'The RRB Annual Exam Calendar is the official recruitment roadmap issued by the Railway Recruitment Board specifying release months for notifications, application windows, CBT exam dates, and result timelines across NTPC, Group D, ALP, Technician, JE, and Paramedical posts.' },
    { q: 'Where can I download the official RRB Calendar 2026 PDF?', a: 'The official calendar PDF is available on the central Indian Railways recruitment portal (rrbapply.gov.in) and regional RRB websites (e.g., rrbcdg.gov.in, rrbmumbai.gov.in).' },
    { q: 'When will RRB NTPC 2026 Notification be released?', a: 'RRB NTPC Graduate and Under-Graduate 2026 notifications are expected to be released in August and September 2026 respectively.' },
    { q: 'When is the RRB Group D (Level-1) 2026 Notification expected?', a: 'RRB Group D (Level 1) recruitment notification for over 1 Lakh vacancies is expected between October and November 2026.' },
    { q: 'Is there any negative marking in RRB CBT examinations?', a: 'Yes, almost all RRB CBT exams have a standard negative marking of 1/3rd (0.33) marks for each incorrect answer.' },
    { q: 'When will RRB Technician CEN 02/2026 Exam take place?', a: 'The Computer Based Test (CBT) for RRB Technician CEN 02/2026 (6,557 posts) is scheduled for November - December 2026. Online applications were active from 30 June to 29 July 2026, with the official correction window running from 1 to 10 August 2026.' },
    { q: 'How can I download my RRB City Intimation Slip?', a: 'RRB releases the Exam City Intimation Slip approximately 10 days before the CBT exam date on rrbapply.gov.in using your Registration Number and Date of Birth.' },
    { q: 'How many days before the exam is RRB Admit Card issued?', a: 'Official RRB E-Call Letters (Admit Cards) are released exactly 4 days before the candidate\'s scheduled exam date.' },
    { q: 'Is 10th pass eligible for RRB Group D Level-1 posts?', a: 'Yes, 10th pass or ITI (NCVT/SCVT) or National Apprenticeship Certificate (NAC) holders are eligible for RRB Group D posts.' },
    { q: 'What is the age limit for RRB NTPC Under Graduate posts?', a: 'The standard age limit for 12th pass NTPC posts is 18 to 33 years, with age relaxations of 3 years for OBC and 5 years for SC/ST.' },
    { q: 'What is the minimum age for RRB ALP (Assistant Loco Pilot)?', a: 'The age limit for RRB ALP is 18 to 33 years. ITI/Diploma/B.E/B.Tech in relevant engineering streams is required.' },
    { q: 'How can I submit objections against RRB Answer Key?', a: 'RRB opens an online Objection Tracker portal 3 to 5 days after the CBT exam. Candidates can challenge answers by paying ₹50 per question.' },
    { q: 'When will RRB Section Controller 2026 result be declared?', a: 'The CBT result for RRB Section Controller (Advt 03/2026) is tentatively expected in February 2027.' },
    { q: 'What is the selection process for RRB NTPC Graduate posts?', a: 'Selection process includes CBT-1 (Screening), CBT-2 (Scoring), Typing Test/CBAT (as applicable), Document Verification (DV), and Medical Examination.' },
    { q: 'What is CBAT in RRB recruitment?', a: 'CBAT stands for Computer Based Aptitude Test (Psycho Test) conducted for station masters, traffic assistants, and loco pilots.' },
    { q: 'Are medical standards mandatory for Railway jobs?', a: 'Yes, Indian Railways strictly enforces medical standards (A-1, A-2, A-3, B-1, B-2, C-1) depending on safety-critical roles.' },
    { q: 'What is the vision standard for RRB ALP?', a: 'RRB ALP requires strict A-1 medical standards: Distance Vision 6/6, 6/6 without glasses, plus passing tests for Color Vision, Binocular Vision, Field of Vision, and Night Vision.' },
    { q: 'What is the fee refund policy in RRB applications?', a: 'Unreserved/OBC candidates pay ₹500 (₹400 refunded after appearing in CBT-1). SC/ST/Female/Ex-Servicemen/EWS pay ₹250 (Full ₹250 refunded after CBT-1).' },
    { q: 'Can I change my RRB examination city choices?', a: 'No, exam city choices cannot be changed once submitted. RRB allocates centers based on administrative availability.' },
    { q: 'Is normalization applied in multi-session RRB CBT exams?', a: 'Yes, RRB uses a mathematical percentile-based normalization formula to equalize difficulty across multiple exam shifts.' },
    { q: 'What is the qualification for RRB Junior Engineer (JE)?', a: 'Three-year Diploma in Engineering or B.E./B.Tech in relevant engineering branches (Civil, Mechanical, Electrical, Electronics, IT, etc.).' },
    { q: 'What is RRB Paramedical salary level?', a: 'Paramedical staff (Staff Nurse, Lab Tech, Pharmacist) fall under Pay Levels 4 to 7 (Initial basic pay ₹25,500 to ₹44,900 plus DA, HRA, TA).' },
    { q: 'What is the official Railway application portal URL?', a: 'The unified official application portal for all 21 RRBs is https://rrbapply.gov.in.' },
    { q: 'Can final year students apply for RRB NTPC?', a: 'No, candidates must possess the prescribed educational qualification certificates on or before the closing date of application.' },
    { q: 'Is there a typing test for RRB Junior Clerk cum Typist?', a: 'Yes, a qualifying Computer Typing Skill Test is mandatory (30 wpm in English OR 25 wpm in Hindi on PC without spell-check).' },
    { q: 'How many RRB zones/boards are there in India?', a: 'There are 21 Railway Recruitment Boards (RRBs) operating across 17 Railway Zones in India.' },
    { q: 'Can I apply to multiple RRBs for the same CEN notification?', a: 'No, a candidate can apply to ONLY ONE RRB against a single Centralized Employment Notice (CEN). Multiple applications lead to rejection.' },
    { q: 'What is the correction window fee in RRB applications?', a: 'Candidates can edit personal details during the correction window by paying a non-refundable modification fee of ₹250.' },
    { q: 'How long is the RRB merit panel valid?', a: 'The merit list/panel generated by RRB remains valid for 1 to 2 years for appointment in Indian Railways.' },
    { q: 'Is EWS reservation applicable in RRB 2026-27 recruitment?', a: 'Yes, 10% reservation is provided to Economically Weaker Section (EWS) candidates as per Central Government norms.' },
    { q: 'How to retrieve forgotten RRB Registration Number?', a: 'You can retrieve your Registration Number via the "Forgot Registration" link on rrbapply.gov.in using your registered Email, Mobile, and DOB.' },
    { q: 'What documents are required for RRB Document Verification (DV)?', a: 'Matriculation Certificate, Degree/Diploma/ITI Certificates, Caste/EWS Certificate, NCVT/SCVT Trade Certificate, Identity Proof (Aadhaar/PAN), and Photo Call Letter.' },
    { q: 'What is the physical efficiency test (PET) in RRB Group D?', a: 'PET requires male candidates to lift 35 kg for 100m in 2 mins and run 1000m in 4 mins 15 secs. Female candidates lift 20 kg for 100m in 2 mins and run 1000m in 5 mins 40 secs.' },
    { q: 'How many questions are asked in RRB NTPC CBT-1?', a: '100 Multiple Choice Questions (General Awareness 40, Mathematics 30, General Intelligence & Reasoning 30) to be attempted in 90 minutes.' },
    { q: 'How many questions are in RRB NTPC CBT-2?', a: '120 MCQs (General Awareness 50, Mathematics 35, Reasoning 35) in 90 minutes duration.' },
    { q: 'What is the exam pattern for RRB Technician Grade 3?', a: '100 MCQs (Maths 20, Reasoning 25, General Science 40, General Awareness 15) in 90 minutes duration.' },
    { q: 'Will there be RRB Section Controller recruitment every year?', a: 'RRB Section Controller is a specialized operational cadre filled based on zonal railway vacancies and operational requirements.' },
    { q: 'Where can I get RRB official notifications and PDFs?', a: 'All official CEN PDFs are published on rrbapply.gov.in and linked on NewVacancyAlert.in for direct download.' },
    { q: 'Is Aadhaar authentication mandatory during RRB CBT exam?', a: 'Yes, Aadhaar-based biometric authentication is compulsory at exam centers before entering the computer lab.' },
    { q: 'What is the salary of RRB NTPC Commercial Apprentice (Level 6)?', a: 'Level-6 initial basic pay is ₹35,400 per month. Gross monthly salary with DA, HRA, and allowances ranges from ₹55,000 to ₹65,000.' }
  ];

  const filteredFaqs = FAQS.filter(item => 
    faqSearch === '' || 
    item.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Structured Schema Objects
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "RRB Exam Calendar 2026-27: Notification, Admit Card, Exam Date, Result Schedule",
    "description": "RRB Exam Calendar 2026-27 with complete notification schedule, application dates, admit cards, CBT exams, answer keys, results, expected recruitment timeline, and latest Railway Recruitment Board updates.",
    "author": {
      "@type": "Organization",
      "name": "NewVacancyAlert Editorial Team",
      "url": "https://newvacancyalert.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newvacancyalert.in/logo.png"
      }
    },
    "datePublished": "2026-07-28T00:00:00+05:30",
    "dateModified": "2026-07-28T00:00:00+05:30",
    "mainEntityOfPage": "https://newvacancyalert.in/rrb-exam-calendar-2026-27"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://newvacancyalert.in" },
      { "@type": "ListItem", "position": 2, "name": "Articles", "item": "https://newvacancyalert.in/articles" },
      { "@type": "ListItem", "position": 3, "name": "RRB Exam Calendar 2026-27", "item": "https://newvacancyalert.in/rrb-exam-calendar-2026-27" }
    ]
  };

  return (
    <div className={`w-full min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200 pb-20 relative font-sans`}>
      <Helmet>
        <title>RRB Exam Calendar 2026-27: Notification, Admit Card, Exam Date, Result Schedule</title>
        <meta name="description" content="RRB Exam Calendar 2026-27 with complete notification schedule, application dates, admit cards, CBT exams, answer keys, results, expected recruitment timeline, and latest Railway Recruitment Board updates." />
        <meta name="keywords" content="RRB Calendar 2026, RRB Exam Calendar, Railway Calendar, RRB Notification 2026, Railway Recruitment Calendar, RRB Recruitment Calendar, RRB Exam Date, RRB Admit Card, RRB Result Date, RRB CBT, RRB Group D, RRB NTPC, RRB Technician, RRB ALP, RRB JE, RRB Paramedical, RRB Ministerial, Railway Vacancy, RRB Calendar 2026 PDF" />
        <link rel="canonical" href="https://newvacancyalert.in/rrb-exam-calendar-2026-27" />
        <meta property="og:title" content="RRB Exam Calendar 2026-27: Notification, Admit Card, Exam Date, Result Schedule" />
        <meta property="og:description" content="Official & Expected Railway Recruitment Board Exam Schedule 2026-27 for NTPC, Group D, ALP, Technician, JE, and Paramedical posts." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://newvacancyalert.in/rrb-exam-calendar-2026-27" />
        
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div 
          className="h-full bg-amber-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Quick Breadcrumbs */}
      <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b py-3 px-4 text-xs font-bold text-slate-500 hidden md:block`}>
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/articles" className="hover:text-blue-600 transition">Articles</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-600 font-extrabold">RRB Exam Calendar 2026-27</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <header className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white pt-10 pb-16 px-4 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Train className="w-4 h-4 text-amber-400" />
              <span>Ministry of Railways • Official & Expected Roadmap</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold transition cursor-pointer"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-blue-300" />}
              <span>{darkMode ? 'Light View' : 'Dark View'}</span>
            </button>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            RRB Exam Calendar 2026-27 | Railway Recruitment Notification, Exam Date, Admit Card, Result Timeline
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-4xl font-medium leading-relaxed">
            Complete centralized schedule for Indian Railways recruitment examinations including <strong>RRB NTPC, Group D (Level-1), ALP, Technician, Junior Engineer (JE), Paramedical, and Section Controller</strong>. Track notifications, application closing dates, CBT-1 & CBT-2 exam dates, admit card links, answer keys, and merit result declarations.
          </p>

          {/* Author Meta & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
              <span>By <strong className="text-white">NewVacancyAlert Editorial Team</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> ~10 Min Read</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">Updated: 28th July 2026</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => scrollToId('master-table')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Latest RRB Notification</span>
              </button>

              <button
                onClick={() => scrollToId('expected-calendar')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Upcoming Recruitment</span>
              </button>

              <button
                onClick={copyUrl}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => requireAuthForAction(
                  () => window.print(),
                  "Google Sign-In Required for Print / PDF",
                  "Sign in with Google to print or save the RRB Exam Calendar as a PDF."
                )}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* STICKY TABLE OF CONTENTS NAV */}
      <nav className={`sticky top-0 z-40 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] shrink-0 font-black flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5 text-amber-500" /> Jump To:
          </span>
          {[
            { id: 'live-dashboard', label: 'Live Status' },
            { id: 'highlights', label: 'Quick Highlights' },
            { id: 'master-table', label: 'Master Table' },
            { id: 'timeline', label: 'Annual Timeline' },
            { id: 'month-wise', label: 'Month-Wise' },
            { id: 'recruitment-details', label: 'Exam Breakdown' },
            { id: 'process-flowchart', label: 'Selection Flow' },
            { id: 'admit-card-tracker', label: 'Admit Cards' },
            { id: 'result-tracker', label: 'Results' },
            { id: 'faqs', label: '40+ FAQs' },
            { id: 'official-links', label: 'RRB Links' }
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => scrollToId(nav.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer border ${
                activeSection === nav.id
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-black'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-12">

        {/* LIVE STATUS DASHBOARD */}
        <section id="live-dashboard" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              <span>RRB Live Status Dashboard (2026-27)</span>
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Updates
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { title: 'Notifications', count: '03 Released', color: 'bg-emerald-50 text-emerald-900 border-emerald-200', icon: FileText },
              { title: 'Applications Open', count: 'Section Controller', color: 'bg-blue-50 text-blue-900 border-blue-200', icon: Rocket },
              { title: 'Exam Soon', count: 'Technician Nov-Dec', color: 'bg-amber-50 text-amber-900 border-amber-200', icon: Clock },
              { title: 'City Slip', count: 'Expected Oct', color: 'bg-purple-50 text-purple-900 border-purple-200', icon: MapPin },
              { title: 'Admit Card', count: 'Expected Oct', color: 'bg-indigo-50 text-indigo-900 border-indigo-200', icon: FileCheck },
              { title: 'Results Soon', count: 'Upcoming', color: 'bg-pink-50 text-pink-900 border-pink-200', icon: Award },
              { title: 'Next Notification', count: 'NTPC Aug 2026', color: 'bg-orange-50 text-orange-900 border-orange-200', icon: Bell }
            ].map((card, i) => {
              const IconComp = card.icon;
              return (
                <div key={i} className={`p-3 rounded-2xl border-2 ${card.color} space-y-1 shadow-xs`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{card.title}</span>
                    <IconComp className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <p className="text-xs font-black leading-tight">{card.count}</p>
                </div>
              );
            })}
          </div>
        </section>

        <MarketingPartnerBanner className="my-6" />

        {/* HIGHLIGHT INFORMATION BOXES */}
        <section id="highlights" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span>Important Recruitment Highlights</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-5 rounded-2xl border-2 border-emerald-600 shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                Active Application
              </span>
              <h3 className="text-base font-black text-white">RRB Section Controller (03/2026)</h3>
              <p className="text-xs text-slate-300 font-medium">119 Vacancies. Online applications active till <strong>14th August 2026</strong>. Any Graduate eligible.</p>
              <a href="https://rrbapply.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:underline pt-1">
                <span>Apply on rrbapply.gov.in</span> <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-amber-900 to-slate-900 text-white p-5 rounded-2xl border-2 border-amber-600 shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800">
                Correction Window (1-10 Aug)
              </span>
              <h3 className="text-base font-black text-white">RRB Technician (CEN 02/2026)</h3>
              <p className="text-xs text-slate-300 font-medium">6,557 Vacancies. Application window: 30 Jun - 29 Jul 2026. Correction window open <strong>01 - 10 Aug 2026</strong> (₹250 fee per edit). CBT Exam in <strong>Nov - Dec 2026</strong>.</p>
              <Link to="/rrb-technician-2026" className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:underline pt-1">
                <span>View Full Details</span> <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-5 rounded-2xl border-2 border-blue-600 shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800">
                Next Mega Recruitment
              </span>
              <h3 className="text-base font-black text-white">RRB NTPC Graduate & Under Graduate</h3>
              <p className="text-xs text-slate-300 font-medium">Expected notification in <strong>August & September 2026</strong> for Station Master, Goods Guard, Senior Clerk & Commercial Apprentice.</p>
              <button onClick={() => scrollToId('expected-calendar')} className="inline-flex items-center gap-1 text-xs font-bold text-blue-300 hover:underline pt-1">
                <span>Check Expected Dates</span> <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* MASTER CALENDAR TABLE */}
        <section id="master-table" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span>Master RRB Exam Calendar 2026-27 Table</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Filter, search, and sort complete recruitment timelines across all Railway posts.</p>
            </div>

            {/* Table Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'NTPC', 'Technician', 'ALP', 'Group D', 'JE', 'Officer'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTableCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer border ${
                    tableCategoryFilter === cat
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search table by recruitment name, status, exam date..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-medium focus:border-blue-500 outline-none shadow-xs"
            />
          </div>

          {/* Scrollable Responsive Table */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-black text-[11px] uppercase tracking-wider sticky top-0 z-20">
                  <tr>
                    <th className="p-3.5 border-b border-slate-800 min-w-[200px]">Recruitment Post</th>
                    <th className="p-3.5 border-b border-slate-800">Notification</th>
                    <th className="p-3.5 border-b border-slate-800 min-w-[140px]">Application Window</th>
                    <th className="p-3.5 border-b border-slate-800 min-w-[130px]">Correction</th>
                    <th className="p-3.5 border-b border-slate-800">City Slip</th>
                    <th className="p-3.5 border-b border-slate-800">Admit Card</th>
                    <th className="p-3.5 border-b border-slate-800 min-w-[130px]">CBT Exam</th>
                    <th className="p-3.5 border-b border-slate-800">Answer Key</th>
                    <th className="p-3.5 border-b border-slate-800">Result</th>
                    <th className="p-3.5 border-b border-slate-800">Status</th>
                    <th className="p-3.5 border-b border-slate-800">Official Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filteredMasterTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/60 transition-colors">
                      <td className="p-3.5 font-black text-slate-900">{row.recruitment}</td>
                      <td className="p-3.5 text-slate-700 font-semibold">{row.notification}</td>
                      <td className="p-3.5 text-slate-700">{row.application}</td>
                      <td className="p-3.5 text-slate-600">{row.correction}</td>
                      <td className="p-3.5 text-slate-600">{row.citySlip}</td>
                      <td className="p-3.5 text-slate-600">{row.admitCard}</td>
                      <td className="p-3.5 text-blue-900 font-bold">{row.exam}</td>
                      <td className="p-3.5 text-slate-600">{row.answerKey}</td>
                      <td className="p-3.5 text-slate-600">{row.result}</td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <a 
                          href={row.officialLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded font-bold text-[10px] inline-flex items-center gap-1"
                        >
                          <span>Portal</span> <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BLOCK 1 */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border-2 border-blue-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
              <Rocket className="w-5 h-5 text-amber-400" />
              <span>Looking for Active Railway Vacancies?</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium">Explore all currently open Railway notifications with direct application links & eligibility breakdowns.</p>
          </div>
          <Link
            to="/"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1.5"
          >
            <span>Check All Railway Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* MONTH-WISE RECRUITMENT CALENDAR */}
        <section id="month-wise" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span>Month-Wise RRB Recruitment Calendar (2026-27)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { month: 'July 2026', events: ['RRB Technician CEN 02/2026 Application (30 Jun - 29 Jul, 6557 Posts)', 'RRB Section Controller 03/2026 Application Open'], status: 'Active Month', color: 'border-emerald-400 bg-emerald-50/30' },
              { month: 'August 2026', events: ['Technician Application Correction Window (01 - 10 Aug 2026)', 'RRB NTPC Graduate Level (CEN 05/2026) Expected Notification', 'RRB ALP Expected Notification'], status: 'Expected High Volume', color: 'border-amber-400 bg-amber-50/30' },
              { month: 'September 2026', events: ['RRB NTPC Under-Graduate Level (CEN 06/2026) Expected', 'RRB Paramedical Categories Expected Notification'], status: 'Upcoming', color: 'border-blue-400 bg-blue-50/30' },
              { month: 'October 2026', events: ['RRB Junior Engineer (JE) Notification Expected', 'RRB Group D (Level-1) Notification Expected', 'Technician Exam City Slip Release'], status: 'Upcoming', color: 'border-blue-400 bg-blue-50/30' },
              { month: 'November 2026', events: ['RRB Technician CBT Exam Starts', 'RRB Ministerial & Isolated Categories Notification', 'NTPC Application Correction Window'], status: 'Exam Month', color: 'border-purple-400 bg-purple-50/30' },
              { month: 'December 2026', events: ['RRB Technician CBT Exam Concludes', 'RRB Section Controller CBT Exam', 'RRB ALP CBT-1 Exam Expected'], status: 'Exam Month', color: 'border-purple-400 bg-purple-50/30' },
              { month: 'January 2027', events: ['RRB NTPC Graduate CBT-1 Exam Expected', 'RRB Technician CBT Answer Key & Objection Tracker', 'Paramedical CBT Exam'], status: 'Next Year Phase', color: 'border-slate-300 bg-slate-50' },
              { month: 'February 2027', events: ['RRB NTPC Under-Graduate CBT-1 Exam', 'RRB JE CBT-1 Exam Expected', 'RRB Section Controller Result Declaration'], status: 'Next Year Phase', color: 'border-slate-300 bg-slate-50' },
              { month: 'March - May 2027', events: ['RRB Group D (Level 1) CBT Exam Phase 1 & 2', 'NTPC CBT-2 Exam for shortlisted candidates', 'CBAT / Psycho Tests for Loco Pilots & Station Masters'], status: 'Next Year Phase', color: 'border-slate-300 bg-slate-50' }
            ].map((m, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border-2 ${m.color} shadow-xs space-y-2`}>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{m.month}</span>
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200">
                    {m.status}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {m.events.map((ev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* RRB RECRUITMENT EXPANDABLE SECTIONS */}
        <section id="recruitment-details" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>Comprehensive RRB Recruitment Wise Breakdown</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                key: 'ntpc',
                title: 'RRB NTPC (Non-Technical Popular Categories) 2026',
                vacancies: '10,000+ Expected (Graduate & UG)',
                posts: 'Station Master, Goods Train Manager, Senior Clerk, Junior Accounts Assistant, Commercial Apprentice, Junior Clerk cum Typist',
                eligibility: '12th Pass (UG Posts) / Graduation in Any Stream (Graduate Posts)',
                age: '18 - 33 Years (UG) | 18 - 36 Years (Graduate) + Age Relaxations',
                process: 'CBT 1 → CBT 2 → CBAT / Typing Test → Document Verification → Medical Exam'
              },
              {
                key: 'groupd',
                title: 'RRB Group D / Level-1 Recruitment 2026',
                vacancies: '1,00,000+ Expected',
                posts: 'Track Maintainer Grade IV, Helper/Assistant in Electrical, Mechanical, Signal & Telecom, Pointsman',
                eligibility: '10th Pass OR ITI from NCVT/SCVT OR National Apprenticeship Certificate (NAC)',
                age: '18 - 36 Years',
                process: 'Computer Based Test (CBT) → Physical Efficiency Test (PET) → Document Verification → Medical Examination'
              },
              {
                key: 'technician',
                title: 'RRB Technician (CEN 02/2026)',
                vacancies: '6,557 Confirmed Posts',
                posts: 'Technician Grade I Signal & Technician Grade III (Electrical, Fitter, Welder, Machinist, Diesel, Carpenter)',
                eligibility: '10th + ITI / NAC or B.Sc / Diploma / B.Tech in Physics/Electronics/CS',
                age: '18 - 33 / 36 Years',
                process: 'Single Stage CBT → Document Verification → Medical Exam'
              },
              {
                key: 'alp',
                title: 'RRB ALP (Assistant Loco Pilot) 2026',
                vacancies: '5,000+ Expected',
                posts: 'Assistant Loco Pilot (Electric & Diesel Locomotives)',
                eligibility: '10th Pass + ITI in Fitter/Electrician/Instrument Mechanic/Tractor/Wireman OR Diploma/B.Tech in Mech/Elec/Auto/ECE',
                age: '18 - 33 Years',
                process: 'CBT 1 → CBT 2 → Computer Based Aptitude Test (CBAT) → DV → Medical (A-1 Vision Mandatory)'
              },
              {
                key: 'je',
                title: 'RRB Junior Engineer (JE) & CMA/DMS 2026',
                vacancies: '7,000+ Expected',
                posts: 'Junior Engineer (Civil, Mechanical, Electrical, Electronics), Depot Material Superintendent (DMS), Chemical & Metallurgical Assistant (CMA)',
                eligibility: '3-Year Engineering Diploma / B.E / B.Tech in relevant branch (Civil, Mech, Elec, ECE, CS, Metallurgy)',
                age: '18 - 36 Years',
                process: 'CBT 1 (Screening) → CBT 2 (Technical) → Document Verification → Medical Exam'
              }
            ].map((rec) => {
              const isOpen = expandedRecruitment[rec.key];
              return (
                <div key={rec.key} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => toggleRecruitment(rec.key)}
                    className="w-full p-4 text-left bg-slate-900 text-white font-black text-base flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Train className="w-5 h-5 text-amber-400" />
                      <span>{rec.title}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-5 space-y-3 text-xs text-slate-700 bg-slate-50/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="text-slate-900 block font-black mb-0.5">Expected Vacancies:</strong>
                          <span>{rec.vacancies}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="text-slate-900 block font-black mb-0.5">Key Posts:</strong>
                          <span>{rec.posts}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="text-slate-900 block font-black mb-0.5">Educational Qualification:</strong>
                          <span>{rec.eligibility}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="text-slate-900 block font-black mb-0.5">Age Limit:</strong>
                          <span>{rec.age}</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block font-black mb-1">Selection Process:</strong>
                        <p className="text-slate-600 font-medium">{rec.process}</p>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <a 
                          href="https://rrbapply.gov.in" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow inline-flex items-center gap-1.5"
                        >
                          <span>Official Portal</span> <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RRB PROCESS FLOWCHART */}
        <section id="process-flowchart" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            <span>Complete Railway Selection Process Flowchart</span>
          </h2>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
              {[
                { step: '01', name: 'Official CEN Release', desc: 'Detailed Notification on rrbapply.gov.in' },
                { step: '02', name: 'Online Application', desc: 'Registration & Fee Payment' },
                { step: '03', name: 'Correction Window', desc: 'Modification of details (₹250 fee)' },
                { step: '04', name: 'City Intimation', desc: 'Released 10 days before CBT' },
                { step: '05', name: 'Admit Card', desc: 'Released 4 days before CBT' },
                { step: '06', name: 'CBT Examination', desc: 'Computer Based Test at centers' },
                { step: '07', name: 'Answer Key', desc: 'Objection Tracker & Key Challenge' },
                { step: '08', name: 'CBT Result', desc: 'Normalised Score & Cutoff List' },
                { step: '09', name: 'Skill Test / PET', desc: 'Typing / CBAT / PET (if applicable)' },
                { step: '10', name: 'Doc Verification', desc: 'Original Certificate Checking' },
                { step: '11', name: 'Medical Test', desc: 'Strict Railway Medical Fitness' },
                { step: '12', name: 'Final Appointment', desc: 'Zonal Railway Posting Letter' }
              ].map((s, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1 relative">
                  <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
                    Step {s.step}
                  </span>
                  <h4 className="text-xs font-black text-slate-800 leading-tight">{s.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPECTED CALENDAR & DISCLAIMER */}
        <section id="expected-calendar" className="space-y-4">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2 text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="text-base font-black">Expected Schedule Disclaimer</h3>
            </div>
            <p className="text-xs font-medium leading-relaxed">
              Dates marked as "Expected" or "Tentative" are derived from historical RRB annual recruitment cycles, Ministry of Railways press briefings, and zonal railway notifications. Official confirmed dates are updated instantly as soon as Centralized Employment Notices (CEN) are uploaded on rrbapply.gov.in.
            </p>
          </div>
        </section>

        {/* PREVIOUS YEARS TIMELINE COMPARISON */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" />
            <span>RRB Recruitment Cycle Comparison (2024 vs 2025 vs 2026)</span>
          </h2>

          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-black uppercase text-[11px]">
                  <tr>
                    <th className="p-3 border-b border-slate-800">Recruitment Cadre</th>
                    <th className="p-3 border-b border-slate-800">2024 Cycle</th>
                    <th className="p-3 border-b border-slate-800">2025 Cycle</th>
                    <th className="p-3 border-b border-slate-800 text-amber-300">2026-27 Cycle (Current)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-black text-slate-900">RRB ALP</td>
                    <td className="p-3 text-slate-600">Jan 2024 (CEN 01/2024)</td>
                    <td className="p-3 text-slate-600">Exam Conducted Nov 2025</td>
                    <td className="p-3 text-blue-900 font-bold">Expected Aug 2026</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-slate-900">RRB Technician</td>
                    <td className="p-3 text-slate-600">March 2024 (CEN 02/2024)</td>
                    <td className="p-3 text-slate-600">Exam Conducted Dec 2025</td>
                    <td className="p-3 text-emerald-700 font-bold">Released July 2026 (6557 Posts)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-slate-900">RRB NTPC</td>
                    <td className="p-3 text-slate-600">Sep 2024 (CEN 05/2024)</td>
                    <td className="p-3 text-slate-600">CBT 1 & 2 Conducted</td>
                    <td className="p-3 text-blue-900 font-bold">Expected Aug-Sep 2026</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-slate-900">RRB Group D (Level 1)</td>
                    <td className="p-3 text-slate-600">Oct 2024 Cycle</td>
                    <td className="p-3 text-slate-600">PET & Medical Completed</td>
                    <td className="p-3 text-blue-900 font-bold">Expected Oct-Nov 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ADMIT CARD & RESULT TRACKERS */}
        <section id="admit-card-tracker" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-600" />
            <span>RRB Admit Card & City Slip Tracker (2026-27)</span>
          </h2>

          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-white font-black text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Recruitment Name</th>
                    <th className="p-3">City Intimation Slip</th>
                    <th className="p-3">Admit Card Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">RRB Technician CEN 02/2026</td>
                    <td className="p-3 text-slate-700">Expected Oct 2026</td>
                    <td className="p-3 text-slate-700">4 Days Before CBT Exam</td>
                    <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Awaited</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">RRB Section Controller 03/2026</td>
                    <td className="p-3 text-slate-700">Expected Nov 2026</td>
                    <td className="p-3 text-slate-700">4 Days Before CBT Exam</td>
                    <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Awaited</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="result-tracker" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>RRB Answer Key & Result Declaration Tracker</span>
          </h2>

          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-white font-black text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Recruitment Exam</th>
                    <th className="p-3">Answer Key Release</th>
                    <th className="p-3">Objection Window</th>
                    <th className="p-3">Result Declaration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">RRB Technician CEN 02/2026</td>
                    <td className="p-3 text-slate-700">Dec 2026</td>
                    <td className="p-3 text-slate-700">3-5 Days Window</td>
                    <td className="p-3 text-emerald-700 font-bold">Expected Jan 2027</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">RRB Section Controller 03/2026</td>
                    <td className="p-3 text-slate-700">Jan 2027</td>
                    <td className="p-3 text-slate-700">3-5 Days Window</td>
                    <td className="p-3 text-emerald-700 font-bold">Expected Feb 2027</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* REGIONAL RRB OFFICIAL WEBSITES */}
        <section id="official-links" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Official Regional Railway Recruitment Board (RRB) Websites</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { name: 'RRB Ahmedabad', url: 'http://www.rrbahmedabad.gov.in' },
              { name: 'RRB Ajmer', url: 'http://rrbajmer.gov.in' },
              { name: 'RRB Prayagraj', url: 'http://rrbald.gov.in' },
              { name: 'RRB Bangalore', url: 'http://rrbbnc.gov.in' },
              { name: 'RRB Bhopal', url: 'http://rrbbhopal.gov.in' },
              { name: 'RRB Bhubaneswar', url: 'http://rrbbbs.gov.in' },
              { name: 'RRB Bilaspur', url: 'http://rrbbilaspur.gov.in' },
              { name: 'RRB Chandigarh', url: 'http://rrbcdg.gov.in' },
              { name: 'RRB Chennai', url: 'http://rrbchennai.gov.in' },
              { name: 'RRB Gorakhpur', url: 'http://rrbgkp.gov.in' },
              { name: 'RRB Guwahati', url: 'http://rrbguwahati.gov.in' },
              { name: 'RRB Jammu', url: 'http://rrbjammu.nic.in' },
              { name: 'RRB Kolkata', url: 'http://rrbkolkata.gov.in' },
              { name: 'RRB Malda', url: 'http://rrbmalda.gov.in' },
              { name: 'RRB Mumbai', url: 'http://rrbmumbai.gov.in' },
              { name: 'RRB Muzaffarpur', url: 'http://rrbmuzaffarpur.gov.in' },
              { name: 'RRB Patna', url: 'http://rrbpatna.gov.in' },
              { name: 'RRB Ranchi', url: 'http://rrbranchi.gov.in' },
              { name: 'RRB Secunderabad', url: 'http://rrbsecunderabad.gov.in' },
              { name: 'RRB Siliguri', url: 'http://rrbsiliguri.gov.in' },
              { name: 'RRB Trivandrum', url: 'http://rrbthiruvananthapuram.gov.in' }
            ].map((rrb, i) => (
              <a
                key={i}
                href={rrb.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-blue-400 p-2.5 rounded-xl text-center shadow-xs transition hover:scale-105 group"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 block">{rrb.name}</span>
                <span className="text-[9px] text-slate-400 font-medium inline-flex items-center gap-0.5 mt-0.5">
                  Official <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* 40+ EXPANDABLE FAQS */}
        <section id="faqs" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-amber-500" />
                <span>Frequently Asked Questions (40+ RRB Calendar FAQs)</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Search and get answers to all candidates' common queries regarding RRB exams.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAllFaqs(true)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={() => toggleAllFaqs(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* FAQ Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 40+ FAQs by keyword (e.g., NTPC, Group D, Admit Card, Age...)"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-medium focus:border-blue-500 outline-none shadow-xs"
            />
          </div>

          <div className="space-y-2">
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedFaqs[idx] || false;
              return (
                <div key={idx} className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs transition">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-3.5 text-left font-black text-xs sm:text-sm text-slate-800 hover:text-blue-600 flex items-center justify-between gap-3 cursor-pointer bg-slate-50/50"
                  >
                    <span className="flex items-start gap-2">
                      <span className="text-amber-500 font-black">Q{idx + 1}.</span>
                      <span>{faq.q}</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-2 text-xs text-slate-600 leading-relaxed font-medium bg-white border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERNAL LINKING CARDS TO RELATED JOBS */}
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-lg sm:text-xl font-black flex items-center gap-2 text-slate-900">
            <Rocket className="w-5 h-5 text-blue-600" />
            <span>Explore Railway Recruitment Job Notifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              to="/rrb-technician-2026"
              className="bg-white border-2 border-slate-200 hover:border-amber-400 p-4 rounded-2xl shadow-xs transition hover:scale-[1.02] flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">6557 Posts</span>
                <h3 className="text-sm font-black text-slate-900 mt-1">RRB Technician CEN 02/2026</h3>
                <p className="text-xs text-slate-500 font-medium">Technician Grade I & Grade III complete notification, eligibility & exam pattern.</p>
              </div>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1 pt-2">View Details <ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>

            <Link
              to="/rrb-section-controller"
              className="bg-white border-2 border-slate-200 hover:border-blue-400 p-4 rounded-2xl shadow-xs transition hover:scale-[1.02] flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">119 Posts</span>
                <h3 className="text-sm font-black text-slate-900 mt-1">RRB Section Controller 2026</h3>
                <p className="text-xs text-slate-500 font-medium">Any Graduate. Apply online by 14th August 2026 via rrbapply.gov.in.</p>
              </div>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1 pt-2">View Details <ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>

            <Link
              to="/rail-wheel-factory-bangalore-sports-quota-2026"
              className="bg-white border-2 border-slate-200 hover:border-emerald-400 p-4 rounded-2xl shadow-xs transition hover:scale-[1.02] flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">15 Posts</span>
                <h3 className="text-sm font-black text-slate-900 mt-1">Rail Wheel Factory Sports Quota</h3>
                <p className="text-xs text-slate-500 font-medium">Ministry of Railways recruitment for sportspersons in Level 1 & Level 2.</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-2">View Details <ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          </div>
        </section>



        {/* Comments & Discussion */}
        <CommentsSection pageId="rrb-calendar" pageTitle="RRB Exam Calendar 2026-27" />

        {/* Push Notification Subscription Bar at Bottom */}
        <SubscribeWidget mode="bottom" />

      </div>

      {/* Back to Top Floating Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-xl transition cursor-pointer border-2 border-slate-900"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 font-black" />
        </button>
      )}
    </div>
  );
}
