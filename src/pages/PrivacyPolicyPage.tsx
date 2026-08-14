import React from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Shield, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Privacy Policy | NewVacancyAlert.in</title>
        <meta name="description" content="Privacy Policy for NewVacancyAlert.in. Read how we collect, use, and protect your information." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Last Updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            At NewVacancyAlert.in, accessible from https://newvacancyalert.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by NewVacancyAlert.in and how we use it.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>mahalaxmiagency@gmail.com</strong>.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Eye className="w-5 h-5 text-blue-600" /> Log Files
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              NewVacancyAlert.in follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Server className="w-5 h-5 text-blue-600" /> Cookies and Web Beacons
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Like any other website, NewVacancyAlert.in uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lock className="w-5 h-5 text-blue-600" /> Third Party Privacy Policies
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              NewVacancyAlert.in's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Shield className="w-5 h-5 text-blue-600" /> Consent
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
