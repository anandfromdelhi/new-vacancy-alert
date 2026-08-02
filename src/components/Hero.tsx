import React from 'react';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="h-[120px] bg-white border-b border-[var(--border)] flex flex-col justify-center text-center shrink-0">
      <div className="w-full max-w-[1000px] mx-auto px-4">
        <h1 className="text-[#1e40af] text-[32px] font-[800] tracking-[-0.025em] m-0 leading-tight">
          NewVacancyAlert.in
        </h1>
        <p className="text-[14px] opacity-70 mt-1 mb-3 text-[var(--foreground)]">
          Latest Government Job Notifications, Upcoming Vacancies, Results and Admit Cards
        </p>
        
        <div className="relative w-full max-w-[500px] mx-auto">
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search Jobs, Exams, Departments..." 
            className="w-full py-2 px-4 pl-10 rounded-lg border border-[var(--border)] text-[14px] bg-[var(--background)] focus:outline-none focus:border-[#1e40af] text-[var(--foreground)]"
          />
        </div>
      </div>
    </div>
  );
}
