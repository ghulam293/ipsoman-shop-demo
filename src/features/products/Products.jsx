import { useMemo, useState } from "react";
import ProductArt from "../../components/ProductArt.jsx";
import { money } from "../../lib/api.js";
import ProductForm from "./ProductForm.jsx";
import UniformFittingModal from "./UniformFittingModal.jsx";
import { Plus, Search, Sparkles } from "../../components/Icons.jsx";

const PAGE_SIZE = 9;

export default function Products({ products, search, onCreated, onOrderPlaced }) {
  const [category, setCategory] = useState("All products");
  const [stock, setStock] = useState("all");
  const [grade, setGrade] = useState("all");
  const [gender, setGender] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [showFitting, setShowFitting] = useState(false);
  const [pagination, setPagination] = useState({ key: "", page: 1 });

  const grades = useMemo(
    () =>
      [...new Set(products.map((p) => p.grade))].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ),
    [products],
  );

  const sizes = useMemo(
    () =>
      [...new Set(products.map((p) => p.size).filter(Boolean))].sort(),
    [products],
  );

  const totals = useMemo(
    () =>
      products.reduce(
        (result, p) => ({
          units: result.units + p.stock,
          low: result.low + Number(p.stock > 0 && p.stock < 10),
          empty: result.empty + Number(p.stock === 0),
          value: result.value + p.price * p.stock,
        }),
        { units: 0, low: 0, empty: 0, value: 0 },
      ),
    [products],
  );

  const items = useMemo(() => {
    const terms = `${search || ""} ${query}`
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const result = products.filter((p) => {
      const text = `${p.name} ${p.id} ${p.grade} ${p.category} ${p.gender || ""} ${p.size || ""}`.toLowerCase();
      const matchGender =
        gender === "all" ||
        p.gender === gender ||
        (gender === "Boys" && (p.gender === "Boys" || p.gender === "Unisex")) ||
        (gender === "Girls" && (p.gender === "Girls" || p.gender === "Unisex"));
      const matchSize =
        sizeFilter === "all" ||
        p.size === sizeFilter ||
        (p.size && p.size.includes(sizeFilter));

      return (
        terms.every((term) => text.includes(term)) &&
        (category === "All products" || p.category === category) &&
        (grade === "all" || p.grade === grade || p.grade === "All years") &&
        matchGender &&
        matchSize &&
        (stock === "all" ||
          (stock === "available" && p.stock > 0) ||
          (stock === "low" && p.stock > 0 && p.stock < 10) ||
          (stock === "empty" && p.stock === 0))
      );
    });

    if (sort === "recent") return result.reverse();
    return result.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "stock-low") return a.stock - b.stock;
      return a.name.localeCompare(b.name);
    });
  }, [products, search, query, category, grade, gender, sizeFilter, stock, sort]);

  const filterKey = JSON.stringify([
    search,
    query,
    category,
    grade,
    gender,
    sizeFilter,
    stock,
    sort,
  ]);
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const page = Math.min(
    pagination.key === filterKey ? pagination.page : 1,
    pageCount,
  );
  const start = (page - 1) * PAGE_SIZE;
  const visible = items.slice(start, start + PAGE_SIZE);

  function resetFilters() {
    setCategory("All products");
    setStock("all");
    setGrade("all");
    setGender("all");
    setSizeFilter("all");
    setQuery("");
    setSort("recent");
  }

  return (
    <>
      <div className="product-management">
        <div>
          <strong>Product catalogue</strong>
          <p>Find essentials, check stock, and manage boys & girls uniform sizing.</p>
        </div>
        <div className="management-buttons">
          <button
            type="button"
            className="button colorful-uniform-btn"
            onClick={() => setShowFitting(true)}
          >
            <Sparkles size={16} />
            Uniform Sizing & Selection
          </button>
          <button
            type="button"
            className="button primary"
            onClick={() => setAdding(true)}
            disabled={adding}
          >
            <Plus size={16} />
            Add product
          </button>
        </div>
      </div>

      <div className="inventory-summary" aria-label="Inventory summary">
        <div className="card">
          <span>Products</span>
          <strong>{products.length}</strong>
          <small>{totals.units} units in stock</small>
        </div>
        <button
          className={`card ${stock === "low" ? "chosen" : ""}`}
          onClick={() => setStock(stock === "low" ? "all" : "low")}
          aria-pressed={stock === "low"}
        >
          <span>Low stock</span>
          <strong>{totals.low}</strong>
          <small>Fewer than 10 units</small>
        </button>
        <button
          className={`card ${stock === "empty" ? "chosen" : ""}`}
          onClick={() => setStock(stock === "empty" ? "all" : "empty")}
          aria-pressed={stock === "empty"}
        >
          <span>Out of stock</span>
          <strong>{totals.empty}</strong>
          <small>Products to restock</small>
        </button>
        <div className="card">
          <span>Inventory value</span>
          <strong>
            <small>OMR </small>
            {money(totals.value)}
          </strong>
          <small>At listed selling prices</small>
        </div>
      </div>

      {showFitting && (
        <UniformFittingModal
          onClose={() => setShowFitting(false)}
          onOrderPlaced={(order) => {
            if (onOrderPlaced) onOrderPlaced(order);
          }}
        />
      )}

      {adding && (
        <ProductForm
          onCancel={() => setAdding(false)}
          onCreated={(product) => {
            resetFilters();
            setPagination({ key: "", page: 1 });
            setAdding(false);
            onCreated(product);
          }}
        />
      )}

      <div className="catalogue-controls card">
        <label className="catalogue-search">
          <Search size={16} />
          <input
            aria-label="Search catalogue"
            placeholder="Search name, SKU, boys, girls, or size..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="catalogue-selects">
          <label>
            Uniform Selection (Boys / Girls)
            <select
              aria-label="Filter by gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="all">All genders</option>
              <option value="Boys">👦 Boys Uniforms</option>
              <option value="Girls">👧 Girls Uniforms</option>
              <option value="Unisex">✨ Unisex</option>
            </select>
          </label>

          <label>
            Uniform Size
            <select
              aria-label="Filter by size"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="all">All sizes</option>
              {sizes.length > 0 ? (
                sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              ) : (
                <>
                  <option value="Size 20">Size 20 (Age 3-4)</option>
                  <option value="Size 22">Size 22 (Age 4-5)</option>
                  <option value="Size 24">Size 24 (Age 5-6)</option>
                  <option value="Size 26">Size 26 (Age 7-8)</option>
                  <option value="Size 28">Size 28 (Age 9-10)</option>
                  <option value="Size 30">Size 30 (Age 11-12)</option>
                  <option value="Size 32">Size 32 (Age 13-14)</option>
                  <option value="Size 34">Size 34 (S)</option>
                  <option value="Size 36">Size 36 (M)</option>
                </>
              )}
            </select>
          </label>

          <label>
            School year
            <select
              aria-label="Filter school year"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="all">All school years</option>
              {grades.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>

          <label>
            Availability
            <select
              aria-label="Filter product stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            >
              <option value="all">All stock</option>
              <option value="available">In stock</option>
              <option value="low">Low stock</option>
              <option value="empty">Out of stock</option>
            </select>
          </label>

          <label>
            Sort by
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recent">Newest first</option>
              <option value="name">Name A–Z</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="stock-low">Stock: lowest first</option>
            </select>
          </label>

          <button className="text-link" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      </div>

      <div className="catalogue-results">
        <div className="product-tabs" aria-label="Product categories">
          {["All products", "Books", "Uniforms"].map((c) => (
            <button
              className={category === c ? "selected" : ""}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              key={c}
            >
              {c}
              <span className="category-count">
                {c === "All products"
                  ? products.length
                  : products.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>
        <span className="results-count" role="status">
          {items.length} {items.length === 1 ? "product" : "products"} found
        </span>
      </div>

      <div className="product-grid">
        {visible.map((p) => (
          <article className="card product-card" key={p.id}>
            <ProductArt product={p} />
            <div className="product-info">
              <div className="product-tag-row">
                <span className="product-category">
                  {p.category} · {p.grade}
                </span>
                {p.gender && (
                  <span
                    className={`gender-badge ${p.gender.toLowerCase()}`}
                  >
                    {p.gender === "Boys" ? "👦 Boys" : p.gender === "Girls" ? "👧 Girls" : "✨ Unisex"}
                  </span>
                )}
                {p.size && (
                  <span className="size-badge" title={p.size}>
                    {p.size.length > 14 ? p.size.slice(0, 12) + "…" : p.size}
                  </span>
                )}
              </div>
              <h2>{p.name}</h2>
              <div>
                <strong>OMR {money(p.price)}</strong>
                <span
                  className={
                    p.stock === 0
                      ? "out-of-stock"
                      : p.stock < 10
                        ? "low-stock"
                        : "in-stock"
                  }
                >
                  {p.stock === 0
                    ? "Out of stock"
                    : p.stock < 10
                      ? "Low stock"
                      : "In stock"}{" "}
                  · {p.stock}
                </span>
              </div>
              <small className="product-sku" title={p.id}>
                SKU: {p.id}
              </small>
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="empty-state card">
          <Search size={25} />
          <h2>No matching products</h2>
          <p>
            Try another name, SKU, school year, boys/girls selection, or stock filter.
            {search ? " A search is also active in the top bar." : ""}
          </p>
          <button className="button secondary" onClick={resetFilters}>
            Reset catalogue filters
          </button>
        </div>
      ) : (
        <div className="catalogue-pagination">
          <span>
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, items.length)} of{" "}
            {items.length}
          </span>
          <nav aria-label="Catalogue pagination">
            <button
              className="button secondary"
              disabled={page === 1}
              onClick={() =>
                setPagination({ key: filterKey, page: page - 1 })
              }
            >
              Previous
            </button>
            <span>
              Page {page} of {pageCount}
            </span>
            <button
              className="button secondary"
              disabled={page === pageCount}
              onClick={() =>
                setPagination({ key: filterKey, page: page + 1 })
              }
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
