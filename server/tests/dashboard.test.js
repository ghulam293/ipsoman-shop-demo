import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
let server;
let base;
let directory;
let productFile;
before(async () => {
  directory = await mkdtemp(join(tmpdir(), "ips-products-"));
  productFile = join(directory, "products.json");
  const app = createApp({ productFile });
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(directory, { recursive: true, force: true });
});
test("dashboard returns demo products and orders", async () => {
  const response = await fetch(`${base}/api/dashboard`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.demo, true);
  assert.equal(data.products.length, 9);
  assert.equal(data.orders.length, 6);
  assert.equal(data.summary.revenue, 4826.75);
});
test("period selection changes the summary and chart", async () => {
  const data = await (await fetch(`${base}/api/dashboard?period=week`)).json();
  assert.equal(data.summary.orders, 64);
  assert.equal(data.summary.chart.length, 7);
});
test("invalid and inherited object keys fall back safely", async () => {
  for (const period of ["unknown", "toString", "__proto__"]) {
    const data = await (
      await fetch(`${base}/api/dashboard?period=${period}`)
    ).json();
    assert.equal(data.summary.revenue, 4826.75);
  }
});
test("unknown API endpoint returns JSON 404", async () => {
  const response = await fetch(`${base}/api/unknown`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "API endpoint not found" });
});

const validProduct = { name: "  English Workbook  ", category: "Books", grade: "Year 2", price: 2.75, stock: 12 };
test("manual product creation persists and survives a new app instance", async () => {
  const response = await fetch(`${base}/api/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(validProduct) });
  assert.equal(response.status, 201);
  const product = await response.json();
  assert.equal(product.name, "English Workbook");
  assert.equal(product.price, 2.75);
  assert.equal(product.stock, 12);
  assert.match(product.id, /^BK-/);
  const restarted = createApp({ productFile }).listen(0, "127.0.0.1");
  await new Promise(resolve => restarted.once("listening", resolve));
  try {
    const data = await (await fetch(`http://127.0.0.1:${restarted.address().port}/api/dashboard`)).json();
    assert.equal(data.products.length, 7);
    assert.deepEqual(data.products.find(p => p.id === product.id), product);
  } finally { await new Promise(resolve => restarted.close(resolve)); }
});
test("invalid products are rejected without changing saved inventory", async () => {
  const before = await (await fetch(`${base}/api/dashboard`)).json();
  for (const overrides of [{ name: " " }, { category: "Other" }, { grade: "" }, { price: -1 }, { price: "2.75" }, { price: 1.2345 }, { stock: -1 }, { stock: 1.2 }, { stock: 1000001 }]) {
    const response = await fetch(`${base}/api/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...validProduct, ...overrides }) });
    assert.equal(response.status, 400);
    assert.equal(typeof (await response.json()).error, "string");
  }
  const after = await (await fetch(`${base}/api/dashboard`)).json();
  assert.deepEqual(after.products, before.products);
});
test("concurrent product saves keep every product", async () => {
  const responses = await Promise.all(["Test A", "Test B"].map(name => fetch(`${base}/api/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...validProduct, name, stock: 0 }) })));
  assert.ok(responses.every(response => response.status === 201));
  const data = await (await fetch(`${base}/api/dashboard`)).json();
  for (const name of ["Test A", "Test B"]) assert.ok(data.products.some(p => p.name === name && p.stock === 0));
});
test("malformed JSON receives a useful error", async () => {
  const response = await fetch(`${base}/api/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "Invalid JSON request.");
});
