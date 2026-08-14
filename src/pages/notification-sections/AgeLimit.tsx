import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = ReactHelmetAsync;
import MarketingPartnerBanner from '../../components/MarketingPartnerBanner';

export default function AgeLimit() {
  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen pb-12">
      <Helmet>
        <title>Age Limit | RRB Technician CEN 02/2026</title>
        <meta name="description" content="Detailed information about Age Limit for RRB Technician Recruitment 2026." />
      </Helmet>
      
      <div className="w-full max-w-[1000px] mx-auto p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/rrb-technician-cen-02-2026" className="inline-flex items-center text-sm font-semibold text-blue-700 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Notification Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-blue-800 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-8xl">🚆</span>
            </div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Age Limit</h1>
              <p className="text-blue-200 text-sm font-medium">RRB Technician CEN 02/2026 Official Notification</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Introduction */}
            <div className="prose max-w-none text-slate-700">
              <p>This section provides comprehensive details regarding Age Limit as outlined in the official RRB Technician CEN 02/2026 notification.</p>
              
              <MarketingPartnerBanner className="my-6" />

              {/* Note to AI: Replace this section with detailed PDF content */}
              <div className="mt-8 p-6 bg-slate-100 rounded-lg border border-slate-200 text-center">
                <p className="text-slate-500 font-medium">Detailed content for this section is being populated from the official PDF...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}