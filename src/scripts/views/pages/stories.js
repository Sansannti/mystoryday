import StoryAPI from '../../api/story-api.js';
import IDBHelper from '../../data/idb-helper.js';

const Stories = {
  _stories: [],
  _map: null,
  _markers: [],
  _currentLayer: 'streets',
  _favoriteIds: new Set(),

  async render() {
    return `
      <div class="container">
        <div class="stories-header">
          <h1>Semua Cerita</h1>
          <div class="header-actions">
            <a href="#/favorites" class="btn-secondary">💾 Favorit Saya</a>
            <a href="#/add-story" class="btn-primary">+ Tambah Cerita</a>
          </div>
        </div>
        
        <div id="storiesAlert" role="alert" aria-live="polite"></div>
        
        <!-- Map Section -->
        <section class="map-section">
          <h2>Peta Lokasi Cerita</h2>
          <p id="mapDescription" class="sr-only">
            Peta interaktif menampilkan lokasi cerita. Klik pada kartu cerita di bawah untuk melihat lokasinya di peta.
          </p>
          <div style="margin-bottom: 1rem;">
            <button id="streetsLayer" class="btn-secondary">Streets</button>
            <button id="satelliteLayer" class="btn-secondary">Satellite</button>
          </div>
          <div id="map" aria-describedby="mapDescription"></div>
        </section>
        
        <!-- Stories Grid Section -->
        <section class="stories-section">
          <h2>Daftar Cerita</h2>
          <div id="storiesGrid" class="stories-grid">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>Loading stories...</p>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async afterRender() {
    await this._loadFavoriteIds();
    await this._loadStories();
    this._initMap();
    this._setupLayerControls();
  },

  async _loadFavoriteIds() {
    try {
      const favorites = await IDBHelper.getAllFavorites();
      this._favoriteIds = new Set(favorites.map(f => f.id));
    } catch (error) {
      console.error('Error loading favorite IDs:', error);
    }
  },

  async _loadStories() {
    const storiesGrid = document.getElementById('storiesGrid');
    const alertDiv = document.getElementById('storiesAlert');
    
    try {
      const result = await StoryAPI.getStories();
      this._stories = result.listStory;
      
      if (this._stories.length === 0) {
        storiesGrid.innerHTML = '<p style="text-align: center;">Belum ada cerita. Tambahkan cerita pertama Anda!</p>';
        return;
      }
      
      storiesGrid.innerHTML = this._stories.map((story, index) => {
        const isFavorite = this._favoriteIds.has(story.id);
        return `
          <article class="story-card" data-index="${index}">
            <button class="favorite-btn ${isFavorite ? 'is-favorite' : ''}" 
                    data-id="${story.id}" 
                    aria-label="${isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}">
              ${isFavorite ? '❤️' : '🤍'}
            </button>
            <button class="story-card-button" aria-label="Lihat detail cerita ${story.name}">
              <img src="${story.photoUrl}" alt="Foto cerita: ${story.name}">
              <div class="story-card-content">
                <h3>${story.name}</h3>
                <p>${story.description}</p>
                <div class="story-meta">
                  <span>📅 ${new Date(story.createdAt).toLocaleDateString('id-ID')}</span>
                  ${story.lat && story.lon ? '<span>📍 Lokasi tersedia</span>' : ''}
                </div>
              </div>
            </button>
          </article>
        `;
      }).join('');
      
      // Update map description with actual count
      const mapDesc = document.getElementById('mapDescription');
      const locationCount = this._stories.filter(s => s.lat && s.lon).length;
      mapDesc.textContent = `Peta interaktif menampilkan lokasi ${locationCount} cerita. Klik pada kartu cerita di bawah untuk melihat lokasinya di peta.`;
      
      // Add click handlers
      this._setupStoryCardHandlers();
      this._setupFavoriteButtons();
      
    } catch (error) {
      alertDiv.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
      storiesGrid.innerHTML = '';
    }
  },

  _setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.stopPropagation();
        const storyId = button.dataset.id;
        await this._toggleFavorite(storyId, button);
      });
    });
  },

  async _toggleFavorite(storyId, button) {
    const alertDiv = document.getElementById('storiesAlert');
    const story = this._stories.find(s => s.id === storyId);
    
    if (!story) return;
    
    try {
      const isFavorite = this._favoriteIds.has(storyId);
      
      if (isFavorite) {
        // Remove from favorites
        await IDBHelper.removeFavorite(storyId);
        this._favoriteIds.delete(storyId);
        button.textContent = '🤍';
        button.classList.remove('is-favorite');
        button.setAttribute('aria-label', 'Tambah ke favorit');
        
        alertDiv.innerHTML = '<div class="alert alert-success">Dihapus dari favorit</div>';
      } else {
        // Add to favorites
        await IDBHelper.addFavorite(story);
        this._favoriteIds.add(storyId);
        button.textContent = '❤️';
        button.classList.add('is-favorite');
        button.setAttribute('aria-label', 'Hapus dari favorit');
        
        alertDiv.innerHTML = '<div class="alert alert-success">Ditambahkan ke favorit</div>';
      }
      
      // Clear alert after 2 seconds
      setTimeout(() => {
        alertDiv.innerHTML = '';
      }, 2000);
      
    } catch (error) {
      alertDiv.innerHTML = `<div class="alert alert-error">Error: ${error.message}</div>`;
    }
  },

  _initMap() {
    // Initialize map
    this._map = L.map('map').setView([-6.2088, 106.8456], 5);
    
    // Add default layer
    this._addStreetsLayer();
    
    // Add markers for stories with location
    this._addMarkers();
  },

  _addStreetsLayer() {
    if (this._currentTileLayer) {
      this._map.removeLayer(this._currentTileLayer);
    }
    
    this._currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this._map);
  },

  _addSatelliteLayer() {
    if (this._currentTileLayer) {
      this._map.removeLayer(this._currentTileLayer);
    }
    
    this._currentTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    }).addTo(this._map);
  },

  _setupLayerControls() {
    const streetsBtn = document.getElementById('streetsLayer');
    const satelliteBtn = document.getElementById('satelliteLayer');
    
    streetsBtn.addEventListener('click', () => {
      this._addStreetsLayer();
      streetsBtn.classList.add('active');
      satelliteBtn.classList.remove('active');
    });
    
    satelliteBtn.addEventListener('click', () => {
      this._addSatelliteLayer();
      satelliteBtn.classList.add('active');
      streetsBtn.classList.remove('active');
    });
    
    streetsBtn.classList.add('active');
  },

  _addMarkers() {
    this._markers.forEach(marker => this._map.removeLayer(marker));
    this._markers = [];
    
    this._stories.forEach((story, index) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon], {
          title: story.name
        })
        .bindPopup(`
          <div style="text-align: center;">
            <img src="${story.photoUrl}" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem;" alt="Foto cerita: ${story.name}">
            <h3 style="margin: 0.5rem 0; font-size: 1.1rem;">${story.name}</h3>
            <p style="margin: 0.3rem 0; color: #7f8c8d;">${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
          </div>
        `)
        .addTo(this._map);
        
        marker.storyIndex = index;
        this._markers.push(marker);
      }
    });
  },

  _setupStoryCardHandlers() {
    const storyButtons = document.querySelectorAll('.story-card-button');
    
    storyButtons.forEach(button => {
      const card = button.closest('.story-card');
      const index = parseInt(card.dataset.index);
      
      const handleClick = () => {
        const story = this._stories[index];
        
        if (story.lat && story.lon) {
          this._map.setView([story.lat, story.lon], 13);
          
          const marker = this._markers.find(m => m.storyIndex === index);
          if (marker) {
            marker.openPopup();
          }
        }
        
        document.querySelectorAll('.story-card').forEach(c => c.classList.remove('highlighted'));
        card.classList.add('highlighted');
      };
      
      button.addEventListener('click', handleClick);
    });
  },
};

export default Stories;