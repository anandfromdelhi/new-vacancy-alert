import React from 'react';

const placeholderUpdates = [
  { id: 1, title: 'SSC CGL Tier II Result 2026 Out', department: 'Staff Selection Commission', date: 'Oct 24', color: 'border-accent' },
  { id: 2, title: 'IBPS Clerk Prelims Admit Card', department: 'Banking Selection', date: 'Oct 22', color: 'border-primary' },
  { id: 3, title: 'RRB Technician Phase III List', department: 'Railway Recruitment', date: 'Oct 20', color: 'border-slate-300' },
];

export default function LatestUpdates() {
  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 flex flex-col min-h-[200px]">
      <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest mb-3 shrink-0">
        Latest Updates
      </h3>
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {placeholderUpdates.map((update) => (
          <div key={update.id} className={`border-l-4 ${
            update.color === 'border-accent' ? 'border-[#16a34a]' : 
            update.color === 'border-primary' ? 'border-[#1e40af]' : 
            'border-slate-300'
          } pl-3 py-1`}>
            <div className="text-[11px] font-bold text-[var(--foreground)]">{update.title}</div>
            <div className="text-[9px] text-slate-500">Dept: {update.department} • {update.date}</div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200 hover:bg-slate-100 transition-colors shrink-0">
        VIEW ALL UPDATES
      </button>
    </div>
  );
}
