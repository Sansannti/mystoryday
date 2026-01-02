const DB_NAME = 'MyStoryDayDB';
const DB_VERSION = 1;
const FAVORITES_STORE = 'favorites';
const PENDING_STORIES_STORE = 'pendingStories';

class IDBHelper {
  static async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create favorites store
        if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
          const favoritesStore = db.createObjectStore(FAVORITES_STORE, { keyPath: 'id' });
          favoritesStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Create pending stories store
        if (!db.objectStoreNames.contains(PENDING_STORIES_STORE)) {
          const pendingStore = db.createObjectStore(PENDING_STORIES_STORE, { keyPath: 'id', autoIncrement: true });
          pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // === FAVORITES OPERATIONS ===
  
  static async addFavorite(story) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([FAVORITES_STORE], 'readwrite');
      const store = transaction.objectStore(FAVORITES_STORE);
      
      const favoriteStory = {
        ...story,
        savedAt: new Date().toISOString()
      };
      
      await store.add(favoriteStory);
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  }

  static async removeFavorite(storyId) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([FAVORITES_STORE], 'readwrite');
      const store = transaction.objectStore(FAVORITES_STORE);
      
      await store.delete(storyId);
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }

  static async getAllFavorites() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([FAVORITES_STORE], 'readonly');
      const store = transaction.objectStore(FAVORITES_STORE);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static async isFavorite(storyId) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([FAVORITES_STORE], 'readonly');
      const store = transaction.objectStore(FAVORITES_STORE);
      
      return new Promise((resolve, reject) => {
        const request = store.get(storyId);
        request.onsuccess = () => resolve(!!request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  static async searchFavorites(query) {
    const favorites = await this.getAllFavorites();
    const lowerQuery = query.toLowerCase();
    
    return favorites.filter(story => 
      story.name.toLowerCase().includes(lowerQuery) ||
      story.description.toLowerCase().includes(lowerQuery)
    );
  }

  static async sortFavorites(sortBy = 'newest') {
    const favorites = await this.getAllFavorites();
    
    switch (sortBy) {
      case 'newest':
        return favorites.sort((a, b) => 
          new Date(b.savedAt) - new Date(a.savedAt)
        );
      case 'oldest':
        return favorites.sort((a, b) => 
          new Date(a.savedAt) - new Date(b.savedAt)
        );
      case 'name':
        return favorites.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
      default:
        return favorites;
    }
  }

  // === PENDING STORIES (for offline sync) ===
  
  static async addPendingStory(storyData) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([PENDING_STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(PENDING_STORIES_STORE);
      
      const pendingStory = {
        ...storyData,
        timestamp: new Date().toISOString(),
        synced: false
      };
      
      return new Promise((resolve, reject) => {
        const request = store.add(pendingStory);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error adding pending story:', error);
      throw error;
    }
  }

  static async getPendingStories() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([PENDING_STORIES_STORE], 'readonly');
      const store = transaction.objectStore(PENDING_STORIES_STORE);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting pending stories:', error);
      return [];
    }
  }

  static async deletePendingStory(id) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([PENDING_STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(PENDING_STORIES_STORE);
      
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error deleting pending story:', error);
      return false;
    }
  }

  static async clearPendingStories() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([PENDING_STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(PENDING_STORIES_STORE);
      
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing pending stories:', error);
      return false;
    }
  }
}

export default IDBHelper;