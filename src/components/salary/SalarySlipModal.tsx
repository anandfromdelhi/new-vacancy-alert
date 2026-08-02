import React from 'react';
import { X, Printer, Download, Share2, ShieldCheck, Landmark, CheckCircle2 } from 'lucide-react';

interface SalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    departmentName: string;
    payLevel: number;
    basicPay: number;
    daAmount: number;
    daPercentage: number;
    hraAmount: number;
    cityType: 'X' | 'Y' | 'Z';
    taAmount: number;
    grossSalary: number;
    npsDeduction: number;
    cghsDeduction: number;
    incomeTax: number;
    totalDeductions: number;
    netSalary: number;
    employerNps: number;
    ctc: number;
  };
}

export default function SalarySlipModal({ isOpen, onClose, data }: SalarySlipModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Government Salary Slip - Level ${data.payLevel}`,
        text: `Check out my Government Salary Breakdown: Gross ₹${data.grossSalary.toLocaleString('en-IN')}, In-Hand ₹${data.netSalary.toLocaleString('en-IN')}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Salary Calculator Link copied to clipboard!');
    }
  };

  const numberToWords = (num: number): string => {
    // Basic Converter for Indian Rupees
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero Rupees Only';

    function convertLessThanThousand(n: number): string {
      if (n === 0) return '';
      if (n < 20) return units[n];
      const digit = n % 10;
      return tens[Math.floor(n / 10)] + (digit ? ' ' + units[digit] : '');
    }

    let result = '';
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;

    if (lakh > 0) {
      result += convertLessThanThousand(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
      result += convertLessThanThousand(thousand) + ' Thousand ';
    }
    if (num > 0) {
      if (num >= 100) {
        result += units[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      if (num > 0) {
        result += convertLessThanThousand(num) + ' ';
      }
    }

    return result.trim() + ' Rupees Only';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto relative print:shadow-none print:border-none print:max-w-none print:w-full print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-sm sm:text-base text-white">
              Official Salary Slip Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Salary Slip Content */}
        <div className="p-6 sm:p-8 space-y-6 bg-white text-slate-900 font-sans print:p-0">
          
          {/* Slip Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <div className="inline-block bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded">
              GOVERNMENT OF INDIA
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              {data.departmentName}
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase">
              STATEMENT OF MONTHLY SALARY / EMOLUMENTS (7TH CPC)
            </p>
          </div>

          {/* Employee Meta Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Pay Level</span>
              <span className="font-black text-slate-900">Level {data.payLevel}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Posting Station</span>
              <span className="font-black text-slate-900">Class {data.cityType} City ({data.cityType === 'X' ? 'Metro' : data.cityType === 'Y' ? 'Tier-2' : 'Tier-3'})</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Current DA Rate</span>
              <span className="font-black text-emerald-700">{data.daPercentage}% of Basic</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Pay Commission</span>
              <span className="font-black text-blue-700">7th CPC Matrix</span>
            </div>
          </div>

          {/* Table Breakdown (Earnings vs Deductions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Earnings Column */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-slate-900 text-white font-black text-xs uppercase px-4 py-2.5 flex justify-between">
                <span>EARNINGS (ALLOWANCES)</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1.5 font-medium">
                  <span className="text-slate-700">Basic Pay</span>
                  <span className="font-bold text-slate-900">₹{data.basicPay.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 font-medium">
                  <span className="text-slate-700">Dearness Allowance (DA @ {data.daPercentage}%)</span>
                  <span className="font-bold text-slate-900">₹{data.daAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 font-medium">
                  <span className="text-slate-700">House Rent Allowance (HRA)</span>
                  <span className="font-bold text-slate-900">₹{data.hraAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 font-medium">
                  <span className="text-slate-700">Transport Allowance (TA + DA on TA)</span>
                  <span className="font-bold text-slate-900">₹{data.taAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-blue-900 pt-2 border-t border-slate-300">
                  <span>TOTAL GROSS EMOLUMENTS</span>
                  <span>₹{data.grossSalary.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-rose-950 text-white font-black text-xs uppercase px-4 py-2.5 flex justify-between">
                <span>DEDUCTIONS (MONTHLY)</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                {data.npsDeduction > 0 && (
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 font-medium">
                    <span className="text-slate-700">NPS Employee Contribution (10%)</span>
                    <span className="font-bold text-rose-700">-₹{data.npsDeduction.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {data.cghsDeduction > 0 && (
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 font-medium">
                    <span className="text-slate-700">CGHS Medical Health Scheme</span>
                    <span className="font-bold text-rose-700">-₹{data.cghsDeduction.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {data.incomeTax > 0 && (
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 font-medium">
                    <span className="text-slate-700">Income Tax (TDS Estimate)</span>
                    <span className="font-bold text-rose-700">-₹{data.incomeTax.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-rose-900 pt-2 border-t border-slate-300">
                  <span>TOTAL MONTHLY DEDUCTIONS</span>
                  <span>-₹{data.totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Take Home Salary Highlight Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-xs uppercase font-black tracking-wider text-emerald-200 block">
                NET IN-HAND TAKE-HOME SALARY (CREDITED TO BANK)
              </span>
              <p className="text-xs text-emerald-100 font-semibold mt-0.5">
                {numberToWords(data.netSalary)}
              </p>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white shrink-0">
              ₹{data.netSalary.toLocaleString('en-IN')} <span className="text-xs text-emerald-200 font-normal">/ month</span>
            </div>
          </div>

          {/* Government / Employer Contribution Extra Note */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Government NPS Contribution (Employer 14%): ₹{data.employerNps.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-slate-500 font-medium pl-6">
              Total Cost to Company (CTC) = Gross Salary + Govt NPS = ₹{data.ctc.toLocaleString('en-IN')} / month (₹{(data.ctc * 12).toLocaleString('en-IN')} / year).
            </p>
          </div>

          {/* Footer watermark */}
          <div className="pt-2 text-center text-[11px] text-slate-400 font-semibold border-t border-slate-200 flex items-center justify-between">
            <span>Generated via NewVacancyAlert.in - 7th Pay Commission Calculator</span>
            <span>Verified Rules: CCS (Revised Pay) Rules 2016</span>
          </div>

        </div>
      </div>
    </div>
  );
}
