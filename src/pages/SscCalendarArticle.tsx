import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { 
  Calendar, Clock, Download, ArrowRight, ShieldCheck, Flame, Search, 
  Filter, History, Map, TrendingUp, Info, ChevronDown, CheckCircle2, 
  AlertCircle, FileText, ExternalLink, Activity, ListOrdered, CalendarDays, 
  ArrowUpRight, Copy, Share2, Timer, BookOpen
} from 'lucide-react';
import { sscCalendarData, sscRevisionHistory, sscFaqs, SscExamEvent } from '../data/sscCalendarData';
import SubscribeWidget from '../components/SubscribeWidget';
import CommentsSection from '../components/CommentsSection';
import { useAuth } from '../context/AuthContext';

export default function SscCalendarArticle() {
  const { requireAuthForDownloadAction } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDownloadPdf = () => {
    requireAuthForDownloadAction(
      () => window.print(),
      "Google Sign-In Required for PDF Download",
      "Sign in with Google to download or save the official SSC Exam Calendar PDF."
    );
  };
  const [selectedQualification, setSelectedQualification] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const qualifications = ['All', '10th', '12th', 'Graduate', 'Engineer'];
  const statuses = ['All', 'Upcoming', 'Notification Soon', 'Registration Open', 'Exam Running', 'Result Released'];

  const filteredExams = useMemo(() => {
    return sscCalendarData.filter(exam => {
      const matchesSearch = 
        exam.examName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        exam.examCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesQualification = selectedQualification === 'All' || exam.qualification.includes(selectedQualification);
      const matchesStatus = selectedStatus === 'All' || exam.status === selectedStatus;

      return matchesSearch && matchesQualification && matchesStatus;
    });
  }, [searchQuery, selectedQualification, selectedStatus]);

  // Schema Generation
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "SSC Exam Calendar 2026-2027 | Notification, Last Date, Admit Card",
    "description": "Check the latest SSC Exam Calendar with notification dates, application deadlines, admit cards, exam schedules, answer keys, results, official PDFs, and live status updates.",
    "publisher": {
      "@type": "Organization",
      "name": "NewVacancyAlert.in"
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Helmet>
        <title>SSC Exam Calendar 2026-2027 | Notification, Last Date, Admit Card, Exam Date, Result</title>
        <meta name="description" content="Check the latest SSC Exam Calendar with notification dates, application deadlines, admit cards, exam schedules, answer keys, results, official PDFs, monthly timelines, and live status updates." />
        <link rel="canonical" href="https://newvacancyalert.in/ssc-exam-calendar" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Live Status Strip */}
      <div className="bg-slate-900 text-white overflow-hidden py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs font-black text-red-400 uppercase tracking-widest shrink-0">
            <Activity className="w-4 h-4 animate-pulse" /> LIVE
          </span>
          <div className="flex-1 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> MTS 2026 Registration Open till 31st July</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> CHSL 2026 Tier 1 Exams Running</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> CPO 2026 Tier 1 Result Declared</span>
          </div>
        </div>
      </div>

      {/* Top Hero Section */}
      <div className="bg-gradient-to-b from-blue-50/50 to-white pt-8 pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  2026-2027
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Official Sources Only
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                SSC Exam Calendar <span className="text-blue-600">Master Tracker</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
                The definitive, continuously updated dashboard for Staff Selection Commission recruitments. Track notifications, deadlines, admit cards, and results verified directly from ssc.gov.in.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a href="https://ssc.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all">
                  <ExternalLink className="w-4 h-4" /> Official SSC Portal
                </a>
                <button 
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold border-2 border-slate-200 hover:border-slate-300 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-600" /> Download PDF Calendar
                </button>
              </div>
            </div>

            {/* Featured Countdown */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 shrink-0 w-full md:w-80 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-4">
                <Timer className="w-4 h-4" /> Next Major Event
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">SSC MTS 2026 Deadline</h3>
              <p className="text-sm text-slate-600 font-medium mb-6">Last date to apply and pay fees online.</p>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-2xl font-black text-slate-900">03</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Days</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-2xl font-black text-slate-900">14</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Hours</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-2xl font-black text-slate-900">45</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Mins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Registration Open</div>
            <div className="text-3xl font-black text-emerald-600">1</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Upcoming Notification</div>
            <div className="text-3xl font-black text-blue-600">2</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Results Awaited</div>
            <div className="text-3xl font-black text-amber-500">3</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Exams</div>
            <div className="text-3xl font-black text-purple-600">1</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
          <div className="relative w-full md:w-96 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search exams, posts, or codes (e.g. CGL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3">
            <select 
              value={selectedQualification}
              onChange={(e) => setSelectedQualification(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 shrink-0 w-full sm:w-auto"
            >
              <option value="All">All Qualifications</option>
              {qualifications.filter(q => q !== 'All').map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 shrink-0 w-full sm:w-auto"
            >
              <option value="All">All Statuses</option>
              {statuses.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Master Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Exam Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Notification & Apply</th>
                  <th className="p-4">Exam Date</th>
                  <th className="p-4">Updates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-bold text-slate-900 text-sm mb-1">
                        {exam.examCode} - {exam.examName}
                      </div>
                      <div className="text-xs text-slate-500 font-medium space-y-1">
                        <div><span className="font-semibold">Dept:</span> {exam.department}</div>
                        <div><span className="font-semibold">Qualification:</span> {exam.qualification.join(', ')}</div>
                        <div className="text-blue-600 font-bold">{exam.vacancies} Vacancies</div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        exam.status === 'Registration Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        exam.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        exam.status === 'Result Released' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        exam.status === 'Exam Running' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {exam.status === 'Registration Open' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {exam.status}
                      </span>
                    </td>
                    <td className="p-4 align-top text-xs font-medium space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 text-slate-500">Notified:</span>
                        <span className="text-slate-900 font-bold">{exam.notificationDate}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 text-slate-500">Apply Start:</span>
                        <span className="text-slate-900">{exam.applyStartDate}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 text-slate-500">Last Date:</span>
                        <span className="text-red-600 font-bold">{exam.lastDate}</span>
                      </div>
                    </td>
                    <td className="p-4 align-top text-xs font-medium space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 text-slate-500">Admit Card:</span>
                        <span className="text-slate-900">{exam.admitCardDate}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-20 shrink-0 text-slate-500">Exam:</span>
                        <span className="text-slate-900 font-bold bg-amber-50 px-1 py-0.5 rounded">{exam.examDate}</span>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="text-xs font-medium text-slate-600 mb-3">
                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Expected Next</span>
                        {exam.expectedNextUpdate}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={`/${exam.id}`} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group">
                          View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                          Official Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredExams.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                      No exams found matching your criteria. Try adjusting the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="block lg:hidden divide-y divide-slate-100">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="p-4 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="font-bold text-slate-900 text-sm">
                    {exam.examCode} - {exam.examName}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${
                    exam.status === 'Registration Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    exam.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    exam.status === 'Result Released' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    exam.status === 'Exam Running' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {exam.status === 'Registration Open' && <CheckCircle2 className="w-3 h-3" />}
                    {exam.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs font-medium text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notified:</span>
                    <span className="font-bold text-slate-900">{exam.notificationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Date:</span>
                    <span className="font-bold text-red-600">{exam.lastDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Exam:</span>
                    <span className="font-bold text-slate-900">{exam.examDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-blue-600 font-bold">{exam.vacancies} Vacancies</div>
                  <Link to={`/${exam.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors">
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
            {filteredExams.length === 0 && (
              <div className="p-8 text-center text-slate-500 font-medium text-sm">
                No exams found matching your criteria. Try adjusting the filters.
              </div>
            )}
          </div>
        </div>

        {/* Timeline View */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="w-6 h-6 text-slate-700" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">2026 Timeline & Month View</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-2">
              {['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => {
                const monthExams = sscCalendarData.filter(e => e.examMonth === month);
                return (
                  <div key={month} className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden flex flex-col">
                    <div className="bg-slate-800 text-white p-3 text-center font-black text-sm uppercase tracking-wider">{month} 2026</div>
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      {monthExams.length > 0 ? monthExams.map(exam => (
                        <div key={exam.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs">
                          <span className="font-black text-blue-700 mb-1 block">{exam.examCode}</span>
                          <span className="text-slate-600 font-medium line-clamp-2 leading-snug">{exam.examName}</span>
                          <div className="mt-2 text-[10px] uppercase font-bold text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
                            <span>Status:</span>
                            <span className={exam.status.includes('Open') ? 'text-emerald-600' : 'text-amber-600'}>{exam.status}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="flex-1 flex items-center justify-center text-xs font-medium text-slate-400 text-center">
                          No major events scheduled yet.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Exam Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Major SSC Exams Guides</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['CGL', 'CHSL', 'MTS'].map(code => {
              const exam = sscCalendarData.find(e => e.examCode === code);
              if (!exam) return null;
              return (
                <div key={code} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-1 rounded-md">{exam.examCode}</span>
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Map className="w-3 h-3" /> All India</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug">{exam.examName}</h3>
                    <div className="space-y-2 mt-4 text-xs font-medium text-slate-600">
                      <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> <span><strong className="text-slate-800">Eligibility:</strong> {exam.qualification.join(', ')}</span></div>
                      <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> <span><strong className="text-slate-800">Salary:</strong> {exam.salary}</span></div>
                    </div>
                  </div>
                  <div className="p-4 bg-white grid grid-cols-2 gap-2 text-center text-[11px] font-bold border-t border-slate-100">
                    <Link to={`/${exam.id}/syllabus`} className="py-2 px-1 hover:bg-slate-50 rounded text-slate-600 hover:text-blue-600 transition-colors">Syllabus</Link>
                    <Link to={`/${exam.id}/cutoff`} className="py-2 px-1 hover:bg-slate-50 rounded text-slate-600 hover:text-blue-600 transition-colors">Cutoff</Link>
                    <Link to={`/${exam.id}/papers`} className="py-2 px-1 hover:bg-slate-50 rounded text-slate-600 hover:text-blue-600 transition-colors">Prev Papers</Link>
                    <Link to={`/${exam.id}`} className="py-2 px-1 hover:bg-slate-50 rounded text-blue-600 bg-blue-50 transition-colors">Full Details</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revision History */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-6 h-6 text-slate-700" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Updates & Revisions</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="space-y-6">
              {sscRevisionHistory.map((rev, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== sscRevisionHistory.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200"></div>
                  )}
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 z-10 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-900">{rev.exam}</h4>
                      <span className="text-[11px] font-bold text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 mb-2">
                      <span className="line-through text-slate-400 mr-2">{rev.oldVal}</span>
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{rev.newVal}</span>
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 bg-slate-50 inline-block px-2.5 py-1 rounded-md border border-slate-100">
                      <span className="font-bold text-slate-700">Reason:</span> {rev.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-slate-700" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sscFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-start gap-2">
                  <span className="text-blue-500 font-black">Q.</span> {faq.q}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comments & Discussion */}
        <CommentsSection pageId="ssc-calendar" pageTitle="SSC Exam Calendar" />

        {/* Subscribe Widget at Bottom */}
        <SubscribeWidget mode="bottom" />

      </div>
    </div>
  );
}
