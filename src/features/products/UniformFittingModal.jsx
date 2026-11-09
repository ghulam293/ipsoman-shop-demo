import { useState } from "react";
import { money } from "../../lib/api.js";
import { X, Check, ShieldCheck, Sparkles } from "../../components/Icons.jsx";

const BOYS_ITEMS = [
  { id: "BP-01", name: "Official Boys Maroon Polo", price: 6.5, image: "/assets/images/products/ips-school-uniform.jpg", desc: "Maroon with embroidered IPS crest & grey collar" },
  { id: "BT-01", name: "Classic Boys School Trousers", price: 7.0, image: "/assets/images/products/school-trousers.svg", desc: "Tailored grey school trousers with adjustable waist" },
  { id: "BPE-01", name: "Boys Sports PE Kit", price: 8.25, image: "/assets/images/products/pe-kit.svg", desc: "Breathable moisture-wicking sports top & athletic shorts" },
  { id: "BW-01", name: "IPS Boys Knit Cardigan / Sweater", price: 9.5, image: "/assets/images/products/ips-school-uniform.jpg", desc: "Warm knitted winter sweater with IPS crest" },
];

const GIRLS_ITEMS = [
  { id: "GP-01", name: "Official Girls Maroon Polo", price: 6.5, image: "/assets/images/products/ips-school-uniform.jpg", desc: "Maroon with embroidered IPS crest & ribbon accent" },
  { id: "GS-01", name: "Classic Girls Pleated Skirt", price: 7.0, image: "/assets/images/products/ips-school-uniform.jpg", desc: "Permanent pleated grey school skirt / pinafore" },
  { id: "GPE-01", name: "Girls Sports PE Kit", price: 8.25, image: "/assets/images/products/pe-kit.svg", desc: "Athletic shirt & activewear track pants" },
  { id: "GR-01", name: "IPS Girls Hair Ribbons & Scarf Set", price: 2.5, image: "/assets/images/products/ips-school-uniform.jpg", desc: "School yellow hair ribbons and formal scarf" },
];

const SIZES = [
  { label: "Size 20 · Age 3–4 (Height 98-104cm, Chest 22\")", value: "Size 20 (Age 3-4)" },
  { label: "Size 22 · Age 4–5 (Height 104-110cm, Chest 24\")", value: "Size 22 (Age 4-5)" },
  { label: "Size 24 · Age 5–6 (Height 110-116cm, Chest 26\")", value: "Size 24 (Age 5-6)" },
  { label: "Size 26 · Age 7–8 (Height 122-128cm, Chest 28\")", value: "Size 26 (Age 7-8)" },
  { label: "Size 28 · Age 9–10 (Height 134-140cm, Chest 30\")", value: "Size 28 (Age 9-10)" },
  { label: "Size 30 · Age 11–12 (Height 146-152cm, Chest 32\")", value: "Size 30 (Age 11-12)" },
  { label: "Size 32 · Age 13–14 (Height 158-164cm, Chest 34\")", value: "Size 32 (Age 13-14)" },
  { label: "Size 34 · Adult Small (Chest 36\", Waist 28\")", value: "Size 34 (S)" },
  { label: "Size 36 · Adult Medium (Chest 38\", Waist 30\")", value: "Size 36 (M)" },
  { label: "Size 38 · Adult Large (Chest 40\", Waist 32\")", value: "Size 38 (L)" },
  { label: "Size 40 · Adult XL (Chest 42\", Waist 34\")", value: "Size 40 (XL)" },
];

export default function UniformFittingModal({ onClose, onOrderPlaced }) {
  const [gender, setGender] = useState("Boys");
  const [selectedItem, setSelectedItem] = useState(BOYS_ITEMS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[2].value);
  const [quantity, setQuantity] = useState(1);
  const [studentName, setStudentName] = useState("");
  const [studentGrade, setStudentGrade] = useState("Year 4");
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const currentItems = gender === "Boys" ? BOYS_ITEMS : GIRLS_ITEMS;

  function handleGenderSwitch(newGender) {
    setGender(newGender);
    setSelectedItem(newGender === "Boys" ? BOYS_ITEMS[0] : GIRLS_ITEMS[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!studentName.trim()) return;

    const ref = `IPS-UNI-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderRef(ref);
    setSubmitted(true);

    if (onOrderPlaced) {
      onOrderPlaced({
        id: ref,
        customer: studentName.trim(),
        grade: studentGrade,
        category: "Uniforms",
        gender,
        item: selectedItem.name,
        size: selectedSize,
        quantity,
        total: selectedItem.price * quantity,
        status: "Processing",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card uniform-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close icon-button" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-badge-row">
            <span className="school-pill">
              <Sparkles size={13} /> Official IPS Sizing Desk
            </span>
            <span className="security-pill">
              <ShieldCheck size={13} /> Strict Quality Verified
            </span>
          </div>
          <h2>Uniform Size & Selection</h2>
          <p>Separate selection for Boys & Girls uniforms with verified sizing for all school years.</p>
        </div>

        {submitted ? (
          <div className="order-success-card">
            <div className="success-icon">
              <Check size={32} />
            </div>
            <h3>Uniform Request Submitted!</h3>
            <p>
              Order reference: <strong>{orderRef}</strong>
            </p>
            <div className="order-summary-box">
              <div><span>Student:</span> <strong>{studentName} ({studentGrade})</strong></div>
              <div><span>Uniform:</span> <strong>{selectedItem.name}</strong></div>
              <div><span>Gender:</span> <strong>{gender} Collection</strong></div>
              <div><span>Selected Size:</span> <strong>{selectedSize}</strong></div>
              <div><span>Quantity:</span> <strong>{quantity} pcs</strong></div>
              <div><span>Total Amount:</span> <strong>OMR {money(selectedItem.price * quantity)}</strong></div>
            </div>
            <p className="success-note">A confirmation ticket has been dispatched to the shop manager.</p>
            <button className="button primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="uniform-order-form">
            {/* Separate Selection: Boys vs Girls */}
            <div className="gender-selector-container">
              <span className="section-label">1. Choose Uniform Category</span>
              <div className="gender-toggle-tabs">
                <button
                  type="button"
                  className={`gender-tab boys-tab ${gender === "Boys" ? "active" : ""}`}
                  onClick={() => handleGenderSwitch("Boys")}
                >
                  <span className="gender-emoji">👦</span>
                  <div>
                    <strong>Boys Uniform</strong>
                    <small>Polo, Trousers & PE Kit</small>
                  </div>
                </button>
                <button
                  type="button"
                  className={`gender-tab girls-tab ${gender === "Girls" ? "active" : ""}`}
                  onClick={() => handleGenderSwitch("Girls")}
                >
                  <span className="gender-emoji">👧</span>
                  <div>
                    <strong>Girls Uniform</strong>
                    <small>Polo, Pleated Skirt & PE Kit</small>
                  </div>
                </button>
              </div>
            </div>

            {/* Split layout: Photo preview + item grid */}
            <div className="uniform-selection-body">
              <div className="photo-preview-box">
                <img
                  src="/assets/images/products/ips-school-uniform.jpg"
                  alt="IPS Oman uniform students"
                  className="preview-uniform-img"
                />
                <div className="preview-caption">
                  <strong>IPS Oman Approved Attire</strong>
                  <small>Students in official {gender.toLowerCase()} school uniform</small>
                </div>
              </div>

              <div className="item-selection-pane">
                <span className="section-label">2. Select Garment Item</span>
                <div className="uniform-items-grid">
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      className={`uniform-item-card ${selectedItem.id === item.id ? "selected" : ""}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="item-radio-mark">{selectedItem.id === item.id && <span />}</div>
                      <div className="item-details">
                        <strong>{item.name}</strong>
                        <p>{item.desc}</p>
                        <span className="item-price">OMR {money(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-row-sizing">
                  <label className="size-dropdown-label">
                    <span className="section-label">3. Select Uniform Size (Dropdown)</span>
                    <select
                      className="size-select-input"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      {SIZES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="student-details-grid">
                  <label>
                    <span>Student Full Name</span>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      placeholder="e.g. Saif Al-Maamari"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Grade / Year</span>
                    <select value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)}>
                      {["KG 1", "KG 2", ...Array.from({ length: 12 }, (_, i) => `Year ${i + 1}`)].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </label>
                  <label className="qty-label">
                    <span>Quantity</span>
                    <div className="qty-controls">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="qty-btn"
                      >
                        –
                      </button>
                      <span className="qty-val">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </label>
                </div>

                <div className="order-cost-bar">
                  <div>
                    <span>Total Amount</span>
                    <strong>OMR {money(selectedItem.price * quantity)}</strong>
                  </div>
                  <button type="submit" className="button primary order-submit-btn">
                    Place Uniform Request
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
