document.addEventListener('DOMContentLoaded', async () => {
  const cartDiv = document.getElementById('cart-items');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  console.log("Loaded cart from localStorage:", cart);

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/products');
    const products = await res.json();

    let totalAmount = 0;

    cart.forEach((item, index) => {
      const product = products.find(p => p.ProductID === item.productID);
      console.log("Matched product:", product);

      if (product) {
        totalAmount += product.Price * item.quantity;

        const div = document.createElement('div');
        div.innerHTML = `
          <h4>${product.ProductName}</h4>
          <p>${product.Description}</p>
          <p>Price: ₹${product.Price}</p>
          <p>Quantity: ${item.quantity}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
          <hr>
        `;
        cartDiv.appendChild(div);
      }
    });

    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `
      <h3>Total: ₹${totalAmount}</h3>
      <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
    `;
    cartDiv.appendChild(totalDiv);

  } catch (err) {
    console.error('❌ Error loading cart items:', err);
    cartDiv.innerHTML = '<p>⚠️ Failed to load cart items.</p>';
  }
});

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.reload();
}

function checkout() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) return;

  fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(products => {
      let totalAmount = 0;

      cart.forEach(item => {
        const product = products.find(p => p.ProductID === item.productID);
        if (product) {
          totalAmount += product.Price * item.quantity;
        }
      });

      localStorage.setItem('checkoutData', JSON.stringify({
        itemCount: cart.length,
        totalAmount
      }));

      window.location.href = 'checkout.html';
    })
    .catch(err => {
      console.error('Error preparing checkout:', err);
      alert('Error preparing checkout!');
    });
}
