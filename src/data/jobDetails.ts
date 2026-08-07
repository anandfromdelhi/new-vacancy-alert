import jobDetailsJson from './jobDetails.json';

export interface JobDetail {
  id: string;
  seoTitle: string;
  seoDescription: string;
  focusKeywords: string;
  lsiKeywords: string;
  title: string;
  board: string;
  advtNo: string;
  vacancies: number | string;
  jobLocation: string;
  applicationMode: string;
  applicationStatus?: string;
  lastUpdated: string;
  overview: string[];
  highlights: { label: string; value: string }[];
  importantDates: { event: string; date: string }[];
  vacanciesDetails: { category: string; count: number | string }[];
  regionWiseVacancies?: { region: string; count: number | string }[];
  eligibility: {
    education: string[];
    ageLimit: string;
    ageRelaxation?: { category: string; relaxation: string }[];
    medicalStandards?: string[];
    experience?: string[];
  };
  salary: {
    payLevel: string;
    initialPay: string;
    allowances?: string | string[];
  };
  applicationFee?: any;
  howToPayFee?: string[];
  selectionProcess?: any;
  examPattern?: any;
  syllabus?: any;
  reservation?: any;
  examCentres?: any;
  howToApply?: string[];
  howToApplySteps?: string[];
  documentsRequired?: string[];
  importantInstructions?: string[];
  urls?: { label: string; url: string }[];
  officialLinks?: { label: string; url: string }[];
  u?: string;
  faqs?: { question: string; answer: string }[];
}

export const jobDetailsData: Record<string, JobDetail> = jobDetailsJson as Record<string, JobDetail>;
export default jobDetailsData;
