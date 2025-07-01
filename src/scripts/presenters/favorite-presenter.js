import { getAllFavorites } from '../utils/favorite-db.js';
import FavoriteView from '../views/favorite-view.js';

class FavoritePresenter {
  constructor({ container }) {
    this._view = new FavoriteView({ container });
    this._init();
  }

  async _init() {
    const viewHtml = await this._view.render();
    this._view._container.innerHTML = viewHtml;

    const favorites = await getAllFavorites();
    this._view.showFavorites(favorites);
  }
}

export default FavoritePresenter;
