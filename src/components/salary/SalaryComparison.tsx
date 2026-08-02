import React, { useState } from 'react';
import { Columns3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PAY_MATRIX, PAY_LEVEL_INFO, CITY_TYPES, POPULAR_JOB_COMPARISONS } from '../../data/salaryData';

export default function SalaryComparison() {
  const [levelA, setLevelA] = useState<number>(4);
  const [cityA, setCityA] = useState<'X' | 'Y' | 'Z'>('Y');

  const [levelB, setLevelB] = useState<number>(6);
  const [cityB, setCityB] = useState<'X' | 'Y' | 'Z'>('X');

  const daPct = 50; // Current DA

  // Calculation for Job A
  const basicA = PAY_MATRIX[levelA]?.[0] || 25500;
  const daA = Math.round(basicA * (daPct / 100));
  const hraA = Math.round(basicA * CITY_TYPES[cityA].hraRate);
  let baseTaA = 1800;
  if (levelA >= 9) baseTaA = CITY_TYPES[cityA].higherTaRate;
  else if (levelA >= 3) baseTaA = CITY_TYPES[cityA].midTaRate;
  else baseTaA = CITY_TYPES[cityA].lowerTaRate;
  const taA = baseTaA + Math.round(baseTaA * (daPct / 100));
  const grossA = basicA + daA + hraA + taA;
  const npsA = Math.round((basicA + daA) * 0.10);
  const netA = grossA - npsA;

  // Calculation for Job B
  const basicB = PAY_MATRIX[levelB]?.[0] || 35400;
  const daB = Math.round(basicB * (daPct / 100));
  const hraB = Math.round(basicB * CITY_TYPES[cityB].hraRate);
  let baseTaB = 1800;
  if (levelB >= 9) baseTaB = CITY_TYPES[cityB].higherTaRate;
  else if (levelB >= 3) baseTaB = CITY_TYPES[cityB].midTaRate;
  else baseTaB = CITY_TYPES[cityB].lowerTaRate;
  const taB = baseTaB + Math.round(baseTaB * (daPct / 100));
  const grossB = basicB + daB + hraB + taB;
  const npsB = Math.round((basicB + daB) * 0.10);
  const netB = grossB - npsB;

  const diffNet = Math.abs(netB - netA);
  const higherJob = netB >= netA ? 'Job B' : 'Job A';

  const applyPreset = (preset: typeof POPULAR_JOB_COMPARISONS[0]) => {
    setLevelA(preset.jobA.level);
    setCityA(preset.jobA.city);
    setLevelB(preset.jobB.level);
    setCityB(preset.jobB.city);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <Columns3 className="w-3.5 h-3.5 text-indigo-600" /> Side-by-Side Comparison
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Compare Two Pay Levels or Cities Side-by-Side
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Compare gross pay, allowances, and net in-hand salary between two different government posts or locations.
          </p>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div>
        <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">
          POPULAR COMPARISONS:
        </span>
        <div className="flex flex-wrap gap-2">
          {POPULAR_JOB_COMPARISONS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Job A */}
        <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">JOB A</span>
            <span className="text-xs font-bold text-blue-600">Entry Basic: ₹{basicA.toLocaleString('en-IN')}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pay Level</label>
              <select
                value={levelA}
                onChange={(e) => setLevelA(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-900 outline-none"
              >
                {Array.from({ length: 18 }, (_, i) => i + 1).map((lvl) => (
                  <option key={lvl} value={lvl}>Level {lvl} ({PAY_LEVEL_INFO[lvl]?.defaultTitle})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">City Class</label>
              <select
                value={cityA}
                onChange={(e) => setCityA(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-900 outline-none"
              >
                <option value="X">Class X (30% HRA)</option>
                <option value="Y">Class Y (20% HRA)</option>
                <option value="Z">Class Z (10% HRA)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-200">
            <div className="flex justify-between"><span>Basic Pay:</span> <span className="font-bold">₹{basicA.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>DA (50%):</span> <span className="font-bold">₹{daA.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>HRA ({cityA}):</span> <span className="font-bold">₹{hraA.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>TA + DA:</span> <span className="font-bold">₹{taA.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200"><span>Gross Salary:</span> <span>₹{grossA.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between font-black text-emerald-700 text-sm pt-1"><span>Net In-Hand:</span> <span>₹{netA.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Job B */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 border-2 border-indigo-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">JOB B</span>
            <span className="text-xs font-bold text-indigo-700">Entry Basic: ₹{basicB.toLocaleString('en-IN')}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pay Level</label>
              <select
                value={levelB}
                onChange={(e) => setLevelB(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-900 outline-none"
              >
                {Array.from({ length: 18 }, (_, i) => i + 1).map((lvl) => (
                  <option key={lvl} value={lvl}>Level {lvl} ({PAY_LEVEL_INFO[lvl]?.defaultTitle})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">City Class</label>
              <select
                value={cityB}
                onChange={(e) => setCityB(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-900 outline-none"
              >
                <option value="X">Class X (30% HRA)</option>
                <option value="Y">Class Y (20% HRA)</option>
                <option value="Z">Class Z (10% HRA)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-indigo-200">
            <div className="flex justify-between"><span>Basic Pay:</span> <span className="font-bold">₹{basicB.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>DA (50%):</span> <span className="font-bold">₹{daB.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>HRA ({cityB}):</span> <span className="font-bold">₹{hraB.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>TA + DA:</span> <span className="font-bold">₹{taB.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-indigo-200"><span>Gross Salary:</span> <span>₹{grossB.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between font-black text-indigo-900 text-sm pt-1"><span>Net In-Hand:</span> <span>₹{netB.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

      </div>

      {/* Difference Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong>{higherJob}</strong> yields <strong className="text-amber-300">₹{diffNet.toLocaleString('en-IN')} / month</strong> higher net in-hand salary (₹{(diffNet * 12).toLocaleString('en-IN')} / year).
          </span>
        </div>
      </div>
    </div>
  );
}
