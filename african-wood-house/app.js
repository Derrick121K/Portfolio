(() => {
  "use strict";

  const products = [
    {
      id: "form-01", name: "The Quiet Form", category: "sculpture", categoryLabel: "Sculptural works",
      subtitle: "Hand-carved portrait bust", price: 4850, image: "assets/sculptural-bust.webp", tag: "FEATURED PIECE",
      description: "A poised sculptural portrait with a distinctive silhouette and a warm, deep-toned finish. A sample listing showing how a signature artwork can be presented in the store.",
      details: ["Sculptural display piece", "Wood type and finish to be confirmed", "Dimensions and availability to be confirmed"]
    },
    {
      id: "grain-02", name: "Grain & Form", category: "tableware", categoryLabel: "Bowls & tableware",
      subtitle: "Hand-shaped wooden bowl set", price: 2400, image: "assets/wooden-bowls.webp", tag: "COLLECTED OBJECTS",
      description: "A considered arrangement of wooden bowls that places natural pattern and flowing grain at the centre of the design. Final product specifications and set options require approval.",
      details: ["Sample multi-piece set listing", "Dimensions and wood type to be confirmed", "Food-safe suitability to be confirmed"]
    },
    {
      id: "heritage-03", name: "Heritage in Relief", category: "wall-art", categoryLabel: "Wall art",
      subtitle: "Carved elephant wall artwork", price: 8900, image: "assets/elephant-relief.webp", tag: "STATEMENT ART",
      description: "A richly detailed carved wall piece with a strong sense of depth. Materials, dimensions, mounting requirements and the final product story are to be confirmed.",
      details: ["Sample statement artwork", "Dimensions and weight to be confirmed", "Mounting and delivery requirements to be confirmed"]
    },
    {
      id: "wild-04", name: "The Wild Collection", category: "wildlife", categoryLabel: "Animals & wildlife",
      subtitle: "Carved wooden wildlife figures", price: 3950, image: "assets/wildlife-figures.webp", tag: "NATURE STUDIES",
      description: "A group of carved wildlife forms that brings an expressive, collected feel to a room. Individual pieces and set options will be confirmed with the brand.",
      details: ["Sample collection listing", "Individual pieces and set options to be confirmed", "Materials and availability to be confirmed"]
    }
  ];

  const state = { filter: "all", search: "", sort: "featured", bag: [], wishlist: new Set(), step: 1, selectedProduct: null };
  const $ = id => document.getElementById(id);
  const money = value => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  let toastTimer;

  const grid = $("product-grid");
  const overlay = $("overlay");
  const drawer = $("bag-drawer");
  const productDialog = $("product-dialog");
  const checkoutDialog = $("checkout-dialog");
  const successDialog = $("success-dialog");

  function filteredProducts() {
    let list = products.filter(item => (state.filter === "all" || item.category === state.filter));
    if (state.search.trim()) {
      const query = state.search.trim().toLowerCase();
      list = list.filter(item => `${item.name} ${item.subtitle} ${item.categoryLabel}`.toLowerCase().includes(query));
    }
    if (state.wishlistOnly) list = list.filter(item => state.wishlist.has(item.id));
    if (state.sort === "price-low") list.sort((a, b) => a.price - b.price);
    if (state.sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }

  function renderProducts() {
    const items = filteredProducts();
    grid.innerHTML = items.map(item => {
      const saved = state.wishlist.has(item.id);
      return `
        <article class="product-card">
          <div class="product-image" data-open-product="${item.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(item.name)}">
            <img src="${item.image}" alt="${escapeHtml(item.subtitle)} — demonstration artwork" loading="lazy" />
            <span class="product-tag">${escapeHtml(item.tag)}</span>
            <button class="quick-view" type="button" data-open-product="${item.id}">Quick view <span>↗</span></button>
          </div>
          <div class="product-meta">
            <span class="product-category">${escapeHtml(item.categoryLabel)}</span>
            <div class="product-title-row"><h3 class="product-title">${escapeHtml(item.name)}</h3><span class="product-price">${money(item.price)}</span></div>
            <p class="product-subtitle">${escapeHtml(item.subtitle)} · Sample price</p>
            <div class="product-actions"><button class="add-button" type="button" data-add-product="${item.id}">Add to bag +</button><button class="wish-button ${saved ? "active" : ""}" type="button" data-wishlist="${item.id}" aria-label="${saved ? "Remove from" : "Add to"} wishlist">${saved ? "♥" : "♡"}</button></div>
          </div>
        </article>`;
    }).join("");
    $("empty-state").hidden = items.length !== 0;
    grid.hidden = items.length === 0;
    $("result-count").textContent = `${items.length} sample ${items.length === 1 ? "product" : "products"}${state.wishlistOnly ? " saved" : ""}`;
    $("wishlist-count").textContent = state.wishlist.size;
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function openProduct(id) {
    const item = products.find(product => product.id === id);
    if (!item) return;
    state.selectedProduct = item;
    $("dialog-content").innerHTML = `
      <div class="dialog-image"><img src="${item.image}" alt="${escapeHtml(item.subtitle)}" /></div>
      <div class="dialog-copy">
        <p class="eyebrow">${escapeHtml(item.categoryLabel)} · ${escapeHtml(item.tag)}</p>
        <h3>${escapeHtml(item.name)}</h3>
        <span class="dialog-price">${money(item.price)} <span class="demo-disclosure">· SAMPLE PRICE</span></span>
        <p>${escapeHtml(item.description)}</p>
        <ul>${item.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>
        <label class="variant-label" for="product-finish">Finish (demo option)</label>
        <select id="product-finish" class="variant-select"><option value="Natural">Natural wood finish</option><option value="Dark">Dark wood finish (+R250)</option></select>
        <label class="variant-label" for="product-quantity">Quantity</label>
        <input id="product-quantity" class="variant-quantity" type="number" min="1" max="20" value="1" />
        <div class="dialog-purchase"><button class="button button-dark" type="button" data-add-selected="${item.id}">Add to bag <span>＋</span></button><button class="button button-outline" type="button" data-buy-selected="${item.id}">Buy now <span>→</span></button></div>
        <p class="demo-disclosure">Illustrative listing only. Product details, finish options, stock and pricing require brand approval.</p>
      </div>`;
    productDialog.showModal();
  }

  function bagKey(id, finish) { return `${id}::${finish}`; }
  function addToBag(id, finish = "Natural", quantity = 1) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    const existing = state.bag.find(entry => entry.key === bagKey(id, finish));
    const qty = Math.max(1, Math.min(20, Number(quantity) || 1));
    if (existing) existing.quantity = Math.min(20, existing.quantity + qty);
    else state.bag.push({ key: bagKey(id, finish), id, finish, quantity: qty });
    renderBag();
    showToast(`${product.name} added to your shopping bag`);
  }

  function updateQuantity(key, delta) {
    const entry = state.bag.find(item => item.key === key);
    if (!entry) return;
    entry.quantity = Math.max(1, Math.min(20, entry.quantity + delta));
    renderBag();
  }

  function removeFromBag(key) {
    state.bag = state.bag.filter(entry => entry.key !== key);
    renderBag();
  }

  function bagSubtotal() {
    return state.bag.reduce((sum, entry) => {
      const product = products.find(item => item.id === entry.id);
      const unitPrice = product.price + (entry.finish === "Dark" ? 250 : 0);
      return sum + unitPrice * entry.quantity;
    }, 0);
  }

  function renderBag() {
    const count = state.bag.reduce((sum, entry) => sum + entry.quantity, 0);
    $("bag-count").textContent = count;
    $("drawer-count").textContent = `(${count})`;
    $("checkout-button").disabled = count === 0;
    if (!count) {
      $("bag-items").innerHTML = '<div class="bag-empty">Your shopping bag is waiting.<br><br>Explore the collection and add a handcrafted piece to begin.</div>';
      $("bag-summary").innerHTML = `<div class="summary-line total"><span>Subtotal</span><strong>${money(0)}</strong></div>`;
      return;
    }
    $("bag-items").innerHTML = state.bag.map(entry => {
      const product = products.find(item => item.id === entry.id);
      const unitPrice = product.price + (entry.finish === "Dark" ? 250 : 0);
      return `<div class="bag-item"><img src="${product.image}" alt=""><div><h4>${escapeHtml(product.name)}</h4><p>${escapeHtml(entry.finish)} finish · ${money(unitPrice)} each</p><div class="quantity-control"><button type="button" data-quantity="-1" data-key="${entry.key}" aria-label="Decrease quantity">−</button><span>${entry.quantity}</span><button type="button" data-quantity="1" data-key="${entry.key}" aria-label="Increase quantity">+</button></div><button class="remove-item" type="button" data-remove-product="${entry.key}">Remove</button></div><strong>${money(unitPrice * entry.quantity)}</strong></div>`;
    }).join("");
    $("bag-summary").innerHTML = `<div class="summary-line"><span>Subtotal</span><strong>${money(bagSubtotal())}</strong></div><div class="summary-line"><span>Delivery</span><span>Calculated at checkout</span></div><div class="summary-line total"><span>Estimated total</span><strong>${money(bagSubtotal())} + delivery</strong></div>`;
  }

  function openBag() {
    renderBag();
    overlay.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }
  function closeBag() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function openCheckout() {
    if (!state.bag.length) return;
    closeBag();
    state.step = 1;
    setCheckoutStep(1);
    $("checkout-form").reset();
    updateDeliveryOptions();
    renderCheckoutSummary();
    checkoutDialog.showModal();
  }

  function setCheckoutStep(step) {
    state.step = step;
    document.querySelectorAll(".checkout-step-panel").forEach(panel => panel.classList.toggle("active", Number(panel.dataset.step) === step));
    document.querySelectorAll(".step[data-step-label]").forEach(label => label.classList.toggle("active", Number(label.dataset.stepLabel) <= step));
  }

  function validatePanel(step) {
    const panel = document.querySelector(`.checkout-step-panel[data-step="${step}"]`);
    const controls = [...panel.querySelectorAll("input,select,textarea")].filter(control => control.type !== "radio");
    for (const control of controls) {
      if (!control.checkValidity()) {
        control.reportValidity();
        control.focus();
        return false;
      }
    }
    return true;
  }

  function deliveryFee() {
    const country = $("country").value;
    if (country !== "ZA") return 650;
    return $("checkout-form").elements.shipping.value === "express" ? 250 : 120;
  }

  function updateDeliveryOptions() {
    const local = $("country").value === "ZA";
    $("shipping-options").hidden = !local;
    $("international-note").hidden = local;
    if (!local) {
      const international = `<div class="international-shipping"><b>International delivery estimate · ${money(650)}</b><small>Indicative demo amount only. Actual courier rates, customs, duties and destination availability require confirmation.</small></div>`;
      $("shipping-options").innerHTML = international;
    } else {
      $("shipping-options").innerHTML = `<label><input type="radio" name="shipping" value="standard" checked><span><b>Standard delivery</b><small>Simulated South African delivery · 3–7 working days</small></span><strong>R120</strong></label><label><input type="radio" name="shipping" value="express"><span><b>Express delivery</b><small>Simulated South African delivery · 1–3 working days</small></span><strong>R250</strong></label>`;
      $("shipping-options").querySelectorAll('input[name="shipping"]').forEach(input => input.addEventListener("change", renderCheckoutSummary));
    }
    renderCheckoutSummary();
  }

  function renderCheckoutSummary() {
    $("checkout-items").innerHTML = state.bag.map(entry => {
      const product = products.find(item => item.id === entry.id);
      const price = product.price + (entry.finish === "Dark" ? 250 : 0);
      return `<div class="summary-product"><img src="${product.image}" alt=""><span>${escapeHtml(product.name)}<small>${escapeHtml(entry.finish)} finish · Qty ${entry.quantity}</small></span><b>${money(price * entry.quantity)}</b></div>`;
    }).join("");
    const subtotal = bagSubtotal();
    const shipping = deliveryFee();
    $("summary-subtotal").textContent = money(subtotal);
    $("summary-shipping").textContent = money(shipping);
    $("summary-total").textContent = money(subtotal + shipping);
  }

  function placeDemoOrder(event) {
    event.preventDefault();
    if (!state.bag.length) return;
    const formData = new FormData($("checkout-form"));
    const countryNames = { ZA: "South Africa", GB: "United Kingdom", US: "United States", AU: "Australia", EU: "Europe" };
    const subtotal = bagSubtotal();
    const shipping = deliveryFee();
    const total = subtotal + shipping;
    const orderId = `AWH-DEMO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const method = { card: "Card payment (simulated)", eft: "Bank transfer / EFT (simulated)", paypal: "PayPal (simulated)" }[formData.get("payment")];
    const name = String(formData.get("fullName") || "Customer");
    const lines = state.bag.map(entry => {
      const product = products.find(item => item.id === entry.id);
      return `<div><span>${escapeHtml(product.name)} × ${entry.quantity}</span><strong>${money((product.price + (entry.finish === "Dark" ? 250 : 0)) * entry.quantity)}</strong></div>`;
    }).join("");
    $("receipt").innerHTML = `<div class="receipt-order"><span>Demo reference</span><strong>${orderId}</strong></div><div><span>Customer</span><strong>${escapeHtml(name)}</strong></div><div><span>Deliver to</span><strong>${escapeHtml(countryNames[formData.get("country")] || "Selected destination")}</strong></div>${lines}<div><span>Delivery (estimate)</span><strong>${money(shipping)}</strong></div><div><span>Payment method</span><strong>${method}</strong></div><div class="receipt-total"><span>Demo total</span><strong>${money(total)}</strong></div>`;
    checkoutDialog.close();
    state.bag = [];
    renderBag();
    $("checkout-form").reset();
    successDialog.showModal();
  }

  // Category filters and collection tiles.
  document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    state.wishlistOnly = false;
    $("wishlist-toggle").classList.remove("active");
    renderProducts();
  }));
  document.querySelectorAll("[data-category-link]").forEach(button => button.addEventListener("click", () => {
    const category = button.dataset.categoryLink;
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.filter === category));
    state.filter = category;
    state.wishlistOnly = false;
    renderProducts();
    $("shop").scrollIntoView({ behavior: "smooth" });
  }));
  $("sort-products").addEventListener("change", event => { state.sort = event.target.value; renderProducts(); });

  // Product, wishlist and shopping-bag controls.
  document.addEventListener("click", event => {
    const add = event.target.closest("[data-add-product]");
    if (add) { addToBag(add.dataset.addProduct); return; }
    const open = event.target.closest("[data-open-product]");
    if (open) { openProduct(open.dataset.openProduct); return; }
    const save = event.target.closest("[data-wishlist]");
    if (save) {
      if (state.wishlist.has(save.dataset.wishlist)) state.wishlist.delete(save.dataset.wishlist);
      else state.wishlist.add(save.dataset.wishlist);
      renderProducts();
      showToast(state.wishlist.has(save.dataset.wishlist) ? "Piece saved to your wishlist" : "Piece removed from your wishlist");
      return;
    }
    const selectedAdd = event.target.closest("[data-add-selected]");
    if (selectedAdd) {
      addToBag(selectedAdd.dataset.addSelected, $("product-finish").value, $("product-quantity").value);
      productDialog.close();
      return;
    }
    const selectedBuy = event.target.closest("[data-buy-selected]");
    if (selectedBuy) {
      addToBag(selectedBuy.dataset.buySelected, $("product-finish").value, $("product-quantity").value);
      productDialog.close();
      openCheckout();
      return;
    }
    const quantity = event.target.closest("[data-quantity]");
    if (quantity) { updateQuantity(quantity.dataset.key, Number(quantity.dataset.quantity)); return; }
    const remove = event.target.closest("[data-remove-product]");
    if (remove) removeFromBag(remove.dataset.removeProduct);
  });

  grid.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open-product]")) {
      event.preventDefault(); openProduct(event.target.dataset.openProduct);
    }
  });

  $("open-bag").addEventListener("click", openBag);
  $("close-bag").addEventListener("click", closeBag);
  $("continue-shopping").addEventListener("click", closeBag);
  overlay.addEventListener("click", closeBag);
  $("checkout-button").addEventListener("click", openCheckout);
  $("close-product").addEventListener("click", () => productDialog.close());
  $("close-checkout").addEventListener("click", () => checkoutDialog.close());
  $("close-success").addEventListener("click", () => successDialog.close());
  $("product-dialog").addEventListener("click", event => { if (event.target === productDialog) productDialog.close(); });
  $("checkout-dialog").addEventListener("click", event => { if (event.target === checkoutDialog) checkoutDialog.close(); });

  // Multi-step checkout: customer details, delivery and simulated payment.
  document.querySelectorAll("[data-next]").forEach(button => button.addEventListener("click", () => {
    if (!validatePanel(state.step)) return;
    if (state.step === 2) {
      const address = $("checkout-form").elements.address;
      const city = $("checkout-form").elements.city;
      const postal = $("checkout-form").elements.postal;
      for (const field of [address, city, postal]) {
        if (!field.checkValidity()) { field.reportValidity(); field.focus(); return; }
      }
    }
    setCheckoutStep(Number(button.dataset.next));
    renderCheckoutSummary();
  }));
  document.querySelectorAll("[data-back]").forEach(button => button.addEventListener("click", () => setCheckoutStep(Number(button.dataset.back))));
  $("country").addEventListener("change", updateDeliveryOptions);
  $("shipping-options").addEventListener("change", renderCheckoutSummary);
  $("checkout-form").addEventListener("submit", placeDemoOrder);

  // Search and wishlist shortcuts.
  const searchPanel = $("search-panel");
  const searchInput = $("site-search");
  $("search-toggle").addEventListener("click", () => { searchPanel.hidden = !searchPanel.hidden; if (!searchPanel.hidden) searchInput.focus(); });
  $("search-close").addEventListener("click", () => { searchPanel.hidden = true; searchInput.value = ""; state.search = ""; renderProducts(); });
  searchInput.addEventListener("input", event => { state.search = event.target.value; renderProducts(); });
  $("wishlist-toggle").addEventListener("click", () => {
    state.wishlistOnly = !state.wishlistOnly;
    state.filter = "all";
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.filter === "all"));
    renderProducts();
    $("shop").scrollIntoView({ behavior: "smooth" });
    showToast(state.wishlistOnly ? "Showing your saved pieces" : "Showing all products");
  });

  // Contact form is a local demonstration only.
  $("contact-form").addEventListener("submit", event => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast("Demo only — no message was sent.");
  });

  // Mobile menu and footer year.
  const menuToggle = $("menu-toggle");
  const nav = $("main-nav");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
  }));

  $("year").textContent = new Date().getFullYear();
  renderProducts();
  renderBag();
})();