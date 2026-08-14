import React from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = ReactHelmetAsync;
import { Shield, FileText } from 'lucide-react';

export default function MarketingTermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Terms & Conditions - Marketing Partner | NewVacancyAlert.in</title>
        <meta name="description" content="Terms and Conditions for the NewVacancyAlert.in Marketing Partner Programme." />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Marketing Partner Terms & Conditions</h1>
            <p className="text-sm font-medium text-slate-500">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Programme Eligibility</h2>
            <p className="text-slate-600">Participation is voluntary. Participants must provide true and accurate information. Only genuine registrations are permitted.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Registration</h2>
            <p className="text-slate-600">One registration per participant. Duplicate registrations may be rejected. False information may result in permanent removal.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Marketing Material</h2>
            <p className="text-slate-600">All QR Codes, posters, logos, graphics and branding remain the intellectual property of NewVacancyAlert.</p>
            <p className="text-slate-600">Participants may not: Modify, Edit, Rebrand, Sell, or Redistribute official marketing material.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Acceptable Promotion</h2>
            <p className="text-slate-600">Promotion may be done through Cyber Cafés, CSC Centres, Libraries, Colleges, Universities, Student Groups, WhatsApp, Telegram, Instagram, Facebook, and lawful offline and online methods. Spam is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Rewards</h2>
            <p className="text-slate-600">Rewards are promotional incentives. Rewards are NOT guaranteed. Meeting any suggested criteria does not automatically qualify a participant for payment. All rewards are subject to Manual review, Verification, Approval, and Company discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Fraud Prevention</h2>
            <p className="text-slate-600">The company may reject any reward or registration involving: Bots, Automated traffic, Fake referrals, Duplicate referrals, Self referrals, Fake accounts, Purchased traffic, Click farms, VPN abuse, Spam, Artificial engagement, Fake registrations, Misleading advertisements, Manipulated activity, Suspicious behaviour, or any attempt to abuse the programme. Any associated rewards may be cancelled.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Verification</h2>
            <p className="text-slate-600">The company may request proof before approving rewards. Failure to provide requested information may result in rejection.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Programme Modification</h2>
            <p className="text-slate-600">NewVacancyAlert reserves the right to Modify, Suspend, Change, Replace, Remove, Expand, or Reduce any part of the Marketing Partner Programme at any time. Changes become effective immediately upon publication.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Programme Termination</h2>
            <p className="text-slate-600">NewVacancyAlert reserves the right to discontinue the Marketing Partner Programme at any time, with or without prior notice. Participants acknowledge that the programme may be terminated without advance notification.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Payment Policy</h2>
            <p className="text-slate-600">NewVacancyAlert reserves the right to: Delay payments, Suspend payments, Modify payment amounts, Change payment methods, Discontinue promotional rewards, and Reject payment requests that do not satisfy verification requirements.</p>
            <p className="text-slate-600">The company may suspend or permanently discontinue reward payments at any time, with or without prior notice, subject to applicable law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. Right to Reject</h2>
            <p className="text-slate-600">The company reserves the absolute right to: Reject registrations, Reject reward claims, Reject promotional activities, Suspend participant accounts, and Remove participants from the programme. No detailed explanation is required where permitted by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">12. No Employment Relationship</h2>
            <p className="text-slate-600">Participation does not create: Employment, Agency, Partnership, Franchise, Joint Venture, or Contractual employment.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">13. Limitation of Liability</h2>
            <p className="text-slate-600">The company is not responsible for: Printing costs, Internet charges, Advertising expenses, Travel expenses, Loss of anticipated earnings, Business losses, Technical failures, or Third-party outages.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">14. Privacy</h2>
            <p className="text-slate-600">User information will be processed according to the Privacy Policy of NewVacancyAlert. Information will only be used for programme administration and communication.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">15. Intellectual Property</h2>
            <p className="text-slate-600">All logos, posters, QR codes, graphics, website content and branding belong exclusively to NewVacancyAlert. Unauthorised commercial use is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">16. Governing Law</h2>
            <p className="text-slate-600">These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Delhi.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
