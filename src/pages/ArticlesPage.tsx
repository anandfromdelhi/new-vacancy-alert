import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  BookOpen, Search, Calendar, ChevronRight, Clock, ArrowRight, 
  Sparkles, Tag, ShieldCheck, Flame, Star, Award, Rocket, GraduationCap,
  Building2, Users, FileText, CheckCircle2, Calculator
} from 'lucide-react';
import SubscribeWidget from '../components/SubscribeWidget';
import MarketingPartnerBanner from '../components/MarketingPartnerBanner';

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Railway' | 'Medical' | 'SSC' | 'General' | 'UPSC';
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  badge?: string;
  icon: any;
  views?: string;
}

const ARTICLES_LIST: ArticleItem[] = [
  {
    id: 'salary-calculator-2026',
    slug: '/salary-calculator',
    title: '7th Pay Commission Salary Calculator 2026: DA, HRA, NPS & In-Hand Salary',
    excerpt: 'Calculate exact Central and State Government employee salary. Determine Gross Pay, DA, HRA, TA, NPS deductions, and final In-Hand Net Salary across all Pay Levels.',
    category: 'General',
    author: 'Govt Finance Desk',
    date: '28th July 2026',
    readTime: '8 min read',
    featured: true,
    badge: '💰 Popular Tool',
    icon: Calculator,
    views: '150.5K Views'
  },
  {
    id: 'ssc-calendar-2026',
    slug: '/ssc-exam-calendar',
    title: 'SSC Exam Calendar 2026-2027: Notification, Last Date, Admit Card, Exam Date',
    excerpt: 'Check the latest SSC Exam Calendar with notification dates, application deadlines, admit cards, exam schedules, and results updated direct from ssc.gov.in.',
    category: 'SSC',
    author: 'SSC Exams Desk',
    date: '28th July 2026',
    readTime: '12 min read',
    featured: true,
    badge: '🔥 Master Guide',
    icon: Building2,
    views: '89.1K Views'
  },
  {
    id: 'rrb-calendar-2026',
    slug: '/rrb-exam-calendar-2026-27',
    title: 'RRB Exam Calendar 2026-27: Complete Notification, Exam Date, Admit Card & Result Timeline',
    excerpt: 'Comprehensive official & expected schedule for all Railway Recruitment Board exams including RRB NTPC, Group D, ALP, Technician, JE, and Paramedical. Updated for 2026-27.',
    category: 'Railway',
    author: 'NewVacancyAlert Editorial Team',
    date: '28th July 2026',
    readTime: '10 min read',
    featured: true,
    badge: '🔥 Master Guide',
    icon: Rocket,
    views: '45.2K Views'
  },
  {
    id: 'aiims-norcet-11-cutoff',
    slug: '/aiims-norcet-11-nursing-officer-2026/cutoff',
    title: 'AIIMS NORCET 11 Expected Cutoff Marks & Rank Analysis 2026',
    excerpt: 'Detailed institute-wise cutoff analysis for AIIMS NORCET-11 Nursing Officer recruitment across 19 AIIMS, qualifying percentile guidelines, and category-wise expected safe scores.',
    category: 'Medical',
    author: 'Medical Exams Desk',
    date: '25th July 2026',
    readTime: '7 min read',
    featured: false,
    badge: 'Trending',
    icon: GraduationCap,
    views: '18.9K Views'
  }
];

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Railway', 'Medical', 'SSC', 'General'];

  const filteredArticles = ARTICLES_LIST.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = ARTICLES_LIST.find(art => art.featured);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      <Helmet>
        <title>Articles & Exam Guides | NewVacancyAlert.in</title>
        <meta 
          name="description" 
          content="Explore authoritative exam calendars, cutoff marks analysis, notification timelines, syllabus guides, and career insights for Railway, SSC, Medical, and Central Government jobs." 
        />
        <meta name="keywords" content="RRB exam calendar 2026, government exam articles, AIIMS NORCET cutoff, Railway job calendar, government job guides" />
        <link rel="canonical" href="https://newvacancyalert.in/articles" />
      </Helmet>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white pt-10 pb-14 px-4 sm:px-8 border-b-4 border-blue-500">
        <div className="max-w-[1800px] 2xl:max-w-[2000px] mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-800/60 border border-blue-400/30 text-blue-200 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Knowledge Hub & Exam Insights</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Articles & Comprehensive Recruitment Guides
          </h1>
          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto font-medium">
            In-depth exam calendars, cutoff benchmarks, selection process breakdowns, and career resources verified by NewVacancyAlert.in.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, exam calendars, cutoff guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/90 border-2 border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:border-blue-500 outline-none transition-all shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-4 sm:px-8 mt-8 space-y-10">

        {/* Featured Article Card */}
        {featuredArticle && !searchQuery && selectedCategory === 'All' && (
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Featured Master Article</span>
            </h2>

            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-700/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col lg:flex-row gap-6 items-start justify-between relative z-10">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {featuredArticle.badge}
                    </span>
                    <span className="bg-blue-800/60 text-blue-200 border border-blue-600/40 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                      {featuredArticle.category}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug group-hover:text-blue-300 transition-colors">
                    <Link to={featuredArticle.slug}>
                      {featuredArticle.title}
                    </Link>
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-2">
                    <span>By <strong className="text-white">{featuredArticle.author}</strong></span>
                    <span>•</span>
                    <span>{featuredArticle.date}</span>
                    {featuredArticle.views && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{featuredArticle.views}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                  <Link
                    to={featuredArticle.slug}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all group-hover:scale-105"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <MarketingPartnerBanner className="my-6" />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {cat === 'All' ? 'All Articles' : cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-bold">
            Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'}
          </span>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((art) => {
            const IconComp = art.icon;
            return (
              <div 
                key={art.id}
                className="bg-white border-2 border-slate-200 hover:border-blue-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border bg-blue-50 border-blue-200 text-blue-800">
                      <IconComp className="w-3 h-3" />
                      {art.category}
                    </span>

                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 leading-snug transition-colors">
                    <Link to={art.slug}>{art.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {art.excerpt}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-bold">{art.date}</span>

                  <Link 
                    to={art.slug}
                    className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>Read Guide</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-black text-slate-800">No Articles Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or selecting a different category.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Priority Push Notification Subscription Bar at Bottom */}
        <SubscribeWidget mode="bottom" />

      </div>
    </div>
  );
}
