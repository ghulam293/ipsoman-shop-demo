export async function getDashboard(period, signal) {
  const response = await fetch(
    `/api/dashboard?period=${encodeURIComponent(period)}`,
    { signal },
  );
  if (!response.ok)
    throw new Error("Unable to load the dashboard. Please try again.");
  return response.json();
}
export const money = (value) =>
  Number(value).toLocaleString("en-OM", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
export async function addProduct(product) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not save product.");
  return data;
}
