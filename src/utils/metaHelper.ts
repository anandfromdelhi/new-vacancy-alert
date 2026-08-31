import jobsIndexData from '../data/jobs-index-generated.json';

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const notificationSubPagesMeta: Record<string, { title: string; desc: string }> = {
  "posts-and-vacancies": { title: "Posts and Vacancies", desc: "Detailed post-wise and category-wise vacancies for RRB Technician CEN 02/2026." },
  "important-dates": { title: "Important Dates", desc: "Complete timeline of application opening, last dates, fee payment, and exam dates." },
  "important-instructions": { title: "Important Instructions", desc: "Essential guidelines for candidates applying for Railway Technician CEN 02/2026." },
  "general-instructions": { title: "General Instructions", desc: "General terms, eligibility rules, and portal guidelines for RRB Technician recruitment." },
  "vacancy-details": { title: "Vacancy Details", desc: "Zone-wise and post-wise detailed vacancy distribution for Technician Grade I & III." },
  "medical-standards": { title: "Medical Standards", desc: "Physical fitness, vision standards (A-3, B-1, B-2) for RRB Technician posts." },
  "nationality-citizenship": { title: "Nationality & Citizenship", desc: "Eligibility criteria regarding citizenship for Indian and NRI candidates." },
  "age-limit": { title: "Age Limit & Cutoff Date", desc: "Min and max age requirements, crucial calculation dates for RRB Technician." },
  "age-relaxation": { title: "Age Relaxation Rules", desc: "Category-wise age relaxation guidelines for SC/ST, OBC, Ex-Servicemen, and PwBD." },
  "educational-qualification": { title: "Educational Qualification", desc: "ITI, Diploma, Degree, and Metric requirements for RRB Technician CEN 02/2026." },
  "application-fee": { title: "Application Fee & Refund", desc: "Fee structure per category and bank refund details post Computer Based Test." },
  "reservation": { title: "Reservation Guidelines", desc: "Vertical and horizontal reservation policies for SC/ST/OBC/EWS candidates." },
  "ex-serviceman": { title: "Ex-Serviceman Reservation", desc: "Special relaxation and reservation terms for Ex-Servicemen (ESM)." },
  "pwbd": { title: "PwBD Guidelines", desc: "Benchmark disability rules and post eligibility for PwBD candidates." },
  "scribe-facility": { title: "Scribe Facility Rules", desc: "Guidelines for engaging a scribe during CBT exams for eligible PwBD applicants." },
  "recruitment-process": { title: "Recruitment Process", desc: "Multi-stage selection process: CBT 1, CBT 2, Document Verification, Medical Exam." },
  "cbt-details": { title: "CBT Exam Pattern & Syllabus", desc: "Subject weightage, marking scheme, negative marking, and passing percentages." },
  "document-verification": { title: "Document Verification", desc: "List of required certificates, verification process, and candidate instructions." },
  "how-to-apply": { title: "How to Apply Step-by-Step", desc: "Complete guide on online registration, document upload, and payment." },
  "create-account": { title: "Create an Account", desc: "Instructions for setting up a unified RRB recruitment portal login." },
  "application-guidelines": { title: "Application Guidelines", desc: "Standard instructions for filling out online application fields accurately." },
  "live-photo-instructions": { title: "Live Photo & Signature Instructions", desc: "Dimensions, file sizes, webcam capture guidelines for valid submission." },
  "documents-required": { title: "Documents Required", desc: "Checklist of certificates, photos, and IDs needed during application." },
  "application-correction": { title: "Modification of Application", desc: "Rules and window dates for editing submitted application forms." },
  "invalid-applications": { title: "Invalid Applications & Rejection", desc: "Common mistakes causing application rejections and debarment rules." },
  "e-call-letter": { title: "E-Call Letter / Admit Card", desc: "How and when to download CBT admit cards and travel passes." },
  "original-document-verification": { title: "Original Document Verification", desc: "Physical document scrutiny guidelines before final empanelment." },
  "unfair-means-and-debarment": { title: "Unfair Means & Debarment", desc: "Strict penalties for malpractice, impersonation, and fraudulent documents." },
  "rrb-websites": { title: "Official RRB Websites List", desc: "Direct website links for all 21 Regional Railway Recruitment Boards." },
  "post-parameters": { title: "Annexure A: Post Parameters", desc: "Detailed post-wise medical standard, pay level, and qualification matrix." },
  "zone-wise-vacancy": { title: "Annexure B: Zone Wise Vacancies", desc: "Breakdown of vacancies across all 21 Railway Recruitment zones." },
  "merged-post-categories": { title: "Annexure C: Merged Post Categories", desc: "Consolidated list of trade specifications and post category combinations." }
};

