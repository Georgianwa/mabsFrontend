// public/js/cart.js - FIXED VERSION
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
  
  // ✅ FIX: Convert productId to string for consistent comparison
  const itemId = String(productId);
  
  // Check if item already exists - FIXED comparison
  const existingItem = cart.find(item => String(item.productId) === itemId);
  
  if (existingItem) {
    console.log('Item exists, increasing quantity');
    existingItem.quantity += 1;
  } else {
    console.log('New item, adding to cart');
    cart.push({
      productId: itemId, // Store as string
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
    location.reload();
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
      location.reload();
    }
  }
}

// Get cart total
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
document.addEventListener('DOMContentLoaded', updateCartCount);

console.log('✅ Cart.js loaded successfully');