const products = [
  {
    id: "math-workbook",
    name: "Maths in Focus",
    category: "Books",
    grade: "Year 4",
    subject: "Mathematics · Student book",
    price: "3.200",
    seller: "IPS Approved Bookshop",
    sellerType: "Approved bookseller",
    details: "Year 4 mathematics student book for the 2026–27 academic year. Please confirm stock and edition with the seller.",
    color: "#a96947",
    cover: "MATHS<br>IN FOCUS",
    coverLabel: "STUDENT BOOK · YEAR 4",
  },
  {
    id: "english-reader",
    name: "English Reading & Writing",
    category: "Books",
    grade: "Year 4",
    subject: "English · Skills workbook",
    price: "2.750",
    seller: "IPS Approved Bookshop",
    sellerType: "Approved bookseller",
    details: "Year 4 English reading and writing workbook. Please confirm stock and edition with the seller.",
    color: "#567b71",
    cover: "WORDS<br>IN MOTION",
    coverLabel: "ENGLISH · YEAR 4",
  },
  {
    id: "science-explorer",
    name: "Science Explorer",
    category: "Books",
    grade: "Year 4",
    subject: "Science · Activity book",
    price: "2.950",
    seller: "IPS Approved Bookshop",
    sellerType: "Approved bookseller",
    details: "Year 4 science activity book. Please confirm stock and edition with the seller.",
    color: "#43718a",
    cover: "SCIENCE<br>EXPLORER",
    coverLabel: "DISCOVER · YEAR 4",
  },
  {
    id: "arabic-workbook",
    name: "Arabic Language Skills",
    category: "Books",
    grade: "Year 4",
    subject: "Arabic · Language workbook",
    price: "2.500",
    seller: "IPS Approved Bookshop",
    sellerType: "Approved bookseller",
    details: "Year 4 Arabic language workbook. Please confirm stock and edition with the seller.",
    color: "#897453",
    cover: "ARABIC<br>SKILLS",
    coverLabel: "LANGUAGE · YEAR 4",
  },
  {
    id: "school-polo",
    name: "Everyday School Polo",
    category: "Uniforms",
    grade: "Year 4",
    subject: "Navy · Official school uniform",
    price: "6.500",
    seller: "IPS Uniform Centre",
    sellerType: "Approved uniform supplier",
    details: "Official navy IPS school polo. Check the current uniform guide and confirm size availability with the supplier.",
    color: "#d8e2e4",
    garment: "polo",
  },
  {
    id: "school-trousers",
    name: "Classic School Trousers",
    category: "Uniforms",
    grade: "Year 4",
    subject: "Navy · Official school uniform",
    price: "7.000",
    seller: "IPS Uniform Centre",
    sellerType: "Approved uniform supplier",
    details: "Official navy IPS school trousers. Check the current uniform guide and confirm size availability with the supplier.",
    color: "#e8e4d9",
    garment: "trousers",
  },
  {
    id: "pe-kit",
    name: "IPS PE Kit",
    category: "Uniforms",
    grade: "Year 4",
    subject: "Sportswear · Official school uniform",
    price: "8.250",
    seller: "IPS Uniform Centre",
    sellerType: "Approved uniform supplier",
    details: "Official IPS physical education kit. Check the current uniform guide and confirm size availability with the supplier.",
    color: "#dce7df",
    garment: "pe",
  },
  {
    id: "school-polo-y1",
    name: "Everyday School Polo",
    category: "Uniforms",
    grade: "Year 1",
    subject: "Navy · Official school uniform",
    price: "6.500",
    seller: "IPS Uniform Centre",
    sellerType: "Approved uniform supplier",
    details: "Official navy IPS school polo. Check the current uniform guide and confirm size availability with the supplier.",
    color: "#d8e2e4",
    garment: "polo",
  },
  {
    id: "math-workbook-y1",
    name: "Maths in Focus",
    category: "Books",
    grade: "Year 1",
    subject: "Mathematics · Student book",
    price: "2.400",
    seller: "IPS Approved Bookshop",
    sellerType: "Approved bookseller",
    details: "Year 1 mathematics student book for the 2026–27 academic year. Please confirm stock and edition with the seller.",
    color: "#a96947",
    cover: "MATHS<br>IN FOCUS",
    coverLabel: "STUDENT BOOK · YEAR 1",
  },
  {
    id: "reading-kg",
    name: "Little Readers Library",
    category: "Books",
    grade: "KG 2",
    subject: "English · Early reading set",
    price: "4.000",
    seller: "IPS Approved Bookshop",
    sellerType: "Approved bookseller",
    details: "KG 2 early reading set for the 2026–27 academic year. Please confirm stock and edition with the seller.",
    color: "#bd8a4e",
    cover: "LITTLE<br>READERS",
    coverLabel: "EARLY READING · KG 2",
  },
  {
    id: "year3-maths",
    name: "Maths in Focus",
    category: "Books",
    grade: "Year 3",
    subject: "Mathematics · Student book",
    price: "2.900",
    seller: "IPS Approved Bookshop",
    sellerType: "Approved bookseller",
    details: "Year 3 mathematics student book for the 2026–27 academic year. Please confirm stock and edition with the seller.",
    color: "#a96947",
    cover: "MATHS<br>IN FOCUS",
    coverLabel: "STUDENT BOOK · YEAR 3",
  },
  {
    id: "year5-science",
    name: "Science Explorer",
    category: "Books",
    grade: "Year 5",
    subject: "Science · Activity book",
    price: "3.100",
    seller: "IPS Approved Bookshop",
    sellerType: "Approved bookseller",
    details: "Year 5 science activity book. Please confirm stock and edition with the seller.",
    color: "#43718a",
    cover: "SCIENCE<br>EXPLORER",
    coverLabel: "DISCOVER · YEAR 5",
  },
];

