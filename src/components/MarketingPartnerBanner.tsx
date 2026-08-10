import React from 'react';
import { Link } from 'react-router';
import { Megaphone, ArrowRight } from 'lucide-react';

interface MarketingPartnerBannerProps {
  className?: string;
}

export default function MarketingPartnerBanner({ className = '' }: MarketingPartnerBannerProps) {
  return (
    <div 
      className={`w-full my-6 p-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 border border-blue-200/80 rounded-xl shadow-xs transition-all hover:border-blue-300 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3 text-slate-800 text-center sm:text-left">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shrink-0 shadow-xs">
            <Megaphone className="w-4 h-4" />
          </span>
          <p className="line-clamp-2 sm:line-clamp-1 font-medium text-slate-700">
            <span className="font-bold text-slate-900 mr-1.5">Cyber Cafés & Students:</span>
            Earn promotional rewards by displaying official government job QR posters in your area.
          </p>
        </div>
        
        <Link
          to="/marketing-partner"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-white border border-blue-300 rounded-lg shadow-2xs hover:bg-blue-50 transition-all shrink-0 group whitespace-nowrap"
        >
          <span>Join Marketing Partner</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
