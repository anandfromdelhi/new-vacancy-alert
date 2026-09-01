import React, { useState } from 'react';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import { Link } from 'react-router';
import { 
  BookOpen, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Clock, ShieldCheck, HelpCircle, Layers, Sparkles, ChevronDown, 
  ChevronUp, Target, BarChart2, Calendar, Award, BookCheck, Check, 
  RotateCcw, FileText, Star, Calculator, Flame, Lightbulb, Compass,
  Briefcase, CheckSquare, Zap, AlertTriangle, Library, BookmarkCheck,
  ShoppingCart, ExternalLink, GraduationCap, School, BookMarked,
  BrainCircuit, History, Globe2, Landmark, Atom, Cpu, CheckCheck
} from 'lucide-react';
import CommentsSection from '../components/CommentsSection';
import SubscribeWidget from '../components/SubscribeWidget';
import ArticleStickyBottomBar from '../components/ArticleStickyBottomBar';

export const BPSC_TRE4_BOOK_LINKS = {
  NCERT_SET: "https://www.amazon.in/s?k=NCERT+Books+Class+6+to+12+Set&tag=newvacancyale-21",
  LUCENT_GK: "https://www.amazon.in/Lucents-Samanya-Gyan-General-Knowledge/dp/B0H9YWR411?crid=2GHMWW8ZPW0HN&dib=eyJ2IjoiMSJ9.E48bcDcjD5b1cESWb2mGncLTlVPDgGRaU5W0Tpn6NJyqEEbE0m3I0sDywUjuiWV7bBbJis507O9e4faF0lahjoWUxth4NdVU1Se4loQrfQcKSK8ljq9oN1-_5ve-3k8Has1TnouDtzTBqqTV5cyQlvims-4xFTDNzoDyCpBDFzcvDKLPQAZvCzhXx1p-mptbi4u51xyb2wUE7CZwlbIQTSZGA2EJUY5OqCb-AEdJJ7g.ai1-4SYhEOHUTyJCNhjtkzjxA1UvdSXClcwl8D9OLZI&dib_tag=se&keywords=Lucent%27s+General+Knowledge+%28Samanya+Gyan%29&qid=1788225680&sprefix=lucent%27s+general+knowledge+samanya+gyan+%2Caps%2C432&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=18d370f4fa637dca4c48fcbe266cb9c5&ref_=as_li_ss_tl",
  BIHAR_GK: "https://www.amazon.in/Samagra-Revised-Updated-Anisha-Bharti/dp/B0H3J16Q6P?crid=1SCNDMKU5H4U8&dib=eyJ2IjoiMSJ9.1ZZg6CEq6DMcVZxy01dQPyFY7QbEwHxKkfkWb2zPEzkk6aNTXN11ODWw122h0bZ0K4hWU6Eo2n4uxX6jg9zAo1-pZ9UZT1jQMbBKjwhnJ_InsLqnBbIUekUCyqqmQopSJek6d85a8GHOzabqvRXLje8roB8bv2Mqme9eqzaWrMIVfGHewAXPjyCWwJzqtDfZbzqA20FYqU8OZAV3SwRxUFPgqkManuR1NmCrdMFskac.T99hEK6lbRLRrrNjKjL1UtjXbYWBKwP_ljtEdY2QDI4&dib_tag=se&keywords=Bihar+General+Knowledge+%28Bihar+Samagra%29&qid=1788225719&sprefix=bihar+general+knowledge+bihar+samagra+%2Caps%2C300&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=7f93878fb7b271e3d508d8ad24734171&ref_=as_li_ss_tl",
  LUCENT_HINDI: "https://www.amazon.in/s?k=Lucent+Samanya+Hindi&tag=newvacancyale-21",
  HARDEV_BAHRI_HINDI: "https://www.amazon.in/Adhunik-Hindi-Vyakaran-Aur-Rachna/dp/8177090771?crid=2AV4Q1EM7JFFB&dib=eyJ2IjoiMSJ9.F5bIFz3u2nZZTG3kuxUB_rH_KYN3Y4rEhpjz4QGQWB8pz-DZVOorAtT4s0ebfILvp6vZqy4khwU_yKgZoHmVLSmPoWXPbL095xU_Jt8ziYx6rCcBh5dNUFhKLwhlqotZOPK-L7Cnxg-mziIKJAyEnSVsfbZBW-2UJEoOxtm2Hvbp2bgzLDP9dZsuc5CjpQeM6jRSQF_6OelmxbxEZe95X_p76mS_6iu2XyvKEHSIB5s.Yjntqwkda7dCLRWK0es9cvoNqN0HC8xyvCOI4hEP2Qg&dib_tag=se&keywords=Hindi+Vyakaran+Aur+Rachna+Dr.+Hardev+Bahri&qid=1788225803&sprefix=hindi+vyakaran+aur+rachna+dr.+hardev+bahri%2Caps%2C285&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=721e1c5ad810f47635b59a90c50bd343&ref_=as_li_ss_tl",
  WREN_MARTIN_ENGLISH: "https://www.amazon.in/High-School-English-Gram-Comp/dp/9358705736?crid=11IPFYUI982XS&dib=eyJ2IjoiMSJ9.Zqd5QyJ2xx-C9x87ERMRMfCEiqclQIV0vzsMIuGimLI4ma_RG0-MGeZxPanQfl8aIXQxeMwxfUJPRobS5bONT2A65sDh5sVggn7VBzT6hzhhq6Wozkg-nd1M5rp7dHzIqGffcez9oRNf8TwmDk2cpLpz_UKnxHWriqVLRGrrmpUH6ydSnRfgF_AAI7q1Fby8ZICLVV9iT1ehVkJMylMRGhcwWVGHFcYrcfVEIQHUzQU.2cpagqTq38JiCPB4XyWoI0wes9_dAmGzc_NjRWNmvR0&dib_tag=se&keywords=High+School+English+Grammar+%26+Composition+Wren+%26+Martin&nsdOptOutParam=true&qid=1788225844&sprefix=high+school+english+grammar+%26+composition+wren+%26+martin%2Caps%2C263&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=2e2a6291432bc14688f291ccf0e7b4ea&ref_=as_li_ss_tl",
  SP_BAKSHI_ENGLISH: "https://www.amazon.in/Objective-General-English-SP-Bakshi/dp/9325791714?crid=22K7UKSGXZ0S7&dib=eyJ2IjoiMSJ9.lrl6m-oNeAwW63a3AzrzbRy7yA0r2fogOGb4OiwWpif9jMHOLs2ZNP0HeZLS_PuQFXSNWjq7LgURy-yVvvwKynUixM98dPRK1CuNcBJQ0mCOw2yQpDHn4QfY1dpj4EQ1_VKENAp68RCMA0GvnvZ3hhxQvymJq8zbDIOFi17-SBoCJk86rKQgNX756F7DdLM6QefCO4NZbbAxuhyXp-glyq40UToSicufzfAH6dzNF-s.sErUJ2fV4kW-171jXS5KI3J3gDep2F6PZL8REGU_4KE&dib_tag=se&keywords=Objective+General+English+S.P.+Bakshi+%28Arihant%29&qid=1788225876&sprefix=objective+general+english+s.p.+bakshi+arihant+%2Caps%2C310&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=9d9c0026056fd454bb26225c5ab1c66d&ref_=as_li_ss_tl",
  CDP_ARIHANT_KIRAN: "https://www.amazon.in/Arihant-Development-Pedagogy-Classes-Useful/dp/9378168507?crid=32TH2OJ0CZO76&dib=eyJ2IjoiMSJ9.1FbHDSrRvTBLrqz8xonNuPMJzbJUSRbcKiozDAT_U9hbGq1bbJKdPehX1M7HV1IjcE4SbMDt-wBn1H4ipRyvvCzmcDbkqRp1rAQ9m5jJ8TblLbqdmqbZ39HpU8QHRegtPTOteJ-4oYuJRIuO8hOuGcR5dUAjMM3K_wKsR2X-N0lFkfP-cNIv5NsIrNFHS390gA2-Mqs_DJZWV6zckCRNz1-yh1c-BBZmozl6xVPszfg.BRG9D5nkAusViUhzhNjVIZ5hd2sGH1L0dl_J82nv-nU&dib_tag=se&keywords=Child+Development+%26+Pedagogy+%28CDP%29+Arihant+%2F+Kiran&nsdOptOutParam=true&qid=1788225903&sprefix=child+development+%26+pedagogy+cdp+arihant+%2F+kiran%2Caps%2C274&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=94fd3b9d7adb6a32191daef0f388051c&ref_=as_li_ss_tl",
  RS_MATHS: "https://www.amazon.in/Quantitative-Aptitude-Revised-2025-Competitive/dp/B0D6VFV3ZP?crid=2ALMPKAUXA0IW&dib=eyJ2IjoiMSJ9.VkujiB2B1ecVnsMClRRrpNeHUstiJWme5OSH-29Vgk_8s02n_IDcGp61mlM7lRBCwc7LjKKG2WvgXmTy0RwjIxH5sWbTNhG0XAsdPIqwXrAn_zwuEV3Jgt5jOeIn8boCGeDJBB-NK2sVrGiZ9JV_O31_m2UyOUys-rmjpJk6JQylEiIGL_BBKn86R8KLGayVrEXsj4Afgf0tIYCWWLwY1-lF_uMg_0kopmCLSWBpkTg.MckLwUS-rzptB_U-3RalU0boE4jCvhvIko9UoiVjGCk&dib_tag=se&keywords=Quantitative+Aptitude+for+Competitive+Exams+R.S.+Aggarwal+%28S.+Chand%29&nsdOptOutParam=true&qid=1788225933&sprefix=quantitative+aptitude+for+competitive+exams+r.s.+aggarwal+s.+chand+%2Caps%2C267&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=c8b0b652e6b306f42020c6cf30a30501&ref_=as_li_ss_tl",
  NCERT_SCIENCE: "https://www.amazon.in/s?k=NCERT+Science+Class+6+to+10&tag=newvacancyale-21",
  HC_VERMA_PHYSICS: "https://www.amazon.in/Concepts-Physics-ORIGINAL-BOOKS-TOP-Editions/dp/B0F4NPPS95?crid=1KBQMDAUDA2YG&dib=eyJ2IjoiMSJ9.fR6h-S6yT-YIqkcH83u9ZVzIQkGMUeaiBU2u68gBCbCAvnl9tGQNwdJ7Dk3DO86P7rpmIHGERhT9pnvolag1EPpf__Bs277xUPerT-r0SvDg1gmcF9RJOyFmy44-BPoE8pgko3Ul9_gg-rbKxqyCiWZ2Lz6uHmYlx25k5fN3dhlDaIuLWkllNR95-PuN_If_bVkiyBBQxBQE3z8mHYT2sIPTY0I5yZ2UHv29uSK-_JA.ut6Nmp8IuyTM7pIX5h_xsKHAQxHqyd4uh_mUCl1qJig&dib_tag=se&keywords=Concepts+of+Physics+%28Vol+1+%26+2%29+H.C.+Verma&nsdOptOutParam=true&qid=1788225968&sprefix=concepts+of+physics+vol+1+%26+2+h.c.+verma%2Caps%2C271&sr=8-3&linkCode=ll2&tag=newvacancyale-21&linkId=b89011858ac8c4297e7ccd14096f35f6&ref_=as_li_ss_tl",
  SPECTRUM_HISTORY: "https://www.amazon.in/Spectrum-History-Modern-Latest-Competitive/dp/B0GYNTYXMQ?crid=3K798FS3ZLG2Z&dib=eyJ2IjoiMSJ9.Dp1l_VoZsP6v-gZT9yfJL0qPFe5RYWiygGu0AfflBHYgO9TxzPLFvjDO9yMfKfRQUcIfEaCHhEiB0UEOAZDoKuDXN8O0zD3NNFRHGeZJHukeb4N11dmlFWy4MRRFagHmrfwe0K01ZjpKktgnKVFeF1Q-ePGfmeidWCPJ78En0ExxN8778t4Z-saTErk0oyo5sBTdlclk0sjcnTBv-bZPr4XMMftEoOcWdNYO0LimO00.i2lG5bIUghq7n3gEFnrManufTY1kE9QQS3cCNNm6fiI&dib_tag=se&keywords=A+Brief+History+of+Modern+India+Spectrum+%28Rajiv+Ahir%29&nsdOptOutParam=true&qid=1788226002&sprefix=a+brief+history+of+modern+india+spectrum+rajiv+ahir+%2Caps%2C265&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=c7b9c3c2667f77e7869ca1909d3f0afa&ref_=as_li_ss_tl",
  LAXMIKANTH_POLITY: "https://www.amazon.in/Courseware-Laxmikanth-Conceptual-Well-structured-Insightful/dp/9364447670?crid=B892XCZI84NR&dib=eyJ2IjoiMSJ9.txSv6-ZSfZWcAQvN7KteyMGIHpyuhVNDrTVGRi3M3wFq6XlBygVOFDKtiPUn-8-9Kf446AtHhpC45ce5bdqMoyK9z9KS_YI0sDn50Mwma8BhqKN_sLDXAxhnMQ0TyH6qPiYbe0VSDdRnmBpFHQzi2n2exRUMXeyI9Sw-qjxBwreSS7v8cxadTW5qyZ-kXIe7fhsmdGiSJ3Ps9zRIDkHuqTkpJ1u9frPriJo0U5nYR08.4vR5pP_TnPqeJZyJcwtLZoOQDyLI6JyXOc-_VQ66Rak&dib_tag=se&keywords=Indian+Polity+M.+Laxmikanth+%28McGraw+Hill%29&qid=1788226031&sprefix=indian+polity+m.+laxmikanth+mcgraw+hill+%2Caps%2C283&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=35891f282da43d3d06c571898a987c35&ref_=as_li_ss_tl",
  GC_LEONG_GEO: "https://www.amazon.in/Certificate-Physical-Geography-Complete-Competitive/dp/B0GNMH1L6J?crid=1UMMTK3URHU5C&dib=eyJ2IjoiMSJ9.h0NJm9xkZx5WCIxj4Wq1cGPOw3WDj3e9pihfOI7WGVfj1tGT23zzM018sPJBnS3OZXADztmkUe49KqxtbVF2TKTQTiSlN-FajK3EkiYwwR_pDv6oG7hQYLRm3vFBM_1AanO6uiH8IWQCYM_ptwCa8jV8r-N3-MyyaMCYp3AT3Em5jrm8NkmCDuiQ2uua9GHc2CHCjRKCGQyHEMNEH7EMW79_8f6pIEeisdC73FvKqkc.poOCdJ5mL66VFQwY156kcFmf_T4lJjj6i_a3263KLJk&dib_tag=se&keywords=Certificate+Physical+%26+Human+Geography+G.C.+Leong+%28Oxford%29&nsdOptOutParam=true&qid=1788226061&sprefix=certificate+physical+%26+human+geography+g.c.+leong+oxford+%2Caps%2C298&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=38ed09593e1a38a8de7d1ad027ad7eec&ref_=as_li_ss_tl",
  BPSC_TRE_PYQ: "https://www.amazon.in/Year-wise-Services-Previous-Solved-Papers/dp/9371860766?crid=BXS5KUTOQBA4&dib=eyJ2IjoiMSJ9.wtFxa0JweKulsuZqH5C9EL0OScVk69YyQ7Z-mhVyXLMhurjsVvcCS5Xwt-JzM_HRazS2Uxh9zZRXkXdWf2ZbmDFDoUoGi0gg--xxIAdMQCdjT7Fiko99vi0Iffqmn8JKzekUfscl934EqEgU-D-tJKa4TGzSyYS3jlAV0bdP6QT9EacYHmvcw4noabXLKCyd8XEly3s0cC1_yicQMlaTvHYBjZyl8H1MNQKRKokYtqw.85cz3ioLDmwswmZ5bQ5K-bXeLMicGAkCyTYlj5C-PXo&dib_tag=se&keywords=BPSC+TRE+Previous+Years+Solved+Papers+Kiran+%2F+Disha&nsdOptOutParam=true&qid=1788226091&sprefix=bpsc+tre+previous+years+solved+papers+kiran+%2F+disha%2Caps%2C300&sr=8-1&linkCode=ll2&tag=newvacancyale-21&linkId=09006eb6482ba9448251d8ae2a37beab&ref_=as_li_ss_tl"
};