export function getPageMetaData(urlPath: string) {
  const cleanPath = urlPath.split("?")[0].replace(/^\/+|\/+$/g, "");

  let title = "Latest Government Jobs 2026 & Job Alerts | NewVacancyAlert";
  let description =
    "Get the latest central and state government job notifications for 2026, upcoming active vacancies, admit cards, exam keys, and verified results instantly.";
  let ogUrl = cleanPath === "" || cleanPath === "index.html" 
    ? "https://newvacancyalert.in/" 
    : `https://newvacancyalert.in/${cleanPath}`;
  let faqSchema: object | null = null;

  let isNotFound = false;

  if (cleanPath === "" || cleanPath === "index.html") {
    // Home page - default title & description
  }
  else if (cleanPath === "norcet-cutoff" || cleanPath === "norcet-previous-year-cutoff" || cleanPath === "aiims-norcet-11-nursing-officer-2026/cutoff" || cleanPath === "aiims-norcet-11-cutoff-marks" || cleanPath === "articles/aiims-norcet-11-nursing-officer-2026/cutoff" || cleanPath === "articles/aiims-norcet-11-cutoff-marks") {
    title = "AIIMS NORCET Previous Year Cutoff (Last 3 Exams) | NewVacancyAlert";
    description =
      "Detailed category-wise analysis of NORCET 8, 9, and 10 cutoffs. Predict expected cutoffs for NORCET 11 and download solved question papers PDF.";
    ogUrl = "https://newvacancyalert.in/articles/aiims-norcet-11-nursing-officer-2026/cutoff";
  } 
  else if (cleanPath === "salary-calculator" || cleanPath === "govt-job-salary-calculator" || cleanPath === "articles/salary-calculator") {
    title = "7th Pay Commission Salary Calculator 2026 | NewVacancyAlert";
    description = "Calculate exact net in-hand salary for central and state government jobs including basic pay, DA, HRA, TA, and deductions.";
    ogUrl = "https://newvacancyalert.in/articles/salary-calculator";
  }
  else if (cleanPath === "ssc-exam-calendar" || cleanPath === "ssc-exam-calendar-2026-27" || cleanPath === "articles/ssc-exam-calendar") {
    title = "SSC Exam Calendar 2026-27 Notification Dates | NewVacancyAlert";
    description = "Complete official exam dates, notification releases, and application schedules for SSC CGL, CHSL, MTS, CPO, and GD Constable.";
    ogUrl = "https://newvacancyalert.in/articles/ssc-exam-calendar";
  }
  else if (cleanPath === "rrb-exam-calendar-2026-27" || cleanPath === "articles/rrb-exam-calendar-2026-27") {
    title = "RRB Railway Exam Calendar 2026-27 Official Dates | NewVacancyAlert";
    description = "Official annual schedule for Railway Recruitment Board (RRB) exams including NTPC, ALP, Technician, Group D, and JE vacancies.";
    ogUrl = "https://newvacancyalert.in/articles/rrb-exam-calendar-2026-27";
  }
  else if (cleanPath === "best-books-for-rrb-ntpc" || cleanPath === "rrb-ntpc-best-books" || cleanPath === "articles/best-books-for-rrb-ntpc") {
    title = "Best Books for RRB NTPC 2026: Subject-Wise Maths, Reasoning, GK & PYQs | NewVacancyAlert";
    description = "Complete guide to the best books for RRB NTPC 2026 preparation: Detailed subject-wise breakdown for Mathematics, Reasoning, General Awareness, PYQs, and CBT 1 & CBT 2 study strategies.";
    ogUrl = "https://newvacancyalert.in/articles/best-books-for-rrb-ntpc";
  }
  else if (cleanPath === "best-books-for-mpesb" || cleanPath === "best-books-for-mpesb-group-3" || cleanPath === "mpesb-best-books" || cleanPath === "articles/best-books-for-mpesb") {
    title = "Best Books for MPESB 2026: Subject-Wise Books for MPESB Group 3 Preparation | NewVacancyAlert";
    description = "Looking for the best books for MPESB 2026? Check the best MPESB books for GK, MP GK, Maths, Reasoning, Hindi, English, Science, Computer and Group 3 technical preparation.";
    ogUrl = "https://newvacancyalert.in/articles/best-books-for-mpesb";
  }
  else if (cleanPath === "best-books-for-bihar-bsfc" || cleanPath === "bihar-bsfc-best-books" || cleanPath === "best-books-for-bsfc" || cleanPath === "articles/best-books-for-bihar-bsfc") {
    title = "Best Books for Bihar BSFC 2026: Subject-Wise Books for LDC, Asst Manager, Accountant | NewVacancyAlert";
    description = "Looking for the best books for Bihar BSFC 2026? Check the best BSFC books for LDC, Assistant Manager, Accountant, Assistant Accounts Officer and Quality Controller preparation.";
    ogUrl = "https://newvacancyalert.in/articles/best-books-for-bihar-bsfc";
  }
  else if (cleanPath === "ssc-cgl-master-guide" || cleanPath === "articles/ssc-cgl-master-guide") {
    title = "The Ultimate SSC CGL Master Guide: 360° Complete Handbook & Resource Hub";
    description = "The definitive compendium for SSC CGL: Notification timelines, post directories, 7th Pay Commission salaries, physical standards, new 390-mark exam pattern, books, and preparation roadmap.";
    ogUrl = "https://newvacancyalert.in/articles/ssc-cgl-master-guide";
  }
  else if (cleanPath === "ssc-cgl-notification-vacancies-trend" || cleanPath === "articles/ssc-cgl-notification-vacancies-trend") {
    title = "SSC CGL Notification Dates & 5-Year Vacancy Trends (2022-2027) | Complete Analysis";
    description = "Exhaustive analysis of SSC CGL notification timelines, 5-year vacancy trends (2022-2027), initial vs final vacancy increases, and realistic schedule projections from official records.";
    ogUrl = "https://newvacancyalert.in/articles/ssc-cgl-notification-vacancies-trend";
  }
  else if (cleanPath === "ssc-cgl-posts-salary-pay-scale-hierarchy" || cleanPath === "articles/ssc-cgl-posts-salary-pay-scale-hierarchy") {
    title = "SSC CGL Posts Directory, Hierarchy & 7th Pay Commission Salary Structure";
    description = "Complete directory of all 34+ SSC CGL posts across Level 8 to Level 4 with starting basic, in-hand salary for X/Y/Z cities, DA (53%), allowances, and promotion paths.";
    ogUrl = "https://newvacancyalert.in/articles/ssc-cgl-posts-salary-pay-scale-hierarchy";
  }
  else if (cleanPath === "ssc-cgl-eligibility-physical-standards-pst-pet" || cleanPath === "articles/ssc-cgl-eligibility-physical-standards-pst-pet") {
    title = "SSC CGL Eligibility Criteria, Age Limits & Physical Standards (PST/PET) Guide";
    description = "Complete guide to SSC CGL educational eligibility, crucial cut-off dates, category age relaxations, and male/female Physical Measurement and Endurance Standards (PST/PET).";
    ogUrl = "https://newvacancyalert.in/articles/ssc-cgl-eligibility-physical-standards-pst-pet";
  }
  else if (cleanPath === "ssc-cgl-exam-pattern-syllabus-dest-typing" || cleanPath === "articles/ssc-cgl-exam-pattern-syllabus-dest-typing") {
    title = "SSC CGL New Exam Pattern, Syllabus & DEST Typing Speed Test Guide";
    description = "Detailed analysis of SSC CGL Tier-I (qualifying) and Tier-II (390 marks merit) pattern, section-wise syllabus, Computer Knowledge CPT rules, and DEST typing error benchmarks.";
    ogUrl = "https://newvacancyalert.in/articles/ssc-cgl-exam-pattern-syllabus-dest-typing";
  }
  else if (cleanPath === "ssc-cgl-cutoffs-post-preference-ranking-guide" || cleanPath === "articles/ssc-cgl-cutoffs-post-preference-ranking-guide") {
    title = "SSC CGL Post Preference & Career Ranking Guide | Home State vs Salary vs Promotion";
    description = "Master post preference guide for SSC CGL: How to choose between ASO CSS, MEA, Income Tax, GST Inspector, and AAO based on home state, salary, and career growth.";
    ogUrl = "https://newvacancyalert.in/articles/ssc-cgl-cutoffs-post-preference-ranking-guide";
  }
  else if (cleanPath === "ssc-cgl-preparation-strategy-study-plan-books-mocks" || cleanPath === "articles/ssc-cgl-preparation-strategy-study-plan-books-mocks") {
    title = "SSC CGL 12-Month Preparation Roadmap, Books & Mock Strategy | Study Plan";
    description = "Step-by-step SSC CGL study plan: 12-month zero-to-hero roadmap, daily 8-hour timetable, subject-wise booklist, and 3-round mock test taking technique.";
    ogUrl = "https://newvacancyalert.in/articles/ssc-cgl-preparation-strategy-study-plan-books-mocks";
  }
  else if (cleanPath === "ssc-cgl-admit-card-selection-dv-checklist" || cleanPath === "articles/ssc-cgl-admit-card-selection-dv-checklist") {
    title = "SSC CGL Admit Card, Selection Process & Document Verification (DV) Checklist";
    description = "Complete guide to SSC CGL admit card release, examination stages from Tier-I to joining, departmental Document Verification (DV) checklist, and crucial certificate validity rules.";
    ogUrl = "https://newvacancyalert.in/articles/ssc-cgl-admit-card-selection-dv-checklist";
  }
  else if (cleanPath === "articles") {
    title = "Syllabus, Exam Strategy & Recruitment Guides | NewVacancyAlert";
    description = "Read expert articles on government job preparations, exam patterns, cutoff trends, and career advice.";
    ogUrl = "https://newvacancyalert.in/articles";
  }
  else if (cleanPath === "about") {
    title = "About Us | NewVacancyAlert - Verified Govt Job Portal";
    description = "Learn more about NewVacancyAlert, our mission to deliver fast, authentic, and zero-spam government job alerts across India.";
  }
  else if (cleanPath === "contact") {
    title = "Contact Us | NewVacancyAlert Support & Queries";
    description = "Get in touch with the NewVacancyAlert team for recruitment inquiries, advertising, feedback, or support.";
  }
  else if (cleanPath === "privacy-policy") {
    title = "Privacy Policy | NewVacancyAlert";
    description = "Privacy policy and terms of service for users of NewVacancyAlert recruitment portal.";
  }
  else if (cleanPath === "rss-feed") {
    title = "RSS Feed & Notification Subscriptions | NewVacancyAlert";
    description = "Subscribe to live RSS job feeds for central and state government recruitment updates.";
  }
  else if (cleanPath === "marketing-partner" || cleanPath === "marketing-partner/dashboard" || cleanPath === "marketing-partner/terms") {
    title = "Marketing Partner Program | NewVacancyAlert";
    description = "Partner with NewVacancyAlert to reach lakhs of government exam aspirants across India.";
  }
  else if (cleanPath.startsWith("rrb-technician-cen-02-2026/")) {
    const subSlug = cleanPath.replace("rrb-technician-cen-02-2026/", "");
    if (notificationSubPagesMeta[subSlug]) {
      const info = notificationSubPagesMeta[subSlug];
      title = `${info.title} | RRB Technician CEN 02/2026 Notification`;
      description = info.desc;
    } else {
      title = "RRB Technician CEN 02/2026 Recruitment Details | NewVacancyAlert";
      description = "Comprehensive information and official notification details for RRB Technician CEN 02/2026 recruitment.";
    }
  }
  else if (cleanPath.startsWith("state/")) {
    const rawState = cleanPath.replace("state/", "").replace(/-/g, " ");
    const stateName = rawState.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    title = `${stateName} Government Jobs 2026 Notifications | NewVacancyAlert`;
    description = `Find all active public sector, state PSC, and government job vacancies in ${stateName}. Direct PDF notifications, eligibility, and apply online links.`;
  }
  else if (cleanPath === "anand") {
    title = "Admin Dashboard | NewVacancyAlert";
    description = "NewVacancyAlert Admin Management Portal";
    ogUrl = "https://newvacancyalert.in/anand";
    isNotFound = false;
  }
  else if (cleanPath.startsWith("board/")) {
    const rawBoard = cleanPath.replace("board/", "").replace(/-/g, " ").toUpperCase();
    title = `${rawBoard} Recruitment 2026 Notifications & Results | NewVacancyAlert`;
    description = `Latest active job alerts, exam schedules, eligibility, and results for ${rawBoard}. Verified govt job notifications with direct official links.`;
  }
  else if (cleanPath.startsWith("jobs-for/")) {
    const rawQual = cleanPath.replace("jobs-for/", "").replace(/-/g, " ");
    const qualName = rawQual.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    title = `Government Jobs for ${qualName} 2026 | NewVacancyAlert`;
    description = `Explore active central and state government job opportunities requiring ${qualName} eligibility. Check vacancies, salary, exam dates, and apply.`;
  }
  else if (cleanPath && (jobsIndexData as Record<string, any>)[cleanPath]) {
    const job = (jobsIndexData as Record<string, any>)[cleanPath];
    title = job.seoTitle || `${job.title} Recruitment 2026 Notification | NewVacancyAlert`;
    description =
      job.seoDescription ||
      `Complete notification details, eligibility, application fee, key dates, and official PDF download for ${job.title}.`;
    
    if (job.faqs && job.faqs.length > 0) {
      faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": job.faqs.map((f: { question: string; answer: string }) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      };
    }
  }
  else {
    // Unmatched / non-existent route
    isNotFound = true;
    title = "Page Not Found | NewVacancyAlert";
    description = "The requested job notification or page could not be located. Browse active recruitment updates on NewVacancyAlert.";
  }

  return { title, description, ogUrl, faqSchema, isNotFound };
}

