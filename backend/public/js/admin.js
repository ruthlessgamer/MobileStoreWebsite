console.log("✅ admin.js loaded");
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  fetchOrders();
});

function fetchProducts() {
  fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(products => {
      console.log('✅ Products fetched:', products);
      const tableBody = document.getElementById('product-list');
      tableBody.innerHTML = '';

      if (!products || products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No products found</td></tr>';
        return;
      }

      products.forEach(product => {
        const row = `
          <tr>
            <td>${product.ProductID}</td>
            <td>${product.ProductName}</td>
            <td>₹${product.Price}</td>
            <td>${product.CategoryID}</td>
            <td>
              <button class="delete-btn" onclick="deleteProduct(${product.ProductID})">Delete</button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    })
    .catch(err => {
      console.error('❌ Error loading products:', err);
      const tableBody = document.getElementById('product-list');
      tableBody.innerHTML = '<tr><td colspan="5">Error loading products</td></tr>';
    });
}

function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  fetch(`http://localhost:3000/api/products/${productId}`, { // ✅ FIXED: localhost:3000 not 127.0.0.1:5500
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Server error');
      return response.json();
    })
    .then(result => {
      alert(result.message || 'Product deleted');
      fetchProducts(); // Reload product list
    })
    .catch(err => {
      console.error('❌ Error deleting product:', err);
      alert('Failed to delete product');
    });
}

async function fetchOrders() {
  try {
    const response = await fetch('http://localhost:3000/api/orders');
    const orders = await response.json();

    const tbody = document.getElementById('orders-body');
    tbody.innerHTML = '';

    // Group orders by OrderID
    const grouped = {};
    orders.forEach(order => {
      if (!grouped[order.OrderID]) {
        grouped[order.OrderID] = {
          customerName: order.CustomerName,
          address: order.Address,
          phone: order.Phone,
          orderDate: new Date(order.OrderDate).toLocaleString(),
          items: []
        };
      }
      grouped[order.OrderID].items.push({
        productName: order.ProductName,
        quantity: order.Quantity,
        price: order.Price
      });
    });

    // Render grouped orders
    Object.entries(grouped).forEach(([orderID, order]) => {
      const row = document.createElement('tr');
      const itemsHTML = order.items.map(i => `
        ${i.quantity} × ${i.productName} (₹${i.price})
      `).join('<br>');

      row.innerHTML = `
        <td>${orderID}</td>
        <td>${order.customerName}</td>
        <td>${order.address}</td>
        <td>${order.phone}</td>
        <td>${order.orderDate}</td>
        <td>${itemsHTML}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('❌ Error loading orders:', error);
    const tbody = document.getElementById('orders-body');
    tbody.innerHTML = '<tr><td colspan="6">Failed to load orders.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM Ready");

  document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();

    console.log("🟢 Form submit triggered");

    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const categoryId = document.getElementById('category-id').value;
    const description = document.getElementById('product-description').value;
    const imageUrl = document.getElementById('image-url').value;

    fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ProductName: name,
        Price: price,
        CategoryID: categoryId,
        Description: description,
        ImageURL: imageUrl
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log("✅ Response:", result);
        alert(result.message || 'Product added successfully');
        document.getElementById('add-product-form').reset();
        fetchProducts();
      })
      .catch(error => {
        console.error('❌ Error adding product:', error);
        alert('Failed to add product');
      });
  });

  // Also call fetch functions
  fetchProducts();
  fetchOrders();
});


