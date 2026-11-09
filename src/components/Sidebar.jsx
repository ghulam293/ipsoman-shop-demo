import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ChartNoAxesCombined,
  Settings,
  CircleHelp,
  ArrowUpRight,
  ChevronDown,
  X,
  BookOpen,
} from "./Icons.jsx";
const nav = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Orders", icon: ShoppingBag, count: "6" },
  { name: "Products", icon: Package },
  { name: "Customers", icon: Users },
  { name: "Reports", icon: ChartNoAxesCombined },
];
export default function Sidebar({
  page,
  setPage,
  open,
  close,
  shopName = "IPS School Shop",
}) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? "show" : ""}`}
        onClick={close}
      />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={() => {
            setPage("Overview");
            close();
          }}
        >
          <span className="brand-icon">
            <BookOpen size={23} />
          </span>
          <span>
            IPS <b>OMAN</b>
            <small>BOOKS & UNIFORMS</small>
          </span>
        </a>
        <button
          className="mobile-close icon-button"
          aria-label="Close menu"
          onClick={close}
        >
          <X size={20} />
        </button>
        <div className="workspace">
          <span className="school-icon">
            <img src="/assets/ips-school-crest.png" alt="IPS school crest" />
          </span>
          <span>
            <strong>{shopName}</strong>
            <small>School management</small>
          </span>
          <ChevronDown size={14} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {nav.map(({ name, icon: Icon, count }) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""}`}
              onClick={() => {
                setPage(name);
                close();
              }}
            >
              <Icon size={19} />
              <span>{name}</span>
              {count && <b>{count}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="school-card">
            <span className="school-card-icon">✦</span>
            <strong>
              A better school year,
              <br />
              starts here.
            </strong>
            <p>
              Everything your students need,
              <br />
              all in one place.
            </p>
            <button
              onClick={() => {
                setPage("Products");
                close();
              }}
            >
              Explore catalogue <ArrowUpRight size={15} />
            </button>
          </div>
          <button
            className={`nav-item ${page === "Settings" ? "active" : ""}`}
            onClick={() => {
              setPage("Settings");
              close();
            }}
          >
            <Settings size={19} />
            Settings
          </button>
          <button
            className="nav-item"
            onClick={() => {
              setPage("Help");
              close();
            }}
          >
            <CircleHelp size={19} />
            Help & support
            <ArrowUpRight size={15} />
          </button>
          <div className="sidebar-footer">
            <span className="live-dot" /> All systems operational{" "}
            <small>v2.0</small>
          </div>
        </div>
      </aside>
    </>
  );
}
