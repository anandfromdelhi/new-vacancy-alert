import React, { useState } from 'react';
import { Table, Search, CheckCircle2, ChevronRight, Sparkles, HelpCircle } from 'lucide-react';
import { PAY_MATRIX, PAY_LEVEL_INFO } from '../../data/salaryData';

interface PayMatrixExplorerProps {
  currentLevel: number;
  currentBasic: number;
  onSelectCell: (level: number, basic: number) => void;
}

export default function PayMatrixExplorer({
  currentLevel,
  currentBasic,
  onSelectCell
}: PayMatrixExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');

  const levels = Array.from({ length: 18 }, (_, i) => i + 1);

  const isMatchingSearch = (basic: number, level: number) => {
    if (!searchTerm) return true;
    const term = searchTerm.trim().toLowerCase();
    return basic.toString().includes(term) || level.toString() === term || `level ${level}`.includes(term);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Official 7th CPC Matrix
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Interactive 7th CPC Pay Matrix Explorer
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Click any cell in the pay matrix to instantly update your salary calculation.
          </p>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search basic pay (e.g. 35400)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none w-48 sm:w-56"
            />
          </div>

          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Levels (1 to 18)</option>
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>Level {lvl} ({PAY_LEVEL_INFO[lvl]?.defaultTitle})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pay Matrix Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/50 max-h-[500px] overflow-y-auto relative">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="sticky top-0 z-20 bg-slate-900 text-white text-xs uppercase font-black tracking-wider shadow-md">
            <tr>
              <th className="p-3 border-b border-slate-800 text-center bg-slate-900 sticky left-0 z-30 min-w-[70px]">
                Cell
              </th>
              {levels
                .filter((lvl) => selectedLevelFilter === 'all' || selectedLevelFilter === lvl)
                .map((lvl) => (
                  <th
                    key={lvl}
                    className={`p-3 text-center border-b border-slate-800 border-l border-slate-800/60 min-w-[100px] cursor-pointer transition-colors ${
                      currentLevel === lvl ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-800'
                    }`}
                    onClick={() => onSelectCell(lvl, PAY_MATRIX[lvl][0])}
                  >
                    <div>Level {lvl}</div>
                    <div className="text-[10px] text-blue-200 font-normal">GP ₹{PAY_LEVEL_INFO[lvl]?.gradePay || 0}</div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="text-xs font-bold divide-y divide-slate-200 bg-white">
            {Array.from({ length: 40 }).map((_, cellIdx) => {
              const cellNum = cellIdx + 1;
              return (
                <tr key={cellIdx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2.5 text-center bg-slate-100 text-slate-700 font-black border-r border-slate-200 sticky left-0 z-10 shadow-xs">
                    Cell {cellNum}
                  </td>
                  {levels
                    .filter((lvl) => selectedLevelFilter === 'all' || selectedLevelFilter === lvl)
                    .map((lvl) => {
                      const cells = PAY_MATRIX[lvl] || [];
                      const basic = cells[cellIdx];
                      if (!basic) {
                        return (
                          <td key={lvl} className="p-2.5 text-center text-slate-300 border-l border-slate-100">
                            -
                          </td>
                        );
                      }

                      const isSelected = currentLevel === lvl && currentBasic === basic;
                      const isMatching = isMatchingSearch(basic, lvl);

                      return (
                        <td
                          key={lvl}
                          onClick={() => onSelectCell(lvl, basic)}
                          className={`p-2.5 text-center border-l border-slate-200/80 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white font-black ring-2 ring-blue-500 scale-105 shadow-md rounded-lg z-10'
                              : isMatching && searchTerm
                              ? 'bg-amber-100 text-amber-900 font-black ring-1 ring-amber-400'
                              : 'hover:bg-blue-50 text-slate-800 hover:text-blue-700'
                          }`}
                          title={`Level ${lvl}, Cell ${cellNum}: ₹${basic.toLocaleString('en-IN')}`}
                        >
                          <div className="text-xs">₹{basic.toLocaleString('en-IN')}</div>
                          {isSelected && (
                            <div className="text-[9px] uppercase font-black text-amber-300 mt-0.5 flex items-center justify-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Selected
                            </div>
                          )}
                        </td>
                      );
                    })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Note: Annual increment moves your salary down by 1 Cell every year on July 1st or January 1st.</span>
        </div>
        <div className="text-blue-600 font-black">
          Currently Selected: Level {currentLevel} (Cell { (PAY_MATRIX[currentLevel]?.indexOf(currentBasic) || 0) + 1 }) = ₹{currentBasic.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
}
