import { Calendar, Clock, Download, ArrowRight, ShieldCheck, Flame, Search, Filter, History, Map, TrendingUp, Info, ChevronDown, CheckCircle2, AlertCircle, FileText, ExternalLink, Activity, ListOrdered, CalendarDays, ArrowUpRight, Copy, Share2 } from 'lucide-react';

export interface SscExamEvent {
  id: string;
  examCode: string;
  examName: string;
  department: string;
  qualification: string[];
  vacancies: string;
  notificationDate: string;
  applyStartDate: string;
  lastDate: string;
  correctionWindow: string;
  admitCardDate: string;
  examDate: string;
  answerKeyDate: string;
  resultDate: string;
  officialPdf: string;
  officialWebsite: string;
  status: 'Upcoming' | 'Notification Soon' | 'Registration Open' | 'Application Closed' | 'Admit Card Released' | 'Exam Running' | 'Answer Key Released' | 'Result Awaited' | 'Result Released' | 'Completed' | 'Postponed';
  expectedNextUpdate: string;
  lastVerified: string;
  examMonth: string;
  salary: string;
  category: string;
}

export const sscCalendarData: SscExamEvent[] = [
  {
    id: 'ssc-cgl-2026',
    examCode: 'CGL',
    examName: 'Combined Graduate Level Examination, 2026',
    department: 'Various Ministries/Departments/Organizations',
    qualification: ['Graduate'],
    vacancies: '15,000+ (Expected)',
    notificationDate: '15-May-2026',
    applyStartDate: '15-May-2026',
    lastDate: '15-Jun-2026',
    correctionWindow: '20-Jun to 22-Jun-2026',
    admitCardDate: 'To be notified',
    examDate: 'August - September 2026',
    answerKeyDate: 'To be notified',
    resultDate: 'To be notified',
    officialPdf: '#',
    officialWebsite: 'https://ssc.gov.in',
    status: 'Upcoming',
    expectedNextUpdate: '15-May-2026 (Notification Release)',
    lastVerified: '28-Jul-2026',
    examMonth: 'August',
    salary: 'Level 4 to Level 8 (₹25,500 - ₹1,51,100)',
    category: 'Group B & C',
  },
  {
    id: 'ssc-chsl-2026',
    examCode: 'CHSL',
    examName: 'Combined Higher Secondary (10+2) Level Examination, 2026',
    department: 'LDC/JSA, PA/SA, DEO',
    qualification: ['12th'],
    vacancies: '4,500+ (Expected)',
    notificationDate: '02-Apr-2026',
    applyStartDate: '02-Apr-2026',
    lastDate: '01-May-2026',
    correctionWindow: '05-May to 07-May-2026',
    admitCardDate: '15-Jun-2026',
    examDate: 'June - July 2026',
    answerKeyDate: 'August 2026',
    resultDate: 'September 2026',
    officialPdf: '#',
    officialWebsite: 'https://ssc.gov.in',
    status: 'Exam Running',
    expectedNextUpdate: '05-Aug-2026 (Answer Key)',
    lastVerified: '28-Jul-2026',
    examMonth: 'June',
    salary: 'Level 2 to Level 4 (₹19,900 - ₹81,100)',
    category: 'Group C',
  },
  {
    id: 'ssc-mts-2026',
    examCode: 'MTS',
    examName: 'Multi Tasking (Non-Technical) Staff, and Havaldar (CBIC & CBN) Examination, 2026',
    department: 'Various Ministries & CBIC/CBN',
    qualification: ['10th'],
    vacancies: '9,000+ (Expected)',
    notificationDate: '27-Jun-2026',
    applyStartDate: '27-Jun-2026',
    lastDate: '31-Jul-2026',
    correctionWindow: '05-Aug to 07-Aug-2026',
    admitCardDate: 'October 2026',
    examDate: 'October - November 2026',
    answerKeyDate: 'To be notified',
    resultDate: 'To be notified',
    officialPdf: '#',
    officialWebsite: 'https://ssc.gov.in',
    status: 'Registration Open',
    expectedNextUpdate: '01-Aug-2026 (Correction Window)',
    lastVerified: '28-Jul-2026',
    examMonth: 'October',
    salary: 'Level 1 (₹18,000 - ₹56,900)',
    category: 'Group C',
  },
  {
    id: 'ssc-gd-2026',
    examCode: 'GD',
    examName: 'Constable (GD) in CAPFs, SSF, and Rifleman (GD) in Assam Rifles Examination, 2027',
    department: 'BSF, CISF, CRPF, SSB, ITBP, AR, SSF',
    qualification: ['10th'],
    vacancies: '40,000+ (Expected)',
    notificationDate: '27-Aug-2026',
    applyStartDate: '27-Aug-2026',
    lastDate: '05-Oct-2026',
    correctionWindow: '10-Oct to 12-Oct-2026',
    admitCardDate: 'December 2026',
    examDate: 'January - February 2027',
    answerKeyDate: 'To be notified',
    resultDate: 'To be notified',
    officialPdf: '#',
    officialWebsite: 'https://ssc.gov.in',
    status: 'Notification Soon',
    expectedNextUpdate: '27-Aug-2026',
    lastVerified: '28-Jul-2026',
    examMonth: 'January',
    salary: 'Level 3 (₹21,700 - ₹69,100)',
    category: 'Group C',
  },
  {
    id: 'ssc-cpo-2026',
    examCode: 'CPO',
    examName: 'Sub-Inspector in Delhi Police and Central Armed Police Forces Examination, 2026',
    department: 'Delhi Police & CAPFs',
    qualification: ['Graduate'],
    vacancies: '4,000+ (Expected)',
    notificationDate: '15-Feb-2026',
    applyStartDate: '15-Feb-2026',
    lastDate: '14-Mar-2026',
    correctionWindow: '20-Mar to 22-Mar-2026',
    admitCardDate: 'April 2026',
    examDate: '09-May to 13-May-2026',
    answerKeyDate: '20-May-2026',
    resultDate: '15-Jul-2026',
    officialPdf: '#',
    officialWebsite: 'https://ssc.gov.in',
    status: 'Result Released',
    expectedNextUpdate: 'Physical Test Dates Soon',
    lastVerified: '28-Jul-2026',
    examMonth: 'May',
    salary: 'Level 6 (₹35,400 - ₹1,12,400)',
    category: 'Group B',
  }
];

