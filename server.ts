import express from "express";
import fs from "fs";
import path from "path";
import { generateRssXml } from "./src/utils/rssGenerator.js";
import { verifyFirebaseIdToken } from "./src/server/firebaseAdmin.js";
import {
  createPairingToken,
  processTelegramWebhook,
  disconnectTelegram,
  getBotUsername
} from "./src/server/telegramService.js";

export const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security: Disable server fingerprinting header
app.disable("x-powered-by");

// Rate Limiting (In-Memory IP Rate Limiter)
const ipRequestMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 500; // max requests per 15 mins per IP

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const clientIp = (req.headers["x-forwarded-for"] as string || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const now = Date.now();

  const record = ipRequestMap.get(clientIp);
  if (!record || now > record.resetTime) {
    ipRequestMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    res.setHeader("Retry-After", "900");
    return res.status(429).send("Too Many Requests. Please try again later.");
  }

  record.count += 1;
  next();
}

app.use(rateLimiter);

// CORS Configuration: strictly allow only https://newvacancyalert.in (and localhost during development)
const ALLOWED_ORIGINS = new Set([
  "https://newvacancyalert.in",
  "https://www.newvacancyalert.in",
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5173", "http://localhost:3000"] : [])
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    if (origin && ALLOWED_ORIGINS.has(origin)) {
      return res.status(204).end();
    }
    return res.status(403).end();
  }

  next();
});

app.use(express.json());

// Security: Block any requests for source maps (.map files)
app.use((req, res, next) => {
  if (req.path.endsWith(".map")) {
    return res.status(404).send("Not Found");
  }
  next();
});

// Security Middleware: Set production HTTP security headers
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (process.env.NODE_ENV === "production" || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://mittengulped.com https://apis.google.com https://*.firebaseapp.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://pagead2.googlesyndication.com https://mittengulped.com https://get.geojs.io https://*.geojs.io https://ipapi.co https://api.newvacancyalert.in https://*.onrender.com",
    "frame-src 'self' https://*.firebaseapp.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://mittengulped.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join("; ");

  res.setHeader("Content-Security-Policy", cspHeader);
  next();
});

export const REDIRECTS_MAP: Record<string, string> = {
  "guru-ghasidas-vishwavidyalaya-finance-officer-professors-ass-recruitment-2026": "guru-ghasidas-vishwavidyalaya-finance-officer-professors-associat-recruitment-2026",
  "gims-staff-nurse-staff-nurse-non-teaching-recruitment-2026": "gims-greater-noida-staff-nurse-recruitment-2026",
  "tnpsc-ctse-interview-posts-research-assistant-assistant-m-recruitment-2026": "tnpsc-ctse-interview-posts-recruitment-2026",
  "tnpsc-ctse-interview-post-31-different-post-names-recruitment-2026": "tnpsc-ctse-interview-posts-recruitment-2026",
  "uttarakhand-subordinate-s-computer-assistant-junior-recruitment-2026": "uksssc-inter-level-group-c-junior-assistant-registrar-cle-recruitment-2026",
  "uttarakhand-subordinate-servic-computer-assistant-junior-assi-recruitment-2026": "uksssc-inter-level-group-c-junior-assistant-registrar-cle-recruitment-2026",
  "secretariat-administratio-peon-cleaner-sweeper-chow-recruitment-2026": "meghalaya-civil-secretariat-peon-chowkidar-and-more-recruitment-2026",
  "indian-institute-of-technology-sports-coach-recruitment-2026": "iit-goa-sports-coach-recruitment-2026",
  "staff-selection-commission-ssc-je-civil-je-electrical-je-mech-recruitment-2026": "staff-selection-commission-ssc-1748-junior-engineer-recruitment-2026",
  "staff-selection-commission-ssc-combined-higher-secondary-102-recruitment-2026": "ssc-chsl-2026-recruitment",
  "indian-institute-of-technology-senior-research-fellow-recruitment-2026": "iit-delhi-senior-research-fellow-srf-recruitment-2026",
  "homi-bhabha-cancer-hospital-re-foreman-mechanical-recruitment-2026": "tata-memorial-centre-tmc-foreman-mechanical-recruitment-2026",
  "andhra-pradesh-police-dep-37-recruitment-2026": "ap-police-prakasam-district-record-assistant-sweeper-and-m-recruitment-2026",
  "lakshadweep-administration-senior-energy-consultant-and-a-recruitment-2026": "lakshadweep-energy-development-senior-energy-consultant-and-a-recruitment-2026",
  "department-of-posts-ministry-o-bpm-abpm-dak-sevak-recruitment-2026": "department-of-posts-ministry-o-branch-postmaster-bpm-assistan-recruitment-2026",
  "regional-agricultural-research-station-chintapalle-rars-chintapalle-salary-recruitment-2026": "regional-agricultural-research-teaching-associate-and-teachin-recruitment-2026",
  "bastar-district-salary-per-month-recruitment-2026": "bastar-district-high-class-teacher-subject-exp-recruitment-2026",
  "container-corporation-of-india-ltd-concor-no-of-posts-recruitment-2026": "container-corporation-of-india-management-trainee-assistant-o-recruitment-2026",
  "district-court-yadgir-typist-typist-copyist-recruitment-2026": "yadgir-district-court-typist-typist-copyist-process-recruitment-2026",
  "railway-recruitment-boards-rrb-junior-engineer-37-disciplined-recruitment-2026": "rrb-je-dms-recruitment-2026",
  "uttar-pradesh-subordinate-serv-pashudhan-prasar-adhikari-mukh-recruitment-2026": "upsssc-pashudhan-prasar-adhikari-recruitment-2026",
  "railway-recruitment-boards-rrb-rrb-paramedical-recruitment-20-recruitment-2026-3066740": "railway-recruitment-boards-rrb-rrb-paramedical-recruitment-20-recruitment-2026"
};

