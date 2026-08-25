import React, { useState, useEffect, useMemo } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { useSearchParams } from 'react-router';
import { 
  Calculator, PieChart as PieChartIcon, IndianRupee, Download, Info, 
  MapPin, TrendingUp, CheckCircle2, FileText, Activity, Building2,
  Award, Train, FileCheck, Shield, ShieldAlert, GraduationCap,
  ChevronDown, ChevronUp, Share2, Printer, Sparkles, HelpCircle,
  BarChart3, RefreshCw, Eye, ArrowRight, Layers
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { 
  PAY_MATRIX, 
  PAY_LEVEL_INFO, 
  DEPARTMENTS, 
  CITY_TYPES, 
  calculateNewTaxRegime, 
  calculateOldTaxRegime 
} from '../data/salaryData';

import PayMatrixExplorer from '../components/salary/PayMatrixExplorer';
import SalarySlipModal from '../components/salary/SalarySlipModal';
import DaHistoryTimeline from '../components/salary/DaHistoryTimeline';
import PromotionSimulator from '../components/salary/PromotionSimulator';
import CareerGrowthChart from '../components/salary/CareerGrowthChart';
import SalaryComparison from '../components/salary/SalaryComparison';
import CityComparisonCard from '../components/salary/CityComparisonCard';
import TaxRegimeComparison from '../components/salary/TaxRegimeComparison';
import JobsByLevelSection from '../components/salary/JobsByLevelSection';
import SubscribeWidget from '../components/SubscribeWidget';
import CommentsSection from '../components/CommentsSection';
import ArticleStickyBottomBar from '../components/ArticleStickyBottomBar';

export default function SalaryCalculatorArticle() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params or defaults
  const initialDept = searchParams.get('department') || 'ssc';
  const initialLevel = Number(searchParams.get('level')) || 7;
  const initialCity = (searchParams.get('city') as 'X' | 'Y' | 'Z') || 'X';
  const initialBasic = Number(searchParams.get('basic')) || PAY_MATRIX[initialLevel]?.[0] || 44900;
  const initialDa = Number(searchParams.get('da')) || 50;

  const [departmentId, setDepartmentId] = useState<string>(initialDept);
  const [payLevel, setPayLevel] = useState<number>(initialLevel);
  const [basicPay, setBasicPay] = useState<number>(initialBasic);
  const [cityType, setCityType] = useState<'X' | 'Y' | 'Z'>(initialCity);
  const [daPercentage, setDaPercentage] = useState<number>(initialDa);
  const [includeNps, setIncludeNps] = useState<boolean>(true);
  const [includeCghs, setIncludeCghs] = useState<boolean>(true);
  const [taxRegime, setTaxRegime] = useState<'new' | 'old' | 'none'>('new');
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState<boolean>(false);

  // Expandable formula states
  const [showFormulas, setShowFormulas] = useState<boolean>(false);

  // Sync state to URL params
  useEffect(() => {
    setSearchParams({
      department: departmentId,
      level: payLevel.toString(),
      basic: basicPay.toString(),
      city: cityType,
      da: daPercentage.toString()
    }, { replace: true });
  }, [departmentId, payLevel, basicPay, cityType, daPercentage, setSearchParams]);

  // When Pay Level changes, adjust basic pay to Level's Entry Basic if current basic isn't in new level matrix
  const handleLevelChange = (newLevel: number) => {
    setPayLevel(newLevel);
    const cells = PAY_MATRIX[newLevel] || [];
    if (!cells.includes(basicPay)) {
      setBasicPay(cells[0] || 18000);
    }
  };

  // When department changes, set default pay level for that department
  const handleDepartmentChange = (deptId: string) => {
    setDepartmentId(deptId);
    const dept = DEPARTMENTS.find(d => d.id === deptId);
    if (dept) {
      handleLevelChange(dept.defaultLevel);
    }
  };

  // Allow direct selection from Pay Matrix grid
  const handleSelectMatrixCell = (level: number, basic: number) => {
    setPayLevel(level);
    setBasicPay(basic);
    // Smooth scroll to summary card
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Salary Calculations according to 7th CPC official rules
  const daAmount = Math.round(basicPay * (daPercentage / 100));
  
  // HRA Calculation: 30% for X, 20% for Y, 10% for Z when DA >= 50%
  const currentCityInfo = CITY_TYPES[cityType];
  const hraAmount = Math.round(basicPay * currentCityInfo.hraRate);

  // Transport Allowance (TA) Calculation
  let baseTa = 1800;
  if (payLevel >= 9) {
    baseTa = currentCityInfo.higherTaRate;
  } else if (payLevel >= 3) {
    baseTa = currentCityInfo.midTaRate;
  } else {
    baseTa = currentCityInfo.lowerTaRate;
  }
  const taDa = Math.round(baseTa * (daPercentage / 100));
  const taAmount = baseTa + taDa;

  // Monthly Gross Salary
  const grossSalary = basicPay + daAmount + hraAmount + taAmount;

  // Deductions
  const npsDeduction = includeNps ? Math.round((basicPay + daAmount) * 0.10) : 0;
  
  // CGHS Deduction Rates
  let cghsDeduction = 0;
  if (includeCghs) {
    if (payLevel >= 12) cghsDeduction = 1000;
    else if (payLevel >= 7) cghsDeduction = 650;
    else if (payLevel === 6) cghsDeduction = 450;
    else cghsDeduction = 250;
  }

  // Estimated Tax Deduction
  let monthlyTax = 0;
  if (taxRegime === 'new') {
    monthlyTax = calculateNewTaxRegime(grossSalary * 12).monthlyTax;
  } else if (taxRegime === 'old') {
    monthlyTax = calculateOldTaxRegime(grossSalary * 12, hraAmount * 12).monthlyTax;
  }

  const totalDeductions = npsDeduction + cghsDeduction + monthlyTax;
  const netSalary = grossSalary - totalDeductions;

  // Employer NPS Contribution (14%)
  const employerNps = Math.round((basicPay + daAmount) * 0.14);
  const totalCtc = grossSalary + employerNps;

  // Multipliers for Monthly vs Annual view
  const multiplier = isAnnual ? 12 : 1;
  const labelSuffix = isAnnual ? '/ year' : '/ month';

  // Chart Data
  const chartData = [
    { name: 'Basic Pay', value: basicPay * multiplier, color: '#2563eb' },
    { name: 'Dearness Allowance (DA)', value: daAmount * multiplier, color: '#7c3aed' },
    { name: 'House Rent (HRA)', value: hraAmount * multiplier, color: '#059669' },
    { name: 'Transport (TA)', value: taAmount * multiplier, color: '#d97706' },
  ];

  const selectedDepartment = DEPARTMENTS.find(d => d.id === departmentId) || DEPARTMENTS[0];
  const levelInfo = PAY_LEVEL_INFO[payLevel] || PAY_LEVEL_INFO[6];

  // Percentages for stacked bar & gauge
  const takeHomePct = Math.round((netSalary / grossSalary) * 100) || 0;
  const deductionPct = 100 - takeHomePct;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>7th Pay Commission Salary Calculator 2026 | In-Hand, DA, HRA, NPS, Pay Matrix</title>
        <meta 
          name="description" 
          content={`Calculate 7th CPC Government Salary for Level ${payLevel} (${levelInfo.defaultTitle}). Basic ₹${basicPay}, DA ${daPercentage}%, HRA, In-Hand Net Salary ₹${netSalary.toLocaleString('en-IN')}. Official Pay Matrix & Slip.`} 
        />
        <link rel="canonical" href={`https://newvacancyalert.in/salary-calculator?level=${payLevel}&city=${cityType}&basic=${basicPay}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> 7th CPC Official Rules
            </span>
            <span className="flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
              <Activity className="w-3.5 h-3.5 text-emerald-600" /> DA Active @ {daPercentage}%
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Ultimate Government <span className="text-blue-600">Salary Calculator</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Calculate exact Gross Pay, Allowances (DA, HRA, TA), NPS Deductions, Income Tax, and In-Hand Salary across all Central & State Government Pay Levels (Level 1 to 18).
          </p>

          {/* Monthly vs Annual Toggle Banner */}
          <div className="pt-2 flex justify-center">
            <div className="bg-slate-200/80 p-1 rounded-2xl inline-flex items-center gap-1 border border-slate-300/80 shadow-xs">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  !isAnnual ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Figures
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isAnnual ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annual Projections (12 Months)
              </button>
            </div>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Panel (Left) */}
          <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" /> Salary Parameters
              </h2>
              <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                Interactive
              </span>
            </div>

            {/* 1. Department Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                1. Select Department / Service
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DEPARTMENTS.slice(0, 6).map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleDepartmentChange(dept.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[60px] ${
                      departmentId === dept.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-[11px] font-bold leading-tight block truncate">{dept.name}</span>
                    <span className={`text-[9px] font-bold block ${departmentId === dept.id ? 'text-blue-200' : 'text-slate-500'}`}>
                      Level {dept.defaultLevel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pay Level Selector (Levels 1 to 18) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span className="uppercase text-slate-500 font-black text-[11px]">2. 7th CPC Pay Level</span>
                <span className="text-blue-600 font-black text-sm">Level {payLevel} (GP ₹{levelInfo.gradePay})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 18 }, (_, i) => i + 1).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                      payLevel === lvl
                        ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={`Level ${lvl}: ${PAY_LEVEL_INFO[lvl]?.defaultTitle}`}
                  >
                    L{lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                Role Examples: <span className="text-slate-900 font-extrabold">{levelInfo.roles.join(', ')}</span>
              </p>
            </div>

            {/* 3. Basic Pay Dropdown (Populated directly from Pay Matrix) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                3. Basic Pay (7th CPC Pay Cell)
              </label>
              <select
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-black text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {(PAY_MATRIX[payLevel] || []).map((cellVal, idx) => (
                  <option key={cellVal} value={cellVal}>
                    Cell {idx + 1}: ₹{cellVal.toLocaleString('en-IN')} {idx === 0 ? '(Entry Basic Pay)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. City Classification (X, Y, Z Cards) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                4. Posting City Category (HRA Rate)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['X', 'Y', 'Z'] as const).map((type) => {
                  const info = CITY_TYPES[type];
                  const isSelected = cityType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setCityType(type)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-black uppercase block">Class {type}</span>
                      <span className={`text-[11px] font-bold block mt-0.5 ${isSelected ? 'text-amber-300' : 'text-blue-600'}`}>
                        {(info.hraRate * 100)}% HRA
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] font-medium text-slate-500 pl-1">
                Examples: {currentCityInfo.examples.slice(0, 5).join(', ')}.
              </p>
            </div>

            {/* 5. DA Percentage Slider & Input */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span className="uppercase text-slate-500 font-black text-[11px]">5. Dearness Allowance (DA %)</span>
                <span className="text-purple-700 font-black">{daPercentage}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={daPercentage}
                  onChange={(e) => setDaPercentage(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  value={daPercentage}
                  onChange={(e) => setDaPercentage(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-center font-black text-xs text-slate-900"
                />
              </div>
            </div>

            {/* 6. NPS & CGHS & Tax Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs font-bold">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <span className="text-slate-800">Include NPS Tier-1 (10% Employee)</span>
                <input
                  type="checkbox"
                  checked={includeNps}
                  onChange={(e) => setIncludeNps(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <span className="text-slate-800">Include CGHS Medical Health Scheme</span>
                <input
                  type="checkbox"
                  checked={includeCghs}
                  onChange={(e) => setIncludeCghs(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <div className="space-y-1">
                <span className="text-slate-500 font-black uppercase text-[10px] block">Income Tax Estimation</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setTaxRegime('new')}
                    className={`py-2 rounded-xl text-[11px] font-black uppercase transition cursor-pointer ${
                      taxRegime === 'new' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    New Regime
                  </button>
                  <button
                    onClick={() => setTaxRegime('old')}
                    className={`py-2 rounded-xl text-[11px] font-black uppercase transition cursor-pointer ${
                      taxRegime === 'old' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Old Regime
                  </button>
                  <button
                    onClick={() => setTaxRegime('none')}
                    className={`py-2 rounded-xl text-[11px] font-black uppercase transition cursor-pointer ${
                      taxRegime === 'none' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    No Tax
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Results & Live Visual Cards (Right) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Stat Cards (Gross & Take-Home) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Gross Card */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-blue-50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="relative z-10 space-y-1">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                    TOTAL GROSS SALARY
                  </span>
                  <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    ₹{(grossSalary * multiplier).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Before Deductions {labelSuffix}
                  </span>
                </div>
              </div>

              {/* Net In-Hand Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 shadow-md relative overflow-hidden text-white space-y-1">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="relative z-10">
                  <span className="text-xs font-black text-emerald-200 uppercase tracking-widest block">
                    NET IN-HAND TAKE-HOME
                  </span>
                  <div className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                    ₹{(netSalary * multiplier).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-100 block">
                    Credited to Bank Account {labelSuffix}
                  </span>
                </div>
              </div>

            </div>

            {/* Gauge Bar & CTC Highlights */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-blue-600" /> Take-Home Ratio ({takeHomePct}% Net In-Hand)
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  Total Deductions: ₹{(totalDeductions * multiplier).toLocaleString('en-IN')} ({deductionPct}%)
                </span>
              </div>

              {/* Stacked Percentage Progress Bar */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${takeHomePct}%` }}
                  title={`Take Home: ${takeHomePct}%`}
                ></div>
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${deductionPct}%` }}
                  title={`Deductions: ${deductionPct}%`}
                ></div>
              </div>

              {/* Employer Contribution & CTC Banner */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Employer NPS (14%)</span>
                  <span className="font-black text-slate-900 text-sm">₹{(employerNps * multiplier).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200">
                  <span className="text-blue-800 font-bold block text-[10px] uppercase">Total Govt CTC</span>
                  <span className="font-black text-blue-900 text-sm">₹{(totalCtc * multiplier).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Detailed Payslip Table Breakdown & Pie Chart */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Salary Components Breakdown
                </h3>
                <button
                  onClick={() => setIsSlipModalOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Generate Salary Slip</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Allowances & Deductions Text List */}
                <div className="space-y-5 text-xs">
                  <div>
                    <h4 className="font-black text-blue-600 uppercase tracking-widest text-[10px] mb-2.5">
                      EARNINGS (ALLOWANCES)
                    </h4>
                    <div className="space-y-2 font-medium">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-600">Basic Pay</span>
                        <span className="font-black text-slate-900">₹{(basicPay * multiplier).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-600">Dearness Allowance ({daPercentage}%)</span>
                        <span className="font-black text-slate-900">₹{(daAmount * multiplier).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-600">House Rent (HRA)</span>
                        <span className="font-black text-slate-900">₹{(hraAmount * multiplier).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-600">Transport Allowance (TA)</span>
                        <span className="font-black text-slate-900">₹{(taAmount * multiplier).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-rose-600 uppercase tracking-widest text-[10px] mb-2.5">
                      DEDUCTIONS
                    </h4>
                    <div className="space-y-2 font-medium">
                      {includeNps && (
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-600">NPS Employee (10%)</span>
                          <span className="font-black text-rose-600">-₹{(npsDeduction * multiplier).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {cghsDeduction > 0 && (
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-600">CGHS Medical Contribution</span>
                          <span className="font-black text-rose-600">-₹{(cghsDeduction * multiplier).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {monthlyTax > 0 && (
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-600">Income Tax (TDS)</span>
                          <span className="font-black text-rose-600">-₹{(monthlyTax * multiplier).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Donut Chart Visualizer */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold">
                    {chartData.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-slate-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 1. Interactive Pay Matrix Explorer Grid */}
        <PayMatrixExplorer
          currentLevel={payLevel}
          currentBasic={basicPay}
          onSelectCell={handleSelectMatrixCell}
        />

        {/* 2. Promotion Impact Simulator */}
        <PromotionSimulator
          currentLevel={payLevel}
          currentBasic={basicPay}
          cityType={cityType}
          daPercentage={daPercentage}
        />

        {/* 3. 30-Year Career Growth & Pension Chart */}
        <CareerGrowthChart
          initialBasic={basicPay}
          initialGross={grossSalary}
        />

        {/* 4. Side-by-Side Two Salary Comparison */}
        <SalaryComparison />

        {/* 5. Class X vs Y vs Z City Allowance Matrix */}
        <CityComparisonCard
          basicPay={basicPay}
          payLevel={payLevel}
          daPercentage={daPercentage}
        />

        {/* 6. Income Tax Regime Estimator (Old vs New) */}
        <TaxRegimeComparison
          monthlyGross={grossSalary}
          monthlyHra={hraAmount}
        />

        {/* 7. Historical DA Revisions Timeline */}
        <DaHistoryTimeline />

        {/* 8. Which Jobs Use Pay Level X? Connector */}
        <JobsByLevelSection currentLevel={payLevel} />

        {/* 9. Official Formulas & Mathematical Breakdown Accordion */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900">
                Official Calculation Formulas & Government Rules
              </h3>
            </div>
            {showFormulas ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {showFormulas && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <strong className="text-slate-900 font-sans text-xs font-black block">Dearness Allowance (DA)</strong>
                <p className="text-slate-700">DA = Basic Pay × Current DA Percentage</p>
                <p className="text-[11px] text-slate-500 font-sans">Revised semi-annually in January & July as per AICPIN index.</p>
              </div>

              <div className="space-y-1">
                <strong className="text-slate-900 font-sans text-xs font-black block">House Rent Allowance (HRA)</strong>
                <p className="text-slate-700">Class X = 30% | Class Y = 20% | Class Z = 10%</p>
                <p className="text-[11px] text-slate-500 font-sans">Triggered under Dept of Expenditure order when DA crossed 50% milestone.</p>
              </div>

              <div className="space-y-1">
                <strong className="text-slate-900 font-sans text-xs font-black block">Transport Allowance (TA)</strong>
                <p className="text-slate-700">TA = Base TA Slab + (Base TA × DA%)</p>
                <p className="text-[11px] text-slate-500 font-sans">Higher rate applies to 19 Higher TPTA cities for Level 3+.</p>
              </div>

              <div className="space-y-1">
                <strong className="text-slate-900 font-sans text-xs font-black block">NPS Contribution</strong>
                <p className="text-slate-700">Employee = 10% of (Basic + DA) | Govt = 14% of (Basic + DA)</p>
                <p className="text-[11px] text-slate-500 font-sans">Tier-1 account contribution under PFRDA guidelines.</p>
              </div>
            </div>
          )}
        </div>

        {/* 10. Comprehensive FAQs Section */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" /> Frequently Asked Questions (FAQs)
          </h2>

          <div className="space-y-6 text-slate-700">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">1. What is the current DA percentage in 2026 for Central Government Employees?</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                As per the latest Ministry of Finance orders, the Dearness Allowance (DA) is active at 50%+ of Basic Pay. When DA reached 50%, HRA rates automatically revised to 30% (Class X), 20% (Class Y), and 10% (Class Z).
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">2. How is annual increment calculated under the 7th CPC?</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Annual increment is granted either on 1st January or 1st July each year. It is calculated by moving down by one cell in the vertical level of the 7th CPC Pay Matrix, representing approximately a 3% increase in Basic Pay.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">3. What is the difference between Gross Salary and In-Hand Salary?</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Gross Salary is the total sum of Basic Pay and all allowances (DA, HRA, TA). In-Hand (Net) Salary is the actual amount credited to your bank account after subtracting monthly deductions like NPS (10%), CGHS medical health contribution, and Income Tax (TDS).
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">4. Is NPS mandatory for all government employees?</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Yes, for all Central Government employees recruited on or after January 1, 2004, the National Pension System (NPS Tier 1) is mandatory. The employee contributes 10% of (Basic Pay + DA), while the Government contributes 14%.
              </p>
            </div>
          </div>
        </div>



        {/* Comments & Discussion */}
        <div id="comments-section">
          <CommentsSection pageId="salary-calculator" pageTitle="7th CPC Salary Calculator" />
        </div>

        {/* Priority Push Notification Subscription Bar */}
        <SubscribeWidget mode="bottom" />

      </div>

      {/* Sticky Bottom Action Bar */}
      <ArticleStickyBottomBar 
        title="7th Pay Commission Salary Calculator 2026: DA, HRA, NPS & In-Hand Salary"
        description="Calculate exact Central and State Government employee salary. Determine Gross Pay, DA, HRA, TA, NPS deductions, and final In-Hand Net Salary across all Pay Levels."
      />

      {/* Official Printable Salary Slip Modal */}
      <SalarySlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        data={{
          departmentName: selectedDepartment.name,
          payLevel,
          basicPay,
          daAmount,
          daPercentage,
          hraAmount,
          cityType,
          taAmount,
          grossSalary,
          npsDeduction,
          cghsDeduction,
          incomeTax: monthlyTax,
          totalDeductions,
          netSalary,
          employerNps,
          ctc: totalCtc
        }}
      />

      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "7th Pay Commission Government Salary Calculator",
          "applicationCategory": "FinancialApplication",
          "operatingSystem": "All",
          "url": "https://newvacancyalert.in/salary-calculator",
          "description": "Comprehensive Government Salary Calculator for 7th CPC. Calculates Gross Pay, DA, HRA, TA, NPS, Tax, and In-Hand Net Salary across Pay Levels 1 to 18.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is the current DA percentage in 2026 for Central Government Employees?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "As per latest orders, Dearness Allowance is active at 50%+ of Basic Pay, triggering HRA revisions to 30%, 20%, and 10%."
              }
            },
            {
              "@type": "Question",
              "name": "How is annual increment calculated under 7th CPC?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Annual increment moves salary down by 1 cell in the 7th CPC Pay Matrix, representing ~3% increase in Basic Pay."
              }
            }
          ]
        })}
      </script>
    </div>
  );
}
