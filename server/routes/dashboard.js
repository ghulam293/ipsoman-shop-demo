import { Router } from "express";
import { orders, periods } from "../data/store.js";
import { validateProduct } from "../data/products.js";
export function createDashboardRouter(productStore) {
const dashboardRouter = Router();
dashboardRouter.get("/dashboard", async (req, res) => {
  const period = Object.hasOwn(periods, req.query.period)
    ? req.query.period
    : "month";
  res.json({ summary: periods[period], products: await productStore.list(), orders, demo: true });
});

dashboardRouter.post("/products", async (req, res) => {
  const input = validateProduct(req.body);
  if (!input) return res.status(400).json({ error: "Enter a name, category, grade, positive price (up to 3 decimals), and a whole stock quantity from 0 to 1,000,000." });
  const product = await productStore.add(input);
  res.status(201).json(product);
});
dashboardRouter.get("/health", (_req, res) => res.json({ status: "ok" }));
return dashboardRouter;
}
