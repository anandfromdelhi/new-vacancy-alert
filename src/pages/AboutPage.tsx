import React from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Info, Target, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router';
import MarketingPartnerBanner from '../components/MarketingPartnerBanner';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>About Us | NewVacancyAlert.in</title>
        <meta name="description" content="Learn more about NewVacancyAlert.in, your trusted portal for the latest government job updates, exam calendars, and recruitment news." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">About NewVacancyAlert.in</h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Your most reliable and fast source for government job updates, exam calendars, and recruitment notifications across India.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 mb-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" /> Who We Are
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              NewVacancyAlert.in is a dedicated platform created to help millions of government job aspirants in India. We understand that finding accurate, timely, and well-organized information about government recruitments can be challenging. Our goal is to simplify this process by providing a centralized hub for all your competitive exam needs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-600" /> Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Our mission is to empower candidates by delivering the fastest and most accurate updates on Sarkari Naukri (Government Jobs), Admit Cards, Results, Answer Keys, and Exam Calendars. We strive to be the bridge between you and your dream government career.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-600" /> Why Choose Us
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm sm:text-base">
              <li><strong className="text-slate-800">100% Verified Information:</strong> We cross-check all our updates with official government portals and notifications.</li>
              <li><strong className="text-slate-800">Lightning Fast Updates:</strong> Get notified about new vacancies as soon as they are officially announced.</li>
              <li><strong className="text-slate-800">Clean & Ad-Free Experience:</strong> Our platform is designed with the user in mind, free from clutter and annoying pop-ups.</li>
              <li><strong className="text-slate-800">Comprehensive Guides:</strong> We don't just post links; we provide detailed insights into eligibility, syllabus, and selection processes.</li>
            </ul>
          </section>

          <MarketingPartnerBanner className="my-6" />

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center mt-8">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Have questions or feedback?</h3>
            <p className="text-blue-700 text-sm mb-4">We would love to hear from you. Reach out to us for any queries or suggestions.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
              <Mail className="w-4 h-4" /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
