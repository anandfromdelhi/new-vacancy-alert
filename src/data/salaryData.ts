// 7th Central Pay Commission Official Data & Calculator Helpers

export interface PayLevelData {
  level: number;
  gradePayEquivalent: number;
  entryBasic: number;
  maxBasic: number;
  payBand: string;
  typicalPosts: string[];
  cells: number[];
}

// 7th CPC Official Pay Matrix (Levels 1 to 18)
export const PAY_MATRIX: Record<number, number[]> = {
  1: [18000, 18500, 19100, 19700, 20300, 20900, 21500, 22100, 22800, 23500, 24200, 24900, 25600, 26400, 27200, 28000, 28800, 29700, 30600, 31500, 32400, 33400, 34400, 35400, 36500, 37600, 38700, 39900, 41100, 42300, 43600, 44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56900],
  2: [19900, 20500, 21100, 21700, 22400, 23100, 23800, 24500, 25200, 26000, 26800, 27600, 28400, 29300, 30200, 31100, 32000, 33000, 34000, 35000, 36100, 37200, 38300, 39400, 40600, 41800, 43100, 44400, 45700, 47100, 48500, 50000, 51500, 53000, 54600, 56200, 57900, 59600, 61400, 63200],
  3: [21700, 22400, 23100, 23800, 24500, 25200, 26000, 26800, 27600, 28400, 29300, 30200, 31100, 32000, 33000, 34000, 35000, 36100, 37200, 38300, 39400, 40600, 41800, 43100, 44400, 45700, 47100, 48500, 50000, 51500, 53000, 54600, 56200, 57900, 59600, 61400, 63200, 65100, 67100, 69100],
  4: [25500, 26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56900, 58600, 60400, 62200, 64100, 66000, 68000, 70000, 72100, 74300, 76500, 78800, 81100],
  5: [29200, 30100, 31000, 31900, 32900, 33900, 34900, 35900, 37000, 38100, 39200, 40400, 41600, 42900, 44200, 45500, 46900, 48300, 49700, 51200, 52700, 54300, 55900, 57600, 59300, 61100, 63000, 64900, 66800, 68800, 70900, 73000, 75200, 77500, 79800, 82200, 84700, 87200, 89800, 92500],
  6: [35400, 36500, 37600, 38700, 39900, 41100, 42300, 43600, 44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56900, 58600, 60400, 62200, 64100, 66000, 68000, 70000, 72100, 74300, 76500, 78800, 81100, 83500, 86000, 88600, 91300, 94000, 96800, 99700, 102700, 105800, 109000, 112400],
  7: [44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56900, 58600, 60400, 62200, 64100, 66000, 68000, 70000, 72100, 74300, 76500, 78800, 81100, 83500, 86000, 88600, 91300, 94000, 96800, 99700, 102700, 105800, 109000, 112400, 115800, 119300, 122900, 126600, 130400, 134300, 138300, 142400],
  8: [47600, 49000, 50500, 52000, 53600, 55200, 56900, 58600, 60400, 62200, 64100, 66000, 68000, 70000, 72100, 74300, 76500, 78800, 81100, 83500, 86000, 88600, 91300, 94000, 96800, 99700, 102700, 105800, 109000, 112400, 115800, 119300, 122900, 126600, 130400, 134300, 138300, 142400, 146700, 151100],
  9: [53100, 54700, 56300, 58000, 59700, 61500, 63300, 65200, 67200, 69200, 71300, 73400, 75600, 77900, 80200, 82600, 85100, 87700, 90300, 93000, 95800, 98700, 101700, 104800, 107900, 111100, 114400, 117800, 121300, 124900, 128600, 132500, 136500, 140600, 144800, 149100, 153600, 158200, 162900, 167800],
  10: [56100, 57800, 59500, 61300, 63100, 65000, 67000, 69000, 71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400, 90000, 92700, 95500, 98400, 101400, 104400, 107500, 110700, 114000, 117400, 120900, 124500, 128200, 132000, 136000, 140100, 144300, 148600, 153100, 157700, 162400, 167300, 172300, 177500],
  11: [67700, 69700, 71800, 74000, 76200, 78500, 80900, 83300, 85800, 88400, 91100, 93800, 96600, 99500, 102500, 105600, 108800, 112100, 115500, 119000, 122600, 126300, 130100, 134000, 138000, 142100, 146400, 150800, 155300, 160000, 164800, 169700, 174800, 180000, 185400, 191000, 196700, 202600, 208700, 215000],
  12: [78800, 81200, 83600, 86100, 88700, 91400, 94100, 96900, 99800, 102800, 105900, 109100, 112400, 115800, 119300, 122900, 126600, 130400, 134300, 138300, 142400, 146700, 151100, 155600, 160300, 165100, 170100, 175200, 180500, 185900, 191500, 197200, 203100, 209200]
};

