document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
  
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (username && password) {
        // Save dummy login session
        localStorage.setItem('loggedInUser', username);
  
        // Redirect to home
        window.location.href = 'home.html';
      } else {
        document.getElementById('error-msg').textContent = 'Please enter both username and password.';
      }
    });
  });
  