import React from 'react';
import { Calculator, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { calculateNewTaxRegime, calculateOldTaxRegime } from '../../data/salaryData';

interface TaxRegimeComparisonProps {
  monthlyGross: number;
  monthlyHra: number;
}

export default function TaxRegimeComparison({ monthlyGross, monthlyHra }: TaxRegimeComparisonProps) {
  const annualGross = monthlyGross * 12;
  const annualHra = monthlyHra * 12;

  const newTax = calculateNewTaxRegime(annualGross);
  const oldTax = calculateOldTaxRegime(annualGross, annualHra);

  const taxSavings = Math.abs(oldTax.annualTax - newTax.annualTax);
  const recommendedRegime = newTax.annualTax <= oldTax.annualTax ? 'New Tax Regime' : 'Old Tax Regime';

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-teal-600" /> Income Tax Estimator
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            New Tax Regime vs Old Tax Regime Comparison
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Calculated for Annual Gross Income of <strong className="text-slate-900">₹{annualGross.toLocaleString('en-IN')}</strong>.
          </p>
        </div>
      </div>

      {/* Recommended Winner Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">
              RECOMMENDED REGIME
            </span>
            <p className="text-sm font-bold text-white">
              Choose <strong className="text-amber-300 font-black">{recommendedRegime}</strong> to save approximately <strong className="text-amber-300 font-black">₹{taxSavings.toLocaleString('en-IN')} / year</strong> in tax!
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* New Tax Regime Card */}
        <div className={`p-5 rounded-2xl border-2 space-y-3 ${
          recommendedRegime === 'New Tax Regime' ? 'bg-emerald-50/70 border-emerald-300 shadow-sm' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
              NEW REGIME (FY 2024-25/25-26)
            </span>
            {recommendedRegime === 'New Tax Regime' && (
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Best Choice
              </span>
            )}
          </div>

          <div>
            <span className="text-xs text-slate-500 font-bold block">Annual Tax Liability</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{newTax.annualTax.toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500">(₹{newTax.monthlyTax}/mo)</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-medium text-slate-700 pt-2 border-t border-slate-200">
            <div className="flex justify-between"><span>Annual Gross Pay:</span> <span className="font-bold">₹{annualGross.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Standard Deduction:</span> <span className="font-bold text-emerald-700">-₹75,000</span></div>
            <div className="flex justify-between"><span>Taxable Base:</span> <span className="font-bold">₹{Math.max(0, annualGross - 75000).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Effective Tax Rate:</span> <span className="font-bold text-slate-900">{newTax.effectiveRate}%</span></div>
          </div>
        </div>

        {/* Old Tax Regime Card */}
        <div className={`p-5 rounded-2xl border-2 space-y-3 ${
          recommendedRegime === 'Old Tax Regime' ? 'bg-emerald-50/70 border-emerald-300 shadow-sm' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
              OLD REGIME (WITH DEDUCTIONS)
            </span>
            {recommendedRegime === 'Old Tax Regime' && (
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Best Choice
              </span>
            )}
          </div>

          <div>
            <span className="text-xs text-slate-500 font-bold block">Annual Tax Liability</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{oldTax.annualTax.toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500">(₹{oldTax.monthlyTax}/mo)</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-medium text-slate-700 pt-2 border-t border-slate-200">
            <div className="flex justify-between"><span>Annual Gross Pay:</span> <span className="font-bold">₹{annualGross.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Deductions (Std + 80C + 80D + HRA):</span> <span className="font-bold text-emerald-700">-₹{(50000 + 150000 + 25000 + Math.min(annualHra, 150000)).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Effective Tax Rate:</span> <span className="font-bold text-slate-900">{oldTax.effectiveRate}%</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}
