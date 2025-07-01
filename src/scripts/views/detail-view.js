import { initMap } from '../utils/map-helper.js';

class DetailView {
  constructor({ container }) {
    this._container = container;
    this._favButton = null; // Simpan referensi tombol
  }

  showLoading() {
    this._container.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading story details...</p>
      </div>
    `;
  }

  showStoryDetail(story, isFavorited = false) {
    this._container.innerHTML = `
      <section class="story-detail">
        <h2 class="section-title">Story Details</h2>
        <div class="detail-container">
          <div class="detail-image">
            <img src="${story.photoUrl}" alt="Story by ${story.name}">
          </div>
          <div class="detail-content">
            <h3>${story.name}</h3>
            <p class="story-date">
              <i class="far fa-calendar-alt"></i> 
              ${new Date(story.createdAt).toLocaleDateString()}
            </p>
            <p class="story-desc">${story.description}</p>

            <button id="favButton" class="fav-button" title="Tambahkan ke Favorit">
              <i class="${isFavorited ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
              ${isFavorited ? 'Favorited' : 'Favorite'}
            </button>

            <div class="detail-map-container">
              ${story.lat !== 0 && story.lon !== 0 ? 
                `<div class="detail-map" id="detail-map"></div>` :
                `<div class="no-location-message">
                  <i class="fas fa-map-marker-alt"></i>
                  <p>No location data available for this story</p>
                </div>`}
            </div>
            <a href="#/" class="btn-back"><i class="fas fa-arrow-left"></i> Back to Stories</a>
          </div>
        </div>
      </section>
    `;

    // Inisialisasi peta jika ada koordinat
    if (story.lat !== 0 && story.lon !== 0) {
      const mapContainer = this._container.querySelector('#detail-map');
      const map = initMap(mapContainer, [story.lat, story.lon], 13);
      L.marker([story.lat, story.lon]).addTo(map)
        .bindPopup(`<h4>${story.name}'s Location</h4><p>${story.description}</p>`)
        .openPopup();
    }

    // Simpan referensi tombol dan event listener
    this._favButton = this._container.querySelector('#favButton');
    this._favButton.addEventListener('click', () => {
      this._onFavoriteClicked?.(story);
    });
  }

  updateFavoriteButton(isFavorited) {
    if (!this._favButton) return;

    this._favButton.innerHTML = `
      <i class="${isFavorited ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      ${isFavorited ? 'Favorited' : 'Favorite'}
    `;
    this._favButton.classList.toggle('favorited', isFavorited);
  }

  set onFavoriteClicked(callback) {
    this._onFavoriteClicked = callback;
  }

  showError(message) {
    this._container.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <a href="#/" class="btn-back"><i class="fas fa-arrow-left"></i> Back to Stories</a>
      </div>
    `;
  }
}

export default DetailView;
