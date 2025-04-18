document.addEventListener('DOMContentLoaded', async () => {
  const productsDiv = document.getElementById('products');
  let allProducts = [];

  // 👉 Update cart count on page load
  updateCartCount();

  try {
    const res = await fetch('http://localhost:3000/api/products');
    allProducts = await res.json();
    console.log("✅ Fetched Products:", allProducts);

    displayProducts(allProducts); // Show all products on page load
  } catch (err) {
    console.error('❌ Failed to load products:', err);
    productsDiv.innerHTML = '<p>⚠️ Failed to load products.</p>';
  }

  // 🔍 Category Filter Function
  window.filterCategory = (categoryLabel) => {
    let categoryID = null;

    if (categoryLabel === 'Mobiles') categoryID = 1;
    else if (categoryLabel === 'Mobile Accessories' || categoryLabel === 'Accessories') categoryID = 2;
    else if (categoryLabel === 'All') categoryID = null;

    const filtered = categoryID === null
      ? allProducts
      : allProducts.filter(p => p.CategoryID === categoryID);

    console.log(`🔎 Filtering: ${categoryLabel} | ID: ${categoryID}`);
    displayProducts(filtered);
  };

  // 🖼 Display Products
  function displayProducts(products) {
    productsDiv.innerHTML = '';

    if (products.length === 0) {
      productsDiv.innerHTML = '<p>😕 No products found in this category.</p>';
      return;
    }

    products.forEach(product => {
      const div = document.createElement('div');
      const imageURL = product.ImageURL && product.ImageURL.trim() !== ''
        ? product.ImageURL
        : 'https://via.placeholder.com/300x200?text=No+Image';

      div.innerHTML = `
        <img src="${imageURL}" alt="${product.ProductName}" 
     style="width: 100%; height: 200px; object-fit: contain; border-radius: 10px; margin-bottom: 10px; background: #f9f9f9;">
        <h4>${product.ProductName}</h4>
        <p>${product.Description}</p>
        <p><strong>Price: ₹${product.Price}</strong></p>
        <button onclick="addToCart(${product.ProductID})">Add to Cart</button>
      `;

      div.style.border = '1px solid #eee';
      div.style.borderRadius = '10px';
      div.style.padding = '15px';
      div.style.marginBottom = '15px';
      div.style.background = '#fefefe';
      div.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
      div.style.transition = 'transform 0.2s ease';
      div.onmouseover = () => div.style.transform = 'scale(1.03)';
      div.onmouseout = () => div.style.transform = 'scale(1)';
      productsDiv.appendChild(div);
    });
  }

  // 🛒 Add to Cart Logic
  window.addToCart = (productID) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.productID === productID);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productID, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // 🔄 update cart count on UI
    alert('✅ Product added to cart!');
  };

  // 🔄 Cart Count Updater
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById('cart-count');
    if (cartCountSpan) cartCountSpan.textContent = count;
  }
});
