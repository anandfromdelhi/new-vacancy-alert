import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { 
  ArrowLeft, Calendar, FileText, Briefcase, Award, Clock, DollarSign, 
  ListChecks, HelpCircle, Link as LinkIcon, ShieldCheck, MapPin, 
  Search, ChevronRight, CheckCircle2, AlertTriangle, AlertCircle, Info,
  TrendingUp, Users, BookOpen, Layers, Target, FileSignature, UploadCloud, 
  CreditCard, Send, Building2, Share2, Bookmark, Printer, Copy, ArrowUp, Check,
  Home, Facebook, Instagram, MessageCircle, Download, MessageSquare
} from 'lucide-react';
import jobsIndexData from '../data/jobs-index-generated.json';
import SubscribeWidget from '../components/SubscribeWidget';
import CommentsSection from '../components/CommentsSection';
import NorcetPdfDownloadWidget from '../components/NorcetPdfDownloadWidget';
import AdsterraBanner from '../components/AdsterraBanner';
import MarketingPartnerBanner from '../components/MarketingPartnerBanner';
import { useAuth } from '../context/AuthContext';
import { getJobUploadDate } from '../utils/jobUploadDate';

const jobModules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === 'function'
    ? (import.meta as any).glob('../data/jobs-generated/*.json')
    : {};

