import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { products as samples } from "./store.js";

function sanitizeString(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
}

export function createProductStore(file) {
  let pending = Promise.resolve();
  async function read() {
    try {
      return JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return samples.map(product => ({ ...product }));
      throw error;
    }
  }
  return {
    async list() {
      await pending;
      return read();
    },
    add(input) {
      const operation = pending.then(async () => {
        const products = await read();
        const product = {
          ...input,
          image: `/assets/images/products/${input.category === "Books" ? "book-placeholder.svg" : "ips-school-uniform.jpg"}`,
          id: `${input.category === "Books" ? "BK" : "UN"}-${randomUUID()}`,
          label: input.category === "Books" ? input.name.toUpperCase().slice(0, 18) : (input.gender === "Girls" ? "skirt" : "polo"),
          subtitle: input.category === "Books" ? "STUDENT BOOK" : (input.size || "STANDARD"),
          color: input.category === "Books" ? "#8ea89a" : (input.gender === "Girls" ? "#9f1239" : input.gender === "Boys" ? "#1d4ed8" : "#7e1b2f"),
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
  // Prototype pollution protection
  if (Object.prototype.hasOwnProperty.call(body, "__proto__") || Object.prototype.hasOwnProperty.call(body, "constructor")) {
    return null;
  }
  const name = sanitizeString(body.name);
  const category = body.category;
  const grade = sanitizeString(body.grade);
  const price = body.price;
  const stock = body.stock;
  const gender = body.gender ? sanitizeString(body.gender) : (category === "Uniforms" ? "Unisex" : undefined);
  const size = body.size ? sanitizeString(body.size) : (category === "Uniforms" ? "Standard" : undefined);

  if (!name || name.length > 100) return null;
  if (!["Books", "Uniforms"].includes(category)) return null;
  if (!grade || grade.length > 40) return null;
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0 || price > 10000 || Math.abs(price * 1000 - Math.round(price * 1000)) > 0.000001) return null;
  if (!Number.isSafeInteger(stock) || stock < 0 || stock > 1000000) return null;

  const result = { name, category, grade, price, stock };
  if (category === "Uniforms") {
    result.gender = ["Boys", "Girls", "Unisex"].includes(gender) ? gender : "Unisex";
    result.size = size && size.length <= 30 ? size : "Standard";
  }
  return result;
}
