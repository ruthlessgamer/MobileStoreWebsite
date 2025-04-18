document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');

  if (!form) {
    alert('Checkout form not found!');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submit

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!name || !address || !phone || cart.length === 0) {
      alert('Please fill in all details and make sure your cart is not empty.');
      return;
    }

    const order = {
      name,
      address,
      phone,
      cart
    };

    // Store in localStorage
    localStorage.setItem('lastOrder', JSON.stringify(order));
    localStorage.removeItem('cart');

    // ✅ Redirect to success.html
    window.location.href = 'success.html';
  });
});