export function injectMetaTags(htmlTemplate: string, meta: { title: string; description: string; ogUrl: string; faqSchema?: object | null; isNotFound?: boolean }) {
  const safeTitle = escapeHtml(meta.title);
  const safeDesc = escapeHtml(meta.description);

  let html = htmlTemplate;

  html = html.replace(/<title>.*?<\/title>/gi, `<title>${safeTitle}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/gi, `<meta name="title" content="${safeTitle}" />`);
  html = html.replace(
    /<meta name="description" content=".*?" \/>/gi,
    `<meta name="description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/gi,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/gi,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/gi,
    `<meta property="og:url" content="${escapeHtml(meta.ogUrl)}" />`
  );
  html = html.replace(
    /<meta property="twitter:title" content=".*?" \/>/gi,
    `<meta property="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta property="twitter:description" content=".*?" \/>/gi,
    `<meta property="twitter:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta property="twitter:url" content=".*?" \/>/gi,
    `<meta property="twitter:url" content="${escapeHtml(meta.ogUrl)}" />`
  );

  // Canonical Link Tag
  const safeCanonical = escapeHtml(meta.ogUrl);
  if (/<link rel="canonical" content=".*?" \/>/gi.test(html) || /<link rel="canonical" href=".*?" \/>/gi.test(html)) {
    html = html.replace(/<link rel="canonical" (?:href|content)=".*?" \/>/gi, `<link rel="canonical" href="${safeCanonical}" />`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${safeCanonical}" />\n</head>`);
  }

  // Meta Robots Tag (noindex for 404s to avoid Soft 404 penalties)
  const robotsDirective = meta.isNotFound 
    ? "noindex, nofollow" 
    : "index, follow, max-image-preview:large";

  if (/<meta name="robots"/gi.test(html)) {
    html = html.replace(/<meta name="robots" content=".*?" \/>/gi, `<meta name="robots" content="${robotsDirective}" />`);
  } else {
    html = html.replace('</head>', `<meta name="robots" content="${robotsDirective}" />\n</head>`);
  }

  if (meta.faqSchema) {
    const schemaScript = `<script type="application/ld+json">${JSON.stringify(meta.faqSchema)}</script>`;
    html = html.replace('</head>', `${schemaScript}\n</head>`);
  }

  return html;
}
