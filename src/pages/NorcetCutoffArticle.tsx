import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { 
  ArrowLeft, Calendar, FileText, Briefcase, Award, TrendingUp,
  HelpCircle, ShieldCheck, CheckCircle2, ChevronRight, BarChart3,
  Activity, Users, Target, BookOpen, Layers, Clock, AlertCircle, Bookmark, Download, ExternalLink, ShieldAlert, Info,
  ListChecks, Copy, Check, Printer
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import SubscribeWidget from '../components/SubscribeWidget';
import CommentsSection from '../components/CommentsSection';
import NorcetPdfDownloadWidget from '../components/NorcetPdfDownloadWidget';
import MarketingPartnerBanner from '../components/MarketingPartnerBanner';
import { useAuth } from '../context/AuthContext';

export default function NorcetCutoffArticle() {
  const { requireAuthForDownloadAction } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

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
      "Please sign in with your Google Account to download AIIMS NORCET Cutoff Marks & Analysis as a PDF."
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
          event_category: 'Cutoff Article',
          event_label: 'NORCET Cutoff Guide',
          file_name: 'NORCET-Cutoff-Details.pdf',
          file_extension: 'pdf'
        });
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'pdf_download',
          job_id: 'aiims-norcet-11-nursing-officer-2026'
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
      const filter = (node: HTMLElement) => {
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const navItems = [
    { id: 'what-is', label: 'Overview', icon: HelpCircle },
    { id: 'stage-1', label: 'Stage I', icon: TrendingUp },
    { id: 'stage-2', label: 'Stage II', icon: CheckCircle2 },
    { id: 'pwbd', label: 'PwBD', icon: Users },
    { id: 'vacancies', label: 'Vacancies', icon: Briefcase },
    { id: 'expected', label: 'Expected', icon: Target }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? `${totalScroll / windowHeight}` : '0';
      setScrollProgress(Number(scroll) * 100);

      const sections = ['what-is', 'stage-1', 'stage-2', 'pwbd', 'vacancies', 'observations', 'expected', 'factors', 'strategy', 'faqs'];
      let current = '';
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const offset = 100;

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
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const stage1Data = [
    { name: 'NORCET 8', UR: 93.5335077, EWS: 78.2853953, OBC: 83.1213092, SC: 80.1392602, ST: 73.6786438 },
    { name: 'NORCET 9', UR: 90.7161868, EWS: 65.6169852, OBC: 75.9545125, SC: 73.4418098, ST: 66.3210743 },
    { name: 'NORCET 10', UR: 93.5887683, EWS: 78.9831134, OBC: 84.2077239, SC: 81.9605328, ST: 74.4746050 }
  ];

  const vacancyData = [
    { name: 'NORCET 8', count: 1794 },
    { name: 'NORCET 9', count: 3500 },
    { name: 'NORCET 10', count: 2551 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg text-xs">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex justify-between gap-4 font-semibold" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span>{entry.value.toFixed(4)}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomTooltipBar = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg text-xs">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          <p className="text-blue-600 font-bold">{payload[0].value} Vacancies</p>
        </div>
      );
    }
    return null;
  };

  const faqs = [
    { q: "Is NORCET cutoff released in marks or percentile?", a: "AIIMS releases the Stage I cutoff as a Percentile score, not raw marks. Stage II cutoff is based on qualifying percentages." },
    { q: "What is the difference between percentile and marks?", a: "Marks represent your absolute score in the exam, while percentile represents the percentage of candidates who scored equal to or less than you." },
    { q: "Can the NORCET cutoff decrease in future exams?", a: "Yes, cutoff depends on the difficulty level of the paper and the number of vacancies. As seen in NORCET 9, the cutoff dropped significantly compared to NORCET 8 and 10." },
    { q: "Does the number of vacancies affect the cutoff?", a: "Absolutely. Higher vacancies generally lead to a lower cutoff because more candidates are selected for the next stage or final merit list." },
    { q: "How many candidates qualify for Stage II?", a: "Generally, candidates equal to 5 times the number of total vacancies are called for Stage II, subject to scoring above the minimum qualifying percentile." },
    { q: "Is Stage I qualifying in nature only?", a: "Yes, NORCET Stage I (Prelims) is only qualifying. Its marks are not added to the final merit list." },
    { q: "Is Stage II purely merit-based?", a: "Yes, final selection and institute allocation are based entirely on your merit (rank) in Stage II (Mains)." },
    { q: "What is a safe percentile for UR in Stage I?", a: "Based on trends, a percentile above 94.00 is generally considered very safe for UR category to qualify for Stage II." },
    { q: "Can PwBD cutoff change?", a: "Yes, PwBD cutoffs vary depending on the category and the number of PwBD candidates appearing for the exam." },
    { q: "What happens after Stage II?", a: "After Stage II results, successful candidates must participate in the online institute allocation process to choose their preferred AIIMS or hospital." },
    { q: "Is there normalization in NORCET?", a: "Yes, if the exam is conducted in multiple shifts, AIIMS applies a normalization procedure to ensure fairness across all shifts." },
    { q: "What is the qualifying percentage for UR in Stage II?", a: "The qualifying percentage for UR/EWS in Stage II is 50%." },
    { q: "What is the qualifying percentage for OBC in Stage II?", a: "The qualifying percentage for OBC in Stage II is 45%." },
    { q: "What is the qualifying percentage for SC/ST in Stage II?", a: "The qualifying percentage for SC/ST in Stage II is 40%." },
    { q: "Will there be negative marking?", a: "Yes, usually 1/3rd mark is deducted for every incorrect answer, but always verify with the latest official notification." },
    { q: "How are ties resolved in NORCET?", a: "Ties are typically resolved by date of birth (older candidate placed higher) or by the number of wrong answers (fewer wrong answers placed higher)." },
    { q: "Is the cutoff same for all AIIMS institutes?", a: "Stage I cutoff is common. Stage II merit determines allocation, meaning top AIIMS (like New Delhi) require a higher rank in the final merit." },
    { q: "Are central government hospitals included in NORCET?", a: "Yes, apart from AIIMS, hospitals like Safdarjung, RML, and LHMC also participate in NORCET for Nursing Officer recruitment." },
    { q: "When is NORCET 11 expected?", a: "NORCET 11 is expected in the second half of 2026. Keep checking the official AIIMS website for updates." },
    { q: "Where can I find official cutoffs?", a: "Official cutoffs and result PDFs are published strictly on the AIIMS exams portal: www.aiimsexams.ac.in." }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div id="printable-job-content" className="w-full bg-slate-50 min-h-screen pb-12 relative font-sans text-slate-800">
      <Helmet>
        <title>AIIMS NORCET Previous Year Cutoff (Last 3 Exams) - Trend Analysis & PDF</title>
        <meta name="description" content="Compare category-wise cutoffs, vacancy trends, qualifying criteria, and official PDFs for NORCET 8, 9, and 10. Ultimate guide for Nursing Officer aspirants." />
        <link rel="canonical" href="https://newvacancyalert.in/aiims-norcet-11-nursing-officer-2026/cutoff" />
        <meta property="og:title" content="AIIMS NORCET Previous Year Cutoff (Last 3 Exams)" />
        <meta property="og:description" content="Detailed analysis of NORCET 8, 9, and 10 cutoffs. Predict expected cutoffs for NORCET 11 and prepare efficiently." />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div className="h-full bg-blue-600 transition-all duration-150" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-blue-900 pt-16 pb-20 px-4 relative overflow-hidden text-white border-b-4 border-blue-500">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/aiims-norcet-11-nursing-officer-2026" className="inline-flex items-center text-blue-200 hover:text-white font-bold text-xs mb-8 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to NORCET 11 Notification
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="flex gap-2">
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">Exam Analysis</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">Nursing Officer</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                AIIMS NORCET Previous Year Cutoff <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">(Last 3 Exams)</span>
              </h1>
              <p className="text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
                Compare category-wise cutoffs, vacancy trends, qualifying criteria and official PDFs for NORCET 8, NORCET 9, and NORCET 10 to supercharge your NORCET 11 preparation.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/aiims-norcet-11-nursing-officer-2026" className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                  View Latest NORCET <ChevronRight className="h-4 w-4" />
                </Link>
                <a href="https://www.aiimsexams.ac.in" target="_blank" rel="noreferrer" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 backdrop-blur-md border border-white/10">
                  Official AIIMS Website <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="hidden lg:block w-1/3">
              <div className="relative">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500/30 to-emerald-500/30 rounded-full animate-pulse blur-3xl absolute inset-0"></div>
                
                {/* SVG Clipart replacing the image */}
                <div className="w-full aspect-square rounded-2xl border-4 border-white/10 shadow-2xl relative z-10 bg-gradient-to-br from-blue-900/80 to-slate-900 flex items-center justify-center p-8 backdrop-blur-sm overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
                    <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20 mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                      <BarChart3 className="h-20 w-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex items-end justify-center gap-3 w-full px-4 h-16">
                      <div className="w-1/3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg h-1/2 opacity-70 animate-[pulse_3s_ease-in-out_infinite]"></div>
                      <div className="w-1/3 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg h-3/4 opacity-90 animate-[pulse_2s_ease-in-out_infinite]"></div>
                      <div className="w-1/3 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg h-full animate-[pulse_2.5s_ease-in-out_infinite]"></div>
                    </div>
                    
                    <div className="w-full border-t-2 border-white/10 mt-0 pt-3">
                      <span className="font-mono text-xs font-black text-blue-200 tracking-[0.2em] uppercase">Data Analytics</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl z-20 flex items-center gap-3 border border-slate-100">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Analysis Status</p>
                    <p className="text-sm text-slate-800 font-black">100% Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 flex flex-col lg:flex-row gap-6">
        
        {/* Sticky Sidebar / Table of Contents */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" /> Contents
            </h3>
            <nav className="space-y-1">
              {[
                { id: 'what-is', label: 'What is Cutoff?' },
                { id: 'stage-1', label: 'Stage I Comparison' },
                { id: 'stage-2', label: 'Stage II Qualifying' },
                { id: 'pwbd', label: 'PwBD Cutoff' },
                { id: 'vacancies', label: 'Vacancy Trends' },
                { id: 'observations', label: 'Key Observations' },
                { id: 'expected', label: 'Expected NORCET 11' },
                { id: 'factors', label: 'Affecting Factors' },
                { id: 'strategy', label: 'Preparation Strategy' },
                { id: 'faqs', label: 'FAQs' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
               <Link to="/aiims-norcet-11-nursing-officer-2026" className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-4">
                 <Briefcase className="h-4 w-4" /> Latest NORCET Job
               </Link>
               <NorcetPdfDownloadWidget variant="sidebar" />
            </div>
          </div>
        </div>

        {/* Main Article Content */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {/* Highlights & Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><Target className="h-4 w-4 text-blue-500" /> Important Highlights</h3>
              <ul className="space-y-3">
                {['Last Updated: Latest Data', 'Covers NORCET 8, 9 & 10', 'Data from Official AIIMS Sources', 'Detailed Vacancy Comparison', 'Category-wise Percentile Breakdown', 'Stage I & Stage II Criteria'].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-purple-500" /> Quick Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: 'NORCET Covered', v: '3' },
                  { l: 'Latest Exam', v: 'NORCET 10' },
                  { l: 'Highest UR Cutoff', v: '93.58%ile' },
                  { l: 'Lowest UR Cutoff', v: '90.71%ile' },
                  { l: 'Latest Vacancies', v: '2551+' },
                  { l: 'Selection Stages', v: '2' }
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{s.l}</span>
                    <span className="text-sm font-black text-slate-900">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What is AIIMS NORCET Cutoff */}
          <section id="what-is" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><HelpCircle className="h-5 w-5" /></div>
              What is AIIMS NORCET Cutoff?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-6">
              The AIIMS NORCET (Nursing Officer Recruitment Common Eligibility Test) involves two crucial stages, and understanding the difference between qualifying metrics is vital for aspirants.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5">
                <h4 className="text-sm font-black text-indigo-900 mb-2 flex items-center gap-2"><Layers className="h-4 w-4" /> Stage I (Prelims)</h4>
                <p className="text-xs text-indigo-800 leading-relaxed font-medium">Stage I acts as a screening test. The cutoff is released as a <strong>percentile score</strong> based on normalization. It is only qualifying in nature, and marks are not added to the final merit.</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5">
                <h4 className="text-sm font-black text-emerald-900 mb-2 flex items-center gap-2"><Award className="h-4 w-4" /> Stage II (Mains)</h4>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">Stage II is the final merit-deciding exam. Instead of relative percentile, it has a strict <strong>qualifying percentage</strong> (e.g., 50% for UR). Rank in Stage II determines institute allocation.</p>
              </div>
            </div>
          </section>

          {/* Compact 1-Liner In-Content Previous Year Papers Download */}
          <NorcetPdfDownloadWidget 
            variant="compact"
            title="AIIMS NORCET Solved Question Papers (2017–2023 PDF)"
            subtitle="Download solved question papers with official answer keys (AIIMS Raipur, Jodhpur, Bhopal, Delhi & NORCET)."
          />

          {/* Stage I Cutoff Comparison */}
          <section id="stage-1" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><TrendingUp className="h-5 w-5" /></div>
              Category-wise Stage I Cutoff Comparison
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-8">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-black text-slate-600 uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-black text-blue-700 uppercase tracking-wider bg-blue-50/50">NORCET-10</th>
                    <th className="p-4 text-xs font-black text-slate-600 uppercase tracking-wider">NORCET-9</th>
                    <th className="p-4 text-xs font-black text-slate-600 uppercase tracking-wider">NORCET-8</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 text-sm font-black text-slate-800">UR</td>
                    <td className="p-4 text-sm font-bold text-slate-700 bg-blue-50/20">93.5887683</td>
                    <td className="p-4 text-sm font-bold text-slate-700">90.7161868</td>
                    <td className="p-4 text-sm font-bold text-slate-700">93.5335077</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 text-sm font-black text-slate-800">EWS</td>
                    <td className="p-4 text-sm font-bold text-slate-700 bg-blue-50/20">78.9831134</td>
                    <td className="p-4 text-sm font-bold text-slate-700">65.6169852</td>
                    <td className="p-4 text-sm font-bold text-slate-700">78.2853953</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 text-sm font-black text-slate-800">OBC</td>
                    <td className="p-4 text-sm font-bold text-slate-700 bg-blue-50/20">84.2077239</td>
                    <td className="p-4 text-sm font-bold text-slate-700">75.9545125</td>
                    <td className="p-4 text-sm font-bold text-slate-700">83.1213092</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 text-sm font-black text-slate-800">SC</td>
                    <td className="p-4 text-sm font-bold text-slate-700 bg-blue-50/20">81.9605328</td>
                    <td className="p-4 text-sm font-bold text-slate-700">73.4418098</td>
                    <td className="p-4 text-sm font-bold text-slate-700">80.1392602</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 text-sm font-black text-slate-800">ST</td>
                    <td className="p-4 text-sm font-bold text-slate-700 bg-blue-50/20">74.4746050</td>
                    <td className="p-4 text-sm font-bold text-slate-700">66.3210743</td>
                    <td className="p-4 text-sm font-bold text-slate-700">73.6786438</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MarketingPartnerBanner className="my-6" />

            <h3 className="text-sm font-black text-slate-800 mb-4 text-center">Trend Interactive Graph (Percentile)</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stage1Data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                  <Line type="monotone" dataKey="UR" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="OBC" stroke="#8b5cf6" strokeWidth={3} />
                  <Line type="monotone" dataKey="SC" stroke="#ec4899" strokeWidth={3} />
                  <Line type="monotone" dataKey="ST" stroke="#f59e0b" strokeWidth={3} />
                  <Line type="monotone" dataKey="EWS" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* In-Content Download Banner 1 */}
          <NorcetPdfDownloadWidget 
            variant="compact"
            title="AIIMS NORCET Solved Question Papers (2017–2023)"
            subtitle="Download solved question papers with official answer keys (AIIMS Raipur, Jodhpur, Bhopal, Delhi & NORCET 2020–2023)."
          />

          {/* Stage II Qualifying */}
          <section id="stage-2" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><CheckCircle2 className="h-5 w-5" /></div>
              Stage II Qualifying Percentage
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center shadow-xs">
                <p className="text-xs font-black text-green-700 uppercase tracking-wider mb-2">UR / EWS</p>
                <p className="text-3xl font-black text-green-600">50%</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center shadow-xs">
                <p className="text-xs font-black text-yellow-700 uppercase tracking-wider mb-2">OBC</p>
                <p className="text-3xl font-black text-yellow-600">45%</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center shadow-xs">
                <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-2">SC / ST</p>
                <p className="text-3xl font-black text-blue-600">40%</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3 items-start">
              <Info className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                <strong className="text-slate-800 block mb-1">Constant Standard:</strong> 
                The Stage II qualifying percentage remains constant across NORCET 8, 9, and 10. Candidates must score these absolute minimum percentages to be considered for the final merit list and institute allocation.
              </p>
            </div>
          </section>

          {/* PwBD Cutoff */}
          <section id="pwbd" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-lg text-teal-600"><Users className="h-5 w-5" /></div>
              PwBD Candidates Cutoff
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-black text-slate-600 uppercase tracking-wider">Category (PwBD)</th>
                    <th className="p-4 text-xs font-black text-slate-600 uppercase tracking-wider">NORCET-10</th>
                    <th className="p-4 text-xs font-black text-slate-600 uppercase tracking-wider">NORCET-9</th>
                    <th className="p-4 text-xs font-black text-slate-600 uppercase tracking-wider">NORCET-8</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50"><td className="p-4 text-sm font-black text-slate-700">UR-PwBD</td><td className="p-4 text-sm font-medium">45.625%</td><td className="p-4 text-sm font-medium">45.000%</td><td className="p-4 text-sm font-medium">47.053%</td></tr>
                  <tr className="hover:bg-slate-50"><td className="p-4 text-sm font-black text-slate-700">EWS-PwBD</td><td className="p-4 text-sm font-medium">51.667%</td><td className="p-4 text-sm font-medium">48.125%</td><td className="p-4 text-sm font-medium">48.333%</td></tr>
                  <tr className="hover:bg-slate-50"><td className="p-4 text-sm font-black text-slate-700">OBC-PwBD</td><td className="p-4 text-sm font-medium">41.042%</td><td className="p-4 text-sm font-medium">41.667%</td><td className="p-4 text-sm font-medium">40.833%</td></tr>
                  <tr className="hover:bg-slate-50"><td className="p-4 text-sm font-black text-slate-700">SC-PwBD</td><td className="p-4 text-sm font-medium">35.833%</td><td className="p-4 text-sm font-medium">37.917%</td><td className="p-4 text-sm font-medium">35.417%</td></tr>
                  <tr className="hover:bg-slate-50"><td className="p-4 text-sm font-black text-slate-700">ST-PwBD</td><td className="p-4 text-sm font-medium">35.000%</td><td className="p-4 text-sm font-medium">35.833%</td><td className="p-4 text-sm font-medium">46.667%</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Vacancy Comparison */}
          <section id="vacancies" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-lg text-pink-600"><Briefcase className="h-5 w-5" /></div>
              Vacancy Comparison
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {vacancyData.slice().reverse().map((v, i) => (
                <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{v.name}</span>
                  <span className="text-2xl font-black text-blue-600">{v.count}{v.name === 'NORCET 9' ? '+' : ''}</span>
                  <span className="text-[10px] text-slate-400 font-medium text-center mt-1">Vacancies</span>
                </div>
              ))}
            </div>
            
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vacancyData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} />
                  <RechartsTooltip content={<CustomTooltipBar />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Key Observations */}
          <section id="observations" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Activity className="h-5 w-5" /></div>
              Key Observations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-xs mt-1 shrink-0"><TrendingUp className="h-4 w-4 text-orange-500" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">NORCET 9 Dip</h4>
                  <p className="text-xs text-slate-600 font-medium">NORCET 9 had the lowest qualifying percentile across all categories, directly correlating with a massive spike in vacancies (3500+).</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-xs mt-1 shrink-0"><Target className="h-4 w-4 text-blue-500" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Consistency in UR</h4>
                  <p className="text-xs text-slate-600 font-medium">NORCET 8 and NORCET 10 had almost identical UR cutoffs (~93.5 percentile) demonstrating a stable competitive baseline.</p>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-xs mt-1 shrink-0"><ShieldCheck className="h-4 w-4 text-emerald-500" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Static Stage II Criteria</h4>
                  <p className="text-xs text-slate-600 font-medium">Unlike Stage I percentile which fluctuates with competition and paper difficulty, Stage II qualifying percentage remains rigidly unchanged.</p>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-xs mt-1 shrink-0"><Users className="h-4 w-4 text-purple-500" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Vacancy Impact</h4>
                  <p className="text-xs text-slate-600 font-medium">Higher vacancies unequivocally improve selection chances and drop the Stage I screening cutoff.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Expected NORCET 11 */}
          <section id="expected" className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-5 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
            <h2 className="text-xl sm:text-2xl font-black mb-2 relative z-10 flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-400" /> Expected NORCET 11 Cutoff
            </h2>
            <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-3 mb-6 relative z-10 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200 font-medium leading-relaxed">
                <strong className="text-white block mb-0.5">Disclaimer:</strong> 
                The values below are predictive ranges based on historical trends (NORCET 8, 9, 10). They are <strong>not official cutoffs</strong>. Final cutoffs will depend strictly on the exam difficulty and exact vacancy numbers released by AIIMS.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {[
                { cat: 'UR', range: '93.0 - 94.5', prob: 85 },
                { cat: 'OBC', range: '82.0 - 85.0', prob: 80 },
                { cat: 'SC', range: '79.0 - 82.0', prob: 75 },
                { cat: 'EWS', range: '75.0 - 79.0', prob: 70 }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-black text-lg mb-1">{item.cat}</h4>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-3">{item.range}</p>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${item.prob}%` }}></div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-right">{item.prob}% Confidence</p>
                </div>
              ))}
            </div>
          </section>

          {/* Factors */}
          <section id="factors" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Layers className="h-5 w-5" /></div>
              Factors Affecting NORCET Cutoff
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: Users, title: 'Number of Candidates', desc: 'Total applicants appearing' },
                { icon: ShieldAlert, title: 'Difficulty', desc: 'Complexity of the paper' },
                { icon: Briefcase, title: 'Vacancies', desc: 'Total seats available' },
                { icon: BarChart3, title: 'Normalization', desc: 'Multi-shift adjustments' },
                { icon: Bookmark, title: 'Reservation', desc: '80:20 gender ratio & categories' },
                { icon: TrendingUp, title: 'Competition', desc: 'Overall applicant quality' }
              ].map((f, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center hover:bg-slate-100 transition-colors">
                  <div className="inline-flex bg-white p-2.5 rounded-full shadow-sm text-indigo-600 mb-3">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{f.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Strategy */}
          <section id="strategy" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><BookOpen className="h-5 w-5" /></div>
              Preparation Strategy & Targets
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center font-black text-blue-600 shrink-0">UR</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Target &gt; 95.0 Percentile</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">Focus heavily on clinical scenarios and nursing management. Accuracy is paramount due to the high baseline cutoff.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center font-black text-purple-600 shrink-0">OBC</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Target &gt; 86.0 Percentile</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">Ensure strong fundamentals in core nursing subjects. Minimize negative marking to stay above the 85 mark safely.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center font-black text-pink-600 shrink-0">SC</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Target &gt; 83.0 Percentile</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">Consistent practice with previous year papers and mock tests will easily push you past the safety threshold.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center font-black text-orange-600 shrink-0">ST</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Target &gt; 76.0 Percentile</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">Focus on high-yield topics and ensure passing Stage II minimums, as Stage I cutoff is relatively forgiving.</p>
                </div>
              </div>
            </div>
          </section>

          {/* In-Content Download Banner 2 */}
          <NorcetPdfDownloadWidget 
            variant="compact"
            title="Practice NORCET Previous Papers PDF Download"
            subtitle="Get instant access to verified past year nursing officer questions. Subscribe to notifications to unlock."
          />

          {/* FAQs */}
          <section id="faqs" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><HelpCircle className="h-5 w-5" /></div>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 transition-all">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-start sm:items-center justify-between p-4 text-left focus:outline-none bg-white hover:bg-slate-50/50"
                  >
                    <span className="font-bold text-slate-800 text-sm pr-4">{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 mt-0.5 sm:mt-0 ${openFaq === index ? 'rotate-90' : ''}`} />
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out px-4 overflow-hidden border-t border-slate-100 ${
                      openFaq === index ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0 border-transparent'
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Official Resources */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><ExternalLink className="h-5 w-5" /></div>
              Official Resources & Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="https://www.aiimsexams.ac.in" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded shadow-xs group-hover:text-blue-600"><Briefcase className="h-4 w-4" /></div>
                  <span className="font-bold text-sm text-slate-700 group-hover:text-blue-700">Official AIIMS Portal</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
              </a>
              <Link to="/aiims-norcet-11-nursing-officer-2026" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded shadow-xs group-hover:text-emerald-600"><FileText className="h-4 w-4" /></div>
                  <span className="font-bold text-sm text-slate-700 group-hover:text-emerald-700">Latest NORCET Info</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
              </Link>
            </div>
          </section>

          {/* Web View Dock (Visible only on lg screens and up) */}
          <div className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/50 p-2 items-center gap-2 z-40 print:hidden transition-all hover:bg-white hover:shadow-blue-500/10">
            <button
              onClick={startPdfDownload}
              className="flex items-center gap-2 bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-bold px-4 py-2.5 rounded-xl transition-colors group"
            >
              <Printer className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Save PDF</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl transition-colors ${linkCopied ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="text-xs">{linkCopied ? 'Copied' : 'Copy Link'}</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <div className="flex gap-1 items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'}`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {item.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>



      {/* Comments & Discussion */}
      <div className="max-w-6xl mx-auto px-4 mt-8 print:hidden">
        <CommentsSection pageId="norcet-cutoff" pageTitle="AIIMS NORCET Cutoff Marks & Analysis" />
      </div>

      {/* Priority Push Notification Subscription Settings at Bottom */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pb-12 print:hidden">
        <SubscribeWidget mode="bottom" />
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.15)] z-40 px-2.5 py-2 flex items-center justify-between gap-2 safe-area-bottom print:hidden">
        {/* Prominent Download Button on Left */}
        <button
          onClick={startPdfDownload}
          className="flex items-center justify-center gap-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-black px-2 py-1.5 rounded-lg shadow-sm shadow-indigo-200/80 border border-indigo-400/30 cursor-pointer shrink-0 active:scale-95 transition-all"
        >
          <Download className="h-3.5 w-3.5 shrink-0 text-white" />
          <span className="text-[10px] font-black leading-tight whitespace-nowrap">Save PDF</span>
        </button>

        {/* Navigation Items */}
        <div className="flex items-center justify-around flex-1 gap-1">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex flex-col items-center justify-center py-0.5 px-1.5 rounded-lg cursor-pointer transition-colors ${isActive ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-semibold'}`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[9px]">{item.label}</span>
              </button>
            )
          })}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center justify-center py-0.5 px-1.5 rounded-lg cursor-pointer transition-colors ${isMobileMenuOpen ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-semibold'}`}
          >
            <div className="relative">
              <ListChecks className="h-4 w-4" />
            </div>
            <span className="text-[9px]">More</span>
          </button>
        </div>
      </div>

      {/* Mobile Expandable Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs print:hidden" onClick={() => setIsMobileMenuOpen(false)}>
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
                    onClick={() => {
                      scrollToSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                      isActive 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs">{item.label}</span>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleCopyLink}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-colors border font-bold text-xs ${
                  linkCopied
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {linkCopied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
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
                <h3 className="text-base font-black text-slate-900 mt-0.5">Download Cutoff Analysis</h3>
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

// Temporary internal component for missing ArrowRight import (to avoid adding import)
const ArrowRight = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