const grid = document.querySelector("#product-grid");
const gradeSelect = document.querySelector("#grade-select");
const searchInput = document.querySelector("#search-input");
const resultsSummary = document.querySelector("#results-summary");
const emptyState = document.querySelector("#empty-state");
const listCount = document.querySelector("#list-count");
const dialog = document.querySelector("#app-dialog");
const dialogContent = document.querySelector("#dialog-content");
const savedIds = new Set();
let activeCategory = "All";

const icons = {
  external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6m-11 5L20 4M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></svg>',
  bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z" /></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></svg>',
};

function uniformArtwork(type) {
  if (type === "trousers") {
    return '<svg viewBox="0 0 100 110" aria-hidden="true"><path d="m23 14 23-6 8 2 23 4-7 85H53l-4-47-5 47H24l-3-85Z" /><path d="m47 10 3 42m4-42-4 42m-8-32h17" /></svg>';
  }
  if (type === "pe") {
    return '<svg viewBox="0 0 100 110" aria-hidden="true"><path d="m29 14 21-8 21 8 15 15-12 11-9-7v64H35V33l-9 7-12-11z" /><path d="m40 10 10 14 10-14M50 24v26m-9 5h18m-18 8h18" /></svg>';
  }
  return '<svg viewBox="0 0 100 110" aria-hidden="true"><path d="m30 14 20-8 20 8 15 14-12 13-9-7v58H36V34l-9 7-12-13z" /><path d="m39 11 11 14 11-14M50 25v20m-3-7 3 3 3-3" /></svg>';
}

function productCard(product) {
  const isSaved = savedIds.has(product.id);
  const artwork = product.garment
    ? `<div class="art-uniform">${uniformArtwork(product.garment)}</div>`
    : `<div class="art-book-cover" style="background:${product.color}"><span>${product.cover}</span><small>${product.coverLabel}</small></div>`;
  const price = product.price
    ? `<span class="product-price">${product.price}<small>OMR</small></span>`
    : '<span class="product-price price-na">Ask seller</span>';
  return `
    <article class="product-card">
      <div class="product-art" style="background:${product.color}">
        ${artwork}
        <span class="approved-badge"><span>✓</span> APPROVED</span>
        <span class="grade-badge">${product.grade.toUpperCase()}</span>
      </div>
      <div class="product-info">
        <div class="product-type">${product.category === "Books" ? "TEXTBOOKS & LEARNING" : "OFFICIAL UNIFORM"}</div>
        <h3>${product.name}</h3>
        <div class="product-meta">${product.subject}</div>
        <div class="product-divider"></div>
        <div class="product-bottom">
          ${price}
          <button class="seller-button" type="button" data-seller="${product.id}" aria-label="View approved seller for ${product.name}">
            Seller details ${icons.external}
          </button>
          <button class="list-toggle${isSaved ? " is-saved" : ""}" type="button" data-save="${product.id}" aria-label="${isSaved ? "Remove" : "Add"} ${product.name} ${isSaved ? "from" : "to"} my list" aria-pressed="${isSaved}">
            ${icons.bookmark}
          </button>
        </div>
      </div>
    </article>`;
}

function filteredProducts() {
  const grade = gradeSelect.value;
  const query = searchInput.value.trim().toLowerCase();
  return products.filter((product) => {
    const matchesGrade = grade === "All grades" || product.grade === grade;
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = !query || [
      product.name,
      product.category,
      product.grade,
      product.subject,
      product.seller,
    ].some((value) => value.toLowerCase().includes(query));
    return matchesGrade && matchesCategory && matchesSearch;
  });
}

function render() {
  const visibleProducts = filteredProducts();
  grid.innerHTML = visibleProducts.map(productCard).join("");
  grid.hidden = visibleProducts.length === 0;
  emptyState.hidden = visibleProducts.length !== 0;
  const selectedGrade = gradeSelect.value;
  resultsSummary.innerHTML = selectedGrade === "All grades"
    ? `Showing essentials for <strong>all grades</strong>`
    : `Showing essentials for <strong>${selectedGrade}</strong>`;
  document.querySelector("#all-tab-count").textContent = products.length;
  document.querySelector("#books-tab-count").textContent = products.filter((item) => item.category === "Books").length;
  document.querySelector("#uniforms-tab-count").textContent = products.filter((item) => item.category === "Uniforms").length;
  listCount.textContent = savedIds.size;
  listCount.setAttribute("aria-label", `${savedIds.size} saved items`);
}

