import express from "express";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDashboardRouter } from "./routes/dashboard.js";
import { createProductStore } from "./data/products.js";

export function createApp({
  productFile = process.env.VERCEL
    ? path.join(os.tmpdir(), "products.json")
    : fileURLToPath(new URL("./storage/products.json", import.meta.url)),
} = {}) {
  const app = express();
  app.disable("x-powered-by");

  // High Strict Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    );
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    );
    next();
  });

  app.use(express.json({ limit: "16kb" }));

  const dashboardRouter = createDashboardRouter(createProductStore(productFile));
  app.use("/api", dashboardRouter);
  app.use(dashboardRouter);

  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "API endpoint not found" }),
  );

  const dist = fileURLToPath(new URL("../dist", import.meta.url));
  app.use(express.static(dist));
  app.get("/{*path}", (_req, res) => res.sendFile(path.join(dist, "index.html")));

  app.use((error, _req, res, _next) => {
    const status = error.status === 400 ? 400 : error.status === 413 ? 413 : 500;
    res.status(status).json({
      error:
        status === 400
          ? "Invalid JSON request."
          : status === 413
            ? "Request is too large."
            : "Unable to save or load products. Please try again.",
    });
  });

  return app;
}

export const app = createApp();