export default function BpscTre4BestBooksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const quickList = [
    { subject: "General Studies", book: "Lucent's General Knowledge", bestFor: "Quick GS/GK revision & rapid factual check", verdict: "⭐⭐⭐⭐⭐", tag: "Must-Have", link: BPSC_TRE4_BOOK_LINKS.LUCENT_GK },
    { subject: "Bihar GK", book: "Bihar-specific GK book + Bihar SCERT", bestFor: "Bihar History, Geography, Economy & Culture", verdict: "⭐⭐⭐⭐⭐", tag: "High Priority", link: BPSC_TRE4_BOOK_LINKS.BIHAR_GK },
    { subject: "History", book: "NCERT (Class 6-12) + Spectrum", bestFor: "Comprehensive History & Modern India", verdict: "⭐⭐⭐⭐⭐", tag: "Core Foundation", link: BPSC_TRE4_BOOK_LINKS.SPECTRUM_HISTORY },
    { subject: "Geography", book: "NCERT + G.C. Leong", bestFor: "Physical & Indian Geography concepts", verdict: "⭐⭐⭐⭐⭐", tag: "Core Foundation", link: BPSC_TRE4_BOOK_LINKS.GC_LEONG_GEO },
    { subject: "Indian Polity", book: "M. Laxmikanth + NCERT Civics", bestFor: "Constitution, Articles & Governance", verdict: "⭐⭐⭐⭐⭐", tag: "Standard Ref", link: BPSC_TRE4_BOOK_LINKS.LAXMIKANTH_POLITY },
    { subject: "General Science", book: "NCERT Science (Class 6-10)", bestFor: "Physics, Chemistry & Biology fundamentals", verdict: "⭐⭐⭐⭐⭐", tag: "Essential", link: BPSC_TRE4_BOOK_LINKS.NCERT_SCIENCE },
    { subject: "Mathematics", book: "NCERT + R.S. Aggarwal", bestFor: "Basic and objective arithmetic practice", verdict: "⭐⭐⭐⭐½", tag: "Practice Core", link: BPSC_TRE4_BOOK_LINKS.RS_MATHS },
    { subject: "Hindi", book: "Samanya Hindi (Lucent) / Hardev Bahri", bestFor: "Grammar, vocabulary & qualifying language", verdict: "⭐⭐⭐⭐½", tag: "Qualifying Standard", link: BPSC_TRE4_BOOK_LINKS.LUCENT_HINDI },
    { subject: "English", book: "Wren & Martin + S.P. Bakshi", bestFor: "Grammar rules & objective MCQs", verdict: "⭐⭐⭐⭐⭐", tag: "Language Standard", link: BPSC_TRE4_BOOK_LINKS.SP_BAKSHI_ENGLISH },
    { subject: "Child Dev & Pedagogy", book: "Arihant / Kiran CDP + NCERT", bestFor: "PRT & teaching-related methodology", verdict: "⭐⭐⭐⭐⭐", tag: "PRT Essential", link: BPSC_TRE4_BOOK_LINKS.CDP_ARIHANT_KIRAN },
    { subject: "Concerned Subject", book: "NCERT + Bihar SCERT + Standard Degree Text", bestFor: "TGT & PGT subject specialization", verdict: "⭐⭐⭐⭐⭐", tag: "TGT/PGT Core", link: BPSC_TRE4_BOOK_LINKS.NCERT_SET },
    { subject: "Current Affairs", book: "Monthly Magazine (Eduteria/Speedy) + News", bestFor: "National & Bihar state current events", verdict: "⭐⭐⭐⭐½", tag: "Scoring Factor", link: "#" },
    { subject: "Practice & PYQs", book: "BPSC TRE Solved Papers + Mock Tests", bestFor: "Understanding exam pattern & time trial", verdict: "⭐⭐⭐⭐⭐", tag: "Non-Negotiable", link: BPSC_TRE4_BOOK_LINKS.BPSC_TRE_PYQ }
  ];

  const faqs = [
    {
      q: "Which is the best book for BPSC TRE 4.0?",
      a: "There is no single book that is best for every BPSC TRE 4.0 candidate. For General Studies, a combination of NCERT + Lucent GK + Bihar-specific GK is useful. TGT and PGT candidates should additionally use standard textbooks for their concerned subject."
    },
    {
      q: "Which book is best for BPSC TRE 4.0 PRT?",
      a: "PRT candidates should prioritize NCERT, Bihar GK, Hindi, Mathematics, General Science and Child Development & Pedagogy resources. Previous-year questions and practice sets should be added after completing the basic concepts."
    },
    {
      q: "Which book is best for BPSC TRE 4.0 TGT?",
      a: "TGT candidates should study NCERT and Bihar SCERT first and then move to standard textbooks for their concerned subject. PYQs and objective practice should be used alongside the subject preparation."
    },
    {
      q: "Which books are best for BPSC TRE 4.0 PGT?",
      a: "PGT candidates should focus primarily on standard subject textbooks appropriate to their academic level, along with NCERT/SCERT, BPSC/TRE previous-year questions and mock tests."
    },
    {
      q: "Is NCERT enough for BPSC TRE 4.0?",
      a: "NCERT is an excellent foundation but should not automatically be considered sufficient for every post and subject. For TGT and especially PGT subject preparation, candidates may need standard higher-level textbooks."
    },
    {
      q: "Is Lucent GK enough for BPSC TRE 4.0?",
      a: "Lucent GK is useful for quick factual revision, but candidates should combine it with NCERT, Bihar-specific GK and current affairs."
    },
    {
      q: "Which book is best for BPSC TRE 4.0 Bihar GK?",
      a: "Use an updated Bihar-specific GK book (such as KBC Nano, Dr. Manish Ranjan, or Crown) along with Bihar SCERT textbooks and current affairs related to Bihar."
    },
    {
      q: "Which is the best book for BPSC TRE 4.0 Hindi?",
      a: "A good Hindi grammar book such as Lucent's Samanya Hindi or Hardev Bahri can be combined with previous-year questions and objective practice."
    },
    {
      q: "Which is the best book for BPSC TRE 4.0 English?",
      a: "Wren & Martin is useful for grammar fundamentals, while S.P. Bakshi's Objective General English provides extensive competitive-exam practice."
    },
    {
      q: "Which is the best book for BPSC TRE 4.0 Maths?",
      a: "NCERT should be the foundation. R.S. Aggarwal can be added for objective practice where relevant. TGT/PGT candidates should use textbooks appropriate to their concerned subject and level."
    },
    {
      q: "Which is the best book for BPSC TRE 4.0 Science?",
      a: "NCERT Science is the best starting point for foundational preparation. Candidates appearing for higher-level Science posts should supplement it with relevant subject textbooks."
    },
    {
      q: "Should I study NCERT or a BPSC guidebook first?",
      a: "Study NCERT/SCERT first for fundamentals, then use a guidebook for revision and practice."
    },
    {
      q: "How many books should I read for BPSC TRE 4.0?",
      a: "You do not need a large collection. For most sections, one strong primary source plus PYQs and practice material is better than repeatedly switching between multiple books."
    },
    {
      q: "Are previous-year papers important for BPSC TRE 4.0?",
      a: "Yes. PYQs help candidates understand question patterns, frequently tested concepts, difficulty level and areas requiring additional preparation."
    },
    {
      q: "What is the official status of the BPSC TRE 4.0 exam date?",
      a: "The preliminary examination date in BPSC's annual calendar is currently listed as TBD (to be announced after completion of the notification cycle). Follow the official portal and NewVacancyAlert for real-time schedule updates."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://newvacancyalert.in/articles/best-books-for-bpsc-tre-4#article",
        "isPartOf": {
          "@type": "WebPage",
          "@id": "https://newvacancyalert.in/articles/best-books-for-bpsc-tre-4"
        },
        "headline": "BPSC TRE 4.0 Best Books 2026: Subject-Wise Books for PRT, TGT & PGT",
        "description": "BPSC TRE 4.0 Best Books 2026: Check the best books for Hindi, General Studies, Bihar GK, CDP, Maths, Science, English, History and other subjects for PRT, TGT and PGT preparation.",
        "inLanguage": "en",
        "datePublished": "2026-09-01T06:00:00+05:30",
        "dateModified": "2026-09-01T06:45:00+05:30",
        "author": {
          "@type": "Person",
          "name": "Anand Kumar Mehta",
          "jobTitle": "Government Recruitment Researcher & Career Writer",
          "url": "https://newvacancyalert.in/about"
        },
        "publisher": {
          "@type": "Organization",
          "name": "New Vacancy Alert",
          "url": "https://newvacancyalert.in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://newvacancyalert.in/logo.svg"
          }
        },
        "mainEntityOfPage": "https://newvacancyalert.in/articles/best-books-for-bpsc-tre-4"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://newvacancyalert.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Articles & Guides",
            "item": "https://newvacancyalert.in/articles"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BPSC TRE 4.0 Best Books 2026",
            "item": "https://newvacancyalert.in/articles/best-books-for-bpsc-tre-4"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
        "@type": "ItemList",
        "name": "Top Recommended Books for BPSC TRE 4.0 Preparation",
        "itemListElement": quickList.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": `${item.subject}: ${item.book}`
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Helmet>
        <title>BPSC TRE 4.0 Best Books 2026: Subject-Wise Books for PRT, TGT &amp; PGT</title>
        <meta name="description" content="BPSC TRE 4.0 Best Books 2026: Check the best books for Hindi, General Studies, Bihar GK, CDP, Maths, Science, English, History and other subjects for PRT, TGT and PGT preparation." />
        <link rel="canonical" href="https://newvacancyalert.in/articles/best-books-for-bpsc-tre-4" />
        
        {/* Open Graph */}
        <meta property="og:title" content="BPSC TRE 4.0 Best Books 2026: Subject-Wise Books for PRT, TGT & PGT" />
        <meta property="og:description" content="Detailed BPSC TRE 4.0 booklist covering NCERT, Lucent GK, Bihar GK, CDP, Hindi, Maths, Science & subject textbooks for PRT, TGT & PGT." />
        <meta property="og:url" content="https://newvacancyalert.in/articles/best-books-for-bpsc-tre-4" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="New Vacancy Alert" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BPSC TRE 4.0 Best Books 2026: Subject-Wise Books for PRT, TGT & PGT" />
        <meta name="twitter:description" content="Complete BPSC TRE 4.0 book recommendation guide with PRT/TGT/PGT subject breakdowns, 90-day study plan, and PYQ strategies." />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">Home</Link>
            <span className="text-slate-300">/</span>
            <Link to="/articles" className="hover:text-blue-600 transition-colors">Articles &amp; Guides</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-extrabold truncate">BPSC TRE 4.0 Best Books</span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content */}
          <main className="lg:col-span-8 space-y-8 min-w-0">
            
            {/* Hero Header Card */}
            <article className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
              
              {/* Category & Freshness Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-rose-500" /> Bihar Teacher Exam 2026
                </span>
                <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" /> Updated: 1 September 2026
                </span>
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-500" /> 18 min read
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                BPSC TRE 4.0 Best Books 2026: Subject-Wise Book List for PRT, TGT &amp; PGT
              </h1>

              {/* Recruitment Hub Cross-Link Callout */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border-2 border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">Official Recruitment</span>
                    <span className="text-xs font-bold text-blue-900">32,388+ Vacancies</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">BPSC TRE 4.0 School Teacher Recruitment 2026</h4>
                  <p className="text-xs text-slate-600 font-medium">Check post details, eligibility, syllabus, pay scale, and application process on our master hub.</p>
                </div>
                <Link
                  to="/bpsc-tre-4-school-teacher-recruitment-2026"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-98"
                >
                  View Recruitment Page <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Intro Lead Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                <p>
                  Choosing the right books is one of the most important decisions for candidates preparing for the <strong>BPSC TRE 4.0 Recruitment 2026</strong>. With thousands of candidates competing for Bihar teacher posts, simply collecting multiple guidebooks is not an effective preparation strategy.
                </p>
                <p>
                  The better approach is to select <strong>one reliable source for concepts</strong>, one standard reference book where necessary, and a good previous-year-question/practice source, and then revise those resources multiple times.
                </p>
                <p>
                  This article provides a detailed BPSC TRE 4.0 best books list for 2026, covering the major sections and subjects relevant to Primary Teacher (PRT), TGT, and PGT candidates. The recommendations below focus on books that are useful for building concepts, revising the syllabus, solving objective questions, and understanding the type of questions asked in competitive teaching examinations.
                </p>
              </div>

              {/* Quick Golden Rule Banner */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-2xl space-y-1">
                <h4 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2 uppercase tracking-wide">
                  <Sparkles className="h-4 w-4 text-amber-600" /> Golden Rule for BPSC TRE 4.0
                </h4>
                <p className="text-xs sm:text-sm text-amber-900 font-semibold leading-relaxed">
                  Do not buy 10–15 books for the same subject. For most candidates, <strong>NCERT/SCERT + one standard reference book + PYQs/practice sets</strong> is a much better combination.
                </p>
              </div>

              {/* Golden Cycle Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest text-center">
                  The Proven 5-Step BPSC TRE Preparation Cycle
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-black text-indigo-300">STEP 1</span>
                    <p className="text-xs font-black text-white mt-1">NCERT / SCERT</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-black text-blue-300">STEP 2</span>
                    <p className="text-xs font-black text-white mt-1">Standard Reference</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-black text-emerald-300">STEP 3</span>
                    <p className="text-xs font-black text-white mt-1">TRE PYQs</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-black text-amber-300">STEP 4</span>
                    <p className="text-xs font-black text-white mt-1">Mock Tests</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-black text-rose-300">STEP 5</span>
                    <p className="text-xs font-black text-white mt-1">3x Revision</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 1: Why Choosing the Right Book Matters */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600"><Target className="h-5 w-5" /></div>
                BPSC TRE 4.0 Recruitment 2026: Why Choosing the Right Book Matters
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                The BPSC Teacher Recruitment Examination is different from a normal school or university examination. Candidates need to prepare for an objective competitive examination while also having adequate command over their concerned teaching subject.
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                  The Best BPSC TRE 4.0 Books Must Help With:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    "Concept building", "Syllabus coverage", "Objective questions",
                    "Previous-year question practice", "Revision", "Important facts",
                    "Teaching-related concepts", "Subject-specific preparation", "Exam-oriented practice"
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-2 text-xs font-bold text-slate-800 shadow-3xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-rose-950 font-medium">
                <strong>Critical Pitfall:</strong> The biggest mistake candidates make is reading too many books without completing any of them. A disciplined approach following <em>NCERT/SCERT → Standard Reference → PYQs → Mock Tests → Revision</em> always beats an unstructured library of unread guides.
              </div>
            </section>

            {/* Section 2: Quick List Summary Table */}
            <section id="quick-list" className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-600"><BookMarked className="h-5 w-5" /></div>
                  Best Books for BPSC TRE 4.0 2026: Quick List
                </h2>
                <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                  Subject-Wise Matrix
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Here is the master overview of recommended resources across all subjects and sections for BPSC TRE 4.0:
              </p>

              {/* Responsive Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse min-w-[580px]">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                      <th className="py-3.5 px-4">Subject / Section</th>
                      <th className="py-3.5 px-4">Recommended Book / Source</th>
                      <th className="py-3.5 px-4">Best For</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {quickList.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          {row.subject}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-blue-900">{row.book}</td>
                        <td className="py-3.5 px-4 text-slate-600">{row.bestFor}</td>
                        <td className="py-3.5 px-4 text-center">
                          {row.link && row.link !== '#' ? (
                            <a
                              href={row.link}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all active:scale-95"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" /> Buy on Amazon
                            </a>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">Library / PDF</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Subject 1: NCERT Books */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600"><BookOpen className="h-5 w-5" /></div>
                  1. NCERT Books – The Most Important Foundation
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">Priority: Extremely High</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                <p>
                  If there is one resource that candidates should not ignore while preparing for BPSC TRE 4.0, it is <strong>NCERT</strong>. NCERT textbooks provide a strong conceptual foundation for History, Geography, Science, Civics, Economics, and several school-level subjects. NCERT officially provides textbooks for Classes I–XII through its textbook/e-book resources, including downloadable material.
                </p>
              </div>

              {/* Class-wise Priority Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <h3 className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-blue-600" /> For General Studies (PRT/TGT/PGT)
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">Prioritize these foundation NCERTs:</p>
                  <ul className="space-y-1.5 text-xs font-bold text-slate-800">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Class 6–10 History (Our Pasts, India & Contemporary World)</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Class 6–10 Geography (The Earth Our Habitat, Contemporary India)</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Class 6–10 Civics / Political Science (Social & Political Life)</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Class 6–10 Science (Basic Physics, Chemistry & Biology)</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Class 9–10 Economics (Understanding Economic Development)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <h3 className="text-xs sm:text-sm font-black text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-purple-600" /> For Subject-Specific Preparation
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">Study NCERTs corresponding to your teaching level:</p>
                  <ul className="space-y-1.5 text-xs font-bold text-slate-800">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> Mathematics: Class 6–12 as applicable</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> Science: Class 6–12 as applicable</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> History: Class 6–12</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> Geography: Class 6–12</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> Political Science &amp; Economics: Class 9–12</li>
                  </ul>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 font-medium">
                <strong>Why NCERT?</strong> NCERT is useful because it explains fundamental concepts in comparatively simple language. Candidates can then use advanced reference books for topics requiring additional depth.
              </div>

              {/* NCERT Amazon Product Card */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">Foundation Essential</span>
                  <h4 className="text-sm font-black text-slate-900">NCERT Complete Textbooks Set (Class 6 to 12)</h4>
                  <p className="text-xs text-slate-600">Complete paperback set for History, Geography, Polity, Science &amp; Maths.</p>
                </div>
                <a
                  href={BPSC_TRE4_BOOK_LINKS.NCERT_SET}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" /> Check Price on Amazon
                </a>
              </div>
            </section>

            {/* Subject 2: Lucent's GK */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-600"><Globe2 className="h-5 w-5" /></div>
                  2. Best Book for BPSC TRE 4.0 General Knowledge – Lucent's GK
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">Best for: General GK revision</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                <strong>Lucent's General Knowledge</strong> is one of the most commonly used general-knowledge books among Indian competitive-exam aspirants. It is particularly useful for quick revision of Indian History, Geography, Indian Polity, General Science, Economy, and Miscellaneous GK.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Best Strategy with Lucent:</h4>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                  Use: <span className="text-blue-600 font-bold">NCERT → Lucent → PYQs</span>. NCERT should be used for understanding concepts, while Lucent can be used for rapid revision and factual preparation. Do not treat Lucent as a complete replacement for NCERT.
                </p>
              </div>

              {/* Lucent GK Amazon Buy Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase">Bestseller GK Guide</span>
                  <h4 className="text-sm font-black text-slate-900">Lucent's Samanya Gyan (General Knowledge)</h4>
                  <p className="text-xs text-slate-600">Updated edition covering Indian History, Geography, Polity, Science &amp; Static GK.</p>
                </div>
                <a
                  href={BPSC_TRE4_BOOK_LINKS.LUCENT_GK}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" /> Check Price on Amazon
                </a>
              </div>
            </section>

            {/* Subject 3: Bihar GK */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-600"><Landmark className="h-5 w-5" /></div>
                  3. Best Books for Bihar GK for BPSC TRE 4.0
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">Priority: Very High</span>
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                Bihar-specific preparation deserves special attention in BPSC TRE. Do not depend entirely on a generic India GK book for Bihar-specific questions.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                  What Candidates Must Cover for Bihar GK:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-800">
                  {[
                    "History of Bihar", "Geography of Bihar", "Rivers of Bihar",
                    "Agriculture & Soil", "Bihar Economy & Budget", "Important Personalities",
                    "Art, Culture & Festivals", "Important Historical Places", "Govt Schemes of Bihar",
                    "Administrative Structure", "Bihar Freedom Movements", "Bihar Current Affairs"
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-3xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-blue-950 font-medium">
                <strong>Recommended Combination:</strong> Bihar-specific GK book (such as KBC Nano, Dr. Manish Ranjan, or Crown) + Bihar SCERT textbooks + current affairs. Look for a recent edition containing objective questions and updated census/economic survey facts.
              </div>

              {/* Bihar GK Amazon Buy Card */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded uppercase">Bihar State Special</span>
                  <h4 className="text-sm font-black text-slate-900">Bihar Samagra / Bihar GK (Dr. Manish Ranjan / Crown / KBC Nano)</h4>
                  <p className="text-xs text-slate-600">Complete Bihar history, geography, rivers, economy, budget, census and state schemes.</p>
                </div>
                <a
                  href={BPSC_TRE4_BOOK_LINKS.BIHAR_GK}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" /> Check Price on Amazon
                </a>
              </div>
            </section>

            {/* Subject 4: Hindi */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-600"><FileText className="h-5 w-5" /></div>
                  4. Best Books for BPSC TRE 4.0 Hindi
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐½</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                Hindi preparation is particularly important for candidates who need to clear the qualifying language component or concerned subject paper.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">1. Samanya Hindi – Lucent</h3>
                    <p className="text-xs text-slate-600 font-medium">Useful for Hindi grammar, vocabulary, synonyms, antonyms, sentence correction, and objective practice.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.LUCENT_HINDI}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Buy on Amazon
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">2. Hindi Vyakaran – Hardev Bahri</h3>
                    <p className="text-xs text-slate-600 font-medium">Useful when you want deeper, comprehensive coverage of standard Hindi grammar and linguistic rules.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.HARDEV_BAHRI_HINDI}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Buy on Amazon
                  </a>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">Key Topics to Master:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {["संधि", "समास", "उपसर्ग", "प्रत्यय", "पर्यायवाची", "विलोम शब्द", "तत्सम एवं तद्भव", "अलंकार", "रस", "छंद", "मुहावरे", "लोकोक्तियाँ", "वाक्य शुद्धि"].map((t, idx) => (
                    <span key={idx} className="bg-white border border-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-3xs">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-amber-900 font-medium pt-1">
                  <strong>Best Approach:</strong> Do not read a Hindi grammar book like a normal textbook. Study one topic and immediately solve objective questions from that topic.
                </p>
              </div>
            </section>

            {/* Subject 5: English */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-100 text-sky-600"><BookCheck className="h-5 w-5" /></div>
                  5. Best Books for BPSC TRE 4.0 English
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                Candidates preparing for English-related sections can use a combination of a grammar reference and an objective practice book.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">Wren &amp; Martin – High School Grammar</h3>
                    <p className="text-xs text-slate-600 font-medium">A useful reference for Parts of speech, Tenses, Articles, Prepositions, Conjunctions, Active/Passive voice, Direct/Indirect speech, and Sentence structure.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.WREN_MARTIN_ENGLISH}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Buy on Amazon
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">Objective General English – S.P. Bakshi</h3>
                    <p className="text-xs text-slate-600 font-medium">Particularly useful for competitive-exam practice: Error detection, Fill in the blanks, Vocabulary, Sentence correction, Grammar, Comprehension &amp; MCQs.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.SP_BAKSHI_ENGLISH}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Buy on Amazon
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 font-semibold">
                <strong>Best combination:</strong> Wren &amp; Martin + S.P. Bakshi + PYQs. Don't spend months reading grammar theory — learn the rule and immediately practice questions.
              </div>
            </section>

            {/* Subject 6: Child Development & Pedagogy */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-violet-100 text-violet-600"><BrainCircuit className="h-5 w-5" /></div>
                  6. Best Books for BPSC TRE 4.0 Child Development &amp; Pedagogy (CDP)
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                Child Development &amp; Pedagogy is especially relevant for candidates preparing for primary and teaching-oriented posts where pedagogy forms part of the preparation.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                  Recommended Resources &amp; Important Thinkers:
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Use <strong>Arihant CDP</strong> or <strong>Kiran CDP</strong> alongside NCERT educational/psychology resources.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-800 pt-1">
                  {["Jean Piaget", "Lev Vygotsky", "Lawrence Kohlberg", "B.F. Skinner", "Albert Bandura", "Howard Gardner"].map((thinker, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-3xs">
                      <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                      <span>{thinker}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 text-xs sm:text-sm text-violet-950 font-medium">
                <strong>Preparation Strategy:</strong> Don't just memorize theory names. Understand: <span className="font-bold">Theory → Main concept → Classroom application → Objective questions</span>.
              </div>

              {/* CDP Amazon Buy Card */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-violet-700 bg-violet-100 px-2 py-0.5 rounded uppercase">Teaching Pedagogy</span>
                  <h4 className="text-sm font-black text-slate-900">Child Development &amp; Pedagogy (Arihant)</h4>
                  <p className="text-xs text-slate-600">Theory, learning concepts, classroom application &amp; chapter-wise MCQs.</p>
                </div>
                <a
                  href={BPSC_TRE4_BOOK_LINKS.CDP_ARIHANT_KIRAN}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" /> Check Price on Amazon
                </a>
              </div>
            </section>

            {/* Subject 7: Mathematics */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-100 text-teal-600"><Calculator className="h-5 w-5" /></div>
                  7. Best Books for BPSC TRE 4.0 Mathematics
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐½</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                The mathematics book you need depends heavily on the level of the post. For foundational preparation, NCERT Mathematics should always be your first resource.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">For Basic / PRT Level</h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Focus on relevant NCERT Mathematics textbooks + <strong>R.S. Aggarwal Quantitative Aptitude</strong> (Percentage, Ratio, Average, Profit &amp; Loss, SI/CI, Time &amp; Work, Speed &amp; Distance, Number System, Basic Algebra, Geometry).
                    </p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.RS_MATHS}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Buy R.S. Aggarwal Maths
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">For TGT / PGT Mathematics</h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Use <strong>NCERT Class 9–12 + standard higher-level textbooks + PYQs</strong>. For senior-level mathematics, conceptual depth matters much more than solving thousands of basic arithmetic questions.
                    </p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.NCERT_SET}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Check NCERT Math Set
                  </a>
                </div>
              </div>
            </section>

            {/* Subject 8: Science */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-100 text-cyan-600"><Atom className="h-5 w-5" /></div>
                  8. Best Books for BPSC TRE 4.0 Science
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                Science candidates should first establish their fundamentals using NCERT.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-600 uppercase">Physics</span>
                    <h3 className="text-xs font-black text-slate-900">NCERT + H.C. Verma</h3>
                    <p className="text-[11px] text-slate-600">Concepts of Physics for conceptual clarity when required by the syllabus.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.HC_VERMA_PHYSICS}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-2.5 py-1 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3 w-3" /> Buy H.C. Verma
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Chemistry</span>
                    <h3 className="text-xs font-black text-slate-900">NCERT Chemistry</h3>
                    <p className="text-[11px] text-slate-600">Class 6–10 for general science, Class 11–12 + degree texts for TGT/PGT.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.NCERT_SCIENCE}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-2.5 py-1 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3 w-3" /> Buy NCERT Science
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-rose-600 uppercase">Biology</span>
                    <h3 className="text-xs font-black text-slate-900">NCERT Biology</h3>
                    <p className="text-[11px] text-slate-600">Cell, Genetics, Human &amp; Plant Physiology, Ecology, Reproduction &amp; Biotech.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.NCERT_SCIENCE}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-2.5 py-1 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3 w-3" /> Buy NCERT Science
                  </a>
                </div>
              </div>
            </section>

            {/* Subject 9, 10, 11: History, Polity, Geography */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600"><History className="h-5 w-5" /></div>
                9, 10 &amp; 11. Best Books for History, Polity &amp; Geography
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900">9. History: NCERT + Spectrum + PYQs</h3>
                    <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Spectrum – A Brief History of Modern India</strong> is particularly useful for Modern Indian History (British expansion, 1857 revolt, INC, Swadeshi, Gandhian movements, Revolutionary movements, Constitutional developments, Quit India, Independence).
                  </p>
                  <p className="text-xs text-indigo-900 font-bold bg-indigo-50 p-2 rounded-lg">
                    Tip: Don't memorize the entire history book word-for-word. Create notes: <em>Year → Event → Person → Organization → Significance</em>.
                  </p>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.SPECTRUM_HISTORY}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Check Price on Amazon (Spectrum History)
                  </a>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900">10. Indian Polity: M. Laxmikanth + NCERT Civics</h3>
                    <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>M. Laxmikanth</strong> is the standard reference for Constitution, Fundamental Rights, Duties, DPSP, President, Parliament, Judiciary, Election Commission, Panchayati Raj, and Emergency provisions.
                  </p>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.LAXMIKANTH_POLITY}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Check Price on Amazon (M. Laxmikanth Polity)
                  </a>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900">11. Geography: NCERT Geography + G.C. Leong + Bihar GK</h3>
                    <span className="text-amber-500 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>G.C. Leong</strong> is useful for physical geography concepts (Earth, climate, soil, vegetation), combined with NCERT Indian Geography and Bihar-specific sources for Bihar rivers, soil, agriculture, and districts.
                  </p>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.GC_LEONG_GEO}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs transition-all w-fit"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Check Price on Amazon (G.C. Leong Geography)
                  </a>
                </div>
              </div>
            </section>

            {/* Section: Social Science & Subject-Specific 5-Level Hierarchy */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-600"><Layers className="h-5 w-5" /></div>
                12 &amp; 13. Social Science &amp; TGT/PGT Subject-Specific Preparation
              </h2>
              
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                Social Science and Concerned Subject candidates should avoid depending on a single generic guidebook. Instead, follow this 5-tier preparation hierarchy:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-center">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                  <span className="text-[10px] font-black text-blue-700">LEVEL 1</span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">NCERT</h4>
                  <p className="text-[11px] text-slate-600">Build fundamentals</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
                  <span className="text-[10px] font-black text-purple-700">LEVEL 2</span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">Bihar SCERT</h4>
                  <p className="text-[11px] text-slate-600">School curriculum</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <span className="text-[10px] font-black text-emerald-700">LEVEL 3</span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">Standard Texts</h4>
                  <p className="text-[11px] text-slate-600">Degree textbooks</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <span className="text-[10px] font-black text-amber-700">LEVEL 4</span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">TRE PYQs</h4>
                  <p className="text-[11px] text-slate-600">Identify question style</p>
                </div>
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
                  <span className="text-[10px] font-black text-rose-700">LEVEL 5</span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">Practice Sets</h4>
                  <p className="text-[11px] text-slate-600">Speed &amp; accuracy</p>
                </div>
              </div>
            </section>

            {/* Post-Wise Strategy: PRT, TGT, PGT */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600"><School className="h-5 w-5" /></div>
                Post-Wise Book Strategy: PRT, TGT &amp; PGT
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* PRT */}
                <div className="bg-slate-50 border-2 border-blue-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="bg-blue-600 text-white font-black text-[10px] px-2.5 py-1 rounded-md uppercase">Primary Teacher (PRT)</span>
                    <h3 className="text-base font-black text-slate-900">Best Books for PRT</h3>
                    <ul className="text-xs space-y-1.5 text-slate-700 font-semibold">
                      <li>• <strong>Hindi:</strong> Grammar + PYQs</li>
                      <li>• <strong>GS:</strong> NCERT + Lucent + Bihar GK</li>
                      <li>• <strong>Maths &amp; Science:</strong> NCERT Class 6–10</li>
                      <li>• <strong>CDP:</strong> Arihant/Kiran CDP + NCERT</li>
                      <li>• <strong>Practice:</strong> TRE Previous Papers</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-100/60 p-2.5 rounded-xl text-[11px] font-bold text-blue-900">
                      PRT Rule: Don't study at graduation level when the syllabus requires school-level clarity.
                    </div>
                    <a
                      href={BPSC_TRE4_BOOK_LINKS.CDP_ARIHANT_KIRAN}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Buy PRT CDP on Amazon
                    </a>
                  </div>
                </div>

                {/* TGT */}
                <div className="bg-slate-50 border-2 border-purple-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="bg-purple-600 text-white font-black text-[10px] px-2.5 py-1 rounded-md uppercase">Trained Graduate (TGT)</span>
                    <h3 className="text-base font-black text-slate-900">Best Books for TGT</h3>
                    <ul className="text-xs space-y-1.5 text-slate-700 font-semibold">
                      <li>• <strong>Foundation:</strong> NCERT + Bihar SCERT</li>
                      <li>• <strong>Subject:</strong> Graduation-level reference</li>
                      <li>• <strong>GS &amp; Language:</strong> Lucent + Bihar GK</li>
                      <li>• <strong>Practice:</strong> Subject-specific PYQs + Mocks</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-purple-100/60 p-2.5 rounded-xl text-[11px] font-bold text-purple-900">
                      TGT Rule: Don't stop after generic GS. Allocate major time to your concerned subject.
                    </div>
                    <a
                      href={BPSC_TRE4_BOOK_LINKS.NCERT_SET}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Buy TGT NCERT Set
                    </a>
                  </div>
                </div>

                {/* PGT */}
                <div className="bg-slate-50 border-2 border-emerald-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-1 rounded-md uppercase">Post Graduate (PGT)</span>
                    <h3 className="text-base font-black text-slate-900">Best Books for PGT</h3>
                    <ul className="text-xs space-y-1.5 text-slate-700 font-semibold">
                      <li>• <strong>NCERT:</strong> Class 11–12 Advanced</li>
                      <li>• <strong>Subject:</strong> Standard UG/PG textbooks</li>
                      <li>• <strong>Guidebooks:</strong> Only for quick revision</li>
                      <li>• <strong>Testing:</strong> Advanced PYQs &amp; mock series</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-emerald-100/60 p-2.5 rounded-xl text-[11px] font-bold text-emerald-900">
                      PGT Rule: Avoid relying solely on "one-book guides" for a specialist subject.
                    </div>
                    <a
                      href={BPSC_TRE4_BOOK_LINKS.BPSC_TRE_PYQ}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Buy PGT PYQ Book
                    </a>
                  </div>
                </div>

              </div>
            </section>

            {/* Section: PYQs & Mock Tests */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600"><CheckSquare className="h-5 w-5" /></div>
                BPSC TRE 4.0 Previous Year Papers &amp; Mock Tests
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                Buying good books is not enough. Previous Year Questions (PYQs) are non-negotiable. They help identify repeated concepts, high-yield chapters, question difficulty, and time management.
              </p>

              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-2 text-center">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">The Correct PYQ Method</span>
                <p className="text-xs sm:text-sm font-black text-white">
                  Attempt → Check → Analyse → Identify Topic → Re-read Concept → Make Short Note
                </p>
              </div>

              {/* PYQ Amazon Buy Card */}
              <div className="bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded uppercase">Must-Have Practice Set</span>
                  <h4 className="text-sm font-black text-slate-900">BPSC TRE Previous Years Solved Papers &amp; Practice Sets</h4>
                  <p className="text-xs text-slate-600">TRE 1.0, TRE 2.0 &amp; TRE 3.0 authentic solved papers with 100% detailed explanations.</p>
                </div>
                <a
                  href={BPSC_TRE4_BOOK_LINKS.BPSC_TRE_PYQ}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" /> Check Price on Amazon
                </a>
              </div>
            </section>

            {/* Books vs Online Notes Table */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-600"><BookCheck className="h-5 w-5" /></div>
                BPSC TRE 4.0 Books vs Online Notes: Which Is Better?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Both serve distinct purposes in a structured preparation routine:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse min-w-[480px]">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                      <th className="py-3 px-4">Resource</th>
                      <th className="py-3 px-4">Best Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {[
                      { r: "NCERT", u: "Core Concepts & Fundamentals" },
                      { r: "SCERT", u: "Bihar School Curriculum" },
                      { r: "Standard Books", u: "Detailed Concepts & Depth" },
                      { r: "Guidebooks", u: "Quick Revision & Topic MCQs" },
                      { r: "PYQs", u: "Understanding Exam Pattern & Question Style" },
                      { r: "Mock Tests", u: "Speed, Accuracy & Time Trial" },
                      { r: "Short Notes", u: "Final 10-Day Revision" },
                      { r: "Current Affairs", u: "Recent National & Bihar Events" }
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-black text-slate-900">{item.r}</td>
                        <td className="py-2.5 px-4 text-blue-900">{item.u}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 90-Day Study Plan & Timetable */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600"><Calendar className="h-5 w-5" /></div>
                BPSC TRE 4.0 90-Day Book Strategy &amp; Timetable
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">Days 1–30</span>
                  <h3 className="text-sm font-black text-slate-900">Foundation Phase</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Focus on NCERT, Bihar GK, Hindi grammar, basic GS, and concerned subject fundamentals. Avoid taking too many mock tests at this stage.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <span className="bg-purple-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">Days 31–60</span>
                  <h3 className="text-sm font-black text-slate-900">Practice Phase</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Start solving TRE PYQs, topic-wise MCQs, subject practice sets, Bihar GK revision, CDP, and current affairs. Identify weak chapters.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">Days 61–90</span>
                  <h3 className="text-sm font-black text-slate-900">Revision &amp; Mocks</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Full-length mock tests, PYQ revision, short notes, current affairs revision, important formulas, and difficult topics. No new books.
                  </p>
                </div>
              </div>

              {/* Working Candidates Plan */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Daily Plan for Working Candidates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase">2-Hour Daily Plan</span>
                    <p className="text-xs text-slate-200 font-semibold">60m Main Subject • 30m GS/Bihar GK • 20m MCQs • 10m Revision</p>
                  </div>
                  <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase">4-Hour Daily Plan</span>
                    <p className="text-xs text-slate-200 font-semibold">2h Main Subject • 1h GS/Bihar GK • 30m Language/CDP • 30m PYQs</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7 Common Mistakes to Avoid */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600"><AlertTriangle className="h-5 w-5" /></div>
                Common Mistakes Candidates Make While Choosing Books
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
                {[
                  { t: "Mistake 1: Buying too many books", d: "Having 10 books does not mean having 10 times more knowledge." },
                  { t: "Mistake 2: Ignoring NCERT", d: "Jumping directly to competitive guidebooks creates severe conceptual gaps." },
                  { t: "Mistake 3: Ignoring Bihar GK", d: "Bihar GK and Bihar current affairs must never be treated as an afterthought." },
                  { t: "Mistake 4: Reading without MCQs", d: "Competitive exams require question-solving ability, not just theory reading." },
                  { t: "Mistake 5: Starting mocks too late", d: "Mock tests should become increasingly important as the exam approaches." },
                  { t: "Mistake 6: Changing books repeatedly", d: "Switching books after completing 60-70% wastes critical revision time." },
                  { t: "Mistake 7: Studying advanced material", d: "More difficult does not always mean more useful. Stick to the syllabus." }
                ].map((m, idx) => (
                  <div key={idx} className="bg-rose-50/50 border border-rose-200 p-3.5 rounded-xl space-y-1">
                    <h4 className="font-black text-rose-950 text-xs">{m.t}</h4>
                    <p className="text-rose-900">{m.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Budget-Wise Book Combination */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600"><Calculator className="h-5 w-5" /></div>
                Best BPSC TRE 4.0 Book Combinations at Different Budgets
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">₹0 – ₹500</span>
                    <h4 className="text-xs font-black text-slate-900">Zero / Minimal Cost</h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Free NCERT PDFs, Bihar SCERT material, official portals, past question PDFs, own notes.</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">₹500 – ₹1,000</span>
                    <h4 className="text-xs font-black text-slate-900">Essential Kit</h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Bihar GK book, one Hindi grammar book, one BPSC TRE PYQ practice book + Free NCERTs.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.BIHAR_GK}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-center gap-1 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-500 py-1.5 px-2 rounded-lg shadow-xs transition-all mt-1"
                  >
                    <ShoppingCart className="h-3 w-3" /> Get Bihar GK
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded">₹1,000 – ₹2,000</span>
                    <h4 className="text-xs font-black text-slate-900">Standard Kit</h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Lucent GK, Bihar GK, CDP book, Hindi grammar, English book + PYQ practice sets.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.LUCENT_GK}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-center gap-1 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-500 py-1.5 px-2 rounded-lg shadow-xs transition-all mt-1"
                  >
                    <ShoppingCart className="h-3 w-3" /> Get Lucent GK
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">₹2,000+</span>
                    <h4 className="text-xs font-black text-slate-900">Comprehensive Kit</h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Standard subject textbooks, Laxmikanth, Spectrum, G.C. Leong, PYQ book, mock test series.</p>
                  </div>
                  <a
                    href={BPSC_TRE4_BOOK_LINKS.BPSC_TRE_PYQ}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-center gap-1 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-500 py-1.5 px-2 rounded-lg shadow-xs transition-all mt-1"
                  >
                    <ShoppingCart className="h-3 w-3" /> Get TRE PYQ Set
                  </a>
                </div>
              </div>
            </section>

            {/* Official Recruitment Schedule Alert */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-5 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                <h3 className="text-base sm:text-lg font-black">BPSC TRE 4.0 Recruitment 2026: Official Schedule Update</h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                Candidates should always verify recruitment dates, vacancies, eligibility, and examination schedules from official BPSC sources. The current BPSC examination calendar lists <strong>TRE 4.0 with 32,388 vacancies</strong>, while the preliminary examination date is currently shown as <strong>TBD</strong> (to be published after completion of the advertisement period).
              </p>
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                There has also been a recent postponement of the application-opening process that was expected to begin on September 1, 2026. Candidates should therefore avoid relying on outdated articles displaying unchanged schedules.
              </p>
              <div className="pt-2">
                <Link
                  to="/bpsc-tre-4-school-teacher-recruitment-2026"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-5 py-3 rounded-xl transition-all inline-flex items-center gap-2 shadow-xs"
                >
                  Follow Real-Time BPSC TRE 4.0 Updates <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* FAQ Accordion Section */}
            <section id="faqs" className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-600"><HelpCircle className="h-5 w-5" /></div>
                  Frequently Asked Questions – BPSC TRE 4.0 Best Books 2026
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`border rounded-2xl transition-all ${
                        isOpen ? 'border-blue-300 bg-blue-50/20 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-800 cursor-pointer"
                      >
                        <span className="flex items-start gap-2.5">
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-1.5 py-0.5 rounded mt-0.5">Q{idx + 1}</span>
                          {faq.q}
                        </span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-blue-600 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Final Word Box */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Final Key Takeaway</span>
              <h3 className="text-lg sm:text-xl font-black text-white">The Best Book Is the Book You Actually Finish</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                The biggest advantage in BPSC TRE 4.0 preparation will not come from owning the largest collection of books. It will come from finishing the right books, solving questions, analysing mistakes, and revising repeatedly.
              </p>
              <p className="text-xs sm:text-sm text-emerald-400 font-bold">
                The objective should not be to read the maximum number of books. The objective should be to score the maximum number of marks from the syllabus.
              </p>
            </div>

            {/* Author Bio Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                AM
              </div>
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Content Written &amp; Verified By</span>
                <h4 className="text-sm font-black text-slate-900">Anand Kumar Mehta</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Government exam researcher and career writer specializing in Bihar recruitment examinations, BPSC syllabus mapping, book selections, and cut-off analyses.
                </p>
              </div>
            </div>

            {/* Subscribe Widget */}
            <SubscribeWidget />

            {/* Comments Section */}
            <div id="comments-section">
              <CommentsSection 
                pageId="best-books-for-bpsc-tre-4" 
                pageTitle="BPSC TRE 4.0 Best Books 2026: Subject-Wise Books for PRT, TGT & PGT"
              />
            </div>

          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6 shrink-0 print:hidden">
            
            {/* Quick Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCheck className="h-4 w-4 text-blue-600" /> BPSC TRE 4.0 At a Glance
              </h3>
              <div className="space-y-2.5 text-xs font-bold text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Recruitment</span>
                  <span className="text-slate-900 font-extrabold">BPSC TRE 4.0 (2026)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Posts</span>
                  <span className="text-blue-600 font-black">32,388+ Vacancies</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Target Posts</span>
                  <span className="text-slate-900">PRT, TGT &amp; PGT</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Core Strategy</span>
                  <span className="text-emerald-700 font-black">NCERT + SCERT + PYQs</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Exam Schedule</span>
                  <span className="text-amber-600 font-black">TBD (Pending Notice)</span>
                </div>
              </div>

              <Link
                to="/bpsc-tre-4-school-teacher-recruitment-2026"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all text-center block shadow-xs"
              >
                Go to BPSC TRE 4.0 Portal
              </Link>
            </div>

            {/* Related Recruitment & Guides */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Library className="h-4 w-4 text-purple-600" /> Related Articles &amp; Guides
              </h3>
              <div className="flex flex-col space-y-2.5">
                <Link
                  to="/articles/best-books-for-bihar-bsfc"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group block"
                >
                  <span className="text-[10px] font-black text-purple-600 uppercase">Bihar Jobs</span>
                  <h5 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    Best Books for Bihar BSFC Exam 2026
                  </h5>
                </Link>
                <Link
                  to="/articles/best-books-for-rrb-ntpc"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group block"
                >
                  <span className="text-[10px] font-black text-blue-600 uppercase">Railways</span>
                  <h5 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    Best Books for RRB NTPC (CBT 1 &amp; 2)
                  </h5>
                </Link>
                <Link
                  to="/articles/salary-calculator"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group block"
                >
                  <span className="text-[10px] font-black text-emerald-600 uppercase">Salary Tool</span>
                  <h5 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    7th Pay Commission Salary Calculator
                  </h5>
                </Link>
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <ArticleStickyBottomBar 
        title="BPSC TRE 4.0 Best Books 2026: Subject-Wise Books for PRT, TGT & PGT" 
        description="Comprehensive guide to the best books for BPSC TRE 4.0 (2026): Subject-wise recommendations for PRT, TGT, PGT, GS, Bihar GK, CDP & PYQs."
      />

    </div>
  );
}