function openDialog(content) {
  dialogContent.innerHTML = content;
  dialog.showModal();
}

function sellerDialog(product) {
  openDialog(`
    <div class="dialog-kicker">IPS VERIFIED SELLER</div>
    <h2 id="dialog-title">${product.seller}</h2>
    <p>${product.details}</p>
    <div class="dialog-details">
      <div><span>Item</span><strong>${product.name}</strong></div>
      <div><span>Grade</span><strong>${product.grade}</strong></div>
      <div><span>Seller type</span><strong>${product.sellerType}</strong></div>
      <div><span>Indicative price</span><strong>${product.price ? `${product.price} OMR` : "Contact seller"}</strong></div>
    </div>
    <div class="dialog-callout">${icons.info}<span>Demo catalogue — the school must confirm real seller contact details and product availability before publication. No purchase or payment is made in this app.</span></div>
    <div class="dialog-actions"><button class="button button-outline" type="button" data-close-dialog>Close</button></div>`);
}

function listDialog() {
  const savedProducts = products.filter((product) => savedIds.has(product.id));
  const items = savedProducts.length
    ? `<div class="saved-list">${savedProducts.map((product) => `
      <div class="saved-item">
        <span><strong>${product.name}</strong><small>${product.grade} · ${product.category}</small></span>
        <button class="remove-saved" type="button" data-save="${product.id}">Remove</button>
      </div>`).join("")}</div>
      <div class="dialog-callout">${icons.info}<span>Your list is saved for this demo session only. Contact each approved seller directly to arrange a purchase.</span></div>`
    : '<div class="empty-list">Your list is empty for now.<br>Browse the catalogue and tap the bookmark to save an item.</div>';
  openDialog(`
    <div class="dialog-kicker">YOUR SCHOOL CHECKLIST</div>
    <h2 id="dialog-title">My list <span style="color:#a77b1f">(${savedProducts.length})</span></h2>
    <p>Keep the school essentials your family needs together.</p>
    ${items}
    <div class="dialog-actions"><button class="button button-outline" type="button" data-close-dialog>Done</button></div>`);
}

function schoolDialog() {
  openDialog(`
    <div class="dialog-kicker">IPS OMAN · SCHOOL PORTAL</div>
    <h2 id="dialog-title">A trusted list starts at school.</h2>
    <p>School admins review and approve every textbook, uniform requirement, seller, and seller link before it is shared with families.</p>
    <div class="dialog-details">
      <div><span>01</span><strong>Review items by grade and academic year</strong></div>
      <div><span>02</span><strong>Verify seller details and product availability</strong></div>
      <div><span>03</span><strong>Publish the approved catalogue for parents</strong></div>
    </div>
    <div class="dialog-callout">${icons.info}<span>This front-end demo has no admin login or live catalogue publishing. Demo data must be checked and replaced by the school before real-world use.</span></div>
    <div class="dialog-actions"><button class="button button-outline" type="button" data-close-dialog>Close</button></div>`);
}

document.querySelectorAll(".category-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".category-tab").forEach((tab) => {
      tab.classList.toggle("is-active", tab === button);
      tab.setAttribute("aria-pressed", String(tab === button));
    });
    render();
  });
});

gradeSelect.addEventListener("change", render);
searchInput.addEventListener("input", render);
document.querySelector("#clear-filters").addEventListener("click", () => {
  gradeSelect.value = "All grades";
  searchInput.value = "";
  activeCategory = "All";
  document.querySelectorAll(".category-tab").forEach((tab) => {
    const active = tab.dataset.category === "All";
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  render();
});
document.querySelector("#open-list").addEventListener("click", listDialog);
document.querySelectorAll('[data-open="school"]').forEach((button) => {
  button.addEventListener("click", schoolDialog);
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialogContent.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-dialog]")) dialog.close();
});
grid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const id = saveButton.dataset.save;
    if (savedIds.has(id)) savedIds.delete(id);
    else savedIds.add(id);
    render();
    return;
  }
  const sellerButton = event.target.closest("[data-seller]");
  if (sellerButton) {
    const product = products.find((item) => item.id === sellerButton.dataset.seller);
    if (product) sellerDialog(product);
  }
});
dialogContent.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-save]");
  if (!removeButton) return;
  savedIds.delete(removeButton.dataset.save);
  listDialog();
  render();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

document.querySelectorAll(".category-tab").forEach((tab) => {
  tab.setAttribute("aria-pressed", String(tab.dataset.category === activeCategory));
});
render();
