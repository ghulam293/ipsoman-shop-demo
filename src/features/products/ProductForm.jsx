import { useState } from "react";
import { addProduct } from "../../lib/api.js";

export default function ProductForm({ onCreated, onCancel }) {
  const [values, setValues] = useState({ name: "", category: "Books", grade: "Year 1", price: "", stock: "0" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const change = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setError("");
    try {
      const product = await addProduct({ ...values, price: Number(values.price), stock: Number(values.stock) });
      onCreated(product);
    } catch (error) { setError(error.message); setSaving(false); }
  }
  return <form className="card product-form" onSubmit={submit}>
    <h2>Add product manually</h2>
    <p>Enter the product details. Your inventory is saved on this server.</p>
    <div className="product-form-grid">
      <label>Product name<input name="name" value={values.name} onChange={change} required maxLength={100} placeholder="e.g. Year 2 English Workbook" autoFocus /></label>
      <label>Category<select name="category" value={values.category} onChange={change}><option>Books</option><option>Uniforms</option></select></label>
      <label>School year<select name="grade" value={values.grade} onChange={change}>{["All years", "KG 1", "KG 2", ...Array.from({ length: 13 }, (_, i) => `Year ${i + 1}`)].map(grade => <option key={grade}>{grade}</option>)}</select></label>
      <label>Price (OMR)<input name="price" type="number" min="0.001" max="10000" step="0.001" value={values.price} onChange={change} required placeholder="0.000" /></label>
      <label>Stock quantity<input name="stock" type="number" min="0" max="1000000" step="1" value={values.stock} onChange={change} required /></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save product"}</button><button className="button secondary" type="button" disabled={saving} onClick={onCancel}>Cancel</button></div>
  </form>;
}
