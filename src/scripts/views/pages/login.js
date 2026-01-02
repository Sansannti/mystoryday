import StoryAPI from '../../api/story-api.js';
import AuthData from '../../data/auth-data.js';

const Login = {
  async render() {
    return `
      <div class="form-container">
        <h1>Login</h1>
        <div id="loginAlert"></div>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required
              placeholder="Masukkan email Anda"
              aria-label="Email"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required
              minlength="8"
              placeholder="Masukkan password Anda"
              aria-label="Password"
            >
          </div>
          
          <button type="submit" class="btn-primary" style="width: 100%;">
            Login
          </button>
        </form>
        
        <div class="form-footer">
          <p>Belum punya akun? <a href="#/register">Register di sini</a></p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const form = document.getElementById('loginForm');
    const alertDiv = document.getElementById('loginAlert');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        alertDiv.innerHTML = '<div class="alert alert-success">Loading...</div>';
        
        const result = await StoryAPI.login(email, password);
        
        // Save token and user info
        AuthData.saveToken(result.loginResult.token);
        AuthData.saveUserInfo(result.loginResult.name, result.loginResult.userId);
        
        alertDiv.innerHTML = '<div class="alert alert-success">Login berhasil! Redirecting...</div>';
        
        // Redirect to stories page
        setTimeout(() => {
          window.location.hash = '#/stories';
        }, 1000);
        
      } catch (error) {
        alertDiv.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
      }
    });
  },
};

export default Login;