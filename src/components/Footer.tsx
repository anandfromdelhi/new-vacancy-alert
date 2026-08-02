import React from 'react';
import { Facebook, Instagram, BookOpen, Rss } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--border)] text-[11px] text-[#64748b] shrink-0 py-3.5 px-4 sm:px-8 2xl:px-12">
      <div className="w-full max-w-[1800px] 2xl:max-w-[2000px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>&copy; {new Date().getFullYear()} NewVacancyAlert.in - Modern Gov Jobs Portal</span>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Follow Us:</span>
              <a
                href="https://www.facebook.com/profile.php?id=61592714690988"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition border border-blue-100 font-bold text-[10px]"
                title="Facebook Page"
              >
                <Facebook className="w-3 h-3 fill-current" />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/newvacancyalert.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 hover:bg-pink-100 text-pink-700 transition border border-pink-100 font-bold text-[10px]"
                title="Instagram Profile"
              >
                <Instagram className="w-3 h-3" />
                <span>Instagram</span>
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 transition border border-amber-200 font-bold text-[10px]"
                title="RSS Feed XML for Jobs"
              >
                <Rss className="w-3 h-3 text-amber-600" />
                <span>RSS Feed</span>
              </a>
            </div>
            {/* Articles Link for Mobile View below Follow Us */}
            <div className="sm:hidden pt-0.5">
              <Link
                to="/articles"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-blue-950 border border-amber-300 shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-950 shrink-0" />
                <span>Articles & Exam Guides</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-slate-500 md:border-l md:border-slate-200 md:pl-3">
            <Link to="/about" className="cursor-pointer hover:text-[#1e40af]">About Us</Link>
            <Link to="/marketing-partner" className="cursor-pointer hover:text-[#1e40af]">Marketing Partner</Link>
            <Link to="/contact" className="cursor-pointer hover:text-[#1e40af]">Contact</Link>
            <Link to="/privacy-policy" className="cursor-pointer hover:text-[#1e40af]">Privacy Policy</Link>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#1e40af] flex items-center gap-0.5">
              <Rss className="w-3 h-3 text-amber-600 inline" /> RSS
            </a>
            <Link to="/admin" className="cursor-pointer hover:text-[#1e40af]">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

