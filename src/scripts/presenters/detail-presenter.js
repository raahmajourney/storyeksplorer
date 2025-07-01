import StoryModel from '../models/story-model.js';
import DetailView from '../views/detail-view.js';
import {
  saveFavorite,
  deleteFavorite,
  isFavorited,
} from '../utils/favorite-db.js';

class DetailPresenter {
  constructor({ container }) {
    this._container = container;
    this._storyModel = new StoryModel();
    this._view = new DetailView({ container });

    this._showStoryDetail();
  }

  async _showStoryDetail() {
    try {
      this._view.showLoading();
      const storyId = window.location.hash.split('/')[2];
      const story = await this._storyModel.getStoryById(storyId);

      const isFav = await isFavorited(story.id);
      this._view.showStoryDetail(story, isFav);

      this._view.onFavoriteClicked = async (story) => {
        const isCurrentlyFavorited = await isFavorited(story.id);
        if (isCurrentlyFavorited) {
          await deleteFavorite(story.id);
          this._view.updateFavoriteButton(false);
        } else {
          await saveFavorite(story);
          this._view.updateFavoriteButton(true);
        }
      };
    } catch (error) {
      this._view.showError(error.message);
    }
  }
}

export default DetailPresenter;
