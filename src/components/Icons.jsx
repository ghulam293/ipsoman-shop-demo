// Local SVG components: no icon or UI library required.
const paths = {
  Search: "m21 21-5-5M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16",
  Bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  ChevronDown: "m6 9 6 6 6-6",
  Download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  Plus: "M12 5v14M5 12h14",
  ArrowUpRight: "M7 17 17 7M7 7h10v10",
  ArrowRight: "M4 12h16m-6-6 6 6-6 6",
  CalendarDays:
    "M8 2v4m8-4v4M3 9h18M4 4h16a1 1 0 0 1 1 1v16H3V5a1 1 0 0 1 1-1M7 13h2m4 0h2m-8 4h2m4 0h2",
  Menu: "M3 6h18M3 12h18M3 18h18",
  X: "m6 6 12 12M6 18 18 6",
  Check: "m5 12 4 4L19 6",
  RefreshCw:
    "M20 10a8 8 0 0 0-14-5L3 8m0-5v5h5M4 14a8 8 0 0 0 14 5l3-3m0 5v-5h-5",
  CircleHelp:
    "M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  LayoutDashboard: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  ShoppingBag: "M4 7h16l1 14H3L4 7M8 7V6a4 4 0 0 1 8 0v1",
  Package: "m12 2 10 5v10l-10 5-10-5V7l10-5m0 10v10M2 7l10 5 10-5M7 4.5l10 5",
  Users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M20 21v-2a4 4 0 0 0-3-4M13 4a4 4 0 0 1 0 8M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  ChartNoAxesCombined: "M3 3v18h18M6 16l5-6 4 3 6-9M7 18v-1m5 1v-4m5 4v-2",
  Settings:
    "m9 3-1 3-3 1-2 4 2 2v4l4 3 3-1 3 1 4-3v-4l2-2-2-4-3-1-1-3H9M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  BookOpen:
    "M12 5v16M12 5C9 2 5 2 2 3v16c4-1 7 0 10 2 3-2 6-3 10-2V3c-3-1-7-1-10 2",
  Wallet: "M3 5h17v15H3V5m0 0V3h15v2m3 5h-7v5h7v-5m-4 2.5h.01",
  Shirt: "m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0",
  MoreHorizontal: "M5 12h.01M12 12h.01M19 12h.01",
};
const icon = (name) =>
  function Icon({ size = 20, ...props }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d={paths[name]} />
      </svg>
    );
  };
export const Search = icon("Search"),
  Bell = icon("Bell"),
  ChevronDown = icon("ChevronDown"),
  Download = icon("Download"),
  Plus = icon("Plus"),
  ArrowUpRight = icon("ArrowUpRight"),
  ArrowRight = icon("ArrowRight"),
  CalendarDays = icon("CalendarDays"),
  Menu = icon("Menu"),
  X = icon("X"),
  Check = icon("Check"),
  RefreshCw = icon("RefreshCw"),
  CircleHelp = icon("CircleHelp"),
  LayoutDashboard = icon("LayoutDashboard"),
  ShoppingBag = icon("ShoppingBag"),
  Package = icon("Package"),
  Users = icon("Users"),
  ChartNoAxesCombined = icon("ChartNoAxesCombined"),
  Settings = icon("Settings"),
  BookOpen = icon("BookOpen"),
  Wallet = icon("Wallet"),
  Shirt = icon("Shirt"),
  MoreHorizontal = icon("MoreHorizontal");