// Fill upper levels 13 to 18 with standard 7th CPC cell formulas
PAY_MATRIX[13] = [123100, 126800, 130600, 134500, 138500, 142700, 147000, 151400, 155900, 160600, 165400, 170400, 175500, 180800, 186200, 191800, 197600, 203500, 209600, 215900];
PAY_MATRIX[13] = PAY_MATRIX[13] || [123100, 126800, 130600, 134500];
PAY_MATRIX[14] = [144200, 148500, 153000, 157600, 162300, 167200, 172200, 177400, 182700, 188200, 193800, 199600, 205600, 211800, 218200];
PAY_MATRIX[15] = [182200, 187700, 193300, 199100, 205100, 211300, 217600, 224100];
PAY_MATRIX[16] = [205400, 211600, 218000, 224500];
PAY_MATRIX[17] = [225000];
PAY_MATRIX[18] = [250000];

export const PAY_LEVEL_INFO: Record<number, { gradePay: number; pb: string; roles: string[]; defaultTitle: string }> = {
  1: { gradePay: 1800, pb: 'PB-1 (5200-20200)', roles: ['MTS', 'Peon', 'Track Maintainer Grade IV', 'Helper', 'Attendant'], defaultTitle: 'MTS / Group D Staff' },
  2: { gradePay: 1900, pb: 'PB-1 (5200-20200)', roles: ['Lower Division Clerk (LDC)', 'Junior Secretariat Assistant', 'Railway Constable', 'Accounts Clerk'], defaultTitle: 'LDC / Junior Clerk' },
  3: { gradePay: 2000, pb: 'PB-1 (5200-20200)', roles: ['Constable (GD)', 'Railway Trains Clerk', 'Postman', 'Forest Guard'], defaultTitle: 'Constable / Postman' },
  4: { gradePay: 2400, pb: 'PB-1 (5200-20200)', roles: ['Tax Assistant (SSC)', 'Upper Division Clerk (UDC)', 'Postal Assistant / Sorting Assistant', 'Data Entry Operator Grade A'], defaultTitle: 'Tax Assistant / Postal Asst.' },
  5: { gradePay: 2800, pb: 'PB-1 (5200-20200)', roles: ['Auditor (CAG/CGDA)', 'Senior Clerk cum Typist', 'Accountant', 'Goods Guard (Railway)'], defaultTitle: 'Auditor / Senior Clerk' },
  6: { gradePay: 4200, pb: 'PB-2 (9300-34800)', roles: ['Sub-Inspector (SSC CPO)', 'Railway Station Master', 'Assistant Section Officer (Central Govt)', 'Junior Engineer (RRB/SSC JE)'], defaultTitle: 'Sub-Inspector / Station Master / ASO' },
  7: { gradePay: 4600, pb: 'PB-2 (9300-34800)', roles: ['Income Tax Inspector', 'GST & Central Excise Inspector', 'Examiner / Preventive Officer', 'AIIMS Nursing Officer', 'Assistant Section Officer (MEA/IB)'], defaultTitle: 'Inspector (Income Tax / GST) / Nursing Officer' },
  8: { gradePay: 4800, pb: 'PB-2 (9300-34800)', roles: ['Assistant Audit Officer (AAO)', 'Assistant Accounts Officer', 'Senior Section Engineer (Gazetted)'], defaultTitle: 'Assistant Audit Officer (AAO)' },
  9: { gradePay: 5400, pb: 'PB-2 (9300-34800)', roles: ['Section Officer (Promoted)', 'Senior Sub-Inspector', 'Superintendent'], defaultTitle: 'Section Officer (NFSG)' },
  10: { gradePay: 5400, pb: 'PB-3 (15600-39100)', roles: ['Assistant Commissioner (IRS)', 'Assistant Collector', 'UPSC CSE Officers (IAS/IPS Entry)', 'Scientist SB/SC (DRDO/ISRO)', 'Medical Officer (UPSC)'], defaultTitle: 'Assistant Commissioner / IAS / Scientist C' },
  11: { gradePay: 6600, pb: 'PB-3 (15600-39100)', roles: ['Deputy Commissioner', 'Under Secretary (Central Secretariat)', 'Scientist D (ISRO/DRDO)'], defaultTitle: 'Under Secretary / Scientist D' },
  12: { gradePay: 7600, pb: 'PB-3 (15600-39100)', roles: ['Joint Commissioner', 'Deputy Secretary', 'Scientist E'], defaultTitle: 'Deputy Secretary / Scientist E' },
  13: { gradePay: 8700, pb: 'PB-4 (37400-67000)', roles: ['Director (Central Govt)', 'Additional Commissioner', 'Scientist F'], defaultTitle: 'Director / Scientist F' },
  14: { gradePay: 8900, pb: 'PB-4 (37400-67000)', roles: ['Joint Secretary (Central Govt)', 'Commissioner of Income Tax / GST', 'Scientist G'], defaultTitle: 'Joint Secretary / Commissioner' },
  15: { gradePay: 10000, pb: 'PB-4 (37400-67000)', roles: ['Principal Secretary', 'Principal Commissioner', 'Scientist H'], defaultTitle: 'Principal Secretary / Sr. Scientist' },
  16: { gradePay: 0, pb: 'Apex Scale', roles: ['Additional Chief Secretary', 'Director General of Police (DGP)', 'Director DRDO/ISRO'], defaultTitle: 'Additional Chief Secretary / DG' },
  17: { gradePay: 0, pb: 'Apex Scale', roles: ['Secretary to Govt of India', 'Chief Secretary of State'], defaultTitle: 'Secretary to Govt of India' },
  18: { gradePay: 0, pb: 'Cabinet Secretary Scale', roles: ['Cabinet Secretary of India'], defaultTitle: 'Cabinet Secretary of India' }
};

