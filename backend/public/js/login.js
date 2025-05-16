document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (username && password) {
          try {
              const response = await fetch('/routes/auth/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email: username, password: password })
              });

              const data = await response.json();

              if (response.ok && data.success) {
                  localStorage.setItem('loggedInUser', username);
                  localStorage.setItem('customerID', user.CustomerID);


                  if (data.isAdmin) {
                      window.location.href = 'admin.html';  // 🚀 Redirect to Admin Page
                  } else {
                      window.location.href = 'home.html';   // ✅ Redirect to Home
                  }
              } else {
                  document.getElementById('error-msg').textContent = data.message || 'Login failed';
              }
          } catch (error) {
              console.error('Login Error:', error);
              document.getElementById('error-msg').textContent = 'An error occurred during login.';
          }
      } else {
          document.getElementById('error-msg').textContent = 'Please enter both username and password.';
      }
  });
});
