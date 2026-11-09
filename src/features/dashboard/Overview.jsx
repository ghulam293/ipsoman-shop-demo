import {
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  Wallet,
  Users,
  Package,
  BookOpen,
  Shirt,
  MoreHorizontal,
} from "../../components/Icons.jsx";
import { money } from "../../lib/api.js";
import ProductArt from "../../components/ProductArt.jsx";
import Orders from "../orders/Orders.jsx";
export default function Overview({
  data,
  period,
  setPeriod,
  setPage,
  search,
  onOrder,
}) {
  const { summary, products } = data;
  const weightTotal = summary.chart.reduce((total, value) => total + value, 0);
  const revenuePoints = summary.chart.map((value) => value / weightTotal * summary.revenue);
  const axisStep = Math.ceil(Math.max(...revenuePoints) / 4 / 25) * 25;
  const metrics = [
    {
      label: "Total revenue",
      value: money(summary.revenue),
      prefix: "OMR",
      icon: Wallet,
      trend: summary.growth + "%",
      detail: "vs. previous period",
    },
    {
      label: "Total orders",
      value: summary.orders,
      icon: ShoppingBag,
      trend: "8.2%",
      detail: "vs. previous period",
    },
    {
      label: "Total customers",
      value: summary.customers,
      icon: Users,
      trend: "6.4%",
      detail: "vs. previous period",
    },
    {
      label: "Products in stock",
      value: products.reduce((s, p) => s + p.stock, 0),
      icon: Package,
      detail: `Across ${products.length} active products`,
    },
  ];
  return (
    <>
      <div className="metrics">
        {metrics.map(({ label, value, prefix, icon: Icon, trend, detail }) => (
          <article className="metric card" key={label}>
            <div className="metric-heading">
              {label}
              <span>
                <Icon size={17} />
              </span>
            </div>
            <div className="metric-value">
              {prefix && <small>{prefix}</small>}
              {value}
            </div>
            <div className="metric-bottom">
              <span>
                {trend && (
                  <b>
                    <ArrowUpRight size={12} />
                    {trend}
                  </b>
                )}
                <small>{detail}</small>
              </span>
              <svg className="sparkline" viewBox="0 0 80 30" aria-hidden="true">
                <path
                  d="M0 25 7 22 13 25 20 15 26 19 33 12 40 18 47 10 54 13 62 3 68 8 80 1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </article>
        ))}
      </div>
      <div className="chart-row">
        <section className="card revenue">
          <div className="section-heading">
            <div>
              <h2>Revenue overview</h2>
              <p>A little progress, every school day.</p>
            </div>
            <select
              aria-label="Revenue period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="month">This month</option>
              <option value="week">This week</option>
              <option value="year">This year</option>
            </select>
          </div>
          <div className="chart-legend">
            <span>
              <i />
              Books
            </span>
            <span>
              <i />
              Uniforms
            </span>
            <span className="legend-total">
              Total revenue <strong>OMR {money(summary.revenue)}</strong>
            </span>
          </div>
          <div className="bar-chart">
            <div className="y-axis">
              {[4, 3, 2, 1, 0].map((step) => step * axisStep).map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <div className="plot">
              <div className="grid-lines">
                {[1, 2, 3, 4, 5].map((n) => (
                  <i key={n} />
                ))}
              </div>
              <div className="bars">
                {revenuePoints.map((revenue, i) => (
                  <div
                    className="bar-stack"
                    key={i}
                    style={{ height: `${revenue / (axisStep * 4) * 100}%` }}
                    tabIndex="0"
                    aria-label={`Period ${i + 1}: OMR ${money(revenue)}`}
                  >
                    <div className="bar-uniform" />
                    <div className="bar-book" />
                    <span className="bar-tooltip">
                      Period {i + 1} · OMR {money(revenue)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="x-axis">
                {(period === "week"
                  ? ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"]
                  : period === "year"
                    ? ["Jan", "Mar", "May", "Jul", "Sep", "Dec"]
                    : [
                        "01 Oct",
                        "05 Oct",
                        "10 Oct",
                        "15 Oct",
                        "20 Oct",
                        "25 Oct",
                        "30 Oct",
                      ]
                ).map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="chart-foot">
            <span className="live-dot" />
            Illustrative sales trend{" "}
            <span>All amounts in Omani Rial (OMR)</span>
          </div>
        </section>
        <section className="card category-card">
          <div className="section-heading">
            <div>
              <h2>Sales by category</h2>
              <p>A closer look at your sales.</p>
            </div>
            <Package size={17} className="muted" />
          </div>
          <div className="donut">
            <svg
              viewBox="0 0 180 180"
              aria-label="Books 64 percent, uniforms 36 percent"
            >
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="#e4d7b6"
                strokeWidth="21"
              />
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="#285a48"
                strokeWidth="21"
                strokeDasharray="281.5 440"
                transform="rotate(-90 90 90)"
              />
            </svg>
            <div>
              <span>Total sales</span>
              <strong>{summary.orders}</strong>
              <small>orders this period</small>
            </div>
          </div>
          <div className="category-line">
            <span className="category-symbol">
              <BookOpen size={17} />
            </span>
            <span>
              Books<small>Textbooks & workbooks</small>
            </span>
            <strong>
              64%<small>OMR {money(summary.revenue * 0.64)}</small>
            </strong>
          </div>
          <div className="category-line">
            <span className="category-symbol gold">
              <Shirt size={17} />
            </span>
            <span>
              Uniforms<small>Schoolwear & PE kits</small>
            </span>
            <strong>
              36%<small>OMR {money(summary.revenue * 0.36)}</small>
            </strong>
          </div>
        </section>
      </div>
      <div className="lower-row">
        <Orders
          orders={data.orders}
          compact
          search={search}
          onOrder={onOrder}
          onViewAll={() => setPage("Orders")}
        />
        <section className="card top-products">
          <div className="section-heading">
            <div>
              <h2>Popular products</h2>
              <p>The school-day essentials.</p>
            </div>
            <MoreHorizontal size={19} className="muted" />
          </div>
          {[products[0], products[1], products[4]].map((p, i) => (
            <button
              className="popular-product"
              key={p.id}
              onClick={() => setPage("Products")}
            >
              <ProductArt product={p} small />
              <span>
                <strong>{p.name}</strong>
                <small>
                  {p.category} · {p.grade}
                </small>
                <b>OMR {money(p.price)}</b>
              </span>
              <span className="rank">0{i + 1}</span>
            </button>
          ))}
          <button
            className="text-link all-products"
            onClick={() => setPage("Products")}
          >
            View all products <ArrowRight size={15} />
          </button>
        </section>
      </div>
    </>
  );
}
