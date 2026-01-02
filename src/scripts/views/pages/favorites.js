import IDBHelper from '../../data/idb-helper.js';

const Favorites = {
  _favorites: [],
  _filteredFavorites: [],

  async render() {
    return `
      <div class="container">
        <div class="favorites-header">
          <h1>Cerita Favorit Saya</h1>
          <p class="subtitle">Cerita yang telah Anda simpan</p>
        </div>
        
        <div id="favoritesAlert" role="alert" aria-live="polite"></div>
        
        <!-- Search and Sort Controls -->
        <div class="controls-section">
          <div class="search-box">
            <label for="searchInput" class="sr-only">Cari cerita favorit</label>
            <input 
              type="search" 
              id="searchInput" 
              placeholder="🔍 Cari cerita favorit..." 
              aria-label="Cari cerita favorit"
            >
          </div>
          
          <div class="sort-controls">
            <label for="sortSelect">Urutkan:</label>
            <select id="sortSelect" aria-label="Urutkan cerita favorit">
              <option value="newest">Terbaru Disimpan</option>
              <option value="oldest">Terlama Disimpan</option>
              <option value="name">Nama (A-Z)</option>
            </select>
          </div>
        </div>
        
        <!-- Favorites Grid -->
        <div id="favoritesGrid" class="favorites-grid">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading favorites...</p>
          </div>
        </div>
        
        <!-- Empty State -->
        <div id="emptyState" class="empty-state" style="display: none;">
          <div class="empty-state-icon">💔</div>
          <h2>Belum Ada Cerita Favorit</h2>
          <p>Mulai simpan cerita favorit Anda dari halaman Stories</p>
          <a href="#/stories" class="btn-primary">Lihat Semua Cerita</a>
        </div>
      </div>
    `;
  },

  async afterRender() {
    await this._loadFavorites();
    this._setupSearchAndSort();
  },

  async _loadFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyState');
    const alertDiv = document.getElementById('favoritesAlert');
    
    try {
      this._favorites = await IDBHelper.getAllFavorites();
      this._filteredFavorites = [...this._favorites];
      
      if (this._favorites.length === 0) {
        favoritesGrid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
      }
      
      this._renderFavorites();
      
    } catch (error) {
      alertDiv.innerHTML = `<div class="alert alert-error">Error loading favorites: ${error.message}</div>`;
      favoritesGrid.innerHTML = '';
    }
  },

  _renderFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (this._filteredFavorites.length === 0) {
      favoritesGrid.innerHTML = `
        <div class="no-results">
          <p>Tidak ada cerita yang sesuai dengan pencarian</p>
        </div>
      `;
      return;
    }
    
    favoritesGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    favoritesGrid.innerHTML = this._filteredFavorites.map((story) => `
      <article class="favorite-card">
        <button class="remove-favorite" data-id="${story.id}" aria-label="Hapus dari favorit">
          ❌
        </button>
        <img src="${story.photoUrl}" alt="Foto cerita: ${story.name}">
        <div class="favorite-card-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <div class="favorite-meta">
            <span>📅 Dibuat: ${new Date(story.createdAt).toLocaleDateString('id-ID')}</span>
            <span>💾 Disimpan: ${new Date(story.savedAt).toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </article>
    `).join('');
    
    // Add event listeners for remove buttons
    this._setupRemoveButtons();
  },

  _setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-favorite');
    
    removeButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.stopPropagation();
        const storyId = button.dataset.id;
        await this._removeFavorite(storyId);
      });
    });
  },

  async _removeFavorite(storyId) {
    const alertDiv = document.getElementById('favoritesAlert');
    
    try {
      const success = await IDBHelper.removeFavorite(storyId);
      
      if (success) {
        alertDiv.innerHTML = '<div class="alert alert-success">Cerita dihapus dari favorit</div>';
        
        // Remove from local arrays
        this._favorites = this._favorites.filter(s => s.id !== storyId);
        this._filteredFavorites = this._filteredFavorites.filter(s => s.id !== storyId);
        
        // Re-render
        this._renderFavorites();
        
        // Clear alert after 3 seconds
        setTimeout(() => {
          alertDiv.innerHTML = '';
        }, 3000);
      }
    } catch (error) {
      alertDiv.innerHTML = `<div class="alert alert-error">Error menghapus favorit: ${error.message}</div>`;
    }
  },

  _setupSearchAndSort() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query === '') {
        this._filteredFavorites = [...this._favorites];
      } else {
        this._filteredFavorites = this._favorites.filter(story =>
          story.name.toLowerCase().includes(query) ||
          story.description.toLowerCase().includes(query)
        );
      }
      
      this._renderFavorites();
    });
    
    // Sort functionality
    sortSelect.addEventListener('change', (e) => {
      const sortBy = e.target.value;
      this._sortFavorites(sortBy);
    });
  },

  _sortFavorites(sortBy) {
    switch (sortBy) {
      case 'newest':
        this._filteredFavorites.sort((a, b) => 
          new Date(b.savedAt) - new Date(a.savedAt)
        );
        break;
      case 'oldest':
        this._filteredFavorites.sort((a, b) => 
          new Date(a.savedAt) - new Date(b.savedAt)
        );
        break;
      case 'name':
        this._filteredFavorites.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        break;
    }
    
    this._renderFavorites();
  },
};

export default Favorites;