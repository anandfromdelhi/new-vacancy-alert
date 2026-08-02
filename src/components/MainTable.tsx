import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { EXAM_DATA } from '../data';
import { ExamData } from '../types';

type SortConfig = { key: keyof ExamData | null; direction: 'asc' | 'desc' };

export default function MainTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof ExamData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...EXAM_DATA];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  const getSortIcon = (columnName: keyof ExamData) => {
    if (sortConfig.key !== columnName) {
      return <div className="flex flex-col ml-1 opacity-30"><ChevronUp className="h-3 w-3 -mb-1"/><ChevronDown className="h-3 w-3"/></div>;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1 text-[#1e40af]" /> 
      : <ChevronDown className="h-4 w-4 ml-1 text-[#1e40af]" />;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm mb-8">
      <div className="px-4 py-3 border-b border-slate-200 bg-[#f1f5f9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <h2 className="text-[14px] font-[700] text-[#1e40af] m-0">
          Upcoming Major Government Exams & Notifications
        </h2>
      </div>

      <div className="w-full bg-white flex-1">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-[12px] min-w-[600px]">
            <thead className="bg-[#f8fafc] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-[600] text-[#64748b] cursor-pointer" onClick={() => handleSort('exam')}>
                  <div className="flex items-center">Exam {getSortIcon('exam')}</div>
                </th>
                <th className="py-3 px-4 font-[600] text-[#64748b] cursor-pointer w-[140px]" onClick={() => handleSort('conductingBody')}>
                  <div className="flex items-center">Body {getSortIcon('conductingBody')}</div>
                </th>
                <th className="py-3 px-4 font-[600] text-[#64748b] cursor-pointer w-[160px]" onClick={() => handleSort('approxApplicants')}>
                  <div className="flex items-center">Applicants {getSortIcon('approxApplicants')}</div>
                </th>
                <th className="py-3 px-4 font-[600] text-[#64748b] cursor-pointer w-[160px]" onClick={() => handleSort('expectedNotification')}>
                  <div className="flex items-center">Notification {getSortIcon('expectedNotification')}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                sortedData.map((item) => {
                  const isDate = item.expectedNotification !== 'Awaited';
                  return (
                    <tr key={item.id} className="hover:bg-[#f1f5f9] transition-colors border-b border-[#f1f5f9] even:bg-[#fafafa]">
                      <td className="py-3 px-4 font-medium text-slate-800">{item.exam}</td>
                      <td className="py-3 px-4 text-slate-800">{item.conductingBody}</td>
                      <td className="py-3 px-4 text-slate-800">{item.approxApplicants}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] py-1 px-2 rounded-md font-[600] uppercase ${isDate ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                          {item.expectedNotification}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col w-full divide-y divide-slate-100">
          {sortedData.length > 0 ? (
            sortedData.map((item) => {
              const isDate = item.expectedNotification !== 'Awaited';
              return (
                <div key={item.id} className="p-4 flex flex-col gap-2 hover:bg-slate-50 transition-colors">
                  <div className="font-bold text-slate-800 text-[14px] leading-tight">
                    {item.exam}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">Body:</span>
                      <span className="text-[12px] font-semibold text-slate-700">{item.conductingBody}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">Applicants:</span>
                      <span className="text-[12px] font-semibold text-slate-700">{item.approxApplicants}</span>
                    </div>
                  </div>
                  <div className="mt-1 flex justify-start">
                    <span className={`text-[10px] py-1 px-2 rounded-md font-[600] uppercase ${isDate ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                      {item.expectedNotification}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400">
              No records found.
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-2.5 text-[11px] bg-[#f8fafc] border-t border-slate-200 shrink-0 flex items-center justify-between">
        <span className="text-slate-500 italic">
          Last Updated: Automatically generated from admin data source
        </span>
        <span className="text-slate-600 font-medium">
          Total: {sortedData.length} records
        </span>
      </div>
    </div>
  );
}
