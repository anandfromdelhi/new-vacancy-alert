import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, Award, Zap, CheckCircle2 } from 'lucide-react';
import { PAY_MATRIX, PAY_LEVEL_INFO, CITY_TYPES } from '../../data/salaryData';

interface PromotionSimulatorProps {
  currentLevel: number;
  currentBasic: number;
  cityType: 'X' | 'Y' | 'Z';
  daPercentage: number;
}

export default function PromotionSimulator({
  currentLevel,
  currentBasic,
  cityType,
  daPercentage
}: PromotionSimulatorProps) {
  const [promotedLevel, setPromotedLevel] = useState<number>(Math.min(18, currentLevel + 1));

  // Determine fixation cell in promoted level:
  // Step 1: Add one regular increment in current level
  const currentCellIndex = PAY_MATRIX[currentLevel]?.indexOf(currentBasic) ?? 0;
  const incrementedBasicInOldLevel = PAY_MATRIX[currentLevel]?.[currentCellIndex + 1] || currentBasic * 1.03;

  // Step 2: Find cell in promoted level equal to or higher than incrementedBasicInOldLevel
  const promotedCells = PAY_MATRIX[promotedLevel] || [currentBasic];
  const promotedBasic = promotedCells.find((cell) => cell >= incrementedBasicInOldLevel) || promotedCells[0];

  // Old Salary Calculations
  const oldDa = Math.round(currentBasic * (daPercentage / 100));
  const oldHra = Math.round(currentBasic * CITY_TYPES[cityType].hraRate);
  let oldBaseTa = 1800;
  if (currentLevel >= 9) oldBaseTa = CITY_TYPES[cityType].higherTaRate;
  else if (currentLevel >= 3) oldBaseTa = CITY_TYPES[cityType].midTaRate;
  else oldBaseTa = CITY_TYPES[cityType].lowerTaRate;
  const oldTa = oldBaseTa + Math.round(oldBaseTa * (daPercentage / 100));
  const oldGross = currentBasic + oldDa + oldHra + oldTa;
  const oldNps = Math.round((currentBasic + oldDa) * 0.10);
  const oldNet = oldGross - oldNps;

  // Promoted Salary Calculations
  const newDa = Math.round(promotedBasic * (daPercentage / 100));
  const newHra = Math.round(promotedBasic * CITY_TYPES[cityType].hraRate);
  let newBaseTa = 1800;
  if (promotedLevel >= 9) newBaseTa = CITY_TYPES[cityType].higherTaRate;
  else if (promotedLevel >= 3) newBaseTa = CITY_TYPES[cityType].midTaRate;
  else newBaseTa = CITY_TYPES[cityType].lowerTaRate;
  const newTa = newBaseTa + Math.round(newBaseTa * (daPercentage / 100));
  const newGross = promotedBasic + newDa + newHra + newTa;
  const newNps = Math.round((promotedBasic + newDa) * 0.10);
  const newNet = newGross - newNps;

  const monthlyIncrease = newNet - oldNet;
  const annualIncrease = monthlyIncrease * 12;
  const lifetimeIncrease = annualIncrease * 25; // 25 years career projection

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-600" /> Career Growth & Promotion Fixation
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Promotion Impact Simulator
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Calculates exact pay fixation under FR 22(I)(a)(1) rules upon promotion to higher Pay Level.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Promoted Level Selector */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Select Promoted Target Level
          </label>
          <select
            value={promotedLevel}
            onChange={(e) => setPromotedLevel(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-black text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {Array.from({ length: 18 }, (_, i) => i + 1)
              .filter((lvl) => lvl > currentLevel)
              .map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl} - {PAY_LEVEL_INFO[lvl]?.defaultTitle} (GP ₹{PAY_LEVEL_INFO[lvl]?.gradePay})
                </option>
              ))}
          </select>
          <p className="text-[11px] font-medium text-slate-500">
            Promoted Role: <strong className="text-slate-800">{PAY_LEVEL_INFO[promotedLevel]?.roles.join(', ')}</strong>
          </p>
        </div>

        {/* Live Gain Highlight Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-2xl shadow-md space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-200 block">
            PROMOTION PAY FIXATION RESULT
          </span>
          <div className="text-3xl font-black">
            +₹{monthlyIncrease.toLocaleString('en-IN')} <span className="text-xs font-normal text-emerald-100">/ month extra</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-500/40">
            <div>
              <span className="text-emerald-200 block text-[10px] font-bold">Annual Boost</span>
              <span className="font-black text-sm">+₹{annualIncrease.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-emerald-200 block text-[10px] font-bold">25-Yr Career Gain</span>
              <span className="font-black text-sm">+₹{lifetimeIncrease.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[10px] uppercase font-black text-slate-400">Current Position</span>
          <h4 className="text-base font-black text-slate-900">Level {currentLevel}</h4>
          <div className="space-y-1.5 text-slate-700 font-medium">
            <div className="flex justify-between"><span>Basic Pay:</span> <span className="font-bold text-slate-900">₹{currentBasic.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Gross Salary:</span> <span className="font-bold text-slate-900">₹{oldGross.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-emerald-700 font-bold"><span>In-Hand Net:</span> <span>₹{oldNet.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
          <span className="text-[10px] uppercase font-black text-emerald-600">Promoted Position</span>
          <h4 className="text-base font-black text-emerald-900">Level {promotedLevel}</h4>
          <div className="space-y-1.5 text-slate-700 font-medium">
            <div className="flex justify-between"><span>Fixed Basic Pay:</span> <span className="font-bold text-emerald-900">₹{promotedBasic.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Promoted Gross:</span> <span className="font-bold text-emerald-900">₹{newGross.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-emerald-800 font-black"><span>Promoted Net:</span> <span>₹{newNet.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
