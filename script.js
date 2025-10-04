function showUserDetails() {
  alert("Davina's luxe specializes in perfume and fragrances, fragrance advice, makeup artist.\nWEB DEVELOPER: +234 7032049532");
}

function loadProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = ""; // ✅ This clears existing products

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () => viewProduct(product.id);

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₦${product.price}</p>
      <button class="add-btn" onclick="goToDetails(${product.id})">CHECK</button>
    `;

    container.appendChild(card);
  });
}
 
function goToDetails(id) {
      window.location.href = `product.html?id=${id}`;
  }

function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function addToCart(event, id) {
  event.stopPropagation();

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Save product ID for redirect
  sessionStorage.setItem("lastAddedProductId", id);

  // Show the popup
  document.getElementById("popup").classList.remove("hidden");
}
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function goToWhatsApp() {
  const id = sessionStorage.getItem("lastAddedProductId");
  const product = products.find(p => p.id == id);
  const message = `Hello, I just added "${product.name}" to my cart. I would like to place an order`;
  const encoded = encodeURIComponent(message);
  const number = "+2349067875709"; // Replace with your real number
  window.location.href = `https://wa.me/${number}?text=${encoded}`;
}

function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = products.find(p => p.id === id);

  if (!product) {
    document.body.innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.getElementById("product-image").src = product.image;
  document.getElementById("product-price").innerText = `₦${product.price}`;
  document.getElementById("product-description").innerText = product.description;

  // Store selected product for cart
  sessionStorage.setItem("lastProductId", id);
}

function addToCartFromDetail() {
  const id = parseInt(sessionStorage.getItem("lastProductId"));
  const quantity = parseInt(document.getElementById("quantity").value);
  const product = products.find(p => p.id === id);

  if (!product || quantity < 1) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  for (let i = 0; i < quantity; i++) {
    cart.push(id);
  }
  localStorage.setItem("cart", JSON.stringify(cart));

  sessionStorage.setItem("lastAddedProductId", id);
  sessionStorage.setItem("lastQuantity", quantity);

  // Show popup
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
}

if (window.location.pathname.includes("product.html")) {
  window.onload = loadProductDetail;
}

if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  window.onload = loadProducts;
} else if (window.location.pathname.includes("product.html")) {
  window.onload = loadProductDetail;
}

function loadCartPage() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const counts = {};

  cart.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  const cartItemsDiv = document.getElementById("cart-items");
  cartItemsDiv.innerHTML = ""; // Clear existing items
  let total = 0;

  Object.keys(counts).forEach(id => {
    const product = products.find(p => p.id == id);
    const quantity = counts[id];
    const price = product.price;
    const subtotal = quantity * price;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-left">
        <strong>${product.name || "Product"}</strong><br>
        Quantity: ${quantity} × ₦${price}
      </div>
      <div class="cart-item-right">
        ₦${subtotal}
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  document.getElementById("cart-total").innerText = `Total: ₦${total}`;
}

function checkoutOnWhatsApp() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const counts = {};
  cart.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  let message = "Hello, I’d like to order the following:\n\n";

  Object.keys(counts).forEach(id => {
    const product = products.find(p => p.id == parseInt(id));

    if (!product) {
      console.warn(`No product found for id: ${id}`);
      return; // skip this item if it doesn't exist
    }

    message += `- ${counts[id]} x ${product.name || "Product"} @ ₦${product.price} = ₦${counts[id] * product.price}\n`;
  });

  const encoded = encodeURIComponent(message);
  const phone = "+2349067875709"; // Replace with your WhatsApp number
  const url = `https://wa.me/${phone}?text=${encoded}`;

  window.location.href = url;
}


if (window.location.pathname.includes("cart.html")) {
  window.onload = loadCartPage;
}

loadProducts();