export interface DepartmentPreset {
  id: string;
  name: string;
  iconName: string;
  defaultLevel: number;
  popularRoles: string[];
  defaultTitle?: string;
  description: string;
}

export const DEPARTMENTS: DepartmentPreset[] = [
  { id: 'ssc', name: 'SSC (CGL/CHSL/MTS)', iconName: 'Award', defaultLevel: 7, popularRoles: ['Income Tax Inspector', 'GST Inspector', 'ASO (MEA)', 'Tax Assistant', 'MTS'], description: 'Staff Selection Commission non-technical & technical recruitments.' },
  { id: 'railways', name: 'Indian Railways (RRB)', iconName: 'Train', defaultLevel: 6, popularRoles: ['Station Master', 'Goods Guard', 'Senior Clerk', 'Junior Engineer', 'Loco Pilot'], description: 'Ministry of Railways (NTPC, Group D, JE, ALP).' },
  { id: 'incometax', name: 'Income Tax Dept (CBDT)', iconName: 'FileCheck', defaultLevel: 7, popularRoles: ['Income Tax Inspector', 'Tax Assistant', 'Executive Assistant', 'ITO'], description: 'Central Board of Direct Taxes (Ministry of Finance).' },
  { id: 'cbic', name: 'GST & Central Excise (CBIC)', iconName: 'Building2', defaultLevel: 7, popularRoles: ['GST Inspector', 'Preventive Officer', 'Examiner', 'Tax Assistant'], description: 'Central Board of Indirect Taxes and Customs.' },
  { id: 'epfo', name: 'EPFO & ESIC', iconName: 'ShieldCheck', defaultLevel: 8, popularRoles: ['EO/AO (Enforcement Officer)', 'APFC', 'Social Security Assistant (SSA)'], description: 'Employees Provident Fund Organisation & ESIC.' },
  { id: 'postal', name: 'India Post (Dept of Posts)', iconName: 'Mail', defaultLevel: 4, popularRoles: ['Postal Assistant (PA)', 'Sorting Assistant (SA)', 'Postman', 'Inspector of Posts'], description: 'Department of Posts under Ministry of Communications.' },
  { id: 'defence', name: 'Defence Civilians (DRDO/ISRO/MES/BRO)', iconName: 'Shield', defaultLevel: 6, popularRoles: ['Scientist B/C', 'Senior Technical Assistant', 'Store Keeper', 'JE (MES)'], description: 'Civilian posts in DRDO, ISRO, Ordnance Factories, Navy/Army Civilians.' },
  { id: 'cpmf', name: 'Paramilitary Forces (CISF/CRPF/BSF/ITBP)', iconName: 'ShieldAlert', defaultLevel: 6, popularRoles: ['Sub-Inspector (SI)', 'Assistant Commandant', 'Head Constable'], description: 'Ministry of Home Affairs CAPF & Police personnel.' },
  { id: 'upsc', name: 'UPSC Civil Services / IAS / IPS', iconName: 'GraduationCap', defaultLevel: 10, popularRoles: ['IAS Officer', 'IPS Officer', 'IRS Assistant Commissioner', 'IFS Officer'], defaultTitle: 'Group A Gazetted Officers', description: 'UPSC Civil Services Examination recruits.' },
  { id: 'central_gen', name: 'Other Central Govt Depts', iconName: 'Landmark', defaultLevel: 6, popularRoles: ['Assistant Section Officer', 'Junior Engineer', 'Senior Accountant', 'Translator'], description: 'Ministries of Home, External Affairs, Defence, Finance, Agriculture.' }
];