export const sscRevisionHistory = [
  { date: '25-Jul-2026', exam: 'SSC MTS 2026', oldVal: 'Last Date: 27-Jul-2026', newVal: 'Last Date: 31-Jul-2026', reason: 'Extended due to server issues', link: 'https://ssc.gov.in' },
  { date: '15-Jul-2026', exam: 'SSC CPO 2026', oldVal: 'Result: Awaited', newVal: 'Result: Released', reason: 'Tier 1 Result Declared', link: 'https://ssc.gov.in' },
  { date: '10-Jul-2026', exam: 'SSC CHSL 2026', oldVal: 'Admit Card: Awaited', newVal: 'Admit Card: Released', reason: 'Tier 1 Admit Cards issued regionally', link: 'https://ssc.gov.in' },
];

export const sscFaqs = [
  { q: 'Is the new SSC website required for OTR?', a: 'Yes. All candidates must complete One Time Registration (OTR) on the new official portal (ssc.gov.in). Old OTRs from ssc.nic.in are no longer valid.' },
  { q: 'What is the upcoming SSC CGL 2026 notification date?', a: 'According to the tentative calendar, the SSC CGL 2026 notification is expected on 15th May 2026.' },
  { q: 'Can I apply for multiple SSC exams in a year?', a: 'Yes, as long as you meet the specific age limit, educational qualification, and physical standards for each exam.' },
  { q: 'How do I download the SSC Annual Calendar PDF?', a: 'You can download the official SSC exam calendar PDF directly from the top section of this page, sourced directly from the SSC Document Portal.' },
];
