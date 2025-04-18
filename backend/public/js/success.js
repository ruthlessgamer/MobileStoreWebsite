document.addEventListener('DOMContentLoaded', async () => {
    const order = JSON.parse(localStorage.getItem('lastOrder'));
    const summaryDiv = document.getElementById('order-summary');
  
    if (!order || !order.cart || order.cart.length === 0) {
      summaryDiv.innerHTML = '<p>No order placed.</p>';
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3000/api/products');
      const products = await res.json();
  
      const orderID = 'ORD' + Math.floor(100000 + Math.random() * 900000);
      let totalPrice = 0;
  
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
  
      // Add estimated delivery
      const deliveryDays = Math.floor(Math.random() * 5) + 3; // 3 to 7 days
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
  
      const deliveryDiv = document.createElement('div');
      deliveryDiv.innerHTML = `<p><strong>Estimated Delivery:</strong> ${deliveryDate.toDateString()}</p>`;
      summaryDiv.appendChild(deliveryDiv);
  
      // Add return home button
      const homeBtn = document.createElement('button');
      homeBtn.textContent = 'Return to Home';
      homeBtn.onclick = () => {
        window.location.href = 'home.html';
      };
      summaryDiv.appendChild(homeBtn);
  
      // Clear cart after order
      localStorage.removeItem('cart');
  
    } catch (err) {
      console.error('❌ Error fetching product details:', err);
      summaryDiv.innerHTML = '<p>Error loading order details.</p>';
    }
  });
  