// 301 Permanent Redirects for merged/removed duplicate vacancies
app.use((req, res, next) => {
  const cleanPath = req.path.replace(/^\/+|\/+$/g, "");
  if (REDIRECTS_MAP[cleanPath]) {
    return res.redirect(301, `/${REDIRECTS_MAP[cleanPath]}`);
  }
  next();
});

// Geo-IP endpoint for location detection (zero external calls on Vercel/Cloudflare, fallback to GeoJS)
app.get("/api/geo", async (req, res) => {
  const vercelRegion = req.headers["x-vercel-ip-country-region"] as string;
  const cfRegion = req.headers["cf-region"] as string;
  if (vercelRegion || cfRegion) {
    return res.json({ region: vercelRegion || cfRegion });
  }

  try {
    const forwarded = req.headers["x-forwarded-for"] as string;
    const clientIp = (forwarded || req.socket?.remoteAddress || "").split(",")[0].trim();
    const isLocal = !clientIp || clientIp === "::1" || clientIp === "127.0.0.1" || clientIp.startsWith("192.168.") || clientIp.startsWith("10.");
    const geoUrl = isLocal ? "https://get.geojs.io/v1/ip/geo.json" : `https://get.geojs.io/v1/ip/geo/${clientIp}.json`;
    const response = await fetch(geoUrl);
    if (response.ok) {
      const data: any = await response.json();
      return res.json({ region: data.region, city: data.city });
    }
  } catch (err) {
    // fallback silently
  }

  res.json({ region: null });
});

// Root health check endpoint (for Render Web Service & uptime monitoring)
app.get("/", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "newvacancyalert-api"
  });
});

// RSS Feed endpoint
app.get(["/rss.xml", "/feed.xml", "/rss", "/feed"], (_req, res) => {
  const rssXml = generateRssXml();
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.status(200).send(rssXml);
});

// -----------------------------------------------------------------------------
// TELEGRAM ACCOUNT PAIRING & WEBHOOK ENDPOINTS (PHASE 2)
// -----------------------------------------------------------------------------

// 1. Generate secure one-time pairing token for authenticated Firebase user
app.post("/api/telegram/create-pairing-token", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  const idToken = authHeader.split("Bearer ")[1].trim();
  const verifiedUser = await verifyFirebaseIdToken(idToken);

  if (!verifiedUser || !verifiedUser.uid) {
    return res.status(401).json({ success: false, error: "Invalid or expired session. Please sign in again." });
  }

  try {
    const pairingData = await createPairingToken(verifiedUser.uid);
    return res.status(200).json({
      success: true,
      ...pairingData
    });
  } catch (err: any) {
    console.error("Error generating pairing token:", err);
    return res.status(500).json({ success: false, error: "Failed to generate pairing token" });
  }
});

// 2. Telegram Webhook Endpoint
app.post("/api/telegram/webhook", async (req, res) => {
  // Validate secret token if configured
  const secretHeader = req.headers["x-telegram-bot-api-secret-token"] as string;
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (configuredSecret && secretHeader !== configuredSecret) {
    console.warn("⚠️ Unauthorized Telegram webhook attempt with invalid secret token.");
    return res.status(403).send("Forbidden");
  }

  try {
    const result = await processTelegramWebhook(req.body);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("Error processing Telegram webhook:", err);
    return res.status(200).json({ ok: false });
  }
});

// 3. Disconnect Telegram Account (strictly server-controlled)
app.post("/api/telegram/disconnect", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  const idToken = authHeader.split("Bearer ")[1].trim();
  const verifiedUser = await verifyFirebaseIdToken(idToken);

  if (!verifiedUser || !verifiedUser.uid) {
    return res.status(401).json({ success: false, error: "Invalid or expired session." });
  }

  try {
    const result = await disconnectTelegram(verifiedUser.uid);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Error disconnecting Telegram:", err);
    return res.status(500).json({ success: false, error: "Failed to disconnect Telegram" });
  }
});

// 4. Telegram Config & Status Info
app.get("/api/telegram/status", (_req, res) => {
  return res.json({
    botUsername: getBotUsername(),
    isConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN)
  });
});

export async function startServer() {
  const isDev = process.env.NODE_ENV === "development" || 
                (process.env.NODE_ENV !== "production" && !__filename.endsWith(".cjs"));

  if (isDev) {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);

    // Serve HTML for dynamic client-side SPA navigation
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.includes(".") && !url.endsWith(".html")) {
        return next();
      }

      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    const indexHtmlPath = path.join(distPath, "index.html");

    if (fs.existsSync(indexHtmlPath)) {
      // If frontend static assets exist, serve pre-rendered HTML pages
      app.get("*", (req, res, next) => {
        const url = req.path;
        // Skip static assets with file extensions (e.g. .js, .css, .png)
        if (url.includes(".") && !url.endsWith(".html")) {
          return next();
        }

        const cleanPath = url.replace(/^\/+|\/+$/g, "");
        const staticFile = cleanPath === "" 
          ? path.resolve(distPath, "index.html")
          : path.resolve(distPath, cleanPath, "index.html");

        if (fs.existsSync(staticFile)) {
          return res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).sendFile(staticFile);
        }

        return res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).sendFile(indexHtmlPath);
      });

      app.use(express.static(distPath, { index: false, redirect: false }));
    } else {
      // Standalone API Web Service mode (returns 404 for unhandled non-API paths)
      app.use("*", (req, res) => {
        res.status(404).json({ error: "Not Found", path: req.originalUrl });
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

// Only auto-start server if not running in Vercel serverless function environment
if (!process.env.VERCEL) {
  startServer().catch(console.error);
}

export default app;
