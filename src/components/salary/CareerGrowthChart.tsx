import React, { useState } from 'react';
import { TrendingUp, ShieldAlert, Award, Landmark, PieChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CareerGrowthChartProps {
  initialBasic: number;
  initialGross: number;
}

export default function CareerGrowthChart({ initialBasic, initialGross }: CareerGrowthChartProps) {
  const [serviceYears, setServiceYears] = useState<number>(25);

  // Generate 30-year projection data
  const projectionData = React.useMemo(() => {
    const data = [];
    let currentBasic = initialBasic;
    let npsCorpus = 0;
    const returnRate = 0.10; // 10% CAGR for NPS E/C/G mix

    for (let year = 1; year <= serviceYears; year++) {
      // Annual increment = ~3% on Basic
      if (year > 1) {
        currentBasic = Math.round(currentBasic * 1.03);
      }

      // Projected DA grows roughly 6% per year (3% every 6 months)
      const projectedDaPct = Math.round(50 + (year - 1) * 6);
      const daAmt = Math.round(currentBasic * (projectedDaPct / 100));
      const hraAmt = Math.round(currentBasic * 0.30); // X-City HRA
      const gross = currentBasic + daAmt + hraAmt + 5400; // estimated TA

      // Monthly NPS = 10% Employee + 14% Employer = 24% of (Basic + DA)
      const monthlyNpsContribution = (currentBasic + daAmt) * 0.24;
      const annualNpsContribution = monthlyNpsContribution * 12;

      // Compound corpus
      npsCorpus = Math.round((npsCorpus + annualNpsContribution) * (1 + returnRate));

      data.push({
        year: `Year ${year}`,
        basic: currentBasic,
        gross: gross,
        npsCorpus: Math.round(npsCorpus / 100000), // in Lakhs
      });
    }

    return data;
  }, [initialBasic, serviceYears]);

  const finalYearData = projectionData[projectionData.length - 1] || { basic: initialBasic, gross: initialGross, npsCorpus: 0 };
  const estimatedMonthlyPension = Math.round((finalYearData.basic * 1.0) * 0.50); // ~50% of last drawn basic under UPS/OPS standards

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Long-Term Career Simulator
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            30-Year Salary Growth, NPS Corpus & Pension Estimator
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Simulate 3% annual increments, compounded NPS growth (10% employee + 14% Govt), and estimated retirement pension.
          </p>
        </div>
      </div>

      {/* Slider for Years of Service */}
      <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <div className="flex justify-between items-center text-sm font-bold text-slate-800">
          <span>Service Length (Years):</span>
          <span className="text-blue-600 font-black text-base">{serviceYears} Years</span>
        </div>
        <input
          type="range"
          min="5"
          max="35"
          step="1"
          value={serviceYears}
          onChange={(e) => setServiceYears(Number(e.target.value))}
          className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-400">
          <span>5 Years</span>
          <span>20 Years</span>
          <span>35 Years (Retirement)</span>
        </div>
      </div>

      {/* Summary Highlight Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
            PROJECTED LAST DRAWN BASIC
          </span>
          <div className="text-2xl font-black mt-1 text-white">
            ₹{finalYearData.basic.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">At Year {serviceYears}</span>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-black tracking-widest text-blue-200 block">
            ESTIMATED NPS RETIREMENT CORPUS
          </span>
          <div className="text-2xl font-black mt-1 text-white">
            ₹{(finalYearData.npsCorpus).toFixed(1)} Lakhs
          </div>
          <span className="text-[11px] text-blue-100 mt-1 block">Accumulated @ 10% CAGR</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-200 block">
            EST. MONTHLY PENSION
          </span>
          <div className="text-2xl font-black mt-1 text-white">
            ₹{estimatedMonthlyPension.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-100 mt-1 block">~50% of Last Basic Pay</span>
        </div>
      </div>

      {/* Interactive Growth Area Chart */}
      <div className="pt-2">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
          Projected Monthly Gross Salary Trajectory (₹)
        </h4>
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grossColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fontWeight: 'bold' }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Monthly Gross Pay']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="gross" stroke="#1d4ed8" strokeWidth={3} fillOpacity={1} fill="url(#grossColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
