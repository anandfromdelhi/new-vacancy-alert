import React from 'react';
import { Briefcase, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { PAY_LEVEL_INFO } from '../../data/salaryData';

interface JobsByLevelSectionProps {
  currentLevel: number;
}

export default function JobsByLevelSection({ currentLevel }: JobsByLevelSectionProps) {
  const levelInfo = PAY_LEVEL_INFO[currentLevel] || PAY_LEVEL_INFO[6];

  const popularExamsMap: Record<number, Array<{ title: string; link: string; dept: string }>> = {
    1: [
      { title: 'RRB Group D Recruitment 2026', link: '/rrb-group-d-salary-and-jobs', dept: 'Indian Railways' },
      { title: 'SSC MTS & Havaldar Exam 2026', link: '/ssc-mts-salary-and-notification', dept: 'Staff Selection Commission' },
    ],
    2: [
      { title: 'SSC CHSL LDC / JSA Exam 2026', link: '/ssc-chsl-salary-and-pattern', dept: 'SSC' },
      { title: 'RRB NTPC Junior Clerk Recruitment', link: '/rrb-ntpc-undergraduate-jobs', dept: 'Railways' },
    ],
    3: [
      { title: 'SSC GD Constable Examination 2026', link: '/ssc-gd-constable-jobs', dept: 'CAPF / MHA' },
      { title: 'India Post Postman & Mail Guard Recruitment', link: '/india-post-postman-salary', dept: 'Dept of Posts' },
    ],
    4: [
      { title: 'SSC CHSL Postal Assistant & DEO', link: '/ssc-chsl-salary-and-pattern', dept: 'Central Ministries' },
      { title: 'SSC Tax Assistant (CBDT/CBIC)', link: '/ssc-cgl-salary-and-post-details', dept: 'Income Tax & Excise' },
    ],
    5: [
      { title: 'SSC CGL Auditor / Accountant Posts', link: '/ssc-cgl-salary-and-post-details', dept: 'CAG / CGDA' },
      { title: 'RRB NTPC Goods Train Manager / Sr Clerk', link: '/rrb-ntpc-graduate-jobs', dept: 'Indian Railways' },
    ],
    6: [
      { title: 'SSC CPO Sub-Inspector (Delhi Police / CAPF)', link: '/ssc-cpo-sub-inspector-jobs', dept: 'MHA' },
      { title: 'RRB NTPC Station Master Exam 2026', link: '/rrb-ntpc-station-master-salary', dept: 'Railways' },
      { title: 'Assistant Section Officer (ASO) in Central Ministries', link: '/ssc-cgl-salary-and-post-details', dept: 'CSS' },
      { title: 'RRB Junior Engineer (JE) Recruitment', link: '/rrb-je-salary-and-jobs', dept: 'Railways' },
    ],
    7: [
      { title: 'Income Tax Inspector (SSC CGL)', link: '/ssc-cgl-income-tax-inspector-salary', dept: 'CBDT / Finance' },
      { title: 'GST & Central Excise Inspector', link: '/ssc-cgl-gst-inspector-salary', dept: 'CBIC / Finance' },
      { title: 'AIIMS Nursing Officer NORCET 2026', link: '/aiims-norcet-nursing-officer', dept: 'AIIMS' },
      { title: 'Assistant Section Officer (ASO in MEA / IB)', link: '/ssc-cgl-salary-and-post-details', dept: 'MEA / IB' },
    ],
    8: [
      { title: 'Assistant Audit Officer (AAO) SSC CGL', link: '/ssc-cgl-aao-salary-and-details', dept: 'CAG' },
      { title: 'EPFO Enforcement Officer / Accounts Officer', link: '/epfo-eo-ao-salary-details', dept: 'EPFO' },
    ],
    10: [
      { title: 'UPSC Civil Services Exam (IAS/IPS/IRS)', link: '/upsc-civil-services-salary-structure', dept: 'UPSC' },
      { title: 'DRDO & ISRO Scientist B/C Recruitment', link: '/drdo-isro-scientist-jobs', dept: 'Defence / Space' },
    ],
  };

  const exams = popularExamsMap[currentLevel] || popularExamsMap[6];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Career & Vacancy Finder
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Which Government Jobs Use Pay Level {currentLevel}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Explore live government job vacancies and recruitment exams offering Level {currentLevel} salary matrix.
          </p>
        </div>
      </div>

      {/* Role Tags */}
      <div className="flex flex-wrap gap-2">
        {levelInfo.roles.map((role, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200"
          >
            {role}
          </span>
        ))}
      </div>

      {/* Vacancy / Exam Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exams.map((exam, idx) => (
          <Link
            key={idx}
            to={exam.link}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">{exam.dept}</span>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                {exam.title}
              </h4>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        ))}
      </div>

      <div className="pt-2 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
        >
          <span>Browse All Latest Government Vacancies</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
