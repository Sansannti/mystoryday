import StoryAPI from '../../api/story-api.js';
import IDBHelper from '../../data/idb-helper.js';

const AddStory = {
  _map: null,
  _marker: null,
  _selectedLocation: null,
  _selectedFile: null,
  _stream: null,

  async render() {
    return `
      <div class="container">
        <div class="form-container" style="max-width: 800px;">
          <h1>Tambah Cerita Baru</h1>
          
          <!-- Online/Offline Status -->
          <div id="connectionStatus" class="connection-status" role="status" aria-live="polite">
            ${navigator.onLine ? 
              '<span class="status-online">🟢 Online</span>' : 
              '<span class="status-offline">🔴 Offline - Cerita akan dikirim saat online</span>'
            }
          </div>
          
          <!-- Pending Stories Sync Status -->
          <div id="pendingStoriesStatus" style="display: none;" role="status" aria-live="polite"></div>
          
          <div id="addStoryAlert" role="alert" aria-live="polite"></div>
          
          <form id="addStoryForm">
            <!-- Section 1: Deskripsi -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Informasi Cerita</legend>
              
              <div class="form-group">
                <label for="description">Deskripsi Cerita</label>
                <textarea 
                  id="description" 
                  name="description" 
                  required
                  placeholder="Ceritakan pengalaman Anda..."
                  aria-label="Deskripsi Cerita"
                ></textarea>
              </div>
            </fieldset>
            
            <!-- Section 2: Foto -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Foto Cerita</legend>
              
              <div class="form-group">
                <label class="section-subtitle">Upload dari File</label>
                <p id="photoHelpText" class="help-text">Format: JPG, PNG. Maksimal 5MB</p>
                <div class="file-upload">
                  <input 
                    type="file" 
                    id="photo" 
                    name="photo" 
                    accept="image/*" 
                    aria-label="Upload Foto"
                    aria-describedby="photoHelpText"
                  >
                  <label for="photo" class="file-upload-label">
                    <span>📷 Klik untuk upload foto</span>
                  </label>
                </div>
                <div id="filePreview" class="file-preview" aria-live="polite"></div>
              </div>
              
              <div class="form-group" id="cameraSection">
                <label class="section-subtitle">Atau Gunakan Kamera</label>
                <button type="button" id="startCamera" class="btn-secondary" style="width: 100%;">
                  📸 Buka Kamera
                </button>
                <video id="videoPreview" style="display: none;" autoplay aria-label="Live camera preview"></video>
                <div class="camera-buttons" style="display: none;">
                  <button type="button" id="capturePhoto" class="btn-primary">Ambil Foto</button>
                  <button type="button" id="stopCamera" class="btn-secondary">Tutup Kamera</button>
                </div>
                <canvas id="photoCanvas" style="display: none;"></canvas>
              </div>
            </fieldset>
            
            <!-- Section 3: Lokasi -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Lokasi Cerita</legend>
              
              <div class="form-group">
                <label class="section-subtitle">Pilih Lokasi di Peta (Klik pada peta)</label>
                <div id="addStoryMap" style="height: 400px; border-radius: 8px; margin-top: 0.5rem;" aria-label="Interactive map to select location"></div>
                <p style="color: #7f8c8d; font-size: 0.9rem; margin-top: 0.5rem;">
                  Koordinat: <span id="coordsDisplay">Belum dipilih</span>
                </p>
              </div>
            </fieldset>
            
            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">
              Publikasikan Cerita
            </button>
          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    this._initMap();
    this._setupFileUpload();
    this._setupCamera();
    this._setupForm();
    this._setupConnectionMonitor();
    this._checkPendingStories();
  },

  _setupConnectionMonitor() {
    const statusDiv = document.getElementById('connectionStatus');
    
    window.addEventListener('online', () => {
      statusDiv.innerHTML = '<span class="status-online">🟢 Online</span>';
      this._syncPendingStories();
    });
    
    window.addEventListener('offline', () => {
      statusDiv.innerHTML = '<span class="status-offline">🔴 Offline - Cerita akan dikirim saat online</span>';
    });
  },

  async _checkPendingStories() {
    try {
      const pendingStories = await IDBHelper.getPendingStories();
      const statusDiv = document.getElementById('pendingStoriesStatus');
      
      if (pendingStories.length > 0) {
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = `
          <div class="alert alert-warning">
            📤 ${pendingStories.length} cerita menunggu untuk dikirim
            ${navigator.onLine ? '<button id="syncNowBtn" class="btn-secondary" style="margin-left: 1rem;">Kirim Sekarang</button>' : ''}
          </div>
        `;
        
        if (navigator.onLine) {
          const syncBtn = document.getElementById('syncNowBtn');
          if (syncBtn) {
            syncBtn.addEventListener('click', () => this._syncPendingStories());
          }
        }
      }
    } catch (error) {
      console.error('Error checking pending stories:', error);
    }
  },

  async _syncPendingStories() {
    const statusDiv = document.getElementById('pendingStoriesStatus');
    const alertDiv = document.getElementById('addStoryAlert');
    
    try {
      const pendingStories = await IDBHelper.getPendingStories();
      
      if (pendingStories.length === 0) {
        return;
      }
      
      statusDiv.innerHTML = '<div class="alert alert-success">⏳ Mengirim cerita yang tertunda...</div>';
      
      let successCount = 0;
      
      for (const story of pendingStories) {
        try {
          await StoryAPI.addStory(
            story.description,
            story.photo,
            story.lat,
            story.lon
          );
          
          await IDBHelper.deletePendingStory(story.id);
          successCount++;
        } catch (error) {
          console.error('Error syncing story:', error);
        }
      }
      
      if (successCount > 0) {
        statusDiv.innerHTML = `<div class="alert alert-success">✅ ${successCount} cerita berhasil dikirim!</div>`;
        
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 3000);
      }
      
      // Trigger background sync if available
      if ('serviceWorker' in navigator && 'sync' in self.registration) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-stories');
      }
      
    } catch (error) {
      console.error('Error syncing stories:', error);
      alertDiv.innerHTML = `<div class="alert alert-error">Error syncing stories: ${error.message}</div>`;
    }
  },

  _initMap() {
    this._map = L.map('addStoryMap').setView([-6.2088, 106.8456], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this._map);
    
    this._map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      if (this._marker) {
        this._map.removeLayer(this._marker);
      }
      
      this._marker = L.marker([lat, lng]).addTo(this._map);
      this._selectedLocation = { lat, lon: lng };
      
      document.getElementById('coordsDisplay').textContent = 
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    });
  },

  _setupFileUpload() {
    const fileInput = document.getElementById('photo');
    const filePreview = document.getElementById('filePreview');
    const cameraSection = document.getElementById('cameraSection');
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this._selectedFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          filePreview.innerHTML = `
            <img src="${e.target.result}" alt="Preview foto yang dipilih" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
            <p style="color: #27ae60; margin-top: 0.5rem;">✓ Foto berhasil dipilih</p>
          `;
        };
        reader.readAsDataURL(file);
        
        cameraSection.style.display = 'none';
      }
    });
  },

  _setupCamera() {
    const startCameraBtn = document.getElementById('startCamera');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const stopCameraBtn = document.getElementById('stopCamera');
    const videoPreview = document.getElementById('videoPreview');
    const cameraButtons = document.querySelector('.camera-buttons');
    const photoCanvas = document.getElementById('photoCanvas');
    const filePreview = document.getElementById('filePreview');
    const fileInput = document.getElementById('photo');
    
    startCameraBtn.addEventListener('click', async () => {
      try {
        this._stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        
        videoPreview.srcObject = this._stream;
        videoPreview.style.display = 'block';
        cameraButtons.style.display = 'flex';
        startCameraBtn.style.display = 'none';
        startCameraBtn.setAttribute('aria-expanded', 'true');
        
      } catch (error) {
        alert('Tidak dapat mengakses kamera: ' + error.message);
      }
    });
    
    capturePhotoBtn.addEventListener('click', () => {
      photoCanvas.width = videoPreview.videoWidth;
      photoCanvas.height = videoPreview.videoHeight;
      
      const ctx = photoCanvas.getContext('2d');
      ctx.drawImage(videoPreview, 0, 0);
      
      photoCanvas.toBlob((blob) => {
        this._selectedFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        
        filePreview.innerHTML = `
          <img src="${photoCanvas.toDataURL()}" alt="Foto yang diambil dari kamera" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
          <p style="color: #27ae60; margin-top: 0.5rem;">✓ Foto berhasil diambil dari kamera</p>
        `;
        
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(this._selectedFile);
        fileInput.files = dataTransfer.files;
        
        this._stopCamera();
      }, 'image/jpeg', 0.95);
    });
    
    stopCameraBtn.addEventListener('click', () => {
      this._stopCamera();
    });
  },

  _stopCamera() {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
    
    const videoPreview = document.getElementById('videoPreview');
    const cameraButtons = document.querySelector('.camera-buttons');
    const startCameraBtn = document.getElementById('startCamera');
    
    videoPreview.style.display = 'none';
    cameraButtons.style.display = 'none';
    startCameraBtn.style.display = 'block';
    startCameraBtn.setAttribute('aria-expanded', 'false');
  },

  _setupForm() {
    const form = document.getElementById('addStoryForm');
    const alertDiv = document.getElementById('addStoryAlert');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const description = document.getElementById('description').value;
      
      if (!this._selectedFile) {
        alertDiv.innerHTML = '<div class="alert alert-error">Silakan pilih foto atau ambil foto menggunakan kamera terlebih dahulu</div>';
        return;
      }
      
      if (!this._selectedLocation) {
        alertDiv.innerHTML = '<div class="alert alert-error">Silakan pilih lokasi pada peta</div>';
        return;
      }
      
      // Check if online
      if (!navigator.onLine) {
        await this._saveForLater(description);
        return;
      }
      
      try {
        alertDiv.innerHTML = '<div class="alert alert-success">Mengunggah cerita...</div>';
        
        await StoryAPI.addStory(
          description,
          this._selectedFile,
          this._selectedLocation.lat,
          this._selectedLocation.lon
        );
        
        alertDiv.innerHTML = '<div class="alert alert-success">Cerita berhasil ditambahkan! Redirecting...</div>';
        
        this._stopCamera();
        
        setTimeout(() => {
          window.location.hash = '#/stories';
        }, 1500);
        
      } catch (error) {
        // If error, save for later
        if (error.message.includes('network') || error.message.includes('fetch')) {
          await this._saveForLater(description);
        } else {
          alertDiv.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
        }
      }
    });
  },

  async _saveForLater(description) {
    const alertDiv = document.getElementById('addStoryAlert');
    
    try {
      await IDBHelper.addPendingStory({
        description,
        photo: this._selectedFile,
        lat: this._selectedLocation.lat,
        lon: this._selectedLocation.lon
      });
      
      alertDiv.innerHTML = '<div class="alert alert-success">💾 Cerita disimpan! Akan dikirim otomatis saat online.</div>';
      
      // Register background sync
      if ('serviceWorker' in navigator && 'sync' in self.registration) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-stories');
      }
      
      setTimeout(() => {
        window.location.hash = '#/stories';
      }, 2000);
      
    } catch (error) {
      alertDiv.innerHTML = `<div class="alert alert-error">Error menyimpan cerita: ${error.message}</div>`;
    }
  },
};

export default AddStory;