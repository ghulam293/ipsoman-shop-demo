import { useState } from "react";
import { ArrowUpRight } from "../../components/Icons.jsx";
import { money } from "../../lib/api.js";
export default function Orders({
  orders,
  compact = false,
  search = "",
  onOrder,
  onViewAll,
}) {
  const [status, setStatus] = useState("All statuses");
  const filtered = orders.filter(
    (o) =>
      `${o.id} ${o.customer} ${o.grade} ${o.status}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === "All statuses" || o.status === status),
  );
  return (
    <section className="card orders-card">
      <div className="section-heading">
        <div>
          <h2>
            {compact ? "Recent orders" : "All orders"}{" "}
            <span className="count-badge">{orders.length}</span>
          </h2>
          <p>Keep every school essential on track.</p>
        </div>
        {compact ? (
          <button className="subtle-button" onClick={onViewAll}>
            View all <ArrowUpRight size={14} />
          </button>
        ) : (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter order status"
          >
            {["All statuses", "Completed", "Processing", "Pending"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th aria-label="Details" />
            </tr>
          </thead>
          <tbody>
            {(compact ? filtered.slice(0, 4) : filtered).map((o) => (
              <tr key={o.id} onClick={() => onOrder(o)}>
                <td>
                  <button
                    className="order-id"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrder(o);
                    }}
                  >
                    #{o.id}
                  </button>
                  <small>
                    {new Date(`${o.date}T12:00:00`).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short" },
                    )}
                    , 2026
                  </small>
                </td>
                <td>
                  <div className="customer-cell">
                    <span className="avatar" style={{ background: o.color }}>
                      {o.initials}
                    </span>
                    <span>
                      {o.customer}
                      <small>
                        {o.grade} · {o.items} items
                      </small>
                    </span>
                  </div>
                </td>
                <td className="amount">
                  {money(o.total)}
                  <small>OMR</small>
                </td>
                <td>
                  <span className={`status ${o.status.toLowerCase()}`}>
                    <i />
                    {o.status}
                  </span>
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={`View order ${o.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrder(o);
                    }}
                  >
                    <ArrowUpRight size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">No orders match your search.</div>
        )}
      </div>
      <div className="table-footer">
        Showing {Math.min(compact ? 4 : filtered.length, filtered.length)} of{" "}
        {filtered.length} orders <span>Sample orders</span>
      </div>
    </section>
  );
}
