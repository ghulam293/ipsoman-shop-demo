import { useState } from "react";
import { addProduct } from "../../lib/api.js";

const UNIFORM_SIZES = [
  "Size 20 (Age 3-4)",
  "Size 22 (Age 4-5)",
  "Size 24 (Age 5-6)",
  "Size 26 (Age 7-8)",
  "Size 28 (Age 9-10)",
  "Size 30 (Age 11-12)",
  "Size 32 (Age 13-14)",
  "Size 34 (Adult S)",
  "Size 36 (Adult M)",
  "Size 38 (Adult L)",
  "Size 40 (Adult XL)",
  "Standard / Free Size",
];

export default function ProductForm({ onCreated, onCancel }) {
  const [values, setValues] = useState({
    name: "",
    category: "Uniforms",
    gender: "Boys",
    size: "Size 24 (Age 5-6)",
    grade: "All years",
    price: "",
    stock: "10",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const change = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: values.name.trim(),
        category: values.category,
        grade: values.grade,
        price: Number(values.price),
        stock: Number(values.stock),
      };
      if (values.category === "Uniforms") {
        payload.gender = values.gender;
        payload.size = values.size;
      }
      const product = await addProduct(payload);
      onCreated(product);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="card product-form" onSubmit={submit}>
      <div className="product-form-header">
        <div>
          <h2>Add product manually</h2>
          <p>Register uniform items or books with strict validation.</p>
        </div>
        <span className="security-badge">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Strict Mode Active
        </span>
      </div>

      <div className="product-form-grid">
        <label>
          Product name
          <input
            name="name"
            value={values.name}
            onChange={change}
            required
            maxLength={100}
            placeholder={values.category === "Uniforms" ? "e.g. Boys Everyday Maroon Polo" : "e.g. Maths in Focus Year 4"}
            autoFocus
          />
        </label>

        <label>
          Category
          <select name="category" value={values.category} onChange={change}>
            <option value="Uniforms">Uniforms</option>
            <option value="Books">Books</option>
          </select>
        </label>

        {values.category === "Uniforms" && (
          <>
            <label className="highlight-field boys-label">
              Uniform Selection (Boys / Girls)
              <select name="gender" value={values.gender} onChange={change}>
                <option value="Boys">👦 Boys Uniform</option>
                <option value="Girls">👧 Girls Uniform</option>
                <option value="Unisex">✨ Unisex / All</option>
              </select>
            </label>

            <label className="highlight-field size-label">
              Uniform Size
              <select name="size" value={values.size} onChange={change}>
                {UNIFORM_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <label>
          School year
          <select name="grade" value={values.grade} onChange={change}>
            {["All years", "KG 1", "KG 2", ...Array.from({ length: 13 }, (_, i) => `Year ${i + 1}`)].map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </label>

        <label>
          Price (OMR)
          <input
            name="price"
            type="number"
            min="0.001"
            max="10000"
            step="0.001"
            value={values.price}
            onChange={change}
            required
            placeholder="0.000"
          />
        </label>

        <label>
          Stock quantity
          <input
            name="stock"
            type="number"
            min="0"
            max="1000000"
            step="1"
            value={values.stock}
            onChange={change}
            required
          />
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button className="button primary" disabled={saving}>
          {saving ? "Saving…" : "Save product"}
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={saving}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
