import { API_ENDPOINTS, DEFAULT_HEADERS, AUTH_HEADER } from './api-config.js';

class StoryModel {
  async getAllStories() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(API_ENDPOINTS.STORIES, {
      headers: AUTH_HEADER(token)
    });
    
    const responseJson = await response.json();
    
    if (!responseJson.error) {
      // Add proper null checks and default values
      return responseJson.listStory.map(story => ({
        ...story,
        lat: story.lat !== null && !isNaN(story.lat) ? story.lat : 0,
        lon: story.lon !== null && !isNaN(story.lon) ? story.lon : 0,
        photoUrl: story.photoUrl || './assets/images/default-story.jpg',
        name: story.name || 'Anonymous',
        description: story.description || 'No description',
        createdAt: story.createdAt || new Date().toISOString()
      }));
    }
    throw new Error(responseJson.message);
  }

  async getStoryById(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_ENDPOINTS.STORIES}/${id}`, {
      headers: AUTH_HEADER(token)
    });
    
    const responseJson = await response.json();
    
    if (!responseJson.error) {
      const story = responseJson.story;
      // Add null checks for single story
      return {
        ...story,
        lat: story.lat !== null && !isNaN(story.lat) ? story.lat : 0,
        lon: story.lon !== null && !isNaN(story.lon) ? story.lon : 0,
        photoUrl: story.photoUrl || './assets/images/default-story.jpg',
        name: story.name || 'Anonymous',
        description: story.description || 'No description',
        createdAt: story.createdAt || new Date().toISOString()
      };
    }
    throw new Error(responseJson.message);
  }
  
  async addStory({ photo, description, lat, lon }) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);
    formData.append('lat', lat);
    formData.append('lon', lon);
    
    const response = await fetch(API_ENDPOINTS.STORIES, {
      method: 'POST',
      headers: AUTH_HEADER(token),
      body: formData
    });
    
    const responseJson = await response.json();
    
    if (!responseJson.error) {
      return responseJson;
    }
    throw new Error(responseJson.message);
  }
  
  async login({ email, password }) {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ email, password })
    });
    
    const responseJson = await response.json();
    
    if (!responseJson.error) {
      return responseJson;
    }
    throw new Error(responseJson.message);
  }
  
  async register({ name, email, password }) {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ name, email, password })
    });
    
    const responseJson = await response.json();
    
    if (!responseJson.error) {
      return responseJson;
    }
    throw new Error(responseJson.message);
  }
}

export default StoryModel;