const loadMoreBtn = document.getElementById("loadMoreBtn");
const productsGrid = document.getElementById("productsGrid");

if (loadMoreBtn && productsGrid) {
  loadMoreBtn.addEventListener("click", async () => {
    window.PRODUCTS_PAGE++;

    const params = new URLSearchParams(window.location.search);
    params.set("page", window.PRODUCTS_PAGE);
    params.set("limit", window.PRODUCTS_LIMIT);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    if (!data.products || data.products.length === 0) {
      loadMoreBtn.style.display = "none";
      return;
    }

    data.products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <div class="product-image">
          <a href="/product/${product._id}">
            <img src="${product.images?.[0] || '/images/placeholder.jpg'}" alt="${product.name}">
          </a>
        </div>
        <div class="product-info">
          <p class="product-brand">${product.brand?.name || ''}</p>
          <h3 class="product-name">
            <a href="/product/${product._id}">${product.name}</a>
          </h3>
          <p class="product-description">
            ${product.description.substring(0, 100)}...
          </p>
          <p class="product-price">
            ₦${Number(product.price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </p>
          <a href="/product/${product._id}" class="btn btn-outline">
            View Details
          </a>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    if (window.PRODUCTS_PAGE >= data.totalPages) {
      loadMoreBtn.style.display = "none";
    }
  });
}

const showAllBtn = document.getElementById("showAllBtn");

if (showAllBtn) {
  showAllBtn.addEventListener("click", async () => {
    loadMoreBtn.style.display = "none";
    showAllBtn.disabled = true;
    showAllBtn.textContent = "Loading all…";

    const params = new URLSearchParams(window.location.search);
    params.set("page", 1);
    params.set("limit", 100); // max allowed by API

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    productsGrid.innerHTML = "";

    data.products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <div class="product-image">
          <a href="/product/${product._id}">
            <img src="${product.images?.[0] || '/images/placeholder.jpg'}" alt="${product.name}">
          </a>
        </div>
        <div class="product-info">
          <p class="product-brand">${product.brand?.name || ''}</p>
          <h3 class="product-name">
            <a href="/product/${product._id}">${product.name}</a>
          </h3>
          <p class="product-price">
            ₦${Number(product.price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </p>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    showAllBtn.style.display = "none";
  });
}
