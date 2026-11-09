import {
  LayoutDashboard, Package, ShoppingBag, Users,
  ChartNoAxesCombined, Settings, CircleHelp,
} from "./Icons.jsx";

const links = [
  { page: "Overview", label: "Dashboard", icon: LayoutDashboard },
  { page: "Products", label: "Products", icon: Package },
  { page: "Orders", label: "Orders", icon: ShoppingBag },
  { page: "Customers", label: "Customers", icon: Users },
  { page: "Reports", label: "Reports", icon: ChartNoAxesCombined },
  { page: "Settings", label: "Settings", icon: Settings },
  { page: "Help", label: "Help", icon: CircleHelp },
];

export default function Navbar({ page, onNavigate }) {
  return (
    <nav className="app-navbar" aria-label="Main navigation">
      <div className="app-navbar-links">
        {links.map(({ page: destination, label, icon: Icon }) => (
          <button
            key={destination}
            type="button"
            className={page === destination ? "is-active" : ""}
            aria-current={page === destination ? "page" : undefined}
            onClick={() => onNavigate(destination)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