export const DA_HISTORY = [
  { date: 'Jan 2016', rate: 0, remark: '7th CPC Base Rate' },
  { date: 'Jul 2016', rate: 2, remark: '+2% Revision' },
  { date: 'Jan 2017', rate: 4, remark: '+2% Revision' },
  { date: 'Jul 2017', rate: 5, remark: '+1% Revision' },
  { date: 'Jan 2018', rate: 7, remark: '+2% Revision' },
  { date: 'Jul 2018', rate: 9, remark: '+2% Revision' },
  { date: 'Jan 2019', rate: 12, remark: '+3% Revision' },
  { date: 'Jul 2019', rate: 17, remark: '+5% Revision' },
  { date: 'Jan 2020 - Jun 2021', rate: 17, remark: 'Frozen due to COVID-19' },
  { date: 'Jul 2021', rate: 28, remark: 'Restored & Unfrozen (+11%)' },
  { date: 'Jan 2022', rate: 34, remark: '+3% Revision' },
  { date: 'Jul 2022', rate: 38, remark: '+4% Revision' },
  { date: 'Jan 2023', rate: 42, remark: '+4% Revision' },
  { date: 'Jul 2023', rate: 46, remark: '+4% Revision' },
  { date: 'Jan 2024', rate: 50, remark: 'Crossed 50% Milestone (HRA Revised)' },
  { date: 'Jul 2024', rate: 53, remark: '+3% Revision' },
  { date: 'Jan 2025 (Est)', rate: 56, remark: 'Estimated DA Hike' },
  { date: 'Jul 2025 (Est)', rate: 60, remark: 'Estimated DA Hike' }
];

export interface CityClassification {
  type: 'X' | 'Y' | 'Z';
  hraRate: number; // e.g. 0.30 for X when DA >= 50%
  higherTaRate: number; // Base TA for level 9+
  midTaRate: number; // Base TA for level 3-8
  lowerTaRate: number; // Base TA for level 1-2
  examples: string[];
  description: string;
}

