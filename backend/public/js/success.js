document.addEventListener('DOMContentLoaded', async () => {
  const order = JSON.parse(localStorage.getItem('lastOrder'));
  const summaryDiv = document.getElementById('order-summary');

  summaryDiv.innerHTML = '<p>Loading your order...</p>';

  console.log('🛒 Order object from localStorage:', order);

  if (!order || !order.cart || order.cart.length === 0) {
    summaryDiv.innerHTML = '<p>No order placed.</p>';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/products');
    const products = await res.json();

    if (!products || products.length === 0) {
      summaryDiv.innerHTML = '<p>⚠️ Failed to load products. Please try again later.</p>';
      return;
    }

    const orderID = 'ORD' + Math.floor(100000 + Math.random() * 900000);
    let totalPrice = 0;
    const itemsForDB = [];

    summaryDiv.innerHTML = `
      <h3>Thank you for your order, ${order.name}!</h3>
      <p><strong>Order ID:</strong> ${orderID}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <h4>Order Details:</h4>
    `;

    order.cart.forEach(item => {
      const product = products.find(p => p.ProductID === item.productID);

      if (product) {
        const subtotal = product.Price * item.quantity;
        totalPrice += subtotal;

        itemsForDB.push({
          productID: product.ProductID,
          quantity: item.quantity
        });

        const div = document.createElement('div');
        div.innerHTML = `
          <h4>${product.ProductName}</h4>
          <p>${product.Description}</p>
          <p>Price: ₹${product.Price}</p>
          <p>Quantity: ${item.quantity}</p>
          <p><strong>Subtotal:</strong> ₹${subtotal}</p>
          <hr>
        `;
        summaryDiv.appendChild(div);
      }
    });

    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<h3>Total Amount: ₹${totalPrice}</h3>`;
    summaryDiv.appendChild(totalDiv);

    const deliveryDays = Math.floor(Math.random() * 5) + 3; // 3–7 days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    const deliveryDiv = document.createElement('div');
    deliveryDiv.innerHTML = `<p><strong>Estimated Delivery:</strong> ${deliveryDate.toLocaleDateString()}</p>`;
    summaryDiv.appendChild(deliveryDiv);

    const homeBtn = document.createElement('button');
    homeBtn.textContent = ' to Home';
    
    console.log('📦 Sending order data to backend:', {
    customerID: order.customerID,
    items: itemsForDB,
    totalAmount: totalPrice
    });
    console.log('🛒 Order object from localStorage:', order);

    

    // ✅ Send order to backend
    const saveRes = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerID: order.customerID || null,
        name: order.name,
        phone: order.phone,
        address: order.address,
        items: itemsForDB,
        totalAmount: totalPrice
      })
    });

    console.log('🧾 Sending full order:', {
      customerID: order.customerID || null,
      name: order.name,
      address: order.address,
      phone: order.phone,
      items: itemsForDB,
      totalAmount: totalPrice
    });


    const saveResData = await saveRes.text(); // Get raw response for debugging
    console.log('📨 Server response:', saveResData);

    if (!saveRes.ok) {
      summaryDiv.innerHTML += `<p style="color:red;">⚠️ Failed to save order in database. Please contact support.</p>`;
    }

    localStorage.removeItem('cart');
    localStorage.removeItem('lastOrder');

  } catch (err) {
    console.error('❌ Error fetching product details or saving order:', err);
    summaryDiv.innerHTML = '<p style="color:red;">❌ Error loading order details. Please try again later.</p>';
  }
});
    homeBtn.onclick = () => {
      window.location.href = 'home.html';
    };
    summaryDiv.appendChild(homeBtn);

    
