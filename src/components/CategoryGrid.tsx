import React from 'react';
import { FileText, CalendarClock, Trophy, BadgeCheck, FileKey, BookOpen, Landmark, Briefcase, Train, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';

const categories = [
  { name: 'Latest Jobs', icon: FileText, count: '128 New' },
  { name: 'Upcoming', icon: CalendarClock, count: '45 Items' },
  { name: 'Results', icon: Trophy, count: 'Latest Out' },
  { name: 'Admit Cards', icon: BadgeCheck, count: 'Available' },
  { name: 'Answer Keys', icon: FileKey, count: '21 Active' },
  { name: 'Syllabus', icon: BookOpen, count: 'PDF Docs' },
  { name: 'Schemes', icon: Landmark, count: 'Govt Care' },
  { name: 'Banking', icon: Building2, count: 'IBPS/SBI' },
  { name: 'Railway', icon: Train, count: 'RRB NTPC' },
  { name: 'SSC Jobs', icon: ShieldCheck, count: 'CGL/CHSL' },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {categories.map((cat) => (
        <div key={cat.name} className="bg-white border border-[var(--border)] p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer transition-all hover:border-[#1e40af] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="w-7 h-7 bg-[#eff6ff] rounded-md text-[#1e40af] flex items-center justify-center shrink-0">
            <cat.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-[600] text-[var(--foreground)] truncate">{cat.name}</div>
            <div className="text-[9px] text-[#94a3b8] truncate">{cat.count}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
