export function initMap(container, center, zoom) {
  const map = L.map(container).setView(center, zoom);
  
  // Base layers
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
  
  // Add base layers and default
  osmLayer.addTo(map);
  
  // Layer control
  const baseLayers = {
    "Street Map": osmLayer,
    "Satellite": satelliteLayer
  };
  
  L.control.layers(baseLayers).addTo(map);
  
  return map;
}

export function createMapWithMarkers(container, stories) {
  // Clear previous content
  container.innerHTML = '';
  
  // Filter stories with valid locations
  const validStories = stories.filter(story => 
    story.lat !== null && story.lon !== null && 
    !isNaN(story.lat) && !isNaN(story.lon)
  );

  if (validStories.length === 0) {
    container.innerHTML = `
      <div class="no-location-message">
        <i class="fas fa-map-marker-alt"></i>
        <p>No valid location data to display</p>
      </div>
    `;
    return;
  }

  // Calculate average position for initial view
  const avgLat = validStories.reduce((sum, story) => sum + story.lat, 0) / validStories.length;
  const avgLon = validStories.reduce((sum, story) => sum + story.lon, 0) / validStories.length;
  
  const map = initMap(container, [avgLat, avgLon], 5);
  
  // Add markers for each valid story
  validStories.forEach(story => {
    const marker = L.marker([story.lat, story.lon]).addTo(map)
      .bindPopup(`
        <h3>${story.name}</h3>
        <img src="${story.photoUrl}" alt="${story.name}'s story" style="max-width: 150px;">
        <p>${story.description}</p>
      `);
  });
}