import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdsterraBanner from '../components/AdsterraBanner';
import { ArrowLeft, Home } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isMarketingPartnerPage = location.pathname.startsWith('/marketing-partner');
  const isNotificationHome = location.pathname === '/rrb-technician-cen-02-2026';
  const isSubPage = location.pathname.startsWith('/rrb-technician-cen-02-2026/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-200 font-sans overflow-x-hidden">
      <Header />
      <div className="flex-1 flex flex-col">
        <Outlet />

        {/* Notification SubPage Navigation */}
        {isSubPage && (
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-4 border-t border-slate-200 mt-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Previous Page
              </button>
              
              <Link 
                to="/rrb-technician-cen-02-2026"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Home className="w-4 h-4" />
                Notification Home
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Global Adsterra Display Banner - Rendered across all pages */}
      <div className="w-full bg-slate-100/50 py-3 border-t border-slate-200">
        <AdsterraBanner />
      </div>

      <Footer />
    </div>
  );
}

