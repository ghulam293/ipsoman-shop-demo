import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { products as samples } from "./store.js";

export function createProductStore(file) {
  let pending = Promise.resolve();
  async function read() {
    try { return JSON.parse(await readFile(file, "utf8")); }
    catch (error) {
      if (error.code === "ENOENT") return samples.map(product => ({ ...product }));
      throw error;
    }
  }
  return {
    async list() { await pending; return read(); },
    add(input) {
      const operation = pending.then(async () => {
        const products = await read();
        const product = {
          ...input,
          image: `/assets/images/products/${input.category === "Books" ? "book-placeholder.svg" : "ips-school-uniform.jpg"}`,
          id: `${input.category === "Books" ? "BK" : "UN"}-${randomUUID()}`,
          label: input.category === "Books" ? input.name.toUpperCase().slice(0, 18) : "polo",
          subtitle: input.category === "Books" ? "STUDENT BOOK" : "",
          color: input.category === "Books" ? "#8ea89a" : "#bacbc7",
        };
        await mkdir(dirname(file), { recursive: true });
        const temporary = `${file}.tmp`;
        await writeFile(temporary, JSON.stringify([...products, product], null, 2), "utf8");
        await rename(temporary, file);
        return product;
      });
      pending = operation.catch(() => {});
      return operation;
    },
  };
}

export function validateProduct(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const { name, category, grade, price, stock } = body;
  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) return null;
  if (!["Books", "Uniforms"].includes(category)) return null;
  if (typeof grade !== "string" || !grade.trim() || grade.trim().length > 40) return null;
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0 || price > 10000 || Math.abs(price * 1000 - Math.round(price * 1000)) > 0.000001) return null;
  if (!Number.isSafeInteger(stock) || stock < 0 || stock > 1000000) return null;
  return { name: name.trim(), category, grade: grade.trim(), price, stock };
}
