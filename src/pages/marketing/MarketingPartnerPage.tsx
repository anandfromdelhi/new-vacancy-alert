import React, { useState, useEffect } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link, useNavigate } from 'react-router';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { 
  Megaphone, Download, Users, TrendingUp, CheckCircle2, 
  MapPin, Phone, Building2, BookOpen, GraduationCap, ChevronRight
} from 'lucide-react';

export default function MarketingPartnerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result on mount
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate('/marketing-partner/dashboard');
        }
      })
      .catch((error) => {
        console.error("Redirect auth error", error);
        alert(`Authentication failed: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/marketing-partner/dashboard');
    } catch (error: any) {
      console.error("Authentication failed", error);
      
      // If popup is blocked or fails due to cross-origin issues, fallback to redirect
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cross-origin-opener-policy-failed') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
           alert("Failed to initiate redirect login. Please try opening the app in a new tab.");
           setLoading(false);
        }
      } else if (error.code === 'auth/unauthorized-domain') {
        alert(`Domain Unauthorized in Firebase!\n\nThe current domain (${window.location.hostname}) is not added to Authorized Domains in your Firebase Console.\n\nTo fix this:\n1. Open Firebase Console (https://console.firebase.google.com)\n2. Open your project 'newvacancyalert'\n3. Go to Authentication -> Settings -> Authorized domains\n4. Click 'Add domain' and add:\n   - ${window.location.hostname}\n   - newvacancyalert.in (if applicable)`);
        setLoading(false);
      } else {
        alert(`Failed to login with Google: ${error.message}\n\nIf you are viewing this inside the editor, please open the app in a new tab using the 'Open in New Tab' button at the top right.`);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Become a Marketing Partner | NewVacancyAlert.in</title>
        <meta name="description" content="Join the NewVacancyAlert Marketing Partner Programme. Download official QR Code posters, help job seekers, and earn exciting promotional rewards." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-bold mb-6">
            <Megaphone className="w-4 h-4" /> Official Partner Programme 2026
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
            Become a NewVacancyAlert <span className="text-blue-400">Marketing Partner</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
            Help students and job seekers discover the latest Government Jobs through this exclusive offline promotion campaign, while becoming eligible for exciting promotional rewards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Please wait..." : "Register with Google"}
            </button>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              Learn More <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Why Join the Programme?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle2, title: "Free Registration", desc: "No hidden fees or charges ever." },
              { icon: Download, title: "Official Marketing Material", desc: "Access high-quality printable QR Code posters." },
              { icon: Users, title: "Help Students", desc: "Connect local students with real opportunities." },
              { icon: TrendingUp, title: "Earn Rewards", desc: "Eligible for promotional rewards post-verification." },
              { icon: MapPin, title: "Flexible Participation", desc: "Promote online or offline at your convenience." },
              { icon: Building2, title: "Great for Businesses", desc: "Perfect for Cyber Cafés and CSC Centres." },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">How It Works</h2>
          </div>
          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-100 -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {[
                { step: "1", title: "Register using Google", desc: "Quick and secure authentication." },
                { step: "2", title: "Complete your profile", desc: "Tell us a bit about yourself." },
                { step: "3", title: "Download official QR poster", desc: "Get your printable A4 PDF and PNG." },
                { step: "4", title: "Print it or share it", desc: "Display at your shop or share online." },
                { step: "5", title: "Become eligible for rewards", desc: "Subject to manual verification and terms." },
              ].map((item, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 w-full">
                    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'} text-center`}>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Step {item.step}: {item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 z-10 border-4 border-slate-50">
                    {item.step}
                  </div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Promotional Rewards</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Rewards are promotional incentives subject to manual review, verification, and company discretion.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-400" /> For Cyber Cafés
              </h3>
              <p className="text-blue-100 mb-6 font-medium">If you own or manage a Cyber Café, CSC Centre, Coaching Institute, Computer Centre, Library, or Student Help Centre, you may display the official poster.</p>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-sm text-blue-300 font-bold uppercase tracking-wider mb-2">Potential Reward</div>
                <div className="text-3xl font-black text-white mb-2">₹1000 <span className="text-lg text-slate-400 font-medium">/ month</span></div>
                <p className="text-sm text-slate-300">With minimum 100 unique visitors via QR code link, after satisfying requirements and verification.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-emerald-400" /> For Individuals
              </h3>
              <p className="text-emerald-100 mb-6 font-medium">Students and individuals may also participate in this offline campaign. If your friend owns a Cyber Café, Coaching Centre, or Library, you can refer them to print and paste the poster.</p>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-sm text-emerald-300 font-bold uppercase tracking-wider mb-2">Potential Reward</div>
                <div className="text-3xl font-black text-white mb-2">₹500 <span className="text-lg text-slate-400 font-medium">/ approved referral</span></div>
                <p className="text-sm text-slate-300">Maximum: 3 approved referrals per calendar month. Subject to strict manual verification.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/marketing-partner/terms" className="text-blue-600 hover:underline font-bold">
              Read the complete Terms & Conditions
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 border-t border-blue-100 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Ready to get started?</h2>
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg transition-colors shadow-lg"
        >
          {loading ? "Loading..." : "Register Now with Google"}
        </button>
      </section>
    </div>
  );
}
