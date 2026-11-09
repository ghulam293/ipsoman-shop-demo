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
