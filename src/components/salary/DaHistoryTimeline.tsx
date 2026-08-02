import React from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { DA_HISTORY } from '../../data/salaryData';

export default function DaHistoryTimeline() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" /> Historical DA Revisions
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dearness Allowance (DA) Hike History (2016 – 2026)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Official 7th CPC DA rates approved by Cabinet & Ministry of Finance, Department of Expenditure.
          </p>
        </div>
      </div>

      {/* Visual Progress Bar / Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DA_HISTORY.slice(-6).map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border transition-all ${
              item.rate >= 50
                ? 'bg-purple-50 border-purple-200 shadow-xs'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase text-slate-400 block">{item.date}</span>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-0.5">
              {item.rate}%
            </div>
            <span className="text-[10px] font-bold text-purple-700 mt-1 block truncate" title={item.remark}>
              {item.remark}
            </span>
          </div>
        ))}
      </div>

      {/* Complete Historical Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-900 text-white uppercase font-black tracking-wider text-[11px]">
            <tr>
              <th className="p-3">Revision Date</th>
              <th className="p-3">DA Rate (%)</th>
              <th className="p-3">Hike</th>
              <th className="p-3">Key Order / Landmark Milestone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-semibold bg-white text-slate-800">
            {DA_HISTORY.map((row, index) => {
              const prevRate = index > 0 ? DA_HISTORY[index - 1].rate : 0;
              const hike = row.rate - prevRate;
              const is50PercentMilestone = row.rate === 50;

              return (
                <tr
                  key={index}
                  className={`hover:bg-slate-50 transition-colors ${
                    is50PercentMilestone ? 'bg-purple-50/80 font-bold' : ''
                  }`}
                >
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{row.date}</span>
                  </td>
                  <td className="p-3 text-sm font-black text-purple-900">{row.rate}%</td>
                  <td className="p-3 text-emerald-700 font-bold">
                    {index === 0 ? 'Base' : `+${hike}%`}
                  </td>
                  <td className="p-3 text-slate-600">
                    {row.remark}
                    {is50PercentMilestone && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] bg-purple-600 text-white font-black px-2 py-0.5 rounded-md">
                        <AlertCircle className="w-3 h-3" /> HRA revised to 30%/20%/10%
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
