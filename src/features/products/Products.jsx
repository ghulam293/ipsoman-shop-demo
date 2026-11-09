import { useMemo, useState } from "react";
import ProductArt from "../../components/ProductArt.jsx";
import { money } from "../../lib/api.js";
import ProductForm from "./ProductForm.jsx";
import { Plus, Search } from "../../components/Icons.jsx";

const PAGE_SIZE = 9;

export default function Products({ products, search, onCreated }) {
  const [category, setCategory] = useState("All products");
  const [stock, setStock] = useState("all");
  const [grade, setGrade] = useState("all");
  const [sort, setSort] = useState("recent");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [pagination, setPagination] = useState({ key: "", page: 1 });
  const grades = useMemo(() => [...new Set(products.map(p => p.grade))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })), [products]);
  const totals = useMemo(() => products.reduce((result, p) => ({
    units: result.units + p.stock,
    low: result.low + Number(p.stock > 0 && p.stock < 10),
    empty: result.empty + Number(p.stock === 0),
    value: result.value + p.price * p.stock,
  }), { units: 0, low: 0, empty: 0, value: 0 }), [products]);
  const items = useMemo(() => {
    const terms = `${search || ""} ${query}`.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const result = products.filter(p => {
      const text = `${p.name} ${p.id} ${p.grade} ${p.category}`.toLowerCase();
      return terms.every(term => text.includes(term)) &&
        (category === "All products" || p.category === category) &&
        (grade === "all" || p.grade === grade || p.grade === "All years") &&
        (stock === "all" || (stock === "available" && p.stock > 0) || (stock === "low" && p.stock > 0 && p.stock < 10) || (stock === "empty" && p.stock === 0));
    });
    if (sort === "recent") return result.reverse();
    return result.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "stock-low") return a.stock - b.stock;
      return a.name.localeCompare(b.name);
    });
  }, [products, search, query, category, grade, stock, sort]);
  const filterKey = JSON.stringify([search, query, category, grade, stock, sort]);
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const page = Math.min(pagination.key === filterKey ? pagination.page : 1, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const visible = items.slice(start, start + PAGE_SIZE);
  function resetFilters() {
    setCategory("All products"); setStock("all"); setGrade("all"); setQuery(""); setSort("recent");
  }
  return (
    <>
      <div className="product-management">
        <div><strong>Product catalogue</strong><p>Find essentials, check stock, and add new products.</p></div>
        <button type="button" className="button primary" onClick={() => setAdding(true)} disabled={adding}><Plus size={16} />Add product</button>
      </div>
      <div className="inventory-summary" aria-label="Inventory summary">
        <div className="card"><span>Products</span><strong>{products.length}</strong><small>{totals.units} units in stock</small></div>
        <button className={`card ${stock === "low" ? "chosen" : ""}`} onClick={() => setStock(stock === "low" ? "all" : "low")} aria-pressed={stock === "low"}><span>Low stock</span><strong>{totals.low}</strong><small>Fewer than 10 units</small></button>
        <button className={`card ${stock === "empty" ? "chosen" : ""}`} onClick={() => setStock(stock === "empty" ? "all" : "empty")} aria-pressed={stock === "empty"}><span>Out of stock</span><strong>{totals.empty}</strong><small>Products to restock</small></button>
        <div className="card"><span>Inventory value</span><strong><small>OMR </small>{money(totals.value)}</strong><small>At listed selling prices</small></div>
      </div>
      {adding && <ProductForm onCancel={() => setAdding(false)} onCreated={product => {
        resetFilters(); setPagination({ key: "", page: 1 }); setAdding(false); onCreated(product);
      }} />}
      <div className="catalogue-controls card">
        <label className="catalogue-search"><Search size={16}/><input aria-label="Search catalogue" placeholder="Search name, SKU, or school year..." value={query} onChange={e => setQuery(e.target.value)}/></label>
        <div className="catalogue-selects">
          <label>School year<select aria-label="Filter school year" value={grade} onChange={e => setGrade(e.target.value)}><option value="all">All school years</option>{grades.map(g => <option key={g}>{g}</option>)}</select></label>
          <label>Availability<select aria-label="Filter product stock" value={stock} onChange={e => setStock(e.target.value)}><option value="all">All stock</option><option value="available">In stock</option><option value="low">Low stock</option><option value="empty">Out of stock</option></select></label>
          <label>Sort by<select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}><option value="recent">Newest first</option><option value="name">Name A–Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="stock-low">Stock: lowest first</option></select></label>
          <button className="text-link" onClick={resetFilters}>Reset filters</button>
        </div>
      </div>
      <div className="catalogue-results">
        <div className="product-tabs" aria-label="Product categories">{["All products", "Books", "Uniforms"].map(c => <button className={category === c ? "selected" : ""} aria-pressed={category === c} onClick={() => setCategory(c)} key={c}>{c}<span className="category-count">{c === "All products" ? products.length : products.filter(p => p.category === c).length}</span></button>)}</div>
        <span className="results-count" role="status">{items.length} {items.length === 1 ? "product" : "products"} found</span>
      </div>
      <div className="product-grid">{visible.map(p => (
        <article className="card product-card" key={p.id}>
          {/* Product image files live in assets/images/products/. */}
          <ProductArt product={p}/>
          <div className="product-info">
            <span className="product-category">{p.category} · {p.grade}</span><h2>{p.name}</h2>
            <div><strong>OMR {money(p.price)}</strong><span className={p.stock === 0 ? "out-of-stock" : p.stock < 10 ? "low-stock" : "in-stock"}>{p.stock === 0 ? "Out of stock" : p.stock < 10 ? "Low stock" : "In stock"} · {p.stock}</span></div>
            <small className="product-sku" title={p.id}>SKU: {p.id}</small>
          </div>
        </article>
      ))}</div>
      {items.length === 0 ? <div className="empty-state card"><Search size={25}/><h2>No matching products</h2><p>Try another name, SKU, school year, or stock filter.{search ? " A search is also active in the top bar." : ""}</p><button className="button secondary" onClick={resetFilters}>Reset catalogue filters</button></div> : <div className="catalogue-pagination"><span>Showing {start + 1}–{Math.min(start + PAGE_SIZE, items.length)} of {items.length}</span><nav aria-label="Catalogue pagination"><button className="button secondary" disabled={page === 1} onClick={() => setPagination({ key: filterKey, page: page - 1 })}>Previous</button><span>Page {page} of {pageCount}</span><button className="button secondary" disabled={page === pageCount} onClick={() => setPagination({ key: filterKey, page: page + 1 })}>Next</button></nav></div>}
    </>
  );
}
