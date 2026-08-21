import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generateRssXml } from "./src/utils/rssGenerator.js";
import { getPageMetaData, injectMetaTags, escapeHtml } from "./src/utils/metaHelper.js";

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
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://cdn.onesignal.com https://mittengulped.com https://apis.google.com https://*.firebaseapp.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://onesignal.com https://*.onesignal.com https://pagead2.googlesyndication.com https://mittengulped.com",
    "frame-src 'self' https://*.firebaseapp.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://mittengulped.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join("; ");

  res.setHeader("Content-Security-Policy", cspHeader);
  next();
});

export { escapeHtml, getPageMetaData, injectMetaTags };

// RSS Feed endpoint
app.get(["/rss.xml", "/feed.xml", "/rss", "/feed"], (_req, res) => {
  const rssXml = generateRssXml();
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.status(200).send(rssXml);
});

export async function startServer() {
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

    // Serve pre-rendered HTML pages for routes
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

      // Fallback for dynamic / unlisted routes
      const meta = getPageMetaData(url);
      try {
        const rawHtml = fs.readFileSync(indexHtmlPath, "utf-8");
        const html = injectMetaTags(rawHtml, meta);
        const statusCode = meta.isNotFound ? 404 : 200;
        res.status(statusCode).set({ "Content-Type": "text/html; charset=utf-8" }).send(html);
      } catch (err) {
        res.status(500).send("Error loading application");
      }
    });

    app.use(express.static(distPath, { index: false, redirect: false }));
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
