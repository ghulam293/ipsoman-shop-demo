# IPS Oman — React + Node.js Dashboard

A responsive school shop dashboard built with **plain React**, **Node.js**, **Express**, and regular CSS. No Vite, UI framework, chart library, or icon package. A small esbuild script compiles JSX and CSS; Node.js serves both the frontend and API on one port.

## Requirements

- Node.js 22 or newer
- npm

## Start development

```powershell
npm install
npm run dev
```

Open http://localhost:3001. React source changes rebuild automatically; refresh the browser to see changes. Restart the command after changing server files or build scripts. Set `PORT` to override the port.

## Production

```powershell
npm run build
npm start
```

The build creates `dist/`. Express serves the compiled React application and `/api` endpoints. Deploy to a host that supports a running Node.js server; the previous static-only deployment instructions no longer apply.

## Folder structure

```text
shop app/
├── assets/                     Original school branding
├── scripts/
│   ├── build.js                Compile React, CSS, HTML, and copy assets
│   └── dev.js                  Watch React source and run Express
├── src/
│   ├── app/App.jsx             Application state, navigation, and layout
│   ├── components/             Shared sidebar, SVG icons, product artwork
│   ├── features/
│   │   ├── dashboard/          Summary cards and sales visualisations
│   │   ├── orders/             Search, status filters, and order table
│   │   └── products/           Catalogue and category filters
│   ├── lib/api.js              API requests and OMR formatting
│   ├── styles/global.css       Design system and responsive styling
│   └── main.jsx                React entry point
├── server/
│   ├── data/store.js           Clearly labelled demo records
│   ├── routes/dashboard.js    Dashboard and health endpoints
│   ├── tests/                  Node.js API integration tests
│   ├── app.js                  Express configuration and static serving
│   └── index.js                Production server entry point
├── index.html                  HTML template
└── package.json                Dependencies and commands
```

Keep each feature's components together. Put reusable visual components in `src/components`, shared browser utilities in `src/lib`, API routes in `server/routes`, and server data access in `server/data`. This keeps UI, network requests, and server responsibilities separate without unnecessary layers.

## Features

- Responsive dashboard with revenue, orders, customers, inventory, and sales charts
- Week, month, and year demo periods
- Orders with search, status filtering, detail dialogs
- Books and uniforms catalogue with category and text filters
- Add products manually with validated names, prices, school years, and stock
- Products saved to `server/storage/products.json` and retained after server restarts
- Sample customer directory and low-stock notifications
- Local shop-name preference and help page
- API loading, error, and retry states

## API

- `GET /api/dashboard?period=month` — summary, products, and sample orders (`week`, `month`, or `year`)
- `POST /api/products` ? manually create a product (`name`, `category`, `grade`, numeric `price`, integer `stock`)
- `GET /api/health` — service status

```powershell
npm test
```

## Demo data and limitations

Products, inventory, customers, sales totals, trends, and category splits are sample data. Chart trends and summary totals are illustrative; the recent-order list is a sample rather than the complete reporting dataset. No live school approvals, authentication, database, checkout, or payments are included. Shop preferences are saved in this browser only. This is a local demonstration; add authentication and a production database before using real records.

The original standalone `app.js` and `styles.css` remain as legacy reference files and are not loaded by the React application.

## Manual products

Open **Products > Add product**, fill in the form, and select **Save product**. CSV import and export controls are not included. Existing sample products remain available. New products appear immediately and are saved on the Node.js server. Keep `server/storage/` on persistent disk and back it up. The JSON store supports a single Node.js process; use a database before running multiple server processes. API tests use temporary storage and never change your inventory.

## Product image files

Product images are local SVG illustrations in `assets/images/products/`. They are rendered by `src/components/ProductArt.jsx`, which is used by the catalogue in `src/features/products/Products.jsx` and dashboard thumbnails.

| Product | Image file |
| --- | --- |
| Maths in Focus | `assets/images/products/maths-in-focus.svg` |
| English Reading & Writing | `assets/images/products/english-workbook.svg` |
| Science Explorer | `assets/images/products/science-explorer.svg` |
| Everyday School Polo | `assets/images/products/school-polo.svg` |
| Classic School Trousers | `assets/images/products/school-trousers.svg` |
| IPS PE Kit | `assets/images/products/pe-kit.svg` |
| New book fallback | `assets/images/products/book-placeholder.svg` |

The `image` field on each product stores its browser URL, for example `/assets/images/products/maths-in-focus.svg`. To use a real product photo, place a JPG, PNG, or WebP in this folder and set that product's `image` field to `/assets/images/products/your-photo.jpg`. New manually added products use a category illustration until a photo is assigned. Existing saved products without an image still show a default illustration.

`npm run build` copies the asset folder to `dist/assets/`. If adding or changing image files while development is running, restart `npm run dev` to copy the updated assets.

## Catalogue tools

The product catalogue includes local search by name, SKU, category, and school year; category counts; availability and school-year filters; sorting by newest, name, price, or stock; and pagination with nine products per page. Selecting a school year also includes products marked All years. Search in the top bar combines with catalogue search. Reset catalogue filters clears the catalogue controls; clear the top-bar search separately.

Inventory cards show total products, units, low-stock products, out-of-stock products, and inventory value at selling prices. Select the low-stock or out-of-stock card to filter the catalogue. Newly saved products appear first, with catalogue filters reset. These controls run in React for the existing small catalogue; server pagination would be appropriate for a much larger inventory.
