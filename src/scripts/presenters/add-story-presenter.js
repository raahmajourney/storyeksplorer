// presenters/add-story-presenter.js
import StoryModel from '../models/story-model.js';
import AddStoryView from '../views/add-story-view.js';

class AddStoryPresenter {
    constructor({ container }) {
        this._container = container;
        this._storyModel = new StoryModel();
        this._view = new AddStoryView({
            container,
            onSubmit: this._onSubmit.bind(this)
        });

        // Tambahkan event hashchange untuk menghentikan kamera saat keluar
        window.addEventListener('hashchange', () => {
            this._view.destroy();
        });
    }

    async _onSubmit({ photo, description, lat, lon }) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You need to login first');
            }

            await this._storyModel.addStory({ photo, description, lat, lon });
            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default AddStoryPresenter;
