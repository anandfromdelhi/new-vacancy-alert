import React from 'react';
import { MapPin, Building2, Trees, Building } from 'lucide-react';
import { CITY_TYPES } from '../../data/salaryData';

interface CityComparisonCardProps {
  basicPay: number;
  payLevel: number;
  daPercentage: number;
}

export default function CityComparisonCard({
  basicPay,
  payLevel,
  daPercentage
}: CityComparisonCardProps) {
  const cityKeys: Array<'X' | 'Y' | 'Z'> = ['X', 'Y', 'Z'];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-600" /> City Allowance Matrix
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Class X vs Y vs Z City Salary Comparison
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            See how your House Rent Allowance (HRA) and Transport Allowance (TA) change based on posting location.
          </p>
        </div>
      </div>

      {/* 3 City Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cityKeys.map((type) => {
          const cityInfo = CITY_TYPES[type];
          const daAmt = Math.round(basicPay * (daPercentage / 100));
          const hraAmt = Math.round(basicPay * cityInfo.hraRate);

          let baseTa = 1800;
          if (payLevel >= 9) baseTa = cityInfo.higherTaRate;
          else if (payLevel >= 3) baseTa = cityInfo.midTaRate;
          else baseTa = cityInfo.lowerTaRate;

          const taAmt = baseTa + Math.round(baseTa * (daPercentage / 100));
          const gross = basicPay + daAmt + hraAmt + taAmt;
          const nps = Math.round((basicPay + daAmt) * 0.10);
          const net = gross - nps;

          return (
            <div
              key={type}
              className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
                type === 'X'
                  ? 'bg-blue-50/50 border-blue-200'
                  : type === 'Y'
                  ? 'bg-purple-50/50 border-purple-200'
                  : 'bg-emerald-50/50 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded text-white ${
                  type === 'X' ? 'bg-blue-600' : type === 'Y' ? 'bg-purple-600' : 'bg-emerald-600'
                }`}>
                  CLASS {type} CITIES
                </span>
                <span className="text-xs font-bold text-slate-600">
                  HRA: {(cityInfo.hraRate * 100)}%
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block">Net In-Hand Salary</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  ₹{net.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-medium text-slate-700 pt-2 border-t border-slate-200">
                <div className="flex justify-between"><span>Basic Pay:</span> <span className="font-bold">₹{basicPay.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>DA (50%):</span> <span className="font-bold">₹{daAmt.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>HRA Amount:</span> <span className="font-bold text-slate-900">₹{hraAmt.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>TA + DA:</span> <span className="font-bold text-slate-900">₹{taAmt.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200"><span>Gross Salary:</span> <span>₹{gross.toLocaleString('en-IN')}</span></div>
              </div>

              <div className="pt-2 text-[11px] font-semibold text-slate-500 border-t border-slate-200">
                <strong className="text-slate-700 block mb-1">Sample Postings:</strong>
                <p className="leading-snug">{cityInfo.examples.join(', ')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
