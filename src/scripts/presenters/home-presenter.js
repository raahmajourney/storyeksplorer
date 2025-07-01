import StoryModel from '../models/story-model.js';
import HomeView from '../views/home-view.js';
import { subscribePush, unsubscribePush } from '../utils/push-api.js';


class HomePresenter {
  constructor({ container }) {
    this._container = container;
    this._storyModel = new StoryModel();
    this._view = new HomeView({ container });

    this._showStories();
  }

  async _showStories() {
    try {
      this._view.showLoading();
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/auth';
        return;
      }

      const stories = await this._storyModel.getAllStories();
      this._view.showStories(stories);

      // Tambahkan event listener tombol subscribe & unsubscribe
      setTimeout(() => {
        document.querySelector('#subscribe-btn')?.addEventListener('click', subscribePush);
        document.querySelector('#unsubscribe-btn')?.addEventListener('click', unsubscribePush);
      }, 0);
    } catch (error) {
      if (error.message.includes('authentication')) {
        window.location.hash = '#/auth';
      } else {
        this._view.showError(error.message);
      }
    }
  }
}


export default HomePresenter;