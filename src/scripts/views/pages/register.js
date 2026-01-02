import StoryAPI from '../../api/story-api.js';

const Register = {
  async render() {
    return `
      <div class="form-container">
        <h1>Register</h1>
        <div id="registerAlert"></div>
        <form id="registerForm">
          <div class="form-group">
            <label for="name">Nama Lengkap</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              placeholder="Masukkan nama lengkap Anda"
              aria-label="Nama Lengkap"
            >
          </div>
          
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
              placeholder="Minimal 8 karakter"
              aria-label="Password"
            >
          </div>
          
          <button type="submit" class="btn-primary" style="width: 100%;">
            Register
          </button>
        </form>
        
        <div class="form-footer">
          <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const form = document.getElementById('registerForm');
    const alertDiv = document.getElementById('registerAlert');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Validasi password
      if (password.length < 8) {
        alertDiv.innerHTML = '<div class="alert alert-error">Password minimal 8 karakter</div>';
        return;
      }
      
      try {
        alertDiv.innerHTML = '<div class="alert alert-success">Loading...</div>';
        
        await StoryAPI.register(name, email, password);
        
        alertDiv.innerHTML = '<div class="alert alert-success">Registrasi berhasil! Redirecting to login...</div>';
        
        // Redirect to login page
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1500);
        
      } catch (error) {
        alertDiv.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
      }
    });
  },
};

export default Register;