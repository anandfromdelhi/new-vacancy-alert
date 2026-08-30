import React from 'react';
import { Facebook, Instagram, BookOpen, Rss, Megaphone, ArrowRight, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 shrink-0 print:hidden">
      {/* 1. Marketing Partner Programme Hero Strip */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800/80 py-5 px-4 sm:px-8">
        <div className="w-full max-w-[1800px] 2xl:max-w-[2000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 shrink-0 shadow-xs">
              <Megaphone className="w-5 h-5 text-blue-400" />
            </span>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-extrabold text-white text-sm sm:text-base">Cyber Cafés & Student Partner Programme</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  Earn Rewards
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5 max-w-2xl">
                Earn promotional rewards by displaying official government job QR posters in your cyber café, coaching institute, or college notice boards.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <Link
              to="/marketing-partner"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap"
            >
              <span>Join Partner Programme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/marketing-partner/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all whitespace-nowrap"
            >
              <span>Partner Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Columns */}
      <div className="w-full max-w-[1800px] 2xl:max-w-[2000px] mx-auto py-8 px-4 sm:px-8 2xl:px-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        
        {/* Column 1: About Portal */}
        <div className="space-y-3 col-span-2 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              NV
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">NewVacancyAlert.in</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            India's fast, zero-clutter government job notification portal. Real-time vacancy updates, exam schedules, syllabus breakdowns, and career calculators.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://www.facebook.com/profile.php?id=61592714690988"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition"
              title="Facebook Page"
            >
              <Facebook className="w-4 h-4 fill-current" />
            </a>
            <a
              href="https://www.instagram.com/newvacancyalert.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-400 hover:text-white transition"
              title="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white transition"
              title="RSS Feed XML"
            >
              <Rss className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Popular Guides & Calendars */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Guides & Calendars</span>
          </h3>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            <li>
              <Link to="/articles" className="hover:text-blue-400 transition">All Articles & Guides</Link>
            </li>
            <li>
              <Link to="/articles/ssc-cgl-master-guide" className="hover:text-blue-400 transition">SSC CGL Master Guide</Link>
            </li>
            <li>
              <Link to="/articles/best-books-for-rrb-ntpc" className="hover:text-blue-400 transition">Best Books for RRB NTPC</Link>
            </li>
            <li>
              <Link to="/articles/rrb-exam-calendar-2026-27" className="hover:text-blue-400 transition">RRB Exam Calendar 2026-27</Link>
            </li>
            <li>
              <Link to="/articles/ssc-exam-calendar" className="hover:text-blue-400 transition">SSC Exam Calendar 2026</Link>
            </li>
            <li>
              <Link to="/articles/salary-calculator" className="hover:text-blue-400 transition">7th CPC Salary Calculator</Link>
            </li>
            <li>
              <Link to="/articles/aiims-norcet-11-nursing-officer-2026/cutoff" className="hover:text-blue-400 transition">AIIMS NORCET Cutoff & Rank</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Qualification Jobs */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Jobs by Category</span>
          </h3>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            <li>
              <Link to="/jobs-for/10th-pass" className="hover:text-amber-400 transition">10th Pass Govt Jobs</Link>
            </li>
            <li>
              <Link to="/jobs-for/12th-pass" className="hover:text-amber-400 transition">12th Pass Govt Jobs</Link>
            </li>
            <li>
              <Link to="/jobs-for/graduate" className="hover:text-amber-400 transition">Graduate Vacancies</Link>
            </li>
            <li>
              <Link to="/jobs-for/diploma" className="hover:text-amber-400 transition">Diploma & ITI Recruitment</Link>
            </li>
            <li>
              <Link to="/jobs-for/b-e-b-tech" className="hover:text-amber-400 transition">Engineering / Technical Jobs</Link>
            </li>
            <li>
              <Link to="/jobs-for/medical" className="hover:text-amber-400 transition">Medical & Nursing Jobs</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Partner & Legal */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Partner & Company</span>
          </h3>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            <li>
              <Link to="/marketing-partner" className="text-amber-400 font-bold hover:underline">Marketing Partner Programme</Link>
            </li>
            <li>
              <Link to="/marketing-partner/dashboard" className="hover:text-slate-200 transition">Partner Dashboard</Link>
            </li>
            <li>
              <Link to="/marketing-partner/terms" className="hover:text-slate-200 transition">Partner Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-slate-200 transition">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-slate-200 transition">Contact Us</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-slate-200 transition">Privacy Policy</Link>
            </li>
          </ul>
        </div>

      </div>

      {/* 3. Bottom Copyright Bar */}
      <div className="border-t border-slate-800/80 py-4 px-4 sm:px-8 text-slate-500 text-[11px]">
        <div className="w-full max-w-[1800px] 2xl:max-w-[2000px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} NewVacancyAlert.in. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/privacy-policy" className="hover:text-slate-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-300">About</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
            <span>•</span>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1">
              <Rss className="w-3 h-3 text-amber-500 inline" /> RSS Feed
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