export const CITY_TYPES: Record<'X' | 'Y' | 'Z', CityClassification> = {
  'X': {
    type: 'X',
    hraRate: 0.30,
    higherTaRate: 7200,
    midTaRate: 3600,
    lowerTaRate: 1350,
    examples: ['Delhi NCR', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Pune'],
    description: 'Tier 1 Metro Cities (Population 50 Lakh+). Maximum HRA (30%) and Higher Transport Allowance.'
  },
  'Y': {
    type: 'Y',
    hraRate: 0.20,
    higherTaRate: 3600,
    midTaRate: 1800,
    lowerTaRate: 900,
    examples: ['Jaipur', 'Lucknow', 'Patna', 'Bhopal', 'Chandigarh', 'Nagpur', 'Surat', 'Kochi', 'Guwahati'],
    description: 'Tier 2 Major Cities (Population 5 to 50 Lakh). Standard HRA (20%) and Standard Transport Allowance.'
  },
  'Z': {
    type: 'Z',
    hraRate: 0.10,
    higherTaRate: 3600,
    midTaRate: 1800,
    lowerTaRate: 900,
    examples: ['Small towns', 'District headquarters', 'Sub-districts', 'Rural posting areas', 'Villages'],
    description: 'Tier 3 Towns & Rural Postings (Population < 5 Lakh). Base HRA (10%) and Standard Transport Allowance.'
  }
};

export const POPULAR_JOB_COMPARISONS = [
  {
    name: 'Income Tax Inspector vs GST Inspector',
    jobA: { title: 'Income Tax Inspector', level: 7, city: 'X' as const, dept: 'incometax' },
    jobB: { title: 'GST Inspector', level: 7, city: 'Y' as const, dept: 'cbic' }
  },
  {
    name: 'Railway Station Master vs SSC CGL Sub-Inspector',
    jobA: { title: 'Railway Station Master', level: 6, city: 'Y' as const, dept: 'railways' },
    jobB: { title: 'Sub-Inspector (CPO)', level: 6, city: 'X' as const, dept: 'ssc' }
  },
  {
    name: 'Postal Assistant vs Tax Assistant',
    jobA: { title: 'Postal Assistant (India Post)', level: 4, city: 'Y' as const, dept: 'postal' },
    jobB: { title: 'Tax Assistant (CBDT)', level: 4, city: 'X' as const, dept: 'incometax' }
  },
  {
    name: 'UPSC IAS Entry (Level 10) vs Level 7 Inspector',
    jobA: { title: 'UPSC IAS / Assistant Commr', level: 10, city: 'X' as const, dept: 'upsc' },
    jobB: { title: 'Central Excise Inspector', level: 7, city: 'X' as const, dept: 'ssc' }
  }
];

// Calculate Income Tax under New Tax Regime FY 2024-25 / 2025-26
export function calculateNewTaxRegime(annualGross: number): { annualTax: number; monthlyTax: number; effectiveRate: number } {
  // Standard Deduction: ₹75,000 under New Regime
  const taxableIncome = Math.max(0, annualGross - 75000);
  let tax = 0;

  // New Regime Slabs:
  // Up to ₹3,000,000 : 0
  // ₹3,000,001 - ₹7,000,000 (3L to 7L): 5%
  // ₹7,000,001 - ₹10,000,000 (7L to 10L): 10%
  // ₹10,000,001 - ₹12,000,000 (10L to 12L): 15%
  // ₹12,000,001 - ₹15,000,000 (12L to 15L): 20%
  // Above ₹15,000,000 : 30%

  if (taxableIncome <= 700000) {
    // Rebate under Sec 87A makes tax ZERO up to 7 Lakh taxable income (87A rebate up to 25,000)
    tax = 0;
  } else {
    let incomeRemaining = taxableIncome;

    // 0 to 3L
    const slab1 = Math.min(300000, incomeRemaining);
    incomeRemaining -= slab1;

    // 3L to 7L @ 5%
    if (incomeRemaining > 0) {
      const slab2 = Math.min(400000, incomeRemaining);
      tax += slab2 * 0.05;
      incomeRemaining -= slab2;
    }

    // 7L to 10L @ 10%
    if (incomeRemaining > 0) {
      const slab3 = Math.min(300000, incomeRemaining);
      tax += slab3 * 0.10;
      incomeRemaining -= slab3;
    }

    // 10L to 12L @ 15%
    if (incomeRemaining > 0) {
      const slab4 = Math.min(200000, incomeRemaining);
      tax += slab4 * 0.15;
      incomeRemaining -= slab4;
    }

    // 12L to 15L @ 20%
    if (incomeRemaining > 0) {
      const slab5 = Math.min(300000, incomeRemaining);
      tax += slab5 * 0.20;
      incomeRemaining -= slab5;
    }

    // Above 15L @ 30%
    if (incomeRemaining > 0) {
      tax += incomeRemaining * 0.30;
    }

    // Add 4% Health & Education Cess
    tax = tax * 1.04;
  }

  const annualTax = Math.round(tax);
  const monthlyTax = Math.round(annualTax / 12);
  const effectiveRate = annualGross > 0 ? Number(((annualTax / annualGross) * 100).toFixed(1)) : 0;

  return { annualTax, monthlyTax, effectiveRate };
}

// Calculate Income Tax under Old Tax Regime with standard deductions (80C, 80D, HRA)
export function calculateOldTaxRegime(annualGross: number, annualHra: number): { annualTax: number; monthlyTax: number; effectiveRate: number } {
  // Std deduction ₹50,000 + 80C ₹150,000 + 80D ₹25,000 + HRA Exemption
  const totalDeduction = 50000 + 150000 + 25000 + Math.min(annualHra, 150000);
  const taxableIncome = Math.max(0, annualGross - totalDeduction);
  let tax = 0;

  if (taxableIncome <= 500000) {
    tax = 0; // Sec 87A rebate up to 12,500
  } else {
    // 0 to 2.5L: Nil
    let remaining = taxableIncome - 250000;
    // 2.5L to 5L @ 5%
    const slab1 = Math.min(250000, remaining);
    tax += slab1 * 0.05;
    remaining -= slab1;

    // 5L to 10L @ 20%
    if (remaining > 0) {
      const slab2 = Math.min(500000, remaining);
      tax += slab2 * 0.20;
      remaining -= slab2;
    }

    // Above 10L @ 30%
    if (remaining > 0) {
      tax += remaining * 0.30;
    }

    tax = tax * 1.04; // 4% Cess
  }

  const annualTax = Math.round(tax);
  const monthlyTax = Math.round(annualTax / 12);
  const effectiveRate = annualGross > 0 ? Number(((annualTax / annualGross) * 100).toFixed(1)) : 0;

  return { annualTax, monthlyTax, effectiveRate };
}
