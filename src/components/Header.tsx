import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { user, openLoginModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isArticlesActive = location.pathname.startsWith('/articles');

  return (
    <header className="bg-[#1e40af] text-white h-[56px] flex items-center border-b-[3px] border-[#16a34a] sticky top-0 z-50 shrink-0 shadow-md">
      <div className="w-full max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-4 sm:px-8 2xl:px-12 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Full Title */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <img 
            src="/logo.svg" 
            alt="NewVacancyAlert.in Logo" 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white object-contain p-0.5 shrink-0 shadow-sm group-hover:scale-105 transition-transform" 
          />
          <span className="text-sm min-[380px]:text-base sm:text-lg md:text-xl font-black tracking-tight uppercase whitespace-nowrap">
            NewVacancyAlert<span className="text-amber-300">.in</span>
          </span>
        </Link>

        {/* Right: Articles Nav Link & Google Auth Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Articles Link (Desktop only) */}
          <Link
            to="/articles"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 border shrink-0 ${
              isArticlesActive
                ? 'bg-amber-400 text-blue-950 border-amber-300 shadow-sm'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40'
            }`}
            title="Read Articles & News"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-[11px] sm:text-xs">Articles</span>
          </Link>

          {/* Google Auth Button / User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-blue-900/80 hover:bg-blue-900 text-white border border-blue-400/40 cursor-pointer transition-all"
                title={user.displayName || user.email || "Account"}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-amber-400"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[11px] font-bold max-w-[80px] sm:max-w-[120px] truncate hidden min-[400px]:inline">
                  {user.displayName?.split(' ')[0] || 'User'}
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {user.displayName || "Google User"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openLoginModal()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 bg-white hover:bg-slate-100 text-blue-950 border border-slate-200 shadow-sm cursor-pointer shrink-0"
              title="Sign in with Google"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-[11px] sm:text-xs">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}






