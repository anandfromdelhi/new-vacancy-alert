import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  vacanciesDetails: { 
    category?: string; 
    count?: number | string; 
    postName?: string; 
    total?: number | string; 
    ur?: number | string; 
    obc?: number | string; 
    sc?: number | string; 
    st?: number | string; 
    ews?: number | string; 
    qualification?: string; 
    payScale?: string; 
    [key: string]: any;
  }[];
  regionWiseVacancies?: { region: string; count: number | string }[];
  eligibility?: {
    education: string[];
    ageLimit: string;
    ageRelaxation?: { category: string; relaxation: string }[];
    medicalStandards?: string[];
    experience?: string[];
  };
  salary?: {
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

let cachedData: Record<string, JobDetail> | null = null;

function loadJobDetails(): Record<string, JobDetail> {
  if (cachedData) return cachedData;
  try {
    let dirname = '';
    if (typeof __dirname !== 'undefined') {
      dirname = __dirname;
    } else if (typeof import.meta !== 'undefined' && import.meta.url) {
      dirname = path.dirname(fileURLToPath(import.meta.url));
    }
    const jsonPath = dirname ? path.join(dirname, 'jobDetails.json') : path.resolve('src/data/jobDetails.json');
    cachedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch {
    cachedData = {};
  }
  return cachedData || {};
}

export const jobDetailsData: Record<string, JobDetail> = new Proxy({}, {
  get(_target, prop: string) {
    return loadJobDetails()[prop];
  },
  has(_target, prop: string) {
    return prop in loadJobDetails();
  },
  ownKeys() {
    return Reflect.ownKeys(loadJobDetails());
  },
  getOwnPropertyDescriptor(_target, prop: string) {
    const data = loadJobDetails();
    return Object.getOwnPropertyDescriptor(data, prop) || {
      configurable: true,
      enumerable: true,
      value: data[prop]
    };
  }
});

export default jobDetailsData;

