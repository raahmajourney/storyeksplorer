import { getAllFavorites, deleteFavorite } from '../utils/favorite-db.js';

class FavoriteView {
  constructor({ container }) {
    this._container = container;
  }

  async render() {
    return `
      <main id="main-content" class="container" tabindex="-1">
        <h1>Daftar Cerita Favorit</h1>
        <div id="favorite-list" class="story-list"></div>
      </main>
    `;
  }

  async showFavorites(stories) {
    const listContainer = document.querySelector('#favorite-list');
    if (!listContainer) return;

    if (stories.length === 0) {
      listContainer.innerHTML = `<p class="empty-message">No favorite stories yet.</p>`;
      return;
    }

    // Render card favorit
    listContainer.innerHTML = stories.map((story) => {
      const formattedDate = new Date(story.createdAt).toLocaleDateString();

      return `
        <div class="fav-card">
          <img src="${story.photoUrl}" alt="${story.name}">
          <h3>${story.name}</h3>
          <p class="story-date">
            <i class="far fa-calendar-alt"></i> ${formattedDate}
          </p>
          <p class="story-desc">${story.description}</p>
          <div class="story-coordinates">
            <small><i class="fas fa-map-marker-alt"></i> 
              Lat: ${story.lat.toFixed(5)}, Lon: ${story.lon.toFixed(5)}
            </small>
          </div>
          <button data-id="${story.id}" class="unfav-btn">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </div>
      `;
    }).join('');

    // Tambahkan event listener untuk tombol hapus
    listContainer.querySelectorAll('.unfav-btn').forEach((button) => {
      button.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const confirmed = confirm('Yakin ingin menghapus dari daftar favorit?');

        if (confirmed) {
          await deleteFavorite(id);
          const updatedStories = await getAllFavorites();
          this.showFavorites(updatedStories); // re-render
        }
      });
    });
  }
}

export default FavoriteView;