const isNoData = (val: any): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') {
    const clean = val.trim().toLowerCase();
    return (
      clean === 'n/a' ||
      clean === '0' ||
      clean === 'not mentioned' ||
      clean === 'not mentioned in official notification' ||
      clean === 'information not available' ||
      clean === 'not available' ||
      clean === 'none' ||
      clean === ''
    );
  }
  if (typeof val === 'number') {
    return val === 0;
  }
  if (Array.isArray(val)) {
    return val.length === 0 || val.every(isNoData);
  }
  return false;
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vacancySearch, setVacancySearch] = useState('');
  const [bookmarkSaved, setBookmarkSaved] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [dockQuery, setDockQuery] = useState('');
  const [flashedSection, setFlashedSection] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const { requireAuthForAction, requireAuthForDownloadAction, isAdmin } = useAuth();
  const [faqSearch, setFaqSearch] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  // Smart Multi-Tier Job ID Resolution
  const rawId = (id || '').trim().toLowerCase().replace(/\/$/, '');
  const indexKeys = Object.keys(jobsIndexData);

  let matchedKey = indexKeys.find(
    k => k === id || k.toLowerCase() === rawId
  );

  if (!matchedKey && rawId) {
    matchedKey = indexKeys.find(k => {
      const kLower = k.toLowerCase();
      return kLower.includes(rawId) || rawId.includes(kLower);
    });
  }

  if (!matchedKey && rawId) {
    const tokens = rawId.split(/[-_\s]+/).filter(t => t.length > 3);
    if (tokens.length > 0) {
      matchedKey = indexKeys.find(k => {
        const kLower = k.toLowerCase();
        return tokens.every(token => kLower.includes(token));
      });
    }
  }

  function getInitialSsrJob() {
    if (typeof window === 'undefined') {
      return (globalThis as any).__SSR_JOB_DATA__ ?? null;
    }
    const el = document.getElementById('__SSR_JOB_DATA__');
    if (el?.textContent) {
      try {
        return JSON.parse(el.textContent);
      } catch {
        return null;
      }
    }
    return null;
  }
  const initialSsrJob = getInitialSsrJob();
  const [job, setJob] = useState<any>(initialSsrJob);
  const [loadingJob, setLoadingJob] = useState<boolean>(!initialSsrJob && !!matchedKey);

  useEffect(() => {
    if (!matchedKey) {
      setJob(null);
      setLoadingJob(false);
      return;
    }
    if (job && (job.id === matchedKey || job.id === id)) {
      setLoadingJob(false);
      return;
    }

    setLoadingJob(true);
    const globPath = `../data/jobs-generated/${matchedKey}.json`;
    const loader = jobModules[globPath];

    const fetchJobFallback = () => {
      fetch(`/data/jobs-generated/${matchedKey}.json`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data && data.title) {
            setJob(data);
          } else {
            setJob(null);
          }
          setLoadingJob(false);
        })
        .catch(() => {
          setJob(null);
          setLoadingJob(false);
        });
    };

    if (loader) {
      loader()
        .then((mod: any) => {
          setJob(mod.default || mod);
          setLoadingJob(false);
        })
        .catch((err: any) => {
          console.error(`Failed to load job data for ${matchedKey} via module loader, trying fetch fallback`, err);
          fetchJobFallback();
        });
    } else {
      fetchJobFallback();
    }
  }, [matchedKey, id]);

  const executePdfDownload = () => {
    setShowPdfModal(true);
    setIsGeneratingPdf(true);
    setPdfProgress(0);
    setTimeout(() => {
      handleConfirmDownloadPdf();
    }, 10);
  };

  const startPdfDownload = () => {
    requireAuthForDownloadAction(
      executePdfDownload,
      "Google Sign-In Required for PDF Download",
      "Please sign in with your Google Account to download complete recruitment details as a clean PDF document."
    );
  };

  const handleConfirmDownloadPdf = async () => {
    setPdfProgress(5);
    
    // Yield to let the UI update and show the loading modal instantly
    await new Promise(resolve => setTimeout(resolve, 50));

    // Send Google Analytics event if gtag / dataLayer is loaded
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'file_download', {
          event_category: 'Recruitment Guide',
          event_label: job?.title || id,
          file_name: `${id || 'vacancy'}-Notification-Details.pdf`,
          file_extension: 'pdf',
          job_id: id,
          job_title: job?.title
        });
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'pdf_download',
          job_id: id,
          job_title: job?.title
        });
      }
    }

    try {
      setPdfProgress(15);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const element = document.getElementById('printable-job-content');
      if (!element) {
        window.print();
        setShowPdfModal(false);
        setIsGeneratingPdf(false);
        return;
      }

      // Hide modal temporarily for capture if it's inside the captured element
      // (though our modal is usually outside or fixed, we filter it out)
      const filter = (node: HTMLElement) => {
        // Exclude elements with print:hidden or no-pdf, or specific tags
        const tagName = node.tagName ? node.tagName.toLowerCase() : '';
        if (tagName === 'nav' || tagName === 'header' || tagName === 'footer') {
          return false;
        }
        if (node.classList) {
          if (node.classList.contains('print:hidden') || node.classList.contains('no-pdf')) {
            return false;
          }
        }
        return true;
      };

      setPdfProgress(40);
      const dataUrl = await toPng(element, { 
        filter: filter,
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 1.5 // Good balance of quality and size
      });
      
      setPdfProgress(75);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      setPdfProgress(85);
      await new Promise(resolve => setTimeout(resolve, 10));

      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      setPdfProgress(95);
      await new Promise(resolve => setTimeout(resolve, 10));

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
      setPdfProgress(100);
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.error("html-to-image failed, falling back to window.print", err);
      try {
        window.print();
      } catch (e) {
        // Ignore print error
      }
    } finally {
      setIsGeneratingPdf(false);
      setShowPdfModal(false);
      setPdfProgress(0);
    }
  };

  const executeDownloadDvChecklist = () => {
    if (!job) return;
    const docs = job.documentsRequired || [
      'Educational Certificates & Marksheets (Matriculation / Graduation / Post Graduation / Diploma)',
      'Identity Proof (Aadhaar Card / PAN Card / Voter ID / Passport)',
      'Category / Caste Certificate (OBC / SC / ST / EWS) if applicable',
      'Disability Certificate (PwBD) / Ex-Servicemen Discharge Book if applicable',
      'Recent Passport Size Photograph & Signature Scan',
      'Work Experience Certificates (if applicable)'
    ];
    const content = `DOCUMENT VERIFICATION CHECKLIST - ${job.title}\n${job.board}\n` +
      `--------------------------------------------------\n\n` +
      docs.map((doc: string, idx: number) => `[  ] ${idx + 1}. ${doc}`).join('\n\n') +
      `\n\n--------------------------------------------------\nDownloaded from NewVacancyAlert.in`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.id || 'job'}-DV-Checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDvChecklist = () => {
    requireAuthForDownloadAction(
      executeDownloadDvChecklist,
      "Google Sign-In Required",
      "Please sign in with your Google Account to download the Document Verification Checklist."
    );
  };

  const jobSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job?.title,
    "description": job?.seoDescription || job?.overview?.join(' '),
    "identifier": {
      "@type": "PropertyValue",
      "name": job?.board,
      "value": job?.advtNo || job?.id
    },
    "datePosted": job?.lastUpdated || "2026-08-01",
    "validThrough": job?.importantDates?.find(d => d.event.toLowerCase().includes('last date'))?.date || "2026-12-31",
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job?.board,
      "sameAs": "https://newvacancyalert.in",
      "logo": "https://newvacancyalert.in/logo.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job?.jobLocation || "India",
        "addressCountry": "IN"
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (job?.faqs || []).map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  // SEO Internal Linking: Calculate 6 Related & Trending Vacancies
  const relatedJobs = useMemo(() => {
    if (!job) return [];
    const indexEntries = Object.entries(jobsIndexData as Record<string, any>);
    const currentId = (job.id || id || '').toLowerCase();
    const currentBoard = (job.board || '').toLowerCase();
    const currentTitle = (job.title || '').toLowerCase();

    const matches = indexEntries.filter(([k, j]) => {
      if (k.toLowerCase() === currentId) return false;
      const b = (j.board || '').toLowerCase();
      const t = (j.title || '').toLowerCase();
      if (currentBoard && (b.includes(currentBoard) || currentBoard.includes(b))) return true;
      const keywords = ['apprentice', 'aiims', 'railway', 'rrb', 'bank', 'sbi', 'ibps', 'drdo', 'isro', 'esic', 'teacher', 'constable', 'engineer', 'court', 'clerk', 'nursing', 'medical'];
      for (const kw of keywords) {
        if (currentTitle.includes(kw) && (t.includes(kw) || b.includes(kw))) return true;
      }
      return false;
    });

    const result = matches.slice(0, 6);
    if (result.length < 6) {
      for (const [k, j] of indexEntries) {
        if (k.toLowerCase() !== currentId && !result.some(([rk]) => rk === k)) {
          result.push([k, j]);
          if (result.length >= 6) break;
        }
      }
    }
    return result.map(([k, j]) => ({ id: k, ...j }));
  }, [job, id]);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      setShareSupported(true);
    }
    
    // Load bookmark state
    if (id) {
      const saved = localStorage.getItem(`bookmark_${id}`);
      if (saved === 'true') {
        setBookmarkSaved(true);
      }
    }

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? `${totalScroll / windowHeight}` : '0';
      setScrollProgress(Number(scroll) * 100);

      if (totalScroll > 350) {
        setShowDock(true);
      } else {
        setShowDock(false);
      }

      // Section tracking
      const sections = ['overview', 'highlights', 'dates', 'vacancies', 'eligibility', 'salary', 'fees', 'selection', 'exam-pattern', 'syllabus', 'how-to-apply', 'faqs'];
      let current = '';
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 85 : 105;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const absoluteTop = rect.top + scrollTop;
          if (scrollTop >= (absoluteTop - offset)) {
            current = section;
          }
        }
      }
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (loadingJob && !job) {
    return (
      <div className="w-full bg-slate-50 min-h-[70vh] py-12 px-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-extrabold text-slate-700">Loading Job Notification Details...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="w-full bg-slate-50 min-h-[70vh] py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Search className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Recruitment Notification Search
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              The exact notification ID <strong className="text-slate-800 font-bold">"{id}"</strong> could not be directly located. Explore popular recruitment updates or return to the main dashboard:
            </p>
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 text-left">
              Popular Direct Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              <Link
                to="/aiims-norcet-11-nursing-officer-2026"
                className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-xl transition group"
              >
                <span className="text-xs font-black text-blue-900 group-hover:text-blue-600 block truncate">
                  AIIMS NORCET-11 Nursing Officer
                </span>
                <span className="text-[11px] text-slate-500 block truncate">2218+ Vacancies 2026</span>
              </Link>
              <Link
                to="/aiims-norcet-11-nursing-officer-2026/cutoff"
                className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-xl transition group"
              >
                <span className="text-xs font-black text-blue-900 group-hover:text-blue-600 block truncate">
                  AIIMS NORCET-11 Cutoff Marks
                </span>
                <span className="text-[11px] text-slate-500 block truncate">Rank Predictor & Percentile</span>
              </Link>
              <Link
                to="/rrb-exam-calendar-2026-27"
                className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-xl transition group"
              >
                <span className="text-xs font-black text-blue-900 group-hover:text-blue-600 block truncate">
                  RRB Railway Exam Calendar
                </span>
                <span className="text-[11px] text-slate-500 block truncate">NTPC, ALP, Group D Dates</span>
              </Link>
              <Link
                to="/salary-calculator"
                className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-xl transition group"
              >
                <span className="text-xs font-black text-blue-900 group-hover:text-blue-600 block truncate">
                  7th Pay Salary Calculator
                </span>
                <span className="text-[11px] text-slate-500 block truncate">DA (53%), HRA, In-Hand Pay</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md text-center"
            >
              Return to Main Dashboard
            </Link>
            <Link
              to="/articles"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition text-center"
            >
              Browse All Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const boardInitials = (job.board || '').split(' ').map(w => w[0]).join('').replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase() || 'GOVT';

  const scrollToSection = (sectionId: string, alignToCenter = false) => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (alignToCenter) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const absoluteTop = rect.top + scrollTop;
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 75 : 90;

        window.scrollTo({
          top: absoluteTop - offset,
          behavior: 'smooth'
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const toggleBookmark = () => {
    const nextState = !bookmarkSaved;
    setBookmarkSaved(nextState);
    localStorage.setItem(`bookmark_${id}`, String(nextState));
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.seoTitle,
          text: job.seoDescription,
          url: window.location.href,
        });
      } catch (err) {
        copyPageLink();
      }
    } else {
      copyPageLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeOverview = (Array.isArray(job.overview) ? job.overview : []).filter(p => !isNoData(p));
  const activeHighlights = (Array.isArray(job.highlights) ? job.highlights : []).filter(item => !isNoData(item?.value));
  const activeDates = (Array.isArray(job.importantDates) ? job.importantDates : []).filter(item => !isNoData(item?.date) && !isNoData(item?.event));
  
  const activeVacancyDetails = (Array.isArray(job.vacanciesDetails) ? job.vacanciesDetails : []).filter(item => !isNoData(item?.count) && !isNoData(item?.category));
  const activeRegionWiseVacancies = (Array.isArray(job.regionWiseVacancies) ? job.regionWiseVacancies : []).filter(item => !isNoData(item?.count) && !isNoData(item?.region));
  const hasVacancies = activeVacancyDetails.length > 0 || activeRegionWiseVacancies.length > 0;

  const activeEducation = (Array.isArray(job.eligibility?.education) ? job.eligibility.education : []).filter(item => !isNoData(item));
  const hasAgeLimit = !isNoData(job.eligibility?.ageLimit);
  const activeAgeRelaxation = (Array.isArray(job.eligibility?.ageRelaxation) ? job.eligibility.ageRelaxation : []).filter(item => !isNoData(item?.relaxation) && !isNoData(item?.category));
  const activeMedical = (Array.isArray(job.eligibility?.medicalStandards) ? job.eligibility.medicalStandards : []).filter(item => !isNoData(item));
  const hasEligibility = activeEducation.length > 0 || hasAgeLimit || activeAgeRelaxation.length > 0 || activeMedical.length > 0;

  const hasSalary = job.salary && (!isNoData(job.salary.payLevel) || !isNoData(job.salary.initialPay));

  const activeFees = Array.isArray(job.applicationFee) 
    ? job.applicationFee.filter(item => !isNoData(item?.fee) && !isNoData(item?.category)) 
    : [];
  const hasFees = activeFees.length > 0 || (typeof job.applicationFee === 'object' && job.applicationFee !== null);

  const activeSelection = (Array.isArray(job.selectionProcess) ? job.selectionProcess : []).filter(item => !isNoData(item?.stage) && !isNoData(item?.description));
  const hasSelection = activeSelection.length > 0;

  const hasExamPattern = job.examPattern && !isNoData(job.examPattern.duration) && job.examPattern.sections && job.examPattern.sections.length > 0;

  const activeSyllabus = (job.syllabus || []).filter(item => !isNoData(item.section) && item.topics && item.topics.length > 0).map(item => ({
    ...item,
    topics: item.topics.filter(t => !isNoData(t))
  })).filter(item => item.topics.length > 0);
  const hasSyllabus = activeSyllabus.length > 0;

  const activeReservationDetails = (job.reservation?.detailsList || []).filter(item => !isNoData(item));
  const hasReservation = activeReservationDetails.length > 0;

  const hasExamCentres = job.examCentres && !isNoData(job.examCentres.details);

  const defaultHowToApply = [
    `Visit the official recruitment portal of ${job.board || 'the organization'} at ${job.officialLinks?.[0]?.url || job.u || 'the official website'}.`,
    'Search for the official advertisement/notification and read all eligibility criteria carefully.',
    'Complete user registration by providing your basic details, valid email address, and mobile number.',
    'Fill in the application form accurately with personal, educational, and professional qualification details.',
    'Upload scanned copies of required documents, passport photograph, signature, and category certificate if applicable.',
    'Pay the application fee (if applicable) using the prescribed online or offline payment method.',
    'Submit the completed application form and print a copy of the acknowledgment/application slip for future reference.'
  ];

  const activeHowToApply = (job.howToApply && job.howToApply.length > 0)
    ? job.howToApply.filter(item => !isNoData(item))
    : defaultHowToApply;
  const hasHowToApply = activeHowToApply.length > 0;

  const hasFaqs = job.faqs && job.faqs.length > 0;

  const sectionsToSearch = [
    { id: 'overview', title: 'Recruitment Overview', desc: 'Detailed introductory summary and background', show: activeOverview.length > 0 },
    { id: 'highlights', title: 'Quick Highlights', desc: 'A quick summary card with key parameters', show: activeHighlights.length > 0 },
    { id: 'dates', title: 'Important Dates', desc: 'Application start, deadline, timeline and crucial dates', show: activeDates.length > 0 },
    { id: 'vacancies', title: 'Vacancy Details', desc: 'Specialty-wise and category-wise post distributions', show: hasVacancies },
    { id: 'eligibility', title: 'Eligibility Criteria', desc: 'Academic qualification, experience and medical standards', show: hasEligibility },
    { id: 'salary', title: 'Salary & Allowances', desc: 'Pay level, basic pay scale and financial perquisites', show: hasSalary },
    { id: 'fees', title: 'Application Fees', desc: 'Category-wise fee structure and payment modes', show: hasFees },
    { id: 'selection', title: 'Selection Process', desc: 'Personal Interview, shortlisting and merit rules', show: hasSelection },
    { id: 'exam-pattern', title: 'Exam Pattern', desc: 'Qualifying interview criteria and subject-wise metrics', show: hasExamPattern },
    { id: 'syllabus', title: 'Syllabus & Topics', desc: 'Key assessment topics and interview parameters', show: hasSyllabus },
    { id: 'how-to-apply', title: 'How to Apply', desc: 'Step-by-step registration and dispatch instructions', show: hasHowToApply },
    { id: 'faqs', title: 'Frequently Asked Questions', desc: '20+ detailed question and answer blocks', show: hasFaqs }
  ].filter(s => s.show);

  const handleDockSearch = (query: string) => {
    if (!query.trim()) return;
    const match = sectionsToSearch.find(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) || 
      s.desc.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      scrollToSection(match.id, true);
      setFlashedSection(match.id);
      setTimeout(() => {
        setFlashedSection(null);
      }, 2500);
    }
  };

  const matchedSections = searchQuery.trim() === '' ? [] : sectionsToSearch.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestedDockSections = dockQuery.trim() === '' ? [] : sectionsToSearch.filter(s => 
    s.title.toLowerCase().includes(dockQuery.toLowerCase()) || 
    s.desc.toLowerCase().includes(dockQuery.toLowerCase())
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FileText, show: activeOverview.length > 0 },
    { id: 'highlights', label: 'Highlights', icon: Target, show: activeHighlights.length > 0 },
    { id: 'dates', label: 'Dates', icon: Calendar, show: activeDates.length > 0 },
    { id: 'vacancies', label: 'Vacancies', icon: Briefcase, show: hasVacancies },
    { id: 'eligibility', label: 'Eligibility', icon: Award, show: hasEligibility },
    { id: 'salary', label: 'Salary', icon: DollarSign, show: hasSalary },
    { id: 'fees', label: 'Fees', icon: CreditCard, show: hasFees },
    { id: 'selection', label: 'Selection', icon: Layers, show: hasSelection },
    { id: 'exam-pattern', label: 'Exam Pattern', icon: FileSignature, show: hasExamPattern },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen, show: hasSyllabus },
    { id: 'reservation', label: 'Reservation', icon: Users, show: hasReservation },
    { id: 'exam-centres', label: 'Venues', icon: MapPin, show: hasExamCentres },
    { id: 'how-to-apply', label: 'Apply', icon: Send, show: hasHowToApply },
    { id: 'faqs', label: 'FAQ', icon: HelpCircle, show: hasFaqs },
  ].filter(item => item.show);

  // Schema generation
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": job.seoTitle,
    "description": job.seoDescription,
    "datePublished": "2026-05-19T00:00:00+05:30",
    "dateModified": "2026-07-18T23:25:00+05:30",
    "author": {
      "@type": "Person",
      "name": "Anand Kumar Mehta",
      "url": "https://www.instagram.com/pharmacistanand"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newvacancyalert.in/logo.png"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://newvacancyalert.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": job.board,
        "item": "https://newvacancyalert.in/#search"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": job.title,
        "item": `https://newvacancyalert.in/${id}`
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NewVacancyAlert.in",
    "url": "https://newvacancyalert.in",
    "logo": "https://newvacancyalert.in/logo.png"
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": job.seoTitle,
    "description": job.seoDescription,
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  // Parse ISO date helper for validThrough schema
  const parseValidThroughDate = () => {
    let validThrough: string | null = null;
    const dates = job.importantDates || [];
    for (const d of dates) {
      const ev = (d.event || "").toLowerCase();
      if (ev.includes("last date") || ev.includes("closing") || ev.includes("walk-in") || ev.includes("end date")) {
        const m = d.date.match(/(\d{2})[\.\-\/](\d{2})[\.\-\/](\d{4})/);
        if (m) {
          validThrough = `${m[3]}-${m[2]}-${m[1]}T23:59:59+05:30`;
          break;
        }
      }
    }
    if (!validThrough && dates.length > 0) {
      const lastDateStr = dates[dates.length - 1].date;
      const m = lastDateStr.match(/(\d{2})[\.\-\/](\d{2})[\.\-\/](\d{4})/);
      if (m) {
        validThrough = `${m[3]}-${m[2]}-${m[1]}T23:59:59+05:30`;
      }
    }
    return validThrough || "2026-12-31T23:59:59+05:30";
  };

  // Salary parser helper
  const parseBaseSalary = () => {
    const payMatch = (job.salary?.initialPay || "").match(/(?:Rs\.?|INR|\b)\s*([\d,]{4,7})/i);
    let salaryValue = 35400;
    if (payMatch) {
      const parsed = parseInt(payMatch[1].replace(/,/g, ""), 10);
      if (!isNaN(parsed) && parsed >= 5000) {
        salaryValue = parsed;
      }
    }
    return salaryValue;
  };

  const cleanLoc = job.jobLocation || "India";
  const pinMatch = cleanLoc.match(/\b\d{6}\b/);
  const postalCode = pinMatch ? pinMatch[0] : "110001";
  const locality = cleanLoc.includes(",") ? cleanLoc.split(",")[0].trim() : cleanLoc;
  const region = cleanLoc.includes(",") ? cleanLoc.split(",").slice(-1)[0].replace(/-\s*\d{6}/, "").trim() : "India";

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.seoDescription || job.title,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.board,
      "value": job.advtNo || job.id
    },
    "datePosted": "2026-05-19T00:00:00+05:30",
    "validThrough": parseValidThroughDate(),
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.board,
      "sameAs": job.urls?.[0]?.url || "https://newvacancyalert.in"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": cleanLoc.length > 100 ? cleanLoc.substring(0, 100) : cleanLoc,
        "addressLocality": locality,
        "addressRegion": region,
        "postalCode": postalCode,
        "addressCountry": "IN"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": parseBaseSalary(),
        "unitText": "MONTH"
      }
    }
  };

  // Specialty filtering for ESIC
  const filteredSpecialties = (job.regionWiseVacancies || []).filter(spec => 
    spec.region.toLowerCase().includes(vacancySearch.toLowerCase())
  );


  return (
    <div id="printable-job-content" className="w-full bg-slate-50 min-h-screen pb-24 lg:pb-12 relative print:bg-white print:pb-0">
      <Helmet>
        <title>{job.seoTitle}</title>
        <meta name="description" content={job.seoDescription} />
        <meta name="keywords" content={`${job.focusKeywords}, ${job.lsiKeywords}`} />
        <link rel="canonical" href={`https://newvacancyalert.in/${id}`} />
        <meta property="og:title" content={job.seoTitle} />
        <meta property="og:description" content={job.seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://newvacancyalert.in/${id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={job.seoTitle} />
        <meta name="twitter:description" content={job.seoDescription} />
        
        {/* Structured Data Scripts */}
        <script type="application/ld+json">{JSON.stringify(jobPostingSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      {/* Reading Progress Bar & Floating Pill */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50 print:hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      <div className="fixed top-3 right-4 z-50 hidden md:flex items-center bg-blue-900 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-full shadow-md pointer-events-none border border-blue-700 print:hidden">
        {Math.round(scrollProgress)}% Read
      </div>

      {/* Prominent Search Bar (SEO Requirement) */}
      <div className="bg-slate-900 py-6 px-4 border-b border-slate-800 print:hidden">
        <div className="max-w-[1800px] 2xl:max-w-[2000px] mx-auto">
          <div className="relative max-w-2xl 2xl:max-w-4xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search vacancy details, eligibility, dates, qualification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 py-3 sm:py-3.5 bg-slate-800 border-2 border-slate-700/60 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-900/40 outline-none transition-all shadow-lg truncate"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Real-time Search Results Box */}
          {matchedSections.length > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-2xl 2xl:max-w-4xl bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto px-2 py-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-3">Matching Sections</h4>
              <div className="space-y-1">
                {matchedSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      scrollToSection(sec.id, true);
                      setFlashedSection(sec.id);
                      setTimeout(() => setFlashedSection(null), 2500);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 flex flex-col transition-colors group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 text-sm flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-blue-500" /> {sec.title}
                    </span>
                    <span className="text-xs text-slate-400 font-medium pl-6">{sec.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {searchQuery && matchedSections.length === 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-2xl 2xl:max-w-4xl bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 text-center text-slate-500 text-sm font-semibold">
              No sections matching "{searchQuery}". Try "dates", "eligibility", "salary" or "apply".
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumbs for Search Engines */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 hidden md:block print:hidden">
        <div className="max-w-[1800px] 2xl:max-w-[2000px] mx-auto flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="hover:text-blue-600 transition-colors uppercase tracking-wider text-[10px]">Latest Jobs</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-700 font-extrabold">{job.board}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-blue-600 font-black">{job.title}</span>
        </div>
      </div>

      {/* Premium Header / Recruitment Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0f172a] pt-8 pb-16 px-3 sm:px-8 md:pt-12 md:pb-24 relative overflow-hidden border-b-4 border-emerald-500 print:bg-white print:text-black print:p-0 print:border-b-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[100px] opacity-20 -mr-16 -mt-16 pointer-events-none print:hidden"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full filter blur-[80px] opacity-10 -ml-16 -mb-16 pointer-events-none print:hidden"></div>
        <div className="max-w-[1800px] 2xl:max-w-[2000px] mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white font-bold text-xs sm:text-sm mb-6 sm:mb-8 transition-colors bg-blue-950/50 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-800/40 backdrop-blur-sm print:hidden">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 sm:mr-2" /> Back to Latest Jobs
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start lg:items-center justify-between">
            <div className="max-w-4xl 2xl:max-w-5xl">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mb-4 sm:mb-6 print:hidden">
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-400/25 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {job.applicationStatus || 'Active'}
                </span>
                <span className="bg-blue-800/40 text-blue-100 border border-blue-400/25 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold font-mono flex items-center gap-1 sm:gap-1.5">
                  <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Advt: {job.advtNo}
                </span>
                <span className="bg-rose-500/10 text-rose-300 border border-rose-400/25 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {job.vacancies} Vacancies
                </span>
                {isAdmin && (
                  <span className="bg-purple-500/20 text-purple-200 border border-purple-400/40 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm" title="Admin Only: Date when job was added to site">
                    <UploadCloud className="h-3.5 w-3.5 text-purple-300" />
                    Site Upload Date: {getJobUploadDate(job?.id || matchedKey, job?.lastUpdated || job?.d)}
                  </span>
                )}
              </div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 sm:mb-4 tracking-tight print:text-black print:text-3xl">
                {job.title}
              </h1>
              <p className="text-xs sm:text-base md:text-xl text-blue-200 font-semibold flex items-center gap-1.5 sm:gap-2 print:text-black">
                <Building2 className="h-4 w-4 sm:h-5.5 sm:w-5.5 text-blue-400 shrink-0" /> {job.board}
              </p>
            </div>
            
            {/* Premium Recruitment Overview Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl w-full lg:w-auto min-w-0 sm:min-w-[340px] 2xl:min-w-[380px] shadow-2xl print:border-slate-300 print:bg-white print:text-black">
              <div className="flex items-center gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-white/10 mb-3 sm:mb-4 print:border-slate-300">
                <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 bg-blue-500/20 border border-blue-400/35 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-white text-[10px] sm:text-xs shrink-0">{boardInitials}</div>
                <div>
                  <h4 className="text-[9px] sm:text-[10px] font-bold text-blue-300 uppercase tracking-widest">Recruitment status</h4>
                  <p className="text-xs sm:text-sm font-black text-white print:text-black">Official Notification Active</p>
                </div>
              </div>
              <div className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 print:text-slate-600 font-medium">Advt Number</span>
                  <span className="text-white print:text-black font-extrabold font-mono text-[10px] sm:text-xs">{job.advtNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 print:text-slate-600 font-medium">Total Vacancies</span>
                  <span className="text-emerald-300 print:text-black font-black text-sm sm:text-base">{job.vacancies} Posts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 print:text-slate-600 font-medium">Application Mode</span>
                  <span className="text-white print:text-black font-extrabold">{job.applicationMode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 print:text-slate-600 font-medium">Job Location</span>
                  <span className="text-white print:text-black font-extrabold flex items-center gap-1"><MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-400" /> {job.jobLocation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 print:text-slate-600 font-medium">Last Updated</span>
                  <span className="text-white print:text-black font-extrabold">{job.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-3 sm:px-6 2xl:px-8 -mt-8 sm:-mt-10 relative z-20 flex flex-col lg:flex-row gap-6 lg:gap-8 2xl:gap-10">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {/* Adsterra Display Banner */}
          <AdsterraBanner className="print:hidden" />
          
          {/* SEO Introduction */}
          {activeOverview.length > 0 && (
            <section 
              id="overview" 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
                flashedSection === 'overview' 
                  ? 'ring-4 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200'
              }`}
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-blue-600"><FileText className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Recruitment Overview
              </h2>
              <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:font-medium prose-p:text-slate-600 prose-strong:text-slate-800">
                {activeOverview.map((para, idx) => (
                  <p key={idx} className="mb-3 sm:mb-4 text-justify leading-relaxed text-xs sm:text-sm md:text-base">{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Internal Link Card to RRB Exam Calendar 2026-27 for Railway Sub-pages */}
          {((job?.board && (job.board.toLowerCase().includes('rrb') || job.board.toLowerCase().includes('railway'))) || (job?.title && (job.title.toLowerCase().includes('rrb') || job.title.toLowerCase().includes('railway'))) || (id && (id.includes('rrb') || id.includes('rail')))) && (
            <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-amber-300/40 relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 text-white shrink-0">
                    <Calendar className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Official RRB Roadmap 2026-27
                    </span>
                    <h3 className="text-base sm:text-lg font-black leading-snug">
                      RRB Exam Calendar 2026-27: Complete Notification, Exam Date & Admit Card Schedule
                    </h3>
                    <p className="text-xs text-amber-100 font-medium">
                      Check expected notification release dates, CBT-1 & CBT-2 exam dates, admit card trackers & result timelines for NTPC, Group D, ALP, Technician & JE.
                    </p>
                  </div>
                </div>
                <Link 
                  to="/rrb-exam-calendar-2026-27" 
                  className="shrink-0 w-full sm:w-auto text-center px-5 py-3 bg-white text-orange-950 hover:bg-amber-100 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                >
                  <span>View RRB Calendar</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Compact 1-Liner In-Content Previous Year Papers Download */}
          {(id === 'aiims-norcet-11-nursing-officer-2026' || (job?.board && job.board.toLowerCase().includes('aiims')) || (job?.title && job.title.toLowerCase().includes('norcet')) || (job?.title && job.title.toLowerCase().includes('nursing'))) && (
            <NorcetPdfDownloadWidget 
              variant="compact" 
              title="AIIMS NORCET Previous Years Solved Question Papers (2017–2023 PDF)"
              subtitle="Instant download of 8+ full exam papers with official answer keys."
            />
          )}

                    {id === 'isro-hsfc-scientist-engineer-sd-recruitment-2026' && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl shadow-xl border-2 border-indigo-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      ISRO Human Space Flight Programme
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Pay Level 11 (₹67,700–₹2,08,700)
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      No Application Fee (₹0)
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    Human Space Flight Centre (HSFC), Bengaluru
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Direct Recruitment of <strong>Scientist/Engineer 'SD' (Group 'A')</strong> across 6 cutting-edge space research domains: Bioinstrumentation, Space Radiation Biology, Proteomic Adaptation, Digital Twin Biology, Biomechanics & Real-time AI/ML Signal Processing.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://www.isro.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on ISRO Portal
                  </a>
                </div>
              </div>
            </div>
          )}

                    {id === 'krcl-apprentice-recruitment-2026' && (
            <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-orange-950 rounded-2xl shadow-xl border-2 border-amber-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      Konkan Railway NATS Special Drive
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Stipend up to ₹6,150/month (DBT)
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      No Written Exam / Fee (₹0)
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    Konkan Railway Corporation Limited (KRCL)
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Walk-in Document Verification for <strong>134 Graduate &amp; Diploma Apprentice Trainees</strong> (Civil, Electrical, Electronics, Mechanical &amp; General Stream Graduates) passouts from 2021 to 2025.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://nats.education.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Register on NATS Portal
                  </a>
                </div>
              </div>
            </div>
          )}

                    {id === 'iob-local-bank-officer-recruitment-2026' && (
            <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 rounded-2xl shadow-xl border-2 border-blue-400/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      Public Sector Bank Officer Drive
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      JMGS Scale-I (₹48,480–₹85,920)
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Online CBT + Interview (80:20)
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    Indian Overseas Bank (IOB) – Local Bank Officer 2026
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Direct Recruitment of <strong>250 Local Bank Officers (Scale-I)</strong> across Tamil Nadu (100), Karnataka (50), Maharashtra (50) &amp; Gujarat (50). Selected officers will be posted in the applied state for the first 12 years.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://www.iob.bank.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on IOB Portal
                  </a>
                </div>
              </div>
            </div>
          )}

                    {id === 'upsc-recruitment-advt-10-2026' && (
            <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-2xl shadow-xl border-2 border-amber-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      UPSC Direct Recruitment Selection
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Pay Level 7 to Level 10
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Fee ₹25 (NIL for Women/SC/ST/PwBD)
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    Union Public Service Commission (UPSC) – Advt 10/2026
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Direct Recruitment to <strong>34 Group 'A' &amp; 'B' Gazetted Posts</strong>: AEE Civil &amp; Electronics, Assistant Director Engg, Hindi Superintendent (Law), Research Officer (NATMO), and UT Ladakh Officers.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://upsconline.nic.in/ora/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on UPSC ORA Portal
                  </a>
                </div>
              </div>
            </div>
          )}

                    {id === 'kea-karnataka-esi-pharmacist-nursing-officer-2026' && (
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl shadow-xl border-2 border-emerald-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      KEA Karnataka Direct Recruitment
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Salary up to ₹99,400/month
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      188 Group 'C' Posts
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    KEA ESI Medical Services Pharmacist &amp; Nursing Officer Recruitment 2026
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Direct recruitment for <strong>98 Pharmacist Officers</strong> (Pay ₹44,425-₹83,700) and <strong>90 Nursing Officers / Shushrushadhikari</strong> (Pay ₹54,175-₹99,400) in ESI Hospitals across Karnataka.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://cetonline.karnataka.gov.in/kea/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on KEA Portal
                  </a>
                </div>
              </div>
            </div>
          )}

                    {id === 'hp-high-court-district-judiciary-recruitment-2026' && (
            <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 rounded-2xl shadow-xl border-2 border-sky-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-sky-500 to-indigo-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      HP High Court Shimla Recruitment
                    </span>
                    <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Salary up to ₹1,54,300/month
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      388 District Judiciary Vacancies
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    HP High Court District Judiciary Recruitment 2026
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Direct recruitment for <strong>141 Clerks</strong>, <strong>89 Peons</strong>, <strong>79 Stenographers</strong>, <strong>65 Process Servers</strong>, <strong>9 Drivers</strong> &amp; <strong>5 Court Managers</strong> in HP District Judiciary.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://www.hphcrecruitment.in/login" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on HPHC Portal
                  </a>
                </div>
              </div>
            </div>
          )}

                    {id === 'cgssb-chhattisgarh-teacher-recruitment-2026' && (
            <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 rounded-2xl shadow-xl border-2 border-orange-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      CGSSB (CG Vyapam) Exam LST26
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      100% Fee Refund for CG Domiciles
                    </span>
                    <span className="bg-orange-500/20 text-orange-300 border border-orange-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Exam Date: 25 Oct 2026
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    CGSSB Chhattisgarh School Education Teacher Recruitment 2026 (LST26)
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Written recruitment exam for <strong>Shikshak (Teacher)</strong> posts under Directorate of Public Instruction CG. Level 8 Pay Scale (Basic ₹35,400 + Allowances).
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://cgssb.cgstate.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on CGSSB Portal
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Quick Highlights */}
          {activeHighlights.length > 0 && (
            <section 
              id="highlights" 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
                flashedSection === 'highlights' 
                  ? 'ring-4 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200'
              }`}
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="bg-emerald-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-emerald-600"><Target className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Quick Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                {activeHighlights.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl flex flex-col gap-0.5 sm:gap-1 hover:border-blue-200 hover:shadow-xs transition-all">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Important Dates */}
          {activeDates.length > 0 && (
            <section 
              id="dates" 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
                flashedSection === 'dates' 
                  ? 'ring-4 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200'
              }`}
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="bg-purple-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-purple-600"><Calendar className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Important Dates
              </h2>
                    {id === 'krcl-apprentice-recruitment-2026' && (
                      <div className="my-6 bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 sm:p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-amber-200/80 pb-3 mb-4">
                          <h4 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="h-4.5 w-4.5 text-amber-600" /> Walk-in Document Verification Schedule &amp; Venue
                          </h4>
                          <span className="text-[10px] font-black text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-lg">09:00 AM – 12:00 PM</span>
                        </div>

                        <div className="mb-4 bg-white p-3.5 rounded-xl border border-amber-200/60 text-xs sm:text-sm text-slate-800 font-medium">
                          <span className="font-black text-amber-900">Official Venue:</span> Executives Club, Konkan Rail Vihar, Sector-40, Opp. Seawoods Railway Station (West), Navi Mumbai – 400706.
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="bg-white border border-slate-200 p-3 rounded-xl">
                            <span className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">24 August 2026</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5">Civil Engineering</h5>
                            <p className="text-[11px] text-slate-600 font-medium">BE Civil (24) &amp; Diploma Civil (20)</p>
                          </div>
                          <div className="bg-white border border-slate-200 p-3 rounded-xl">
                            <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">25 August 2026</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5">Electrical &amp; Electronics</h5>
                            <p className="text-[11px] text-slate-600 font-medium">BE/Diploma Elec (30) &amp; ECE (15)</p>
                          </div>
                          <div className="bg-white border border-slate-200 p-3 rounded-xl">
                            <span className="bg-purple-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">27 August 2026</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5">Mechanical Engineering</h5>
                            <p className="text-[11px] text-slate-600 font-medium">BE Mech (10) &amp; Diploma Mech (15)</p>
                          </div>
                          <div className="bg-white border border-slate-200 p-3 rounded-xl">
                            <span className="bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">28 August 2026</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5">General Stream</h5>
                            <p className="text-[11px] text-slate-600 font-medium">BA / B.Sc / B.Com / BBA / BMS (20)</p>
                          </div>
                        </div>
                      </div>
                    )}
              
              {/* Visual Timeline */}
              {activeDates.length >= 2 && (
                <div className="hidden md:flex justify-between items-center mb-10 mt-6 px-4 relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-blue-500 -z-10 -translate-y-1/2 rounded-full"></div>
                  
                  {activeDates.slice(0, 4).map((date, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 bg-white px-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md ${idx < activeDates.length - 1 ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        {idx + 1}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black text-slate-800 mb-1 max-w-[130px] mx-auto">{date.event}</p>
                        <p className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md inline-block">{date.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {activeDates.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-3 sm:py-4 sm:px-5 font-bold text-slate-700 text-xs sm:text-sm">{item.event}</td>
                        <td className="py-2.5 px-3 sm:py-4 sm:px-5 text-right">
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 font-black text-[10px] sm:text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-2xs">
                            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" /> {item.date}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Marketing Partner Callout Section in between job content */}
          <MarketingPartnerBanner className="print:hidden my-6" />

          {/* Vacancy Details */}
          {hasVacancies && (
            <section 
              id="vacancies" 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
                flashedSection === 'vacancies' 
                  ? 'ring-4 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200'
              }`}
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="bg-amber-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-amber-600"><Briefcase className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Vacancy Details
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-xl sm:text-3xl font-black mb-1">{job.vacancies}</span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-blue-200 uppercase tracking-widest text-center">Total Positions</span>
                </div>
                {activeVacancyDetails.filter(v => v.category !== 'Total Vacancies').slice(0, 3).map((v, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center">
                    <span className="text-lg sm:text-2xl font-black text-slate-800 mb-1">{v.count}</span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">{v.category}</span>
                  </div>
                ))}
              </div>

              {activeVacancyDetails.length > 0 && (
                <>
                  <h3 className="text-sm sm:text-lg font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">Category-wise Distribution</h3>
                  <div className="overflow-x-auto mb-6 sm:mb-8 rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="py-2.5 px-3 sm:py-3 sm:px-5 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">Category</th>
                          <th className="py-2.5 px-3 sm:py-3 sm:px-5 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200 text-right">Vacancies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeVacancyDetails.map((item, idx) => (
                          <tr key={idx} className={item.category === 'Total Vacancies' ? 'bg-blue-50/40 font-black' : 'hover:bg-slate-50/50'}>
                            <td className={`py-2 px-3 sm:py-3.5 sm:px-5 text-xs sm:text-sm ${item.category === 'Total Vacancies' ? 'font-black text-blue-800' : 'font-bold text-slate-700'}`}>
                              {item.category}
                            </td>
                            <td className={`py-2 px-3 sm:py-3.5 sm:px-5 text-right text-xs sm:text-sm ${item.category === 'Total Vacancies' ? 'font-black text-blue-800 text-sm sm:text-base' : 'font-extrabold text-slate-600'}`}>
                              {item.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Specialty-wise Interactive Table */}
              {activeRegionWiseVacancies.length > 0 && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 sm:mb-4 gap-2.5 sm:gap-3">
                    <h3 className="text-sm sm:text-lg font-black text-slate-800">Specialty-wise Post Distribution</h3>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search Specialty..."
                        value={vacancySearch}
                        onChange={(e) => setVacancySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="py-2.5 px-3 sm:py-3 sm:px-5 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">Specialty (Medical discipline)</th>
                          <th className="py-2.5 px-3 sm:py-3 sm:px-5 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200 text-right">Vacancies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {activeRegionWiseVacancies.filter(item => 
                          item.region.toLowerCase().includes(vacancySearch.toLowerCase())
                        ).map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 sm:py-3 sm:px-5 font-semibold text-slate-700">{item.region}</td>
                            <td className="py-2 px-3 sm:py-3 sm:px-5 text-right">
                              <span className="bg-blue-50 border border-blue-100 text-blue-800 font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs inline-block min-w-10 text-center">
                                {item.count}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          )}

          {/* NORCET Cutoff Promo (Specific to NORCET 11) */}
          {id === 'aiims-norcet-11-nursing-officer-2026' && (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl shadow-lg border-2 border-blue-400/50 p-6 sm:p-8 relative overflow-hidden print:hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[50px] opacity-30 -mr-10 -mt-10 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-500 text-amber-950 font-black text-[10px] uppercase px-2 py-1 rounded-md tracking-wider">Must Read</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">Previous Year Cutoff Analysis</h3>
                  </div>
                  <p className="text-blue-100 font-medium text-sm sm:text-base max-w-xl">
                    Compare category-wise Stage I & II cutoffs, qualifying percentages, and vacancy trends for NORCET 8, 9, and 10 to plan your strategy.
                  </p>
                </div>
                <Link to="/aiims-norcet-11-nursing-officer-2026/cutoff" className="shrink-0 bg-white hover:bg-slate-50 text-blue-900 font-black px-6 py-3.5 rounded-xl shadow-xl transition-all flex items-center gap-2 border border-slate-200 w-full sm:w-auto justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-700" /> View Cutoff Trends
                </Link>
              </div>
            </div>
          )}

          {/* Custom NLCIL Apprentice Category & Slot Breakdown Section */}
          {id === 'nlcil-apprentice-recruitment-2026' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="bg-blue-100 text-blue-800 font-black text-[10px] sm:text-xs uppercase px-2.5 py-1 rounded-lg tracking-wider">
                    Detailed Slot & Stipend Breakdown
                  </span>
                  <h3 className="text-base sm:text-xl font-black text-slate-900 mt-1">
                    NLCIL Apprentice Vacancies & Category Allocation
                  </h3>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs px-3 py-1.5 rounded-xl">
                  1,235 Total Slots
                </span>
              </div>

              {/* Large Screen View: Comprehensive Category Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-800 text-white text-xs font-black uppercase tracking-wider">
                      <th className="py-3.5 px-4">Apprentice Category</th>
                      <th className="py-3.5 px-4 text-center">PAP Wards (L&DC/02/2026)</th>
                      <th className="py-3.5 px-4 text-center">Employee Wards (L&DC/03/2026)</th>
                      <th className="py-3.5 px-4 text-center">Contract Wards (L&DC/03/2026)</th>
                      <th className="py-3.5 px-4 text-right">Monthly Stipend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">1. Trade Apprentices (ITI)</div>
                        <div className="text-[11px] text-slate-500 font-medium">Fitter, Turner, Electrician, Motor Mech, Wireman, Diesel Mech, Steno, Welder, COPA, RAC</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg font-black border border-blue-200">352 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg font-black border border-purple-200">72 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-black border border-amber-200">72 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-700">
                        ₹12,000/- pm
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">2. Non-Engineering Graduate</div>
                        <div className="text-[11px] text-slate-500 font-medium">B.Com, B.Sc (CS, Geology, Chem, Microbio), BCA, BBA, Nursing, B.Pharm</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg font-black border border-blue-200">221 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg font-black border border-purple-200">46 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-black border border-amber-200">46 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-700">
                        ₹12,524/- to ₹15,028/- pm
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">3. Engineering Graduate (B.E/B.Tech)</div>
                        <div className="text-[11px] text-slate-500 font-medium">Mechanical, EEE, Civil, Instrumentation, Chemical, Mining, CSE, IT, ECE</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg font-black border border-blue-200">214 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg font-black border border-purple-200">44 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-black border border-amber-200">44 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-700">
                        ₹15,028/- pm
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">4. Technician Diploma</div>
                        <div className="text-[11px] text-slate-500 font-medium">Mechanical, EEE, Civil, Instrumentation, Mining, CSE, ECE, Pharmacist</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg font-black border border-blue-200">88 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg font-black border border-purple-200">18 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-black border border-amber-200">18 Slots</span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-700">
                        ₹12,524/- pm
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black text-xs text-slate-900">
                      <td className="py-3 px-4">Total Training Slots</td>
                      <td className="py-3 px-4 text-center text-blue-900">875 Slots</td>
                      <td className="py-3 px-4 text-center text-purple-900">180 Slots</td>
                      <td className="py-3 px-4 text-center text-amber-900">180 Slots</td>
                      <td className="py-3 px-4 text-right text-emerald-800">1,235 Total Slots</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Special Guidance & Eligibility Rules Alert Box */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm sm:text-base">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <span>Important Project Notice: State Domicile & Discipline Rules</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200 space-y-1">
                    <p className="font-extrabold text-slate-900">📌 Barsingsar Project (Rajasthan) vs Neyveli (Tamil Nadu):</p>
                    <p className="leading-relaxed">
                      NLCIL Barsingsar Project recruitment is strictly restricted to Rajasthan domicile candidates. For Neyveli notifications (L&DC/02/2026 & L&DC/03/2026), eligibility is reserved for Neyveli PAPs and NLCIL employee/contract wards.
                    </p>
                  </div>
                  <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200 space-y-1">
                    <p className="font-extrabold text-slate-900">💻 CS / IT / BCA / MCA Eligibility Rules:</p>
                    <p className="leading-relaxed">
                      CSE & IT graduates/diploma holders and BCA graduates ARE eligible under Neyveli notices. MCA is NOT eligible. In project notices where CS/IT or BCA are omitted (e.g. Barsingsar), those candidates cannot apply.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Eligibility Criteria */}
          {hasEligibility && (
            <section 
              id="eligibility" 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
                flashedSection === 'eligibility' 
                  ? 'ring-4 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200'
              }`}
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="bg-rose-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-rose-600"><Award className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Eligibility Criteria
              </h2>
              
              <div className="space-y-6 sm:space-y-8">
                {activeEducation.length > 0 && (
                  <div>
                    <h3 className="text-sm sm:text-lg font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 border-b border-slate-100 pb-2">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" /> Educational Qualification
                    </h3>
                    {id === 'cgssb-chhattisgarh-teacher-recruitment-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4 text-orange-600" /> CG Domicile Fee Refund &amp; Exam Schedule Highlights
                          </h4>
                          <span className="text-[10px] font-bold text-orange-900 bg-orange-100 px-2 py-0.5 rounded-md">Exam Code LST26</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">Govt Policy</span>
                              <span className="text-[11px] font-bold text-emerald-700">100% Refund</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">1. Application Fee Refund Rule</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Fee paid by CG Domiciles who <strong>appear in the written exam</strong> will be 100% refunded back into their bank account.
                            </p>
                          </div>
                          <div className="bg-white border border-orange-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-orange-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">25.10.2026</span>
                              <span className="text-[11px] font-bold text-orange-700">10:00 AM - 12:15 PM</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">2. Tentative Exam Date</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Written competitive exam across 16 District Headquarters. Admit Cards available from <strong>19 October 2026</strong>.
                            </p>
                          </div>
                          <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">3-5 Sept 2026</span>
                              <span className="text-[11px] font-bold text-amber-700">Truti Sudhar</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">3. Correction Window</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Online correction window will be active from 03 to 05 September 2026 up to 5:00 PM on CGSSB portal.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {id === 'hp-high-court-district-judiciary-recruitment-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4 text-sky-600" /> Post-wise Educational Qualification &amp; Pay Scale Matrix
                          </h4>
                          <span className="text-[10px] font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md">388 Total Posts</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white border border-sky-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-sky-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">141 Posts</span>
                              <span className="text-[11px] font-bold text-sky-700">Level 03 (₹20k-₹64k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">1. Clerk (Group-C)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Graduate Degree + Computer Knowledge + Typing 30 WPM English &amp; 25 WPM Hindi (Kruti Dev-10).
                            </p>
                          </div>
                          <div className="bg-white border border-indigo-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-indigo-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">89 Posts</span>
                              <span className="text-[11px] font-bold text-indigo-700">Level 01 (₹18k-₹56k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">2. Peon / Chowkidar (Group-D)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Class 12th (10+2) Pass. Merit list based on 10+2 marks percentage (85%) + Certificate Evaluation (15%).
                            </p>
                          </div>
                          <div className="bg-white border border-purple-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-purple-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">79 Posts</span>
                              <span className="text-[11px] font-bold text-purple-700">Level 06 (₹25k-₹81k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">3. Stenographer Gr-III (Group-C)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Graduate Degree + English Steno 80 WPM &amp; Typing 40 WPM (English) / 30 WPM (Hindi Kruti Dev-10).
                            </p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">65 Posts</span>
                              <span className="text-[11px] font-bold text-blue-700">Level 01 (₹18k-₹56k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">4. Process Server (Group-D)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Passed Class 12th (10+2) examination from a recognized Board.
                            </p>
                          </div>
                          <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">09 Posts</span>
                              <span className="text-[11px] font-bold text-emerald-700">Level 05 (₹21k-₹67k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">5. Driver (Group-C)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Matriculation (10th) + Valid LMV Driving License with minimum 3 years driving experience.
                            </p>
                          </div>
                          <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">05 Posts</span>
                              <span className="text-[11px] font-bold text-amber-700">Level 16 (₹48k-₹1.54L)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">6. Court Manager (Group-B)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Graduation Degree + MBA (HR/IT/Finance/Process) + 3 years experience. Age: 25 to 35 years.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {id === 'kea-karnataka-esi-pharmacist-nursing-officer-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4 text-emerald-600" /> Post-wise Qualification &amp; Pay Scale Breakdown
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">188 Total Posts</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">98 Posts</span>
                              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Pay: ₹44,425 - ₹83,700</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-sm mb-1">1. Pharmacist Officer (ಫಾರ್ಮಸಿ ಆಫೀಸರ್)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              <strong>Qualification:</strong> Diploma in Pharmacy (D.Pharm) from a recognized institute + Must be registered with <strong>Karnataka Pharmacy Council</strong>.
                            </p>
                          </div>
                          <div className="bg-white border border-teal-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-teal-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">90 Posts</span>
                              <span className="text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Pay: ₹54,175 - ₹99,400</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-sm mb-1">2. Nursing Officer (ನರ್ಸಿಂಗ್ ಆಫೀಸರ್ - ಶುಶ್ರೂಷಾಧಿಕಾರಿ)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              <strong>Qualification:</strong> Diploma in General Nursing (GNM) OR B.Sc Nursing from authorized authority + Must be registered with <strong>Karnataka Nursing Council</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {id === 'upsc-recruitment-advt-10-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4 text-amber-600" /> 7 Post Categories Vacancy &amp; Qualification Breakdown
                          </h4>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">34 Total Posts</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                            <span className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">Vacancy 01 (1 Post)</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5 mb-1">AEE (Civil) – Min of Ports</h5>
                            <p className="text-[11px] text-slate-600 font-medium">Level 10 | Max 38 Yrs (OBC) | Degree in Civil Engg + 2 yrs exp</p>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                            <span className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">Vacancy 02 (9 Posts)</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5 mb-1">AEE (Electronics) – Min of Ports</h5>
                            <p className="text-[11px] text-slate-600 font-medium">Level 10 | Max 35 Yrs | Degree in Telecom/ECE/Electronics + 2 yrs exp</p>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                            <span className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">Vacancy 03 (1 Post)</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5 mb-1">Assistant Director (Engg) – Ports</h5>
                            <p className="text-[11px] text-slate-600 font-medium">Level 07 | Max 30 Yrs (UR) | BE/B.Tech (Civil/Mech) + 2 yrs exp</p>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                            <span className="bg-purple-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">Vacancy 04 (1 Post)</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5 mb-1">Hindi Superintendent – Law Min</h5>
                            <p className="text-[11px] text-slate-600 font-medium">Level 10 | Max 35 Yrs | LLM + 2 yrs exp OR LLB + 4 yrs exp + Hindi</p>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                            <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">Vacancy 05 (11 Posts)</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5 mb-1">Research Officer – NATMO</h5>
                            <p className="text-[11px] text-slate-600 font-medium">Level 10 | Max 35 Yrs | Master's (Geo/Geology/GIS) + 5 yrs exp</p>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                            <span className="bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">Vacancy 06 &amp; 07 (11 Posts)</span>
                            <h5 className="font-black text-slate-900 text-xs mt-1.5 mb-1">Ladakh Officers (Horticulture / Soil)</h5>
                            <p className="text-[11px] text-slate-600 font-medium">Level 08 | Max 40 Yrs (ST) | B.Sc Agri/Hort/Soil/B.Tech | Ladakh Domicile Only</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {id === 'iob-local-bank-officer-recruitment-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-600" /> State-wise Vacancies &amp; Mandatory Language Requirements
                          </h4>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">250 Total Posts</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Tamil Nadu</span>
                              <span className="bg-blue-100 text-blue-800 font-extrabold text-[10px] px-2 py-0.5 rounded">100 Posts</span>
                            </div>
                            <p className="text-xs font-black text-slate-800 mb-1">Language: Tamil</p>
                            <p className="text-[11px] text-slate-600 font-medium">UR 37 | OBC 33 | SC 15 | EWS 9 | ST 6</p>
                          </div>
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Karnataka</span>
                              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded">50 Posts</span>
                            </div>
                            <p className="text-xs font-black text-slate-800 mb-1">Language: Kannada</p>
                            <p className="text-[11px] text-slate-600 font-medium">UR 19 | OBC 16 | SC 8 | EWS 4 | ST 3</p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 border border-purple-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="bg-purple-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Maharashtra</span>
                              <span className="bg-purple-100 text-purple-800 font-extrabold text-[10px] px-2 py-0.5 rounded">50 Posts</span>
                            </div>
                            <p className="text-xs font-black text-slate-800 mb-1">Language: Marathi</p>
                            <p className="text-[11px] text-slate-600 font-medium">UR 19 | OBC 15 | SC 7 | EWS 5 | ST 4</p>
                          </div>
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="bg-amber-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Gujarat</span>
                              <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2 py-0.5 rounded">50 Posts</span>
                            </div>
                            <p className="text-xs font-black text-slate-800 mb-1">Language: Gujarati</p>
                            <p className="text-[11px] text-slate-600 font-medium">UR 19 | OBC 16 | SC 6 | EWS 4 | ST 5</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {id === 'aiims-norcet-11-nursing-officer-2026' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        {/* Card 1: B.Sc Nursing */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-1 rounded-lg uppercase">Category A</span>
                            <h4 className="font-black text-slate-900 text-xs sm:text-sm md:text-base">B.Sc. Nursing / Post-Basic B.Sc.</h4>
                          </div>
                          <ul className="space-y-2 text-xs font-semibold text-slate-700">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>Degree: B.Sc. (Hons.) / B.Sc. Nursing or Post-Basic B.Sc. Nursing from an INC recognized Institute/University.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>Council Registration: Registered as Nurse & Midwife with State / Indian Nursing Council.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-emerald-100/80 p-2 rounded-lg text-emerald-950 font-black border border-emerald-300">
                              <Check className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                              <span>Work Experience Required: ZERO YEARS (Freshers eligible!).</span>
                            </li>
                          </ul>
                        </div>

                        {/* Card 2: GNM Diploma */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-amber-600 text-white font-black text-[10px] px-2.5 py-1 rounded-lg uppercase">Category B</span>
                            <h4 className="font-black text-slate-900 text-xs sm:text-sm md:text-base">Diploma in GNM</h4>
                          </div>
                          <ul className="space-y-2 text-xs font-semibold text-slate-700">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>Diploma: General Nursing Midwifery (GNM) from INC recognized Board/Council.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>Council Registration: Registered as Nurse & Midwife with State / Indian Nursing Council.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-amber-100/90 p-2 rounded-lg text-amber-950 font-black border border-amber-300">
                              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                              <span>Experience: MANDATORY 2 Years in min. 50-Bedded Hospital AFTER qualification & registration!</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                    {id === 'isro-hsfc-scientist-engineer-sd-recruitment-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4 text-indigo-600" /> Post Code Wise Qualification & Scope Breakdown
                          </h4>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">6 Post Codes</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Post Code 01 */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Post Code 01</span>
                                <span className="bg-blue-100 text-blue-800 font-extrabold text-[10px] px-2 py-0.5 rounded">01 UR</span>
                              </div>
                              <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1.5">Bioinstrumentation / Biophysics / Medical Physics</h5>
                              <p className="text-[11px] text-slate-700 font-semibold mb-2">
                                <span className="font-black text-blue-900">Essential:</span> Ph.D. in Bioinstrumentation / Biophysics / Medical Physics.
                              </p>
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                <span className="font-bold text-slate-800">Pre-requisite:</span> ME/M.Tech/MS (Biomedical Instrumentation / Medical Imaging / Healthcare Informatics / Biomedical Engg) (min 60% / 6.5 CGPA) AND BE/B.Tech (min 65% / 6.84 CGPA).
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-blue-100/80 text-[10px] font-bold text-blue-700">
                              Scope: Wearable health sensors, bio-signal acquisition & portable diagnostics.
                            </div>
                          </div>

                          {/* Post Code 02 */}
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Post Code 02</span>
                                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded">01 UR</span>
                              </div>
                              <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1.5">Developmental Biology / Biotechnology</h5>
                              <p className="text-[11px] text-slate-700 font-semibold mb-2">
                                <span className="font-black text-emerald-900">Essential:</span> Ph.D. in Developmental Biology / Biotechnology.
                              </p>
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                <span className="font-bold text-slate-800">Pre-requisite:</span> ME/M.Tech/MS (Biotech / Bioscience / Biochemical Engg) (min 60% / 6.5 CGPA) + BE/B.Tech (65% / 6.84 CGPA) OR BS-MS dual degree (60% / 6.5 CGPA).
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-emerald-100/80 text-[10px] font-bold text-emerald-700">
                              Scope: Radiation biology, 3D organoids, astronaut disease biology & host-pathogen interactions.
                            </div>
                          </div>

                          {/* Post Code 03 */}
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="bg-amber-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Post Code 03</span>
                                <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2 py-0.5 rounded">01 UR</span>
                              </div>
                              <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1.5">Cellular & Molecular Biology / Cell Biology</h5>
                              <p className="text-[11px] text-slate-700 font-semibold mb-2">
                                <span className="font-black text-amber-900">Essential:</span> Ph.D. in Cellular & Molecular Biology / Cell Biology.
                              </p>
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                <span className="font-bold text-slate-800">Pre-requisite:</span> M.Sc (Microbiology / Mol Biology / Biochemistry / Genetics / Life Sci) (min 60% / 6.5 CGPA) + B.Sc (60% / 6.5 CGPA) OR BS-MS dual degree.
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-amber-100/80 text-[10px] font-bold text-amber-700">
                              Scope: Immune cellular adaptation, proteomic biomarkers, gene editing & confocal microscopy.
                            </div>
                          </div>

                          {/* Post Code 04 */}
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 border border-purple-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="bg-purple-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Post Code 04</span>
                                <span className="bg-purple-100 text-purple-800 font-extrabold text-[10px] px-2 py-0.5 rounded">01 UR</span>
                              </div>
                              <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1.5">Computational Biology / Systems Biology / Bioinformatics</h5>
                              <p className="text-[11px] text-slate-700 font-semibold mb-2">
                                <span className="font-black text-purple-900">Essential:</span> Ph.D. in Computational Biology / Systems Biology / Bioinformatics.
                              </p>
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                <span className="font-bold text-slate-800">Pre-requisite:</span> ME/M.Tech/MS (Biomedical / Computational Bio / Bioinformatics) (60% / 6.5 CGPA) + BE/B.Tech (65% / 6.84 CGPA) OR BS-MS dual degree.
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-purple-100/80 text-[10px] font-bold text-purple-700">
                              Scope: In-silico modeling, Digital Twin Biology, neural networks & closed-loop life support simulation.
                            </div>
                          </div>

                          {/* Post Code 05 */}
                          <div className="bg-gradient-to-br from-rose-50 to-pink-50/60 border border-rose-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Post Code 05</span>
                                <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded">01 UR</span>
                              </div>
                              <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1.5">Biomedical Engineering / Sciences (Biomechanics)</h5>
                              <p className="text-[11px] text-slate-700 font-semibold mb-2">
                                <span className="font-black text-rose-900">Essential:</span> Ph.D. in Biomedical Engg / Sciences with Biomechanics thesis.
                              </p>
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                <span className="font-bold text-slate-800">Pre-requisite:</span> ME/M.Tech/MS (Biomechanics / Biomechanical Engg / Biomedical Engg) (min 60% / 6.5 CGPA) AND BE/B.Tech (min 65% / 6.84 CGPA).
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-rose-100/80 text-[10px] font-bold text-rose-700">
                              Scope: Gait analysis, motion capture, force-plate studies & musculoskeletal analysis.
                            </div>
                          </div>

                          {/* Post Code 06 */}
                          <div className="bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="bg-sky-600 text-white font-black text-[10px] px-2 py-0.5 rounded">Post Code 06</span>
                                <span className="bg-sky-100 text-sky-800 font-extrabold text-[10px] px-2 py-0.5 rounded">01 UR</span>
                              </div>
                              <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1.5">Biomedical Engineering / Sciences (Bio-imaging & DSP)</h5>
                              <p className="text-[11px] text-slate-700 font-semibold mb-2">
                                <span className="font-black text-sky-900">Essential:</span> Ph.D. in Biomedical Engg / Sciences with Bio-imaging / DSP thesis.
                              </p>
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                <span className="font-bold text-slate-800">Pre-requisite:</span> ME/M.Tech/MS (Biomedical Engg / Medical Imaging / Signal Processing) (min 60% / 6.5 CGPA) AND BE/B.Tech (min 65% / 6.84 CGPA).
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-sky-100/80 text-[10px] font-bold text-sky-700">
                              Scope: Microgravity tissue bio-imaging (confidential), DSP algorithms & AI/ML integration.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-3">
                      {activeEducation.map((item, idx) => {
                        const isHeader = item.endsWith(':') || item.includes('Essential for');
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-start gap-2 sm:gap-3 ${isHeader ? 'pt-2.5 pb-0.5 font-black text-slate-800 text-xs sm:text-sm border-t border-slate-50 first:border-0' : 'pl-2 sm:pl-3'}`}
                          >
                            {!isHeader && <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0 mt-0.5" />}
                            <span className={isHeader ? 'text-slate-800 font-black' : 'font-medium text-slate-600 leading-relaxed text-xs sm:text-sm text-justify'}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Age Limit Block */}
                {hasAgeLimit && (
                  <div>
                    <h3 className="text-sm sm:text-lg font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 border-b border-slate-100 pb-2">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" /> Age Limit & Relaxation
                    </h3>
                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 mb-4 sm:mb-6">
                      <p className="font-extrabold text-blue-900 text-xs sm:text-sm mb-1 uppercase tracking-wider">Upper Age Limit</p>
                      <p className="font-black text-blue-950 text-xs sm:text-base md:text-lg leading-relaxed">
                        {job.eligibility.ageLimit}
                      </p>
                    </div>
                    
                    {activeAgeRelaxation.length > 0 && (
                      <>
                        <h4 className="text-xs sm:text-sm font-black text-slate-700 mb-2 sm:mb-3">Category-wise Age Relaxation Details</h4>
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="py-2.5 px-3 sm:py-3 sm:px-5 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">Reserved Category</th>
                                <th className="py-2.5 px-3 sm:py-3 sm:px-5 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200 text-right">Relaxation Limit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                              {activeAgeRelaxation.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3 sm:py-3 sm:px-5 font-bold text-slate-700">{item.category}</td>
                                  <td className="py-2 px-3 sm:py-3 sm:px-5 font-black text-emerald-600 text-right">{item.relaxation}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeMedical.length > 0 && (
                  <div>
                    <h3 className="text-sm sm:text-lg font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 border-b border-slate-100 pb-2">
                      <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" /> Medical & Fitness Standards
                    </h3>
                    <div className="bg-rose-50/40 border border-rose-100 rounded-lg sm:rounded-xl p-3.5 sm:p-5">
                      <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                        {activeMedical.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 sm:gap-3">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 shrink-0 mt-0.5" />
                            <span className="font-medium text-slate-700 leading-relaxed text-justify">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Salary */}
          {hasSalary && (
            <section 
              id="salary" 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
                flashedSection === 'salary' 
                  ? 'ring-4 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200'
              }`}
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="bg-emerald-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-emerald-600"><DollarSign className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Salary & Pay Scale
              </h2>
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                {!isNoData(job.salary?.payLevel) && (
                  <div className="flex-1 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-5 shadow-xs">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm text-emerald-600 shrink-0 border border-emerald-100">
                      <TrendingUp className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-0.5">Pay Matrix Level</p>
                      <p className="text-base sm:text-xl font-black text-slate-800">{job.salary?.payLevel}</p>
                    </div>
                  </div>
                )}
                {!isNoData(job.salary?.initialPay) && (
                  <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-5 shadow-xs">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm text-blue-600 shrink-0 border border-blue-100">
                      <DollarSign className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black text-blue-800 uppercase tracking-wider mb-0.5">Emoluments & Perquisites</p>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed text-justify">{job.salary?.initialPay}</p>
                    </div>
                  </div>
                )}
              </div>

              {id === 'aiims-norcet-11-nursing-officer-2026' && (
                <div className="mt-6 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                  <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> AIIMS Nursing Cadre Career Promotion Hierarchy
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                    {[
                      { title: 'Nursing Officer', level: 'Level 7', pay: '₹44,900' },
                      { title: 'Senior Nursing Officer', level: 'Level 8', pay: '₹47,600' },
                      { title: 'Assistant Nursing Supdt (ANS)', level: 'Level 10', pay: '₹56,100' },
                      { title: 'Deputy Nursing Supdt (DNS)', level: 'Level 11', pay: '₹67,700' },
                      { title: 'Nursing Superintendent', level: 'Level 12', pay: '₹78,800' },
                      { title: 'Chief Nursing Officer (CNO)', level: 'Level 13', pay: '₹1,23,100' },
                    ].map((pos, idx) => (
                      <div key={idx} className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold mb-1">{pos.level}</span>
                        <p className="font-bold text-white text-[11px] leading-tight mb-1">{pos.title}</p>
                        <span className="text-[9px] text-slate-400">{pos.pay}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Application Fee */}
          {hasFees && (
            <section 
              id="fees" 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
                flashedSection === 'fees' 
                  ? 'ring-4 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200'
              }`}
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="bg-orange-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-orange-600"><CreditCard className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Application Fee
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {activeFees.map((item, idx) => (
                  <div key={idx} className="bg-white border-2 border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-orange-200 transition-colors shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                    <div className="relative z-10">
                      <h3 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{item.category}</h3>
                      <p className="text-lg sm:text-2xl font-black text-slate-800 mb-3 sm:mb-4">{item.fee}</p>
                      {!isNoData(item.refund) && (
                        <div className="bg-orange-50 border border-orange-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-[10px] sm:text-xs font-bold text-orange-800 flex items-start gap-1.5 sm:gap-2">
                          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-orange-600" />
                          <span>{item.refund}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Selection Process */}
          {hasSelection && (
            <section 
              id="selection" 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
                flashedSection === 'selection' 
                  ? 'ring-4 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200'
              }`}
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-indigo-600"><Layers className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Selection Process
              </h2>
              <div className="space-y-4 sm:space-y-6 relative before:absolute before:inset-0 before:ml-4 sm:before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-indigo-200 before:to-transparent">
                {activeSelection.map((step, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-4 border-white bg-indigo-600 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-black text-xs sm:text-base">
                      {idx + 1}
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-2.5rem)] sm:w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white border border-slate-200 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm group-hover:border-indigo-300 group-hover:shadow-md transition-all">
                      <h3 className="font-black text-slate-800 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2">{step.stage}</h3>
                      <p className="text-slate-600 font-medium text-[11px] sm:text-xs md:text-sm leading-relaxed text-justify">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Exam Pattern */}
          {job.examPattern && (
            <section id="exam-pattern" className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4 border-b border-slate-100 pb-3 sm:pb-4">
                <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 sm:gap-3">
                  <div className="bg-cyan-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-cyan-600"><FileSignature className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                  Exam Pattern &amp; Selection Scheme
                </h2>
                {job.examPattern.duration && (
                  <div className="flex gap-2">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black flex items-center gap-1 sm:gap-1.5 border border-slate-200">
                      <Clock className="h-3.5 w-3.5 text-slate-400" /> {job.examPattern.duration}
                    </span>
                  </div>
                )}
              </div>

              {job.examPattern.negativeMarking && (
                <div className="bg-rose-50/50 border border-rose-100 text-rose-800 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-bold flex items-start gap-1.5 sm:gap-2 mb-4 sm:mb-6 text-justify">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{job.examPattern.negativeMarking}</span>
                </div>
              )}

              {/* Selection Mode, Screening & Final Selection Grid Cards */}
              {job.examPattern.mode && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block mb-1">Selection Mode</span>
                    <p className="text-xs sm:text-sm font-black text-slate-900">{job.examPattern.mode}</p>
                  </div>
                  {job.examPattern.screeningCriteria && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block mb-1">Screening Criteria</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">{job.examPattern.screeningCriteria}</p>
                    </div>
                  )}
                  {job.examPattern.finalSelection && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block mb-1">Final Merit Weightage</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">{job.examPattern.finalSelection}</p>
                    </div>
                  )}
                </div>
              )}

              {id === 'aiims-norcet-11-nursing-officer-2026' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  {/* Stage 1 Prelims */}
                  <div className="bg-gradient-to-br from-blue-50/80 to-slate-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3 border-b border-blue-100 pb-2.5">
                      <div>
                        <span className="bg-blue-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase">Stage 1</span>
                        <h4 className="font-black text-slate-800 text-xs sm:text-sm md:text-base mt-1">NORCET Prelims (Screening CBT)</h4>
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-blue-800 bg-blue-100 px-2.5 py-1 rounded-lg">12th Sept 2026</span>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-slate-700">
                      <li><strong>Duration:</strong> 90 Minutes (1.5 Hours)</li>
                      <li><strong>Questions:</strong> 100 MCQs (100 Marks)</li>
                      <li><strong>Breakup:</strong> 20 MCQs GK &amp; Aptitude + 80 MCQs Nursing</li>
                      <li><strong>Sectional Division:</strong> 5 Sections of 18 Mins (20 questions/sec)</li>
                      <li><strong>Negative Marking:</strong> 1/3rd (0.33) Mark per wrong answer</li>
                      <li className="bg-blue-100/70 p-2 rounded-lg text-blue-950 font-extrabold border border-blue-200">
                        Qualifying Nature: Shortlists candidates equal to 5 times total vacancies for Stage 2 Mains!
                      </li>
                    </ul>
                  </div>

                  {/* Stage 2 Mains */}
                  <div className="bg-gradient-to-br from-indigo-50/80 to-slate-50 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3 border-b border-indigo-100 pb-2.5">
                      <div>
                        <span className="bg-indigo-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase">Stage 2</span>
                        <h4 className="font-black text-slate-800 text-xs sm:text-sm md:text-base mt-1">NORCET Mains (Skills CBT)</h4>
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-lg">30th Sept 2026</span>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-slate-700">
                      <li><strong>Duration:</strong> 180 Minutes (3.0 Hours)</li>
                      <li><strong>Questions:</strong> 160 MCQs (160 Marks)</li>
                      <li><strong>Breakup:</strong> Clinical Case Scenarios &amp; Practical Nursing Skills</li>
                      <li><strong>Sectional Division:</strong> 4 Sections of 45 Mins (40 questions/sec)</li>
                      <li><strong>Negative Marking:</strong> 1/3rd (0.33) Mark per wrong answer</li>
                      <li className="bg-indigo-100/70 p-2 rounded-lg text-indigo-950 font-extrabold border border-indigo-200">
                        Final Merit basis: Marks obtained in Stage 2 Mains ONLY determine final selection &amp; institute allocation!
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {job.examPattern.sections && job.examPattern.sections.length > 0 && (
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-700 mb-2 sm:mb-3">
                    {job.examPattern.subHeader || 'Subject-wise Marks / Questions Distribution'}
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="py-2.5 px-3 sm:py-3 sm:px-5 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">
                            {job.examPattern.col1 || 'Subject / Section Name'}
                          </th>
                          <th className="py-2.5 px-3 sm:py-3 sm:px-5 text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200 text-right">
                            {job.examPattern.col2 || 'Questions / Marks'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold">
                        {(job.examPattern.sections || []).map((sec: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 sm:py-3 sm:px-5 text-slate-700 font-bold">
                              {typeof sec === 'string' ? sec : (sec?.name || `Section ${idx + 1}`)}
                            </td>
                            <td className="py-2 px-3 sm:py-3 sm:px-5 text-right font-black text-blue-700 text-xs sm:text-sm md:text-base">
                              {typeof sec?.questions === 'number' || /^\d+$/.test(String(sec?.questions)) 
                                ? `${sec.questions} Marks` 
                                : (sec?.questions || 'As per norms')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* NORCET Cutoff Promo 2 (Specific to NORCET 11) */}
          {id === 'aiims-norcet-11-nursing-officer-2026' && (
            <>
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl shadow-lg border-2 border-emerald-400/50 p-6 sm:p-8 relative overflow-hidden print:hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500 rounded-full blur-[50px] opacity-30 -ml-10 -mb-10 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Targeting NORCET 11?</h3>
                    <p className="text-emerald-100 font-medium text-sm sm:text-base max-w-xl">
                      See what percentile is safe for your category based on the last 3 exams. We analyzed NORCET 8, 9, and 10 cutoffs just for you.
                    </p>
                  </div>
                  <Link to="/aiims-norcet-11-nursing-officer-2026/cutoff" className="shrink-0 bg-white hover:bg-slate-50 text-emerald-900 font-black px-6 py-3.5 rounded-xl shadow-xl transition-all flex items-center gap-2 border border-slate-200 w-full sm:w-auto justify-center">
                    <Target className="h-5 w-5 text-emerald-700" /> Read Cutoff Guide
                  </Link>
                </div>
              </div>

              {/* In-Content Download Option 1 (Gated by Notification Subscription) */}
              <NorcetPdfDownloadWidget 
                variant="compact" 
                title="AIIMS NORCET Previous Years Solved Question Papers (PDF)"
                subtitle="Download 8+ Full Solved Question Papers with Answer Keys (AIIMS Raipur, Jodhpur, Bhopal, Delhi, NORCET 2020–2023)."
              />
            </>
          )}

          {/* Syllabus */}
          {hasSyllabus && (
            <section id="syllabus" className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 scroll-mt-24">
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="bg-cyan-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-cyan-600"><BookOpen className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Interview Evaluation Syllabus
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {(job.syllabus || []).map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-3.5 py-2.5 sm:px-5 sm:py-4 border-b border-slate-200">
                      <h4 className="font-black text-slate-800 text-xs sm:text-sm md:text-base">{item.section}</h4>
                    </div>
                    <div className="p-3.5 sm:p-5 bg-white">
                      <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                        {item.topics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-1.5 sm:gap-2">
                            <ChevronRight className="h-3.5 w-3.5 text-cyan-600 mt-0.5 shrink-0" />
                            <span className="text-slate-600 font-medium leading-relaxed">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reservation Block */}
          <section id="reservation" className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 scroll-mt-24">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="bg-violet-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-violet-600"><Users className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              {job.reservation?.title || "Reservation & Category Details"}
            </h2>
            {job.reservation && job.reservation.detailsList && job.reservation.detailsList.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-lg sm:rounded-xl p-3.5 sm:p-5">
                  <ul className="space-y-2.5 sm:space-y-3">
                    {job.reservation.detailsList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-justify">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg sm:rounded-xl p-3.5 sm:p-5">
                    <h4 className="font-black text-indigo-900 text-xs sm:text-sm mb-1.5 sm:mb-2 uppercase tracking-wide">Backlog Vacancies</h4>
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-700 leading-relaxed font-semibold">
                      The total reserved vacancies listed in the table include backlog vacancies of <span className="font-black text-indigo-800">11 posts for SC</span>, <span className="font-black text-indigo-800">6 posts for ST</span>, and <span className="font-black text-indigo-800">23 posts for OBC</span> categories.
                    </p>
                  </div>
                  <div className="bg-purple-50/50 border border-purple-100 rounded-lg sm:rounded-xl p-3.5 sm:p-5">
                    <h4 className="font-black text-purple-900 text-xs sm:text-sm mb-1.5 sm:mb-2 uppercase tracking-wide">PwBD Horizontal Reservation</h4>
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-700 leading-relaxed font-semibold">
                      A total of <span className="font-black text-purple-800">08 posts</span> are reserved horizontally for Persons with Benchmark Disabilities (PwBD) against the current vacancies: Category (a)-2, Category (b)-2, Category (c)-2, and Categories (d & e)-2.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-[11px] sm:text-xs font-semibold text-slate-600 text-justify">
                  <Info className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-400 inline-block mr-1.5 align-middle" />
                  <span>Community reservation benefit is admissible only if the respective caste is included in the Central Government List of reserved communities.</span>
                </div>
              </>
            )}
          </section>

          {/* Exam Centres */}
          <section id="exam-centres" className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 scroll-mt-24">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="bg-rose-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-rose-600"><MapPin className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              {job.examCentres?.title || "Interview & Selection Venue"}
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-5 items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-base sm:text-lg shrink-0 border border-rose-200">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-black text-slate-800 text-xs sm:text-sm md:text-base mb-1">
                  {job.examCentres ? "Allotted Examination Locations" : `Interview Venue Decided by ${boardInitials}`}
                </h4>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 leading-relaxed font-semibold text-justify">
                  {job.examCentres ? job.examCentres.details : `"The interview for the above posts will be held at a suitable place(s), as decided by ${job.board}." Candidates will be informed about the specific interview call and location directly by ${boardInitials}.`}
                </p>
              </div>
            </div>
          </section>

          {/* How to Apply */}
          <section id="how-to-apply" className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 scroll-mt-24">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-blue-600"><Send className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              How to Apply {(job.applicationMode || '').toLowerCase().includes('online') ? 'Online' : 'Offline'}
            </h2>
            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 mb-6 sm:mb-8">
              <ol className="space-y-3 sm:space-y-4">
                {activeHowToApply.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 sm:gap-4 text-justify">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center shrink-0 border border-blue-200 text-[10px] sm:text-xs">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 font-medium pt-0.5 text-xs sm:text-sm leading-relaxed">
                      {step.replace(/^Step \d+: /, '')}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            
                        {id === 'isro-hsfc-scientist-engineer-sd-recruitment-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-blue-400 mb-3 flex items-center gap-2">
                  <UploadCloud className="h-4.5 w-4.5 text-blue-400" /> Document & Image Upload Specifications (Advt No. HSFC:01:RMT:2026)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-blue-300 mb-1">1. Color Photograph</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Recent color passport photo (&lt; 6 months). Plain white background, full front view. Max size: <strong>1 MB</strong> (500 px height × 400 px width, .jpg/.jpeg). No selfies or B&amp;W photos.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-blue-300 mb-1">2. Signature Image</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Clear legible signature in black/blue ink on white paper. Max size: <strong>1 MB</strong> (200 px height × 700 px width, .jpg/.jpeg format).
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-blue-300 mb-1">3. PDF Certificates</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Ph.D. thesis/degree, Master's &amp; Bachelor's marksheets, DOB proof, PwBD/NOC/Discharge certificates in <strong>.pdf</strong> format (max <strong>1 MB</strong> per document).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {id === 'aiims-norcet-11-nursing-officer-2026' && (
              <div className="my-6 bg-blue-50/60 border border-blue-200 rounded-2xl p-4 sm:p-5">
                <h4 className="text-xs sm:text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                  <UploadCloud className="h-4.5 w-4.5 text-blue-600" /> Image Upload Guidelines & Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-blue-900 mb-1">1. Color Photograph</h5>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Recent photo with white background. Front view showing full face, both ears clearly. Size: 50–100 KB (JPG/JPEG).
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-blue-900 mb-1">2. Running Signature</h5>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Signed with black ink on white paper in running hand. No capital letter initials. Size: 20–50 KB (JPG/JPEG).
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-blue-900 mb-1">3. Left Thumb Print</h5>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Left thumb impression in blue/black ink on white paper without smudging. Size: 20–50 KB (JPG/JPEG).
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-sm sm:text-lg font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                              {id === 'iob-local-bank-officer-recruitment-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-blue-400 mb-3 flex items-center gap-2">
                  <UploadCloud className="h-4.5 w-4.5 text-blue-400" /> Image &amp; Document Scanning Specifications (Advt No. HRDD/RECT/02/2026-27)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl">
                    <h5 className="font-black text-xs text-blue-300 mb-1">1. Passport Photograph</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      20–50 KB (.jpg/.jpeg format, 200×230 px). Light/white background. Webcam live photo capture also required.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl">
                    <h5 className="font-black text-xs text-blue-300 mb-1">2. Running Signature</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      10–20 KB (.jpg/.jpeg format, 140×60 px). Signed in <strong>black ink</strong> on white paper. No capital letters.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl">
                    <h5 className="font-black text-xs text-blue-300 mb-1">3. Left Thumb Impression</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      20–50 KB (.jpg/.jpeg format, 240×240 px, 3cm×3cm). Clear impression in blue/black ink without smudging.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl">
                    <h5 className="font-black text-xs text-blue-300 mb-1">4. Handwritten Declaration</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      50–100 KB (.jpg/.jpeg, 800×400 px, 10cm×5cm). Written in candidate's handwriting in English with black ink.
                    </p>
                  </div>
                </div>
              </div>
            )}

                            {id === 'upsc-recruitment-advt-10-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-amber-400 mb-3 flex items-center gap-2">
                  <UploadCloud className="h-4.5 w-4.5 text-amber-400" /> UPSC ORA Portal Upload &amp; Verification Rules (Advt 10/2026)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-amber-300 mb-1">1. Live Photo &amp; Passport Image</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Upload passport photo with clear face + <strong>mandatory live photo capture</strong> via webcam or mobile QR code.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-amber-300 mb-1">2. Signature (Signed 3 Times)</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Sign <strong>three times (one below another)</strong> in black ink on white paper. No capital letter initials.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-amber-300 mb-1">3. PDF Claim Certificates</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      DOB proof (10th), degree marksheets, experience certificates (prescribed format), caste/EWS/PwBD certificates in <strong>.pdf</strong> format.
                    </p>
                  </div>
                </div>
              </div>
            )}

                            {id === 'kea-karnataka-esi-pharmacist-nursing-officer-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-emerald-400 mb-3 flex items-center gap-2">
                  <FileSignature className="h-4.5 w-4.5 text-emerald-400" /> KEA Examination Pattern &amp; Kannada Language Test Rules
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-emerald-300 mb-1">1. Compulsory Kannada Test</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      150 Marks test (2 Hours). Minimum <strong>50 Marks required to pass</strong>. (Exempted if studied Kannada in SSLC/10th).
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-emerald-300 mb-1">2. Competitive Written Exam</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      <strong>Paper 1 (GK 100 Qs / 100 Marks)</strong> + <strong>Paper 2 (Domain 100 Qs / 100 Marks)</strong>. Total 200 Marks. Minimum 35% to qualify.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-emerald-300 mb-1">3. Negative Marking</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      <strong>0.25 Marks (1/4th)</strong> deducted for each incorrect answer in Competitive Written Exam (Paper 1 &amp; 2).
                    </p>
                  </div>
                </div>
              </div>
            )}

                            {id === 'hp-high-court-district-judiciary-recruitment-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-sky-400 mb-3 flex items-center gap-2">
                  <FileSignature className="h-4.5 w-4.5 text-sky-400" /> HP High Court Selection Rules &amp; Typing Font Guidelines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-sky-300 mb-1">1. Hindi Typing Font Rule</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Hindi typing test for Clerk and Steno will be conducted strictly on computer using <strong>Kruti Dev-10 font</strong> at 25 WPM speed.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-sky-300 mb-1">2. Peon 10+2 Merit Weightage</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Shortlisting for Peon/Chowkidar in 1:3 ratio based on <strong>10+2 marks percentage (85%)</strong> + <strong>Document Evaluation (15 Marks)</strong>.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-sky-300 mb-1">3. Bonafide Himachali Rule</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Condition of passing 10th/12th from HP school applies for Non-Bonafides. <strong>Bonafide Himachalis are 100% exempt</strong> from this condition.
                    </p>
                  </div>
                </div>
              </div>
            )}

                            {id === 'cgssb-chhattisgarh-teacher-recruitment-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-orange-400 mb-3 flex items-center gap-2">
                  <FileSignature className="h-4.5 w-4.5 text-orange-400" /> CGSSB LST26 Exam Pattern &amp; Photo Guidelines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-orange-300 mb-1">1. Exam Pattern &amp; Duration</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      100 Multiple Choice Questions (100 Marks). Total Exam Duration: <strong>2 Hours 15 Minutes (135 Mins)</strong>.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-orange-300 mb-1">2. Negative Marking Rule</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      <strong>0.25 Marks (1/4th)</strong> deducted for each incorrect answer in OMR answer sheet.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-orange-300 mb-1">3. Photo Upload Specs</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Recent photograph on <strong>light background (50-100 KB)</strong> + Signature (50-100 KB) in JPG/JPEG format.
                    </p>
                  </div>
                </div>
              </div>
            )}

                <UploadCloud className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" /> Documents Required Checklist
                </h3>
                <ul className="space-y-2.5 sm:space-y-3">
                  {(job.documentsRequired || [
                    'Educational Certificates & Marksheets (Matriculation / Graduation / Post Graduation / Diploma)',
                    'Identity Proof (Aadhaar Card / PAN Card / Voter ID / Passport)',
                    'Category / Caste Certificate (OBC / SC / ST / EWS) if applicable',
                    'Disability Certificate (PwBD) / Ex-Servicemen Discharge Book if applicable',
                    'Recent Passport Size Photograph & Signature Scan',
                    'Work Experience Certificates (if applicable)'
                  ]).map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-justify">
                      <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-600 leading-relaxed">{doc}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleDownloadDvChecklist}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-xl text-xs font-black transition-colors"
                >
                  <Download className="h-4 w-4 text-blue-600" /> Download DV Checklist (.txt)
                </button>
              </div>
              
              <div>
                <h3 className="text-sm sm:text-lg font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500" /> Important Instructions
                </h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {(job.importantInstructions || [
                    'Ensure all details entered in the application form are correct before final submission.',
                    'Applications submitted after the last date or through unauthorized modes will not be accepted.',
                    'Candidates must maintain a valid email ID and mobile number throughout the recruitment process.'
                  ]).map((inst, idx) => {
                    const isBanned = inst.includes('liable to be rejected') || inst.includes('NOT') || inst.includes('Wrong');
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs md:text-sm font-bold leading-relaxed text-justify ${
                          isBanned ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-amber-50/50 border-amber-100 text-amber-800'
                        }`}
                      >
                        {inst}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Participating AIIMS Grid */}
          {id === 'aiims-norcet-11-nursing-officer-2026' && (
            <>
              <section id="participating-institutes" className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 scroll-mt-24">
                <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mb-4 flex items-center gap-2 sm:gap-3">
                  <div className="bg-teal-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-teal-600"><Building2 className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                  19 Participating AIIMS & Allied Medical Institutes
                </h2>
                <p className="text-xs text-slate-600 mb-4 font-medium">
                  Vacancies will be filled across AIIMS institutes across India, CAPFIMS Maidangarhi, ESIC Hospitals, and other central government medical institutions:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs font-bold text-slate-700">
                  {[
                    'AIIMS Avantipora', 'AIIMS Bathinda', 'AIIMS Bhopal', 'AIIMS Bilaspur',
                    'AIIMS Bhubaneswar', 'AIIMS Deoghar', 'AIIMS Gorakhpur', 'AIIMS Guwahati',
                    'AIIMS Kalyani', 'AIIMS Mangalagiri', 'AIIMS Nagpur', 'AIIMS Rae Bareli',
                    'AIIMS New Delhi', 'AIIMS Patna', 'AIIMS Rishikesh', 'AIIMS Raipur',
                    'AIIMS Vijaypur Jammu', 'AIIMS Rewari', 'CAPFIMS Maidangarhi', 'ESIC Hospitals'
                  ].map((inst, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2 hover:border-blue-400 hover:shadow-xs transition-all">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                      <span className="truncate">{inst}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* In-Content Download Option 2 (Before FAQs section) */}
              <NorcetPdfDownloadWidget 
                variant="compact" 
                title="AIIMS NORCET Question Bank & Solved Papers"
                subtitle="Unlock instant PDF download of AIIMS Nursing Officer past papers with official answer keys."
              />
            </>
          )}

          {/* FAQs */}
          <section id="faqs" className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 sm:gap-3">
                <div className="bg-fuchsia-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-fuchsia-600"><HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                Frequently Asked Questions ({job.faqs?.length || 0} FAQs)
              </h2>

              {job.faqs && job.faqs.length > 5 && (
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:ring-2 focus:ring-fuchsia-100 focus:border-fuchsia-400 outline-none transition-all"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {(job.faqs || []).filter(f => 
                !faqSearch || 
                f.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
                f.answer.toLowerCase().includes(faqSearch.toLowerCase())
              ).map((faq, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 sm:p-5 rounded-lg sm:rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <h3 className="font-black text-slate-800 mb-2 flex items-start gap-2 text-xs sm:text-sm md:text-base text-justify">
                    <span className="text-fuchsia-600 bg-fuchsia-100 px-1.5 py-0.5 rounded text-[10px] sm:text-xs mt-0.5 shrink-0">Q</span> 
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 font-semibold leading-relaxed pl-5 sm:pl-7 text-[11px] sm:text-xs md:text-sm text-justify whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>



        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 print:hidden">
          
          {/* NORCET Previous Papers PDF Sidebar Banner */}
          {id === 'aiims-norcet-11-nursing-officer-2026' && (
            <NorcetPdfDownloadWidget variant="sidebar" />
          )}

          {/* Action Buttons Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-20 space-y-4">
            
            {/* Top of Sidebar - Download as PDF Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-4 border border-indigo-700/60 shadow-md space-y-3 relative overflow-hidden group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600/90 text-white rounded-xl shadow-xs border border-indigo-400/30 shrink-0">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Official Recruitment Doc</span>
                  <h4 className="text-xs font-black text-white">Full Vacancy PDF Guide</h4>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-snug">
                Save complete job notification, eligibility, syllabus, fees & timeline as a clean PDF document.
              </p>
              <button
                onClick={startPdfDownload}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-indigo-400/30"
              >
                <Download className="h-4 w-4" /> Download as PDF
              </button>
            </div>

            {/* Quick Action Row */}
            <div className="grid grid-cols-5 gap-2 border-b border-slate-100 pb-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Back to Top"
                className="flex items-center justify-center p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 rounded-xl transition-all shadow-3xs cursor-pointer"
              >
                <ArrowUp className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={handleShare}
                title="Share Page"
                className="flex items-center justify-center p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 rounded-xl transition-all shadow-3xs cursor-pointer"
              >
                <Share2 className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={toggleBookmark}
                title="Bookmark Page"
                className={`flex items-center justify-center p-2.5 border rounded-xl transition-all shadow-3xs cursor-pointer ${
                  bookmarkSaved 
                    ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100' 
                    : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600'
                }`}
              >
                {bookmarkSaved ? <Bookmark className="h-4.5 w-4.5 fill-rose-500" /> : <Bookmark className="h-4.5 w-4.5" />}
              </button>
              <button 
                onClick={handlePrint}
                title="Print Page"
                className="flex items-center justify-center p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 rounded-xl transition-all shadow-3xs cursor-pointer"
              >
                <Printer className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={copyPageLink}
                title="Copy Link"
                className={`flex items-center justify-center p-2.5 border rounded-xl transition-all shadow-3xs cursor-pointer ${
                  linkCopied 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600' 
                    : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600'
                }`}
              >
                {linkCopied ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
              </button>
            </div>

            {/* Important Links */}
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <LinkIcon className="h-4.5 w-4.5 text-blue-600" /> Official Links
            </h3>
            <div className="flex flex-col gap-2">
              {(job.officialLinks || job.urls || []).map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 transition-all rounded-xl p-3 flex items-center justify-between group font-bold text-xs shadow-3xs"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0" /> {link.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
              
              {id === 'aiims-norcet-11-nursing-officer-2026' && (
                <Link 
                  to="/aiims-norcet-11-nursing-officer-2026/cutoff"
                  className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 transition-all rounded-xl p-3 flex items-center justify-between group font-bold text-xs shadow-3xs"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 shrink-0" /> Previous Cutoff Analysis
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
            
            <hr className="my-2 border-slate-100" />
            
            {/* Sidebar Table of Contents */}
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <ListChecks className="h-4.5 w-4.5 text-slate-500" /> Navigation Index
            </h3>
            <nav className="flex flex-col gap-1 max-h-72 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors w-full text-left cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <hr className="my-2 border-slate-100" />

            {/* Share Widget for Link-Building */}
            <div className="pt-2">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3">
                <Share2 className="h-4.5 w-4.5 text-emerald-600" /> Share with Friends
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {(() => {
                  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://newvacancyalert.in/${id || ''}`;
                  return (
                    <>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${job.title} - ${job.board}*\n\nRead full vacancy details, eligibility, syllabus, and apply online here:\n${currentUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors shadow-3xs cursor-pointer border border-emerald-100 hover:border-emerald-200"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-black mt-1">WhatsApp</span>
                      </a>
                      <a
                        href={`https://telegram.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`*${job.title} - ${job.board}*\n\nRead full vacancy details, eligibility, syllabus, and apply online here:`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors shadow-3xs cursor-pointer border border-sky-100 hover:border-sky-200"
                        title="Share on Telegram"
                      >
                        <Send className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-black mt-1">Telegram</span>
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 transition-colors shadow-3xs cursor-pointer border border-blue-100 hover:border-blue-200"
                        title="Share on Facebook"
                      >
                        <Facebook className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-black mt-1">Facebook</span>
                      </a>
                    </>
                  );
                })()}
                <button
                  onClick={copyPageLink}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors shadow-3xs cursor-pointer border ${
                    linkCopied
                      ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-100 hover:border-slate-200'
                  }`}
                  title="Copy Page Link"
                >
                  {linkCopied ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <Copy className="h-4.5 w-4.5" />}
                  <span className="text-[9px] font-black mt-1">{linkCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Official NewVacancyAlert Social Media Channels */}
          <div className="bg-gradient-to-br from-blue-50/80 via-slate-50 to-pink-50/80 rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Official Social Handles</h4>
                <p className="text-[10px] font-bold text-slate-500">Get daily government job alerts directly on social media</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <a 
                href="https://www.facebook.com/profile.php?id=61592714690988" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs border border-slate-200 hover:border-blue-300 transition shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                    <Facebook className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-xs">Facebook Page</p>
                    <p className="text-[10px] text-slate-500 font-medium">@NewVacancyAlert</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>

              <a 
                href="https://www.instagram.com/newvacancyalert.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-pink-50 text-pink-700 font-bold text-xs border border-slate-200 hover:border-pink-300 transition shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shrink-0">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-xs">Instagram Profile</p>
                    <p className="text-[10px] text-slate-500 font-medium">@newvacancyalert.in</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>
            </div>
          </div>

          {/* Content Writer & Researcher Author Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Content Written & Verified By</h4>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-lg border-2 border-blue-200">
                AM
              </div>
              <div>
                <p className="font-black text-slate-800 text-sm">Anand Kumar Mehta</p>
                <p className="text-[10px] font-bold text-slate-400">Pharmacist | Recruitment Researcher | Government Jobs Content Writer</p>
              </div>
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-600 leading-relaxed text-justify">
              <p>"Anand Kumar Mehta is a pharmacist and government recruitment researcher who regularly publishes detailed vacancy notifications, eligibility guides, exam updates, and recruitment analysis on NewVacancyAlert.in."</p>
            </div>
            <a 
              href="https://www.instagram.com/pharmacistanand" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group pt-2 border-t border-slate-100"
            >
              Follow on Instagram @pharmacistanand <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Related & Trending Vacancies (SEO Internal Linking Mesh) */}
          {relatedJobs.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs print:hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-600" /> Related &amp; Trending Government Vacancies 2026
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Explore more recruitment drives, syllabus guides, and application deadlines</p>
                </div>
                <Link to="/" className="text-xs font-bold text-blue-600 hover:underline hidden sm:inline-flex items-center gap-1">
                  View All Jobs <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedJobs.map((rj) => (
                  <Link
                    key={rj.id}
                    to={`/${rj.id}`}
                    className="bg-slate-50/70 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 rounded-xl p-3.5 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded truncate max-w-[170px]">
                          {rj.board || 'Govt Job'}
                        </span>
                        {rj.vacancies && Number(rj.vacancies) > 0 ? (
                          <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                            {rj.vacancies} Posts
                          </span>
                        ) : null}
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 leading-snug">
                        {rj.title}
                      </h4>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>{rj.jobLocation || 'India'}</span>
                      <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Details &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>



      {/* Comments & Discussion */}
      <div className="max-w-6xl mx-auto px-4 mt-8 print:hidden">
        <CommentsSection 
          pageId={`job-${id || 'detail'}`} 
          pageTitle={job.title || 'Government Job Notification'}
          isOpen={isCommentsOpen}
          onOpenChange={setIsCommentsOpen}
          onCountChange={setCommentCount}
          hideFloatingButton={true}
        />
      </div>

      {/* Priority OneSignal Subscription Settings (Bottom of Sub-page, visible only when subscribed, spanning full layout width) */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pb-12 print:hidden">
        <SubscribeWidget mode="bottom" />
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.15)] z-40 px-2.5 py-2 flex items-center justify-between gap-2 safe-area-bottom print:hidden">
        {/* Prominent Download Button on Left */}
        <button
          onClick={startPdfDownload}
          className="flex items-center justify-center gap-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-black px-2 py-1.5 rounded-lg shadow-sm shadow-indigo-200/80 border border-indigo-400/30 cursor-pointer shrink-0 active:scale-95 transition-all"
        >
          <Download className="h-3.5 w-3.5 shrink-0 text-white" />
          <span className="text-[10px] font-black leading-tight whitespace-nowrap">PDF Download</span>
        </button>

        {/* Navigation Items */}
        <div className="flex items-center justify-around flex-1 gap-1">
          {/* Share Button (Replaces Overview & Dates) */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center py-0.5 px-1.5 rounded-lg cursor-pointer transition-colors text-slate-600 hover:text-purple-600 font-semibold"
          >
            <Share2 className="h-4 w-4 text-purple-600" />
            <span className="text-[9px]">Share</span>
          </button>

          {/* Comments Button (Highlighted with comment count if present) */}
          <button
            onClick={() => setIsCommentsOpen(true)}
            className={`flex flex-col items-center justify-center py-0.5 px-1.5 rounded-lg cursor-pointer transition-colors ${
              commentCount > 0 ? 'text-blue-600 font-black' : 'text-slate-600 font-semibold hover:text-blue-600'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <MessageSquare className={`h-4 w-4 ${commentCount > 0 ? 'text-blue-600 fill-blue-100' : 'text-slate-600'}`} />
              {commentCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full min-w-[14px] text-center shadow-xs">
                  {commentCount}
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">Comments</span>
          </button>

          {/* More Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center justify-center py-0.5 px-1.5 rounded-lg cursor-pointer transition-colors ${isMobileMenuOpen ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-semibold'}`}
          >
            <div className="relative">
              <ListChecks className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </div>
            <span className="text-[9px]">More</span>
          </button>
        </div>
      </div>

      {/* Mobile Expandable Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs print:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute bottom-16 left-4 right-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-black text-slate-800 mb-3 px-2 text-xs uppercase tracking-wider text-slate-400">All Page Sections</h3>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold leading-tight truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
              <button 
                onClick={handleShare}
                className="bg-slate-50 border border-slate-200 py-2 rounded-xl text-[10px] font-bold text-slate-600 flex flex-col items-center gap-1 cursor-pointer"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button 
                onClick={toggleBookmark}
                className={`py-2 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 cursor-pointer border ${
                  bookmarkSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Bookmark className="h-4 w-4" /> {bookmarkSaved ? 'Saved' : 'Bookmark'}
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  startPdfDownload();
                }}
                className="bg-indigo-50 border border-indigo-200 py-2 rounded-xl text-[10px] font-bold text-indigo-700 flex flex-col items-center gap-1 cursor-pointer"
              >
                <Download className="h-4 w-4 text-indigo-600" /> PDF Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Translucent Floating Dock (Mac-style) + Separate Floating Comments Button for Large Screens */}
      {showDock && (
        <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 items-center gap-3.5 z-50 print:hidden">
          {/* Main Floating Dock */}
          <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200 dark:border-slate-800/80 px-4 py-2.5 rounded-2xl flex items-center gap-3.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition-all duration-300">
            {/* Back to Home Button */}
            <Link 
              to="/" 
              title="Back to Home Dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 border border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-blue-800 text-blue-600 dark:text-blue-400 transition-all cursor-pointer shadow-3xs"
            >
              <Home className="h-5 w-5" />
            </Link>

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

            {/* Search Input Box */}
            <div className="relative flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-1 py-1 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/40 focus-within:border-blue-400 transition-all w-48 lg:w-64">
              <input 
                type="text" 
                placeholder="Search section..." 
                value={dockQuery}
                onChange={(e) => setDockQuery(e.g.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDockSearch(dockQuery);
                  }
                }}
                className="bg-transparent border-none outline-none text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 w-full"
              />
              {dockQuery && (
                <button 
                  onClick={() => {
                    setDockQuery('');
                    setFlashedSection(null);
                  }}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer mx-1 shrink-0"
                >
                  Clear
                </button>
              )}
              {/* Search Icon/Button inside the input container */}
              <button
                onClick={() => handleDockSearch(dockQuery)}
                title="Search section"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 transition-all cursor-pointer shrink-0 ml-1"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Suggested Sections Dropdown */}
              {suggestedDockSections.length > 0 && (
                <div className="absolute bottom-full mb-3 left-0 w-72 md:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.18)] z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-3 pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Suggested Sections</span>
                    <span className="text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                      {suggestedDockSections.length} found
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/40 px-1">
                    {suggestedDockSections.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => {
                          scrollToSection(sec.id, true);
                          setFlashedSection(sec.id);
                          setTimeout(() => setFlashedSection(null), 2500);
                          setDockQuery(''); // clear query so overlay closes
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex flex-col gap-0.5 cursor-pointer"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600">{sec.title}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1">{sec.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

            {/* Back to Top Button */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Back to Top"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-900/30 border border-slate-200 hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-800 text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer shadow-3xs"
            >
              <ArrowUp className="h-5 w-5" />
            </button>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              title="Share Recruitment Vacancy"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-purple-900/30 border border-slate-200 hover:border-purple-300 dark:border-slate-700 dark:hover:border-purple-800 text-purple-600 dark:text-purple-400 transition-all cursor-pointer shadow-3xs"
            >
              <Share2 className="h-5 w-5" />
            </button>

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

            {/* Download as PDF Button in Floating Dock */}
            <button
              onClick={startPdfDownload}
              title="Download Information as PDF"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md hover:shadow-indigo-500/25 active:scale-95 border border-indigo-400/30 shrink-0"
            >
              <Download className="h-4 w-4 text-white" />
              <span>Download as PDF</span>
            </button>
          </div>

          {/* Separate Floating Comments Button along right side of Floating Dock */}
          <button
            onClick={() => setIsCommentsOpen(true)}
            title="Open Discussion & Comments"
            className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 px-4 py-2.5 h-[54px] rounded-2xl flex items-center gap-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-extrabold text-xs transition-all cursor-pointer shrink-0 active:scale-95 group"
          >
            <div className="relative flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <span>Comments</span>
            {commentCount > 0 && (
              <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                {commentCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* PDF Download Confirmation Modal */}
      {showPdfModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs print:hidden animate-in fade-in duration-200"
          onClick={() => setShowPdfModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0 shadow-xs">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Save Page as PDF</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Download Recruitment Details</h3>
              </div>
            </div>

            {isGeneratingPdf ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-indigo-700 font-bold text-sm w-full">
                <div className="relative flex items-center justify-center">
                  <span className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></span>
                  <span className="absolute text-[10px] font-black text-indigo-700">{pdfProgress}%</span>
                </div>
                <div className="flex flex-col items-center gap-1 w-full px-8">
                  <span>Generating High-Quality PDF...</span>
                  <div className="w-full bg-indigo-100 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `${pdfProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-indigo-500 font-normal mt-1">Please wait, compiling document...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs font-semibold text-slate-700 leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900 text-sm">
                    Do you want to download information on this page as PDF?
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    This will save all official recruitment details, key dates, eligibility standards, vacancy distribution, exam pattern, syllabus, and FAQs as a clean PDF document.
                  </p>
                  <p className="text-amber-600 bg-amber-50 px-2.5 py-2 rounded-lg text-[10px] leading-tight hidden">
                    <span className="font-bold block mb-0.5">Note:</span>
                    If the download does not start, the preview environment might be blocking it. 
                    Please open the app in a new tab (using the button at the top right), or press <kbd className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800">Ctrl + P</kbd> / <kbd className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800">Cmd + P</kbd> manually.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowPdfModal(false)}
                    className="w-full sm:w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDownloadPdf}
                    className="w-full sm:w-2/3 py-2.5 px-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-black text-xs rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer text-center active:scale-95"
                  >
                    <Download className="h-4 w-4" /> Open PDF in New Tab
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
