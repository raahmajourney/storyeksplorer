import { initMap, createMapWithMarkers } from '../utils/map-helper.js';

class HomeView {
  constructor({ container }) {
    this._container = container;
  }
  
  showLoading() {
    this._container.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading stories...</p>
      </div>
    `;
  }
  
 
  showStories(stories) {
  this._container.innerHTML = `
    <section class="stories">
      <div class="notification-controls">
        <button id="subscribe-btn" class="notif-btn">Subscribe</button>
        <button id="unsubscribe-btn" class="notif-btn">Unsubscribe</button>
      </div>
      <h2 class="section-title">Recent Stories</h2>
      <div class="story-list" id="story-list"></div>
      <div class="story-map" id="story-map"></div>
    </section>
  `;
    
    
    const storyList = this._container.querySelector('#story-list');
    const mapContainer = this._container.querySelector('#story-map');
    
    // Filter stories with valid locations
    const validLocationStories = stories.filter(story => 
      story.lat !== 0 && story.lon !== 0
    );
    
    // Display all stories
    stories.forEach(story => {
      const storyElement = this._createStoryElement(story);
      storyList.appendChild(storyElement);
    });
    
    // Only show map if there are stories with valid locations
    if (validLocationStories.length > 0) {
      createMapWithMarkers(mapContainer, validLocationStories);
    } else {
      mapContainer.innerHTML = `
        <div class="no-location-message">
          <i class="fas fa-map-marker-alt"></i>
          <p>No location data available for these stories</p>
        </div>
      `;
    }
  }
  
  _createStoryElement(story) {
    const element = document.createElement('article');
    element.className = 'story-card';
    element.innerHTML = `
      <img src="${story.photoUrl}" alt="Story by ${story.name}" class="story-image">
      <div class="story-content">
        <h3>${story.name}</h3>
        <p class="story-date">
          <i class="far fa-calendar-alt"></i> 
          ${new Date(story.createdAt).toLocaleDateString()}
        </p>
        <p class="story-desc">${story.description}</p>
        <button class="btn-detail" data-id="${story.id}">Read More</button>
      </div>
    `;
    
    element.querySelector('.btn-detail').addEventListener('click', () => {
      window.location.hash = `#/detail/${story.id}`;
    });
    
    return element;
  }
  
  showError(message) {
    this._container.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button class="btn-retry">Try Again</button>
      </div>
    `;
    
    this._container.querySelector('.btn-retry').addEventListener('click', () => {
      window.location.reload();
    });
  }
}

export default HomeView;