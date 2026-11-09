import { useState } from "react";

const imageRoot = "/assets/images/products/";
const sampleImages = {
  "BK-001": "maths-in-focus.svg",
  "BK-002": "english-workbook.svg",
  "BK-003": "science-explorer.svg",
  "UN-001": "ips-school-uniform.jpg",
  "UN-002": "school-trousers.svg",
  "UN-003": "pe-kit.svg",
};

export default function ProductArt({ product, small = false }) {
  const [failedSource, setFailedSource] = useState(null);
  const fallback = `${imageRoot}${product.category === "Books" ? "book-placeholder.svg" : "ips-school-uniform.jpg"}`;
  const source = product.image || (sampleImages[product.id] ? `${imageRoot}${sampleImages[product.id]}` : fallback);

  return (
    <div
      className={`product-art ${small ? "small" : ""}`}
      style={{ "--art-color": product.color || "#bacbc7" }}
    >
      <img
        className="product-image"
        src={failedSource === source ? fallback : source}
        alt={small ? "" : product.name}
        loading="lazy"
        decoding="async"
        width="240"
        height="240"
        onError={() => setFailedSource(source)}
      />
    </div>
  );
}
