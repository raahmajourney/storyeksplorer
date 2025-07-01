class AuthView {
  constructor({ container, onLogin, onRegister }) {
    this._container = container;
    this._onLogin = onLogin;
    this._onRegister = onRegister;
    this._render();
  }

  _render() {
    this._container.innerHTML = `
      <style>
        .spinner {
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.6s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-left: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      </style>

      <section class="auth">
        <div class="auth-tabs">
          <button class="tab-btn active" id="login-tab">Login</button>
          <button class="tab-btn" id="register-tab">Register</button>
        </div>
        
        <div class="auth-content">
          <form id="login-form" class="auth-form active">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" required>
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" required>
            </div>
            <button type="submit" class="btn-submit">
              <span class="btn-text">Login</span>
              <span class="spinner" style="display: none;"></span>
            </button>
          </form>
          
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="register-name">Name</label>
              <input type="text" id="register-name" required>
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" required minlength="6">
            </div>
            <button type="submit" class="btn-submit">
              <span class="btn-text">Register</span>
              <span class="spinner" style="display: none;"></span>
            </button>
          </form>
        </div>
      </section>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {
    // Tab switching
    document.getElementById('login-tab').addEventListener('click', () => {
      document.getElementById('login-form').classList.add('active');
      document.getElementById('register-form').classList.remove('active');
      document.getElementById('login-tab').classList.add('active');
      document.getElementById('register-tab').classList.remove('active');
    });

    document.getElementById('register-tab').addEventListener('click', () => {
      document.getElementById('register-form').classList.add('active');
      document.getElementById('login-form').classList.remove('active');
      document.getElementById('register-tab').classList.add('active');
      document.getElementById('login-tab').classList.remove('active');
    });

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('.btn-submit');
      const text = btn.querySelector('.btn-text');
      const spinner = btn.querySelector('.spinner');

      btn.disabled = true;
      text.textContent = 'Logging in...';
      spinner.style.display = 'inline-block';

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        await this._onLogin({ email, password });
      } finally {
        btn.disabled = false;
        text.textContent = 'Login';
        spinner.style.display = 'none';
      }
    });

    // Register form submission
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('.btn-submit');
      const text = btn.querySelector('.btn-text');
      const spinner = btn.querySelector('.spinner');

      btn.disabled = true;
      text.textContent = 'Registering...';
      spinner.style.display = 'inline-block';

      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      try {
        await this._onRegister({ name, email, password });
      } finally {
        btn.disabled = false;
        text.textContent = 'Register';
        spinner.style.display = 'none';
      }
    });
  }
}

export default AuthView;
