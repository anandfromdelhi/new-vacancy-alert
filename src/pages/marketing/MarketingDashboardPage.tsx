import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import QRCode from 'qrcode';
import { LogOut, Download, CheckCircle2, User, Phone, MapPin, Building2, Briefcase, Share2, Copy, Check, QrCode, MessageCircle, Link2, MousePointerClick, BarChart3, ShieldCheck } from 'lucide-react';

export default function MarketingDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Form State
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [occupation, setOccupation] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/marketing-partner');
        return;
      }
      setUser(currentUser);
      
      try {
        const docRef = doc(db, 'marketingPartners', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/marketing-partner');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }
    
    setSaving(true);
    try {
      const newProfile = {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        phone,
        state,
        district,
        occupation,
        registeredAt: serverTimestamp(),
        acceptedTerms: agreedTerms,
        acceptedMarketingConsent: agreedMarketing,
        totalClicks: 0
      };
      
      await setDoc(doc(db, 'marketingPartners', user.uid), newProfile);
      setProfile(newProfile);
      downloadPDF();
    } catch (error: any) {
      console.error("Error saving profile:", error);
      if (error?.code === 'permission-denied') {
        alert(`Firestore Permission Denied!\n\nYour Firestore database rules in Firebase project 'newvacancyalert' are blocking write access.\n\nTo fix this:\n1. Open Firebase Console (https://console.firebase.google.com)\n2. Select your project 'newvacancyalert'\n3. Go to Firestore Database -> Rules\n4. Update the rules to allow authenticated users to write:\n\nrules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if request.auth != null;\n    }\n  }\n}\n5. Click 'Publish' and try registering again.`);
      } else if (error?.code === 'not-found') {
        alert(`Firestore Database Not Found!\n\nPlease make sure Firestore Database is created in your Firebase project 'newvacancyalert'.\n\nTo fix this:\n1. Open Firebase Console (https://console.firebase.google.com)\n2. Select project 'newvacancyalert'\n3. Click 'Firestore Database' in the left menu and click 'Create database'.`);
      } else {
        alert(`Failed to register: ${error?.message || 'Unknown error'}\n\nPlease check your Firebase Console configuration.`);
      }
    } finally {
      setSaving(false);
    }
  };

  const generateQRCodeDataURL = async () => {
    try {
      const url = 'https://newvacancyalert.in/';
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      return qrDataUrl;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/newvacancyalert_poster.pdf';
    link.download = 'newvacancyalert_poster.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPNG = () => {
    const link = document.createElement('a');
    link.href = '/newvacancyalert_poster.png';
    link.download = 'newvacancyalert_poster.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const referralLink = user ? `${window.location.origin}/marketing-partner?ref=${user.uid}` : 'https://newvacancyalert.in/marketing-partner';

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (!referralLink) return;
    const shareData = {
      title: 'NewVacancyAlert Marketing Partner',
      text: 'Help students and job seekers discover latest Government Jobs through NewVacancyAlert! Join as a Marketing Partner:',
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Dashboard - Marketing Partner | NewVacancyAlert.in</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Marketing Partner Portal</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-bold text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {profile ? (
          // Success / Dashboard State
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Congratulations, {profile.name}!</h2>
                <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                  You are now registered as a NewVacancyAlert Marketing Partner. Use your partner options below to start promoting:
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Option 1: Poster & QR Code Download */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                        1
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Download Official A4 Poster</h3>
                        <p className="text-xs text-slate-500 font-medium">For Cyber Cafés, CSC Centres & Coaching Institutes</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-6 font-medium">
                      Get the official high-resolution A4 printable PDF poster or individual QR code to display at your shop or centre.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={downloadPDF}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base transition-colors shadow-sm"
                    >
                      <Download className="w-5 h-5" /> Download A4 Poster (PDF)
                    </button>
                    <button 
                      onClick={downloadPNG}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-sm transition-colors"
                    >
                      <Download className="w-4 h-4 text-slate-600" /> Download Poster Image (PNG)
                    </button>
                  </div>
                </div>

                {/* Option 2: Referral Link & Direct Share */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                        2
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Share Referral Link Directly</h3>
                        <p className="text-xs text-slate-500 font-medium">Share link directly with friends & partner centres</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 font-medium">
                      Send your unique referral link to direct users and partners straight to the Marketing Partner page:
                    </p>

                    {/* Link Display Box */}
                    <div className="relative mb-6">
                      <input 
                        type="text" 
                        readOnly 
                        value={referralLink}
                        className="w-full pl-3 pr-24 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 font-mono text-xs sm:text-sm select-all outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={handleNativeShare}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base transition-colors shadow-sm"
                    >
                      <Share2 className="w-5 h-5" /> Share Link
                    </button>
                    <a 
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi! Join the NewVacancyAlert Marketing Partner Programme to help students discover latest government jobs: ${referralLink}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-base transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Referral Traffic Review Banner */}
              <div className="mt-8 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Referral Traffic & Verification Status</h3>
                      <p className="text-xs text-blue-200">Official tracking for your partner referral link</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Traffic Reviewing
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                      <ShieldCheck className="w-4 h-4" /> Partner ID: <span className="font-mono text-white">{user?.uid || 'N/A'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      We are actively reviewing the traffic generated via your referral link. Once requirements are satisfied and verified, eligible promotional rewards will be updated.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Promotion Ideas</h3>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Print and paste the A4 poster outside your Cyber Café or shop.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Refer friends who own local businesses, Cyber Cafés, and Coaching Centres.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Display on notice boards in local colleges and libraries.</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Your Profile</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Name:</span>
                    <span className="font-bold text-slate-900">{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-bold text-slate-900">{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Occupation:</span>
                    <span className="font-bold text-slate-900">{profile.occupation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-bold text-slate-900">{profile.district}, {profile.state}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Homepage</Link>
            </div>
          </div>
        ) : (
          // Registration Form State
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Complete Your Registration</h2>
            <p className="text-slate-500 text-sm mb-8">Please provide a few more details to become a Marketing Partner.</p>
            
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={user.displayName || ''} 
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email || ''} 
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter mobile number"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Occupation *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select 
                      required
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="" disabled>Select your occupation</option>
                      <option value="Student">Student</option>
                      <option value="Cyber Café Owner">Cyber Café Owner</option>
                      <option value="CSC Operator">CSC Operator</option>
                      <option value="Coaching Institute">Coaching Institute</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">State *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Delhi, UP, Bihar"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">District / City *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Patna, Lucknow"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600 font-medium">
                    I have read and agree to the <Link to="/marketing-partner/terms" target="_blank" className="text-blue-600 font-bold hover:underline">Marketing Partner Programme Terms & Conditions</Link>. I understand that rewards are promotional incentives and are not guaranteed, and that NewVacancyAlert may modify or terminate this programme at any time.
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={agreedMarketing}
                    onChange={(e) => setAgreedMarketing(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600 font-medium">
                    I agree to receive programme updates, tips, and news.
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={saving || !agreedTerms}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black text-lg transition-colors mt-6 shadow-md"
              >
                {saving ? "Registering..." : "Register & Download QR Poster"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
