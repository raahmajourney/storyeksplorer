import StoryModel from '../models/story-model.js';
import AuthView from '../views/auth-view.js';

class AuthPresenter {
  constructor({ container }) {
    this._container = container;
    this._storyModel = new StoryModel();
    this._view = new AuthView({
      container,
      onLogin: this._handleLogin.bind(this),
      onRegister: this._handleRegister.bind(this)
    });
  }

  async _handleLogin({ email, password }) {
    try {
      const response = await this._storyModel.login({ email, password });
      localStorage.setItem('token', response.loginResult.token);
      localStorage.setItem('user', JSON.stringify({
        name: response.loginResult.name,
        email: email
      }));
      window.location.hash = '#/';
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  }

  async _handleRegister({ name, email, password }) {
    try {
      await this._storyModel.register({ name, email, password });
      alert('Registration successful! Please login with your credentials.');
      // Switch to login tab after successful registration
      document.getElementById('login-tab').click();
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = password;
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
    }
  }
}

export default AuthPresenter;