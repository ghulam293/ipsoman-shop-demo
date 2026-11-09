import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  ArrowUpRight,
  CalendarDays,
  Menu,
  X,
  Check,
  ArrowRight,
  RefreshCw,
  CircleHelp,
} from "../components/Icons.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import Overview from "../features/dashboard/Overview.jsx";
import Orders from "../features/orders/Orders.jsx";
import Products from "../features/products/Products.jsx";
import { getDashboard, money } from "../lib/api.js";
export default function App() {
  const [page, setPage] = useState("Overview"),
    [period, setPeriod] = useState("month"),
    [data, setData] = useState(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0),
    [search, setSearch] = useState(""),
    [menu, setMenu] = useState(false),
    [notifications, setNotifications] = useState(false),
    [order, setOrder] = useState(null),
    [notice, setNotice] = useState("");
  const [shopName, setShopName] = useState(
    () => localStorage.getItem("ips-shop-name") || "IPS School Shop",
  );
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    getDashboard(period, controller.signal)
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [period, retry]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOrder(null);
        setNotifications(false);
        setMenu(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  function navigate(next) {
    setPage(next);
    setSearch("");
    setMenu(false);
    setNotifications(false);
  }
  const titles = {
    Overview: [
      "A good day to make a difference.",
      "Here’s what’s happening with your school shop today.",
    ],
    Orders: [
      "Every order, thoughtfully managed.",
      "Track books, uniforms, and the students they’re heading to.",
    ],
    Products: [
      "The essentials for a great year.",
      "Your books and uniforms, organised in one place.",
    ],
    Customers: [
      "Your school community.",
      "A closer look at the families behind every order.",
    ],
    Reports: [
      "See the bigger picture.",
      "Understand your school shop’s performance.",
    ],
    Settings: [
      "Make yourself at home.",
      "Manage your school shop preferences.",
    ],
    Help: [
      "A little help goes a long way.",
      "Everything you need to get started with your dashboard.",
    ],
  };
  return (
    <div className="app-shell">
      <Sidebar
        shopName={shopName}
        page={page}
        setPage={navigate}
        open={menu}
        close={() => setMenu(false)}
      />
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMenu(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <span>/</span>
            <strong>{page}</strong>
          </div>
          <div className="header-right">
            <label className="search">
              <Search size={16} />
              <input
                placeholder="Search anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search orders and products"
              />
            </label>
            <span className="header-divider" />
            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                aria-expanded={notifications}
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={19} />
                <i />
              </button>
              {notifications && (
                <div className="notification-panel">
                  <h3>
                    Shop updates <span className="count-badge">2</span>
                  </h3>
                  {data?.products
                    .filter((p) => p.stock < 10)
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          navigate("Products");
                          setNotifications(false);
                        }}
                      >
                        <span className="notification-dot" />
                        <span>
                          <strong>{p.name}</strong>
                          <small>Low stock · {p.stock} remaining</small>
                        </span>
                        <ArrowUpRight size={15} />
                      </button>
                    ))}
                  <small>Demo inventory notifications</small>
                </div>
              )}
            </div>
            <button
              className="profile"
              onClick={() => navigate("Settings")}
              aria-label="Account settings"
            >
              <span className="avatar admin-avatar">SA</span>
              <span>
                <strong>School Admin</strong>
                <small>Administrator</small>
              </span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <Navbar page={page} onNavigate={navigate} />
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">YOUR SCHOOL. ALL SET.</div>
              <h1>
                {page === "Overview"
                  ? "Shop overview"
                  : page === "Help"
                    ? "Help & support"
                    : page}
              </h1>
              <p>{titles[page][1]}</p>
            </div>
            <div className="page-actions">
              <button
                className="button primary"
                onClick={() =>
                  navigate(page === "Products" ? "Orders" : "Products")
                }
              >
                {page === "Products" ? (
                  <>
                    <ArrowRight size={16} />
                    View orders
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    View catalogue
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="welcome-banner">
            <div className="banner-decoration" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="banner-copy">
              <span className="banner-badge">
                <span />
                ACADEMIC YEAR 2026–27
              </span>
              <h2>{titles[page][0]}</h2>
              <p>Books, uniforms, and a brighter start for every student.</p>
            </div>
            <div className="banner-right">
              <span className="banner-book">
                a<span>b</span>c
              </span>
              <div className="banner-ring" />
            </div>
            <span className="banner-star">✧</span>
          </div>
          <div className="content-toolbar">
            <div className="section-tabs">
              <button className="selected" onClick={() => navigate("Overview")}>
                {page === "Overview" ? "Overview" : "Dashboard"}
                <span />
              </button>
              <span className="demo-pill">
                <span />
                Demo workspace
              </span>
            </div>
            <div className="period-controls">
              <span className="updated">
                <span className="live-dot" /> Sample data
              </span>
              <label className="date-picker">
                <CalendarDays size={15} />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  aria-label="Dashboard date range"
                >
                  <option value="month">Oct 1 – Oct 31, 2026</option>
                  <option value="week">Oct 20 – Oct 26, 2026</option>
                  <option value="year">Jan 1 – Dec 31, 2026</option>
                </select>
              </label>
            </div>
          </div>
          {error ? (
            <div className="empty-state card">
              <h2>Couldn’t load the dashboard</h2>
              <p>{error}</p>
              <button
                className="button secondary"
                onClick={() => setRetry(retry + 1)}
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          ) : !data ? (
            <div className="loading-state card">
              <span className="loading-spinner" />
              Loading your school shop…
            </div>
          ) : (
            <>
              {(page === "Overview" || page === "Reports") && (
                <Overview
                  data={data}
                  period={period}
                  setPeriod={setPeriod}
                  setPage={navigate}
                  search={search}
                  onOrder={setOrder}
                />
              )}
              {page === "Orders" && (
                <Orders
                  orders={data.orders}
                  search={search}
                  onOrder={setOrder}
                />
              )}
              {page === "Products" && (
                <Products products={data.products} search={search} onCreated={(product) => {
                  setData((current) => ({ ...current, products: [...current.products, product] }));
                  setSearch("");
                  setNotice("Product added successfully");
                }} />
              )}
              {page === "Customers" && (
                <section className="card customers-card">
                  <div className="section-heading">
                    <div>
                      <h2>School families</h2>
                      <p>
                        {data.orders.length} customers in this demo workspace
                      </p>
                    </div>
                  </div>
                  <div className="customer-grid">
                    {data.orders
                      .filter((o) =>
                        `${o.customer} ${o.grade}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )
                      .map((o) => (
                        <article key={o.id}>
                          <span
                            className="avatar"
                            style={{ background: o.color }}
                          >
                            {o.initials}
                          </span>
                          <h3>{o.customer}</h3>
                          <p>{o.email}</p>
                          <small>
                            {o.grade} · Latest order #{o.id}
                          </small>
                          <button
                            className="text-link"
                            onClick={() => setOrder(o)}
                          >
                            View latest order <ArrowUpRight size={14} />
                          </button>
                        </article>
                      ))}
                  </div>
                </section>
              )}
              {page === "Settings" && (
                <form
                  className="card settings-card"
                  onSubmit={(e) => {
                    e.preventDefault();
                    localStorage.setItem("ips-shop-name", shopName);
                    setNotice("Preferences saved on this device");
                  }}
                >
                  <h2>Shop preferences</h2>
                  <p>These preferences are saved on this device.</p>
                  <label>
                    Shop name
                    <input
                      value={shopName}
                      maxLength={80}
                      required
                      onChange={(e) => setShopName(e.target.value)}
                    />
                  </label>
                  <label>
                    Currency
                    <input value="Omani Rial (OMR)" disabled />
                  </label>
                  <button className="button primary" type="submit">
                    <Check size={16} />
                    Save preferences
                  </button>
                </form>
              )}
              {page === "Help" && (
                <section className="card help-card">
                  <CircleHelp size={28} />
                  <h2>Welcome to your school shop</h2>
                  {[
                    [
                      "Explore your dashboard",
                      "Use Overview to review sample revenue, order activity, and stock. Select a date range to explore the demo periods.",
                    ],
                    [
                      "Find an order",
                      "Open Orders, search by customer name or order ID, and select an order to see its details. Filter orders by status.",
                    ],
                    [
                      "Browse your catalogue",
                      "Open Products to browse books and uniforms. Filter by category and use the search box to find an item.",
                    ],
                    [
                      "About this workspace",
                      "This is a demonstration with sample customers, inventory, and sales. No live payments or purchases are processed.",
                    ],
                  ].map(([title, text]) => (
                    <details key={title}>
                      <summary>{title}</summary>
                      <p>{text}</p>
                    </details>
                  ))}
                </section>
              )}
            </>
          )}
          <footer className="page-footer">
            <span>© 2026 IPS Oman. Made for a better school day.</span>
            <span>
              <span className="live-dot" />
              School shop dashboard <i>·</i> Demo data
            </span>
          </footer>
        </main>
      </div>
      {notice && (
        <div role="status" className="toast">
          <Check size={17} />
          {notice}
        </div>
      )}
      {order && (
        <div className="modal-backdrop" onClick={() => setOrder(null)}>
          <section
            className="order-modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const buttons = e.currentTarget.querySelectorAll("button");
              const first = buttons[0];
              const last = buttons[buttons.length - 1];
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="icon-button modal-close"
              aria-label="Close order"
              autoFocus
              onClick={() => setOrder(null)}
            >
              <X size={20} />
            </button>
            <span className="eyebrow">ORDER DETAILS</span>
            <h2 id="order-title">#{order.id}</h2>
            <span className={`status ${order.status.toLowerCase()}`}>
              <i />
              {order.status}
            </span>
            <dl>
              {[
                ["Customer", order.customer],
                ["Email", order.email],
                ["School year", order.grade],
                ["Items", order.items],
                ["Category", order.category],
                ["Order date", order.date],
                ["Total", `OMR ${money(order.total)}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="muted">
              Sample order · No payment has been processed.
            </p>

          </section>
        </div>
      )}
    </div>
  );
}
