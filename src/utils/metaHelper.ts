import { jobDetailsData } from '../data/jobDetails.js';

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
  let ogUrl = `https://newvacancyalert.in/${cleanPath}`;
  let faqSchema: object | null = null;

  if (cleanPath === "norcet-cutoff" || cleanPath === "norcet-previous-year-cutoff" || cleanPath === "aiims-norcet-11-nursing-officer-2026/cutoff" || cleanPath === "aiims-norcet-11-cutoff-marks") {
    title = "AIIMS NORCET Previous Year Cutoff (Last 3 Exams) | NewVacancyAlert";
    description =
      "Detailed category-wise analysis of NORCET 8, 9, and 10 cutoffs. Predict expected cutoffs for NORCET 11 and download solved question papers PDF.";
  } 
  else if (cleanPath === "salary-calculator" || cleanPath === "govt-job-salary-calculator") {
    title = "7th Pay Commission Salary Calculator 2026 | NewVacancyAlert";
    description = "Calculate exact net in-hand salary for central and state government jobs including basic pay, DA, HRA, TA, and deductions.";
  }
  else if (cleanPath === "ssc-exam-calendar" || cleanPath === "ssc-exam-calendar-2026-27") {
    title = "SSC Exam Calendar 2026-27 Notification Dates | NewVacancyAlert";
    description = "Complete official exam dates, notification releases, and application schedules for SSC CGL, CHSL, MTS, CPO, and GD Constable.";
  }
  else if (cleanPath === "rrb-exam-calendar-2026-27") {
    title = "RRB Railway Exam Calendar 2026-27 Official Dates | NewVacancyAlert";
    description = "Official annual schedule for Railway Recruitment Board (RRB) exams including NTPC, ALP, Technician, Group D, and JE vacancies.";
  }
  else if (cleanPath === "archives") {
    title = "Government Job Archives & History | NewVacancyAlert";
    description = "Browse historical government job notifications, past recruitment drives, and archive database.";
  }
  else if (cleanPath === "articles") {
    title = "Syllabus, Exam Strategy & Recruitment Guides | NewVacancyAlert";
    description = "Read expert articles on government job preparations, exam patterns, cutoff trends, and career advice.";
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
    const stateName = cleanPath.replace("state/", "").replace(/-/g, " ").toUpperCase();
    title = `${stateName} Government Jobs 2026 Notifications | NewVacancyAlert`;
    description = `Find all active public sector, state PSC, and government job vacancies in ${stateName}.`;
  }
  else if (cleanPath.startsWith("board/")) {
    const boardName = cleanPath.replace("board/", "").replace(/-/g, " ").toUpperCase();
    title = `${boardName} Recruitment 2026 Notifications & Results | NewVacancyAlert`;
    description = `Latest active job alerts, exam schedules, and results for ${boardName}.`;
  }
  else if (cleanPath.startsWith("jobs-for/")) {
    const qual = cleanPath.replace("jobs-for/", "").replace(/-/g, " ").toUpperCase();
    title = `Government Jobs for ${qual} Pass Candidates 2026 | NewVacancyAlert`;
    description = `Explore active government job opportunities requiring ${qual} eligibility.`;
  }
  else if (cleanPath && jobDetailsData[cleanPath]) {
    const job = jobDetailsData[cleanPath];
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

  return { title, description, ogUrl, faqSchema };
}

export function injectMetaTags(htmlTemplate: string, meta: { title: string; description: string; ogUrl: string; faqSchema?: object | null }) {
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

  if (meta.faqSchema) {
    const schemaScript = `<script type="application/ld+json">${JSON.stringify(meta.faqSchema)}</script>`;
    html = html.replace('</head>', `${schemaScript}\n</head>`);
  }

  return html;
}
