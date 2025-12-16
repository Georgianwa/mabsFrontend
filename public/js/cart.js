// public/js/cart.js - FIXED VERSION (Client-side only)

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Update cart count in header
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-block' : 'none';
  });
}

// Add item to cart - FIXED: Now properly checks by productId
function addToCart(productId, name, price, image) {
  console.log('Adding to cart:', { productId, name, price, image });
  
  // Convert productId to string for consistent comparison
  const itemId = String(productId);
  
  // Check if item already exists
  const existingItem = cart.find(item => String(item.productId) === itemId);
  
  if (existingItem) {
    console.log('Item exists, increasing quantity');
    existingItem.quantity += 1;
  } else {
    console.log('New item, adding to cart');
    cart.push({
      productId: itemId,
      name,
      price: Number(price),
      image,
      quantity: 1
    });
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('Cart saved:', cart);
  
  // Update UI
  updateCartCount();
  
  // Show notification
  showNotification('Product added to cart!', 'success');
  
  return true;
}

// Remove item from cart
function removeFromCart(productId) {
  const itemId = String(productId);
  cart = cart.filter(item => String(item.productId) !== itemId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Reload cart page if on cart page
  if (window.location.pathname === '/cart') {
    renderCart();
  }
}

// Update quantity
function updateQuantity(productId, quantity) {
  const itemId = String(productId);
  const item = cart.find(item => String(item.productId) === itemId);
  
  if (item) {
    const newQuantity = parseInt(quantity);
    
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      item.quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      
      // Update display if on cart page
      if (window.location.pathname === '/cart') {
        renderCart();
      }
    }
  }
}

// Clear cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.location.pathname === '/cart') {
      renderCart();
    }
  }
}

// Get cart total
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Render cart (for cart page)
function renderCart() {
  const container = document.getElementById('cart-container');
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty.</p>
        <a href="/products" class="shop-btn">Start Shopping</a>
      </div>
    `;
    return;
  }
  
  let subtotal = 0;
  let cartHTML = `
    <div class="cart-table">
      <div class="cart-header">
        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Total</span>
        <span>Action</span>
      </div>
  `;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    cartHTML += `
      <div class="cart-item">
        <div class="cart-product">
          <img src="${item.image || '/images/placeholder.jpg'}" alt="${item.name}" onerror="this.src='/images/placeholder.jpg'">
          <span>${item.name}</span>
        </div>
        <div class="cart-price">₦${item.price.toLocaleString()}</div>
        <div class="cart-quantity">
          <button onclick="updateQuantity('${item.productId}', ${item.quantity - 1})">
            <i class="fas fa-minus"></i>
          </button>
          <input type="number" value="${item.quantity}" min="1" 
                 onchange="updateQuantity('${item.productId}', this.value)" 
                 style="width: 60px; text-align: center;">
          <button onclick="updateQuantity('${item.productId}', ${item.quantity + 1})">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="cart-total">₦${itemTotal.toLocaleString()}</div>
        <div class="cart-action">
          <button onclick="removeFromCart('${item.productId}')" class="remove-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
  
  const total = subtotal;
  
  cartHTML += `
    </div>
    <div class="cart-summary">
      <div class="summary-content">
        <h3>Cart Summary</h3>
        <p><strong>Subtotal:</strong> ₦${subtotal.toLocaleString()}</p>
        <p><strong>Shipping:</strong> To be calculated at checkout</p>
        <p style="font-size: 1.2em; margin-top: 10px;">
          <strong>Total:</strong> ₦${total.toLocaleString()}
        </p>
        <div class="summary-actions">
          <button onclick="checkout()" class="checkout-btn">Proceed to Checkout</button>
          <a href="/products" class="continue-btn">Continue Shopping</a>
          <button onclick="clearCart()" class="continue-btn" style="background: #dc3545; color: white;">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = cartHTML;
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Create WhatsApp message
  const message = cart.map(item => 
    `${item.name} - ₦${item.price.toLocaleString()} x ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
  ).join('\n');
  
  const total = getCartTotal();
  
  const whatsappMessage = encodeURIComponent(
    `Hello! I would like to order:\n\n${message}\n\nSubtotal: ₦${total.toLocaleString()}\nTotal: ₦${total.toLocaleString()}\n\nPlease confirm availability.`
  );
  
  // Use phone number from environment variable (passed via EJS)
  const phoneNumber = window.PHONE_NUMBER;
  
  // Remove all non-digits except the leading +
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  
  window.open(`https://wa.me/${cleanPhone}?text=${whatsappMessage}`, '_blank');
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background-color: ${type === 'success' ? '#28a745' : '#007bff'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  // Render cart if on cart page
  if (window.location.pathname === '/cart') {
    renderCart();
  }
});

console.log('✅ Cart.js loaded successfully');