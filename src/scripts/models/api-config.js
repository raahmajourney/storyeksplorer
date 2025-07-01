const API_BASE_URL = 'https://story-api.dicoding.dev/v1';

const API_ENDPOINTS = {
    STORIES: `${API_BASE_URL}/stories`,
    LOGIN: `${API_BASE_URL}/login`,
    REGISTER: `${API_BASE_URL}/register`
};

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const AUTH_HEADER = (token) => ({
    'Authorization': `Bearer ${token}`
});

export { 
    API_BASE_URL, 
    API_ENDPOINTS, 
    DEFAULT_HEADERS, 
    AUTH_HEADER 
};