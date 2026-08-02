import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Home } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isNotificationHome = location.pathname === '/rrb-technician-cen-02-2026';
  const isSubPage = location.pathname.startsWith('/rrb-technician-cen-02-2026/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-200 font-sans overflow-x-hidden">
      <Header />
      <div className="flex-1 flex flex-col">
        <Outlet />
        
        {/* Back Navigation Footer */}
        {!isHome && (
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 border-t border-slate-200 mt-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Previous Page
              </button>
              
              {isSubPage && (
                <Link 
                  to="/rrb-technician-cen-02-2026"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Home className="w-4 h-4" />
                  Notification Home
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
