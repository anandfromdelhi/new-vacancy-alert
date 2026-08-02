import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { jobDetailsData } from "./src/data/jobDetails.js";
import { generateRssXml } from "./src/utils/rssGenerator.js";

const app = express();
const PORT = 3000;

// Helper to escape HTML attributes safely
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// RSS Feed endpoint
app.get(["/rss.xml", "/feed.xml", "/rss", "/feed"], (_req, res) => {
  const rssXml = generateRssXml();
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.status(200).send(rssXml);
});


// Meta tag resolution helper for any sub-page route
function getPageMetaData(urlPath: string) {
  const cleanPath = urlPath.split("?")[0].replace(/^\/+|\/+$/g, "");

  // Default Home Page Meta
  let title = "Latest Government Jobs 2026 & Job Alerts | NewVacancyAlert";
  let description =
    "Get the latest central and state government job notifications for 2026, upcoming active vacancies, admit cards, exam keys, and verified results instantly.";
  let ogUrl = `https://newvacancyalert.in/${cleanPath}`;

  // NORCET Cutoff Special Article
  if (cleanPath === "norcet-cutoff" || cleanPath === "norcet-previous-year-cutoff") {
    title = "AIIMS NORCET Previous Year Cutoff (Last 3 Exams) | NewVacancyAlert";
    description =
      "Detailed category-wise analysis of NORCET 8, 9, and 10 cutoffs. Predict expected cutoffs for NORCET 11 and download solved question papers PDF.";
  } 
  // Job Detail Pages
  else if (cleanPath && jobDetailsData[cleanPath]) {
    const job = jobDetailsData[cleanPath];
    title = job.seoTitle || `${job.title} Recruitment 2026 Notification | NewVacancyAlert`;
    description =
      job.seoDescription ||
      `Complete notification details, eligibility, application fee, key dates, and official PDF download for ${job.title}.`;
  }

  return { title, description, ogUrl };
}

// Inject or replace Open Graph & Meta tags in index.html template
function injectMetaTags(htmlTemplate: string, meta: { title: string; description: string; ogUrl: string }) {
  const safeTitle = escapeHtml(meta.title);
  const safeDesc = escapeHtml(meta.description);

  let html = htmlTemplate;

  // Replace <title>
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${safeTitle}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/gi, `<meta name="title" content="${safeTitle}" />`);

  // Replace <meta name="description">
  html = html.replace(
    /<meta name="description" content=".*?" \/>/gi,
    `<meta name="description" content="${safeDesc}" />`
  );

  // Replace OG tags
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

  // Replace Twitter tags
  html = html.replace(
    /<meta property="twitter:title" content=".*?" \/>/gi,
    `<meta property="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta property="twitter:description" content=".*?" \/>/gi,
    `<meta property="twitter:description" content="${safeDesc}" />`
  );

  return html;
}

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    // Development mode with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);

    // Serve HTML with dynamic meta tags on non-static asset routes
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.includes(".") && !url.endsWith(".html")) {
        return next();
      }

      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const meta = getPageMetaData(url);
        const html = injectMetaTags(template, meta);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    const indexHtmlPath = path.join(distPath, "index.html");

    app.use(express.static(distPath, { index: false }));

    app.get("*", (req, res) => {
      const meta = getPageMetaData(req.path);
      try {
        const rawHtml = fs.readFileSync(indexHtmlPath, "utf-8");
        const html = injectMetaTags(rawHtml, meta);
        res.status(200).set({ "Content-Type": "text/html" }).send(html);
      } catch (err) {
        res.status(500).send("Error loading application");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
