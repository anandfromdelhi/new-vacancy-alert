import React, { useState } from 'react';
import { Rss, Copy, Check, ExternalLink, Sparkles, BookOpen, Bell, ArrowRight } from 'lucide-react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = ReactHelmetAsync;
import jobsIndexData from '../data/jobs-index-generated.json';
import { Link } from 'react-router';

export default function RssFeedPage() {
  const [copied, setCopied] = useState(false);
  const rssUrl = 'https://newvacancyalert.in/rss.xml';
  const feedUrl = 'https://newvacancyalert.in/feed.xml';

  const jobsList = Object.values(jobsIndexData as Record<string, any>).slice(0, 15);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 px-4 sm:px-6">
      <Helmet>
        <title>Official RSS Feed for Govt Jobs 2026 | NewVacancyAlert.in</title>
        <meta
          name="description"
          content="Subscribe to the official RSS Feed for NewVacancyAlert.in to get instant government job alerts, notifications, exam updates, and admit card releases in your RSS reader."
        />
        <link rel="alternate" type="application/rss+xml" title="NewVacancyAlert.in - Govt Jobs RSS Feed" href={rssUrl} />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider">
              <Rss className="w-4 h-4 text-white" />
              <span>Official RSS 2.0 Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Govt Job Alerts RSS Feed
            </h1>
            <p className="text-amber-100 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
              Stay updated automatically! Subscribe to our live RSS feed in your favorite RSS reader (Feedly, Inoreader, NewsBlur, Apple News, or Outlook) for instant job notifications.
            </p>
          </div>
        </div>

        {/* Feed URL Copy Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Rss className="w-5 h-5 text-amber-600" />
            <span>RSS Feed Endpoint URLs</span>
          </h2>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-slate-100 border border-slate-300 rounded-lg px-3.5 py-2.5 font-mono text-xs text-slate-800 break-all select-all font-bold">
                {rssUrl}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(rssUrl)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-2xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                </button>
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-300"
                  title="Open XML in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Alternative endpoint: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">{feedUrl}</code></span>
              <span className="text-emerald-600 font-bold">✓ Standard RSS 2.0 XML Format</span>
            </div>
          </div>
        </div>

        {/* Instructions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Copy RSS Feed Link</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Copy <code className="text-blue-700 font-bold">https://newvacancyalert.in/rss.xml</code> to your clipboard.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Open Feed Reader</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open your RSS aggregator such as Feedly, Inoreader, NewsBlur, NetNewsWire, or Outlook.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Paste & Subscribe</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click 'Add Content' or '+' in your reader, paste the URL, and start receiving live job alerts.
            </p>
          </div>
        </div>

        {/* Live Feed Entries Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Live Feed Entries ({jobsList.length} Items)</span>
            </h2>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View Raw XML</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="divide-y divide-slate-100">
            {jobsList.map((job) => (
              <div key={job.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/${job.id}`}
                    className="font-extrabold text-sm text-slate-900 hover:text-blue-600 transition line-clamp-1"
                  >
                    {job.title}
                  </Link>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {job.lastUpdated}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.overviewSummary || job.seoDescription}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-semibold">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">{job.board}</span>
                  <span>Vacancies: <strong className="text-slate-800">{job.vacancies}</strong></span>
                  <span>Location: {job.jobLocation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
