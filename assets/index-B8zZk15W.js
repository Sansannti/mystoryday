var E=a=>{throw TypeError(a)};var I=(a,e,t)=>e.has(a)||E("Cannot "+t);var m=(a,e,t)=>(I(a,e,"read from private field"),t?t.call(a):e.get(a)),f=(a,e,t)=>e.has(a)?E("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,t),v=(a,e,t,i)=>(I(a,e,"write to private field"),i?i.call(a,t):e.set(a,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const b="https://story-api.dicoding.dev/v1";class w{static async register(e,t,i){const r=await fetch(`${b}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:i})}),s=await r.json();if(!r.ok)throw new Error(s.message||"Registration failed");return s}static async login(e,t){const i=await fetch(`${b}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),r=await i.json();if(!i.ok)throw new Error(r.message||"Login failed");return r}static async getStories(){const e=localStorage.getItem("token");if(!e)throw new Error("No token found. Please login first.");const t=await fetch(`${b}/stories`,{headers:{Authorization:`Bearer ${e}`}}),i=await t.json();if(!t.ok)throw new Error(i.message||"Failed to fetch stories");return i}static async addStory(e,t,i,r){const s=localStorage.getItem("token");if(!s)throw new Error("No token found. Please login first.");const n=new FormData;n.append("description",e),n.append("photo",t),i&&r&&(n.append("lat",i),n.append("lon",r));const o=await fetch(`${b}/stories`,{method:"POST",headers:{Authorization:`Bearer ${s}`},body:n}),l=await o.json();if(!o.ok)throw new Error(l.message||"Failed to add story");return l}}class y{static saveToken(e){localStorage.setItem("token",e)}static getToken(){return localStorage.getItem("token")}static removeToken(){localStorage.removeItem("token")}static isLoggedIn(){return!!this.getToken()}static saveUserInfo(e,t){localStorage.setItem("userName",e),localStorage.setItem("userId",t)}static getUserName(){return localStorage.getItem("userName")}static getUserId(){return localStorage.getItem("userId")}static clearUserInfo(){localStorage.removeItem("userName"),localStorage.removeItem("userId")}static logout(){this.removeToken(),this.clearUserInfo()}}const B={async render(){return`
      <div class="form-container">
        <h1>Login</h1>
        <div id="loginAlert"></div>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required
              placeholder="Masukkan email Anda"
              aria-label="Email"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required
              minlength="8"
              placeholder="Masukkan password Anda"
              aria-label="Password"
            >
          </div>
          
          <button type="submit" class="btn-primary" style="width: 100%;">
            Login
          </button>
        </form>
        
        <div class="form-footer">
          <p>Belum punya akun? <a href="#/register">Register di sini</a></p>
        </div>
      </div>
    `},async afterRender(){const a=document.getElementById("loginForm"),e=document.getElementById("loginAlert");a.addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("email").value,r=document.getElementById("password").value;try{e.innerHTML='<div class="alert alert-success">Loading...</div>';const s=await w.login(i,r);y.saveToken(s.loginResult.token),y.saveUserInfo(s.loginResult.name,s.loginResult.userId),e.innerHTML='<div class="alert alert-success">Login berhasil! Redirecting...</div>',setTimeout(()=>{window.location.hash="#/stories"},1e3)}catch(s){e.innerHTML=`<div class="alert alert-error">${s.message}</div>`}})}},P={async render(){return`
      <div class="form-container">
        <h1>Register</h1>
        <div id="registerAlert"></div>
        <form id="registerForm">
          <div class="form-group">
            <label for="name">Nama Lengkap</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              placeholder="Masukkan nama lengkap Anda"
              aria-label="Nama Lengkap"
            >
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required
              placeholder="Masukkan email Anda"
              aria-label="Email"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required
              minlength="8"
              placeholder="Minimal 8 karakter"
              aria-label="Password"
            >
          </div>
          
          <button type="submit" class="btn-primary" style="width: 100%;">
            Register
          </button>
        </form>
        
        <div class="form-footer">
          <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
        </div>
      </div>
    `},async afterRender(){const a=document.getElementById("registerForm"),e=document.getElementById("registerAlert");a.addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("name").value,r=document.getElementById("email").value,s=document.getElementById("password").value;if(s.length<8){e.innerHTML='<div class="alert alert-error">Password minimal 8 karakter</div>';return}try{e.innerHTML='<div class="alert alert-success">Loading...</div>',await w.register(i,r,s),e.innerHTML='<div class="alert alert-success">Registrasi berhasil! Redirecting to login...</div>',setTimeout(()=>{window.location.hash="#/login"},1500)}catch(n){e.innerHTML=`<div class="alert alert-error">${n.message}</div>`}})}},F="MyStoryDayDB",D=1,c="favorites",d="pendingStories";class u{static async openDB(){return new Promise((e,t)=>{const i=indexedDB.open(F,D);i.onerror=()=>{t(new Error("Failed to open database"))},i.onsuccess=()=>{e(i.result)},i.onupgradeneeded=r=>{const s=r.target.result;s.objectStoreNames.contains(c)||s.createObjectStore(c,{keyPath:"id"}).createIndex("createdAt","createdAt",{unique:!1}),s.objectStoreNames.contains(d)||s.createObjectStore(d,{keyPath:"id",autoIncrement:!0}).createIndex("timestamp","timestamp",{unique:!1})}})}static async addFavorite(e){try{const r=(await this.openDB()).transaction([c],"readwrite").objectStore(c),s={...e,savedAt:new Date().toISOString()};return await r.add(s),!0}catch(t){return console.error("Error adding favorite:",t),!1}}static async removeFavorite(e){try{return await(await this.openDB()).transaction([c],"readwrite").objectStore(c).delete(e),!0}catch(t){return console.error("Error removing favorite:",t),!1}}static async getAllFavorites(){try{const i=(await this.openDB()).transaction([c],"readonly").objectStore(c);return new Promise((r,s)=>{const n=i.getAll();n.onsuccess=()=>r(n.result),n.onerror=()=>s(n.error)})}catch(e){return console.error("Error getting favorites:",e),[]}}static async isFavorite(e){try{const r=(await this.openDB()).transaction([c],"readonly").objectStore(c);return new Promise((s,n)=>{const o=r.get(e);o.onsuccess=()=>s(!!o.result),o.onerror=()=>n(o.error)})}catch(t){return console.error("Error checking favorite:",t),!1}}static async searchFavorites(e){const t=await this.getAllFavorites(),i=e.toLowerCase();return t.filter(r=>r.name.toLowerCase().includes(i)||r.description.toLowerCase().includes(i))}static async sortFavorites(e="newest"){const t=await this.getAllFavorites();switch(e){case"newest":return t.sort((i,r)=>new Date(r.savedAt)-new Date(i.savedAt));case"oldest":return t.sort((i,r)=>new Date(i.savedAt)-new Date(r.savedAt));case"name":return t.sort((i,r)=>i.name.localeCompare(r.name));default:return t}}static async addPendingStory(e){try{const r=(await this.openDB()).transaction([d],"readwrite").objectStore(d),s={...e,timestamp:new Date().toISOString(),synced:!1};return new Promise((n,o)=>{const l=r.add(s);l.onsuccess=()=>n(l.result),l.onerror=()=>o(l.error)})}catch(t){throw console.error("Error adding pending story:",t),t}}static async getPendingStories(){try{const i=(await this.openDB()).transaction([d],"readonly").objectStore(d);return new Promise((r,s)=>{const n=i.getAll();n.onsuccess=()=>r(n.result),n.onerror=()=>s(n.error)})}catch(e){return console.error("Error getting pending stories:",e),[]}}static async deletePendingStory(e){try{const r=(await this.openDB()).transaction([d],"readwrite").objectStore(d);return new Promise((s,n)=>{const o=r.delete(e);o.onsuccess=()=>s(!0),o.onerror=()=>n(o.error)})}catch(t){return console.error("Error deleting pending story:",t),!1}}static async clearPendingStories(){try{const i=(await this.openDB()).transaction([d],"readwrite").objectStore(d);return new Promise((r,s)=>{const n=i.clear();n.onsuccess=()=>r(!0),n.onerror=()=>s(n.error)})}catch(e){return console.error("Error clearing pending stories:",e),!1}}}const C={_stories:[],_map:null,_markers:[],_currentLayer:"streets",_favoriteIds:new Set,async render(){return`
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
    `},async afterRender(){await this._loadFavoriteIds(),await this._loadStories(),this._initMap(),this._setupLayerControls()},async _loadFavoriteIds(){try{const a=await u.getAllFavorites();this._favoriteIds=new Set(a.map(e=>e.id))}catch(a){console.error("Error loading favorite IDs:",a)}},async _loadStories(){const a=document.getElementById("storiesGrid"),e=document.getElementById("storiesAlert");try{const t=await w.getStories();if(this._stories=t.listStory,this._stories.length===0){a.innerHTML='<p style="text-align: center;">Belum ada cerita. Tambahkan cerita pertama Anda!</p>';return}a.innerHTML=this._stories.map((s,n)=>{const o=this._favoriteIds.has(s.id);return`
          <article class="story-card" data-index="${n}">
            <button class="favorite-btn ${o?"is-favorite":""}" 
                    data-id="${s.id}" 
                    aria-label="${o?"Hapus dari favorit":"Tambah ke favorit"}">
              ${o?"❤️":"🤍"}
            </button>
            <button class="story-card-button" aria-label="Lihat detail cerita ${s.name}">
              <img src="${s.photoUrl}" alt="Foto cerita: ${s.name}">
              <div class="story-card-content">
                <h3>${s.name}</h3>
                <p>${s.description}</p>
                <div class="story-meta">
                  <span>📅 ${new Date(s.createdAt).toLocaleDateString("id-ID")}</span>
                  ${s.lat&&s.lon?"<span>📍 Lokasi tersedia</span>":""}
                </div>
              </div>
            </button>
          </article>
        `}).join("");const i=document.getElementById("mapDescription"),r=this._stories.filter(s=>s.lat&&s.lon).length;i.textContent=`Peta interaktif menampilkan lokasi ${r} cerita. Klik pada kartu cerita di bawah untuk melihat lokasinya di peta.`,this._setupStoryCardHandlers(),this._setupFavoriteButtons()}catch(t){e.innerHTML=`<div class="alert alert-error">${t.message}</div>`,a.innerHTML=""}},_setupFavoriteButtons(){document.querySelectorAll(".favorite-btn").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const i=e.dataset.id;await this._toggleFavorite(i,e)})})},async _toggleFavorite(a,e){const t=document.getElementById("storiesAlert"),i=this._stories.find(r=>r.id===a);if(i)try{this._favoriteIds.has(a)?(await u.removeFavorite(a),this._favoriteIds.delete(a),e.textContent="🤍",e.classList.remove("is-favorite"),e.setAttribute("aria-label","Tambah ke favorit"),t.innerHTML='<div class="alert alert-success">Dihapus dari favorit</div>'):(await u.addFavorite(i),this._favoriteIds.add(a),e.textContent="❤️",e.classList.add("is-favorite"),e.setAttribute("aria-label","Hapus dari favorit"),t.innerHTML='<div class="alert alert-success">Ditambahkan ke favorit</div>'),setTimeout(()=>{t.innerHTML=""},2e3)}catch(r){t.innerHTML=`<div class="alert alert-error">Error: ${r.message}</div>`}},_initMap(){this._map=L.map("map").setView([-6.2088,106.8456],5),this._addStreetsLayer(),this._addMarkers()},_addStreetsLayer(){this._currentTileLayer&&this._map.removeLayer(this._currentTileLayer),this._currentTileLayer=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this._map)},_addSatelliteLayer(){this._currentTileLayer&&this._map.removeLayer(this._currentTileLayer),this._currentTileLayer=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles © Esri"}).addTo(this._map)},_setupLayerControls(){const a=document.getElementById("streetsLayer"),e=document.getElementById("satelliteLayer");a.addEventListener("click",()=>{this._addStreetsLayer(),a.classList.add("active"),e.classList.remove("active")}),e.addEventListener("click",()=>{this._addSatelliteLayer(),e.classList.add("active"),a.classList.remove("active")}),a.classList.add("active")},_addMarkers(){this._markers.forEach(a=>this._map.removeLayer(a)),this._markers=[],this._stories.forEach((a,e)=>{if(a.lat&&a.lon){const t=L.marker([a.lat,a.lon],{title:a.name}).bindPopup(`
          <div style="text-align: center;">
            <img src="${a.photoUrl}" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem;" alt="Foto cerita: ${a.name}">
            <h3 style="margin: 0.5rem 0; font-size: 1.1rem;">${a.name}</h3>
            <p style="margin: 0.3rem 0; color: #7f8c8d;">${a.description.substring(0,100)}${a.description.length>100?"...":""}</p>
          </div>
        `).addTo(this._map);t.storyIndex=e,this._markers.push(t)}})},_setupStoryCardHandlers(){document.querySelectorAll(".story-card-button").forEach(e=>{const t=e.closest(".story-card"),i=parseInt(t.dataset.index),r=()=>{const s=this._stories[i];if(s.lat&&s.lon){this._map.setView([s.lat,s.lon],13);const n=this._markers.find(o=>o.storyIndex===i);n&&n.openPopup()}document.querySelectorAll(".story-card").forEach(n=>n.classList.remove("highlighted")),t.classList.add("highlighted")};e.addEventListener("click",r)})}},M={_map:null,_marker:null,_selectedLocation:null,_selectedFile:null,_stream:null,async render(){return`
      <div class="container">
        <div class="form-container" style="max-width: 800px;">
          <h1>Tambah Cerita Baru</h1>
          
          <!-- Online/Offline Status -->
          <div id="connectionStatus" class="connection-status" role="status" aria-live="polite">
            ${navigator.onLine?'<span class="status-online">🟢 Online</span>':'<span class="status-offline">🔴 Offline - Cerita akan dikirim saat online</span>'}
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
    `},async afterRender(){this._initMap(),this._setupFileUpload(),this._setupCamera(),this._setupForm(),this._setupConnectionMonitor(),this._checkPendingStories()},_setupConnectionMonitor(){const a=document.getElementById("connectionStatus");window.addEventListener("online",()=>{a.innerHTML='<span class="status-online">🟢 Online</span>',this._syncPendingStories()}),window.addEventListener("offline",()=>{a.innerHTML='<span class="status-offline">🔴 Offline - Cerita akan dikirim saat online</span>'})},async _checkPendingStories(){try{const a=await u.getPendingStories(),e=document.getElementById("pendingStoriesStatus");if(a.length>0&&(e.style.display="block",e.innerHTML=`
          <div class="alert alert-warning">
            📤 ${a.length} cerita menunggu untuk dikirim
            ${navigator.onLine?'<button id="syncNowBtn" class="btn-secondary" style="margin-left: 1rem;">Kirim Sekarang</button>':""}
          </div>
        `,navigator.onLine)){const t=document.getElementById("syncNowBtn");t&&t.addEventListener("click",()=>this._syncPendingStories())}}catch(a){console.error("Error checking pending stories:",a)}},async _syncPendingStories(){const a=document.getElementById("pendingStoriesStatus"),e=document.getElementById("addStoryAlert");try{const t=await u.getPendingStories();if(t.length===0)return;a.innerHTML='<div class="alert alert-success">⏳ Mengirim cerita yang tertunda...</div>';let i=0;for(const r of t)try{await w.addStory(r.description,r.photo,r.lat,r.lon),await u.deletePendingStory(r.id),i++}catch(s){console.error("Error syncing story:",s)}i>0&&(a.innerHTML=`<div class="alert alert-success">✅ ${i} cerita berhasil dikirim!</div>`,setTimeout(()=>{a.style.display="none"},3e3)),"serviceWorker"in navigator&&"sync"in self.registration&&await(await navigator.serviceWorker.ready).sync.register("sync-stories")}catch(t){console.error("Error syncing stories:",t),e.innerHTML=`<div class="alert alert-error">Error syncing stories: ${t.message}</div>`}},_initMap(){this._map=L.map("addStoryMap").setView([-6.2088,106.8456],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this._map),this._map.on("click",a=>{const{lat:e,lng:t}=a.latlng;this._marker&&this._map.removeLayer(this._marker),this._marker=L.marker([e,t]).addTo(this._map),this._selectedLocation={lat:e,lon:t},document.getElementById("coordsDisplay").textContent=`${e.toFixed(6)}, ${t.toFixed(6)}`})},_setupFileUpload(){const a=document.getElementById("photo"),e=document.getElementById("filePreview"),t=document.getElementById("cameraSection");a.addEventListener("change",i=>{const r=i.target.files[0];if(r){this._selectedFile=r;const s=new FileReader;s.onload=n=>{e.innerHTML=`
            <img src="${n.target.result}" alt="Preview foto yang dipilih" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
            <p style="color: #27ae60; margin-top: 0.5rem;">✓ Foto berhasil dipilih</p>
          `},s.readAsDataURL(r),t.style.display="none"}})},_setupCamera(){const a=document.getElementById("startCamera"),e=document.getElementById("capturePhoto"),t=document.getElementById("stopCamera"),i=document.getElementById("videoPreview"),r=document.querySelector(".camera-buttons"),s=document.getElementById("photoCanvas"),n=document.getElementById("filePreview"),o=document.getElementById("photo");a.addEventListener("click",async()=>{try{this._stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1}),i.srcObject=this._stream,i.style.display="block",r.style.display="flex",a.style.display="none",a.setAttribute("aria-expanded","true")}catch(l){alert("Tidak dapat mengakses kamera: "+l.message)}}),e.addEventListener("click",()=>{s.width=i.videoWidth,s.height=i.videoHeight,s.getContext("2d").drawImage(i,0,0),s.toBlob(A=>{this._selectedFile=new File([A],"camera-photo.jpg",{type:"image/jpeg"}),n.innerHTML=`
          <img src="${s.toDataURL()}" alt="Foto yang diambil dari kamera" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
          <p style="color: #27ae60; margin-top: 0.5rem;">✓ Foto berhasil diambil dari kamera</p>
        `;const S=new DataTransfer;S.items.add(this._selectedFile),o.files=S.files,this._stopCamera()},"image/jpeg",.95)}),t.addEventListener("click",()=>{this._stopCamera()})},_stopCamera(){this._stream&&(this._stream.getTracks().forEach(i=>i.stop()),this._stream=null);const a=document.getElementById("videoPreview"),e=document.querySelector(".camera-buttons"),t=document.getElementById("startCamera");a.style.display="none",e.style.display="none",t.style.display="block",t.setAttribute("aria-expanded","false")},_setupForm(){const a=document.getElementById("addStoryForm"),e=document.getElementById("addStoryAlert");a.addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("description").value;if(!this._selectedFile){e.innerHTML='<div class="alert alert-error">Silakan pilih foto atau ambil foto menggunakan kamera terlebih dahulu</div>';return}if(!this._selectedLocation){e.innerHTML='<div class="alert alert-error">Silakan pilih lokasi pada peta</div>';return}if(!navigator.onLine){await this._saveForLater(i);return}try{e.innerHTML='<div class="alert alert-success">Mengunggah cerita...</div>',await w.addStory(i,this._selectedFile,this._selectedLocation.lat,this._selectedLocation.lon),e.innerHTML='<div class="alert alert-success">Cerita berhasil ditambahkan! Redirecting...</div>',this._stopCamera(),setTimeout(()=>{window.location.hash="#/stories"},1500)}catch(r){r.message.includes("network")||r.message.includes("fetch")?await this._saveForLater(i):e.innerHTML=`<div class="alert alert-error">${r.message}</div>`}})},async _saveForLater(a){const e=document.getElementById("addStoryAlert");try{await u.addPendingStory({description:a,photo:this._selectedFile,lat:this._selectedLocation.lat,lon:this._selectedLocation.lon}),e.innerHTML='<div class="alert alert-success">💾 Cerita disimpan! Akan dikirim otomatis saat online.</div>',"serviceWorker"in navigator&&"sync"in self.registration&&await(await navigator.serviceWorker.ready).sync.register("sync-stories"),setTimeout(()=>{window.location.hash="#/stories"},2e3)}catch(t){e.innerHTML=`<div class="alert alert-error">Error menyimpan cerita: ${t.message}</div>`}}},x={_favorites:[],_filteredFavorites:[],async render(){return`
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
    `},async afterRender(){await this._loadFavorites(),this._setupSearchAndSort()},async _loadFavorites(){const a=document.getElementById("favoritesGrid"),e=document.getElementById("emptyState"),t=document.getElementById("favoritesAlert");try{if(this._favorites=await u.getAllFavorites(),this._filteredFavorites=[...this._favorites],this._favorites.length===0){a.style.display="none",e.style.display="flex";return}this._renderFavorites()}catch(i){t.innerHTML=`<div class="alert alert-error">Error loading favorites: ${i.message}</div>`,a.innerHTML=""}},_renderFavorites(){const a=document.getElementById("favoritesGrid"),e=document.getElementById("emptyState");if(this._filteredFavorites.length===0){a.innerHTML=`
        <div class="no-results">
          <p>Tidak ada cerita yang sesuai dengan pencarian</p>
        </div>
      `;return}a.style.display="grid",e.style.display="none",a.innerHTML=this._filteredFavorites.map(t=>`
      <article class="favorite-card">
        <button class="remove-favorite" data-id="${t.id}" aria-label="Hapus dari favorit">
          ❌
        </button>
        <img src="${t.photoUrl}" alt="Foto cerita: ${t.name}">
        <div class="favorite-card-content">
          <h3>${t.name}</h3>
          <p>${t.description}</p>
          <div class="favorite-meta">
            <span>📅 Dibuat: ${new Date(t.createdAt).toLocaleDateString("id-ID")}</span>
            <span>💾 Disimpan: ${new Date(t.savedAt).toLocaleDateString("id-ID")}</span>
          </div>
        </div>
      </article>
    `).join(""),this._setupRemoveButtons()},_setupRemoveButtons(){document.querySelectorAll(".remove-favorite").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const i=e.dataset.id;await this._removeFavorite(i)})})},async _removeFavorite(a){const e=document.getElementById("favoritesAlert");try{await u.removeFavorite(a)&&(e.innerHTML='<div class="alert alert-success">Cerita dihapus dari favorit</div>',this._favorites=this._favorites.filter(i=>i.id!==a),this._filteredFavorites=this._filteredFavorites.filter(i=>i.id!==a),this._renderFavorites(),setTimeout(()=>{e.innerHTML=""},3e3))}catch(t){e.innerHTML=`<div class="alert alert-error">Error menghapus favorit: ${t.message}</div>`}},_setupSearchAndSort(){const a=document.getElementById("searchInput"),e=document.getElementById("sortSelect");a.addEventListener("input",t=>{const i=t.target.value.toLowerCase().trim();i===""?this._filteredFavorites=[...this._favorites]:this._filteredFavorites=this._favorites.filter(r=>r.name.toLowerCase().includes(i)||r.description.toLowerCase().includes(i)),this._renderFavorites()}),e.addEventListener("change",t=>{const i=t.target.value;this._sortFavorites(i)})},_sortFavorites(a){switch(a){case"newest":this._filteredFavorites.sort((e,t)=>new Date(t.savedAt)-new Date(e.savedAt));break;case"oldest":this._filteredFavorites.sort((e,t)=>new Date(e.savedAt)-new Date(t.savedAt));break;case"name":this._filteredFavorites.sort((e,t)=>e.name.localeCompare(t.name));break}this._renderFavorites()}},$={"/":B,"/login":B,"/register":P,"/stories":C,"/add-story":M,"/favorites":x},T=()=>{const a=window.location.hash.slice(1).toLowerCase()||"/";return a===""?"/":a},H="BN7-r0Svv7CsTi18-OPYtJLVW0bfuZ1x1UtrygczKjennA_qs7OWmgOewcuYSYF8L_9_uBBq6JMBRvJrCBP91ks";class h{static async requestPermission(){try{return await Notification.requestPermission()==="granted"}catch(e){return console.error("Error requesting notification permission:",e),!1}}static async subscribe(){try{const e=await navigator.serviceWorker.ready;let t=await e.pushManager.getSubscription();return t||(t=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this._urlBase64ToUint8Array(H)}),console.log("Push subscription created:",t)),t}catch(e){throw console.error("Error subscribing to push notifications:",e),e}}static async unsubscribe(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return t?(await t.unsubscribe(),console.log("Push subscription removed"),!0):!1}catch(e){return console.error("Error unsubscribing from push notifications:",e),!1}}static async isSubscribed(){try{return!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch(e){return console.error("Error checking subscription status:",e),!1}}static async getSubscription(){try{return await(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch(e){return console.error("Error getting subscription:",e),null}}static _urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),i=(e+t).replace(/-/g,"+").replace(/_/g,"/"),r=window.atob(i),s=new Uint8Array(r.length);for(let n=0;n<r.length;++n)s[n]=r.charCodeAt(n);return s}static async showTestNotification(){Notification.permission!=="granted"&&await this.requestPermission(),Notification.permission==="granted"&&await(await navigator.serviceWorker.ready).showNotification("MyStoryDay",{body:"Push notification berhasil diaktifkan!",icon:"/icon-192x192.png",badge:"/icon-96x96.png",vibrate:[200,100,200],data:{url:"/#/stories"}})}}var p,k,_,g;class N{constructor({content:e,drawerButton:t,navigationDrawer:i}){f(this,p,null);f(this,k,null);f(this,_,null);f(this,g,null);v(this,p,e),v(this,k,t),v(this,_,i),this._initialAppShell()}_initialAppShell(){this._initializeNavigation(),this._initializeScrollEffects(),this._setupAuthUI(),this._setupPWAFeatures()}_setupPWAFeatures(){this._setupInstallPrompt(),this._setupPushNotifications()}_setupInstallPrompt(){const e=document.getElementById("installBanner"),t=document.getElementById("installButton"),i=document.getElementById("dismissBanner");window.addEventListener("beforeinstallprompt",r=>{console.log("beforeinstallprompt fired"),r.preventDefault(),v(this,g,r);const s=localStorage.getItem("installBannerDismissed"),n=localStorage.getItem("appInstalled");!s&&!n&&(e.style.display="block")}),t&&t.addEventListener("click",async()=>{if(!m(this,g))return;m(this,g).prompt();const{outcome:r}=await m(this,g).userChoice;console.log(`User response to install prompt: ${r}`),r==="accepted"&&localStorage.setItem("appInstalled","true"),v(this,g,null),e.style.display="none"}),i&&i.addEventListener("click",()=>{e.style.display="none",localStorage.setItem("installBannerDismissed","true"),setTimeout(()=>{localStorage.removeItem("installBannerDismissed")},10080*60*1e3)}),window.addEventListener("appinstalled",()=>{console.log("PWA installed successfully"),localStorage.setItem("appInstalled","true"),e.style.display="none"})}async _setupPushNotifications(){const e=document.getElementById("notificationToggle");if(document.getElementById("notificationIcon"),!e||!("serviceWorker"in navigator)||!("PushManager"in window))return;const t=await h.isSubscribed();this._updateNotificationIcon(t),e.addEventListener("click",async()=>{try{await h.isSubscribed()?(await h.unsubscribe(),this._updateNotificationIcon(!1),this._showNotificationAlert("Push notifications dinonaktifkan","success")):await h.requestPermission()?(await h.subscribe(),this._updateNotificationIcon(!0),this._showNotificationAlert("Push notifications diaktifkan!","success"),await h.showTestNotification()):this._showNotificationAlert("Permission ditolak untuk notifications","error")}catch(i){console.error("Error toggling push notifications:",i),this._showNotificationAlert("Error mengatur notifications","error")}})}_updateNotificationIcon(e){const t=document.getElementById("notificationIcon"),i=document.getElementById("notificationToggle");t&&(t.textContent=e?"🔔":"🔕"),i&&(i.setAttribute("aria-label",e?"Nonaktifkan push notifications":"Aktifkan push notifications"),i.setAttribute("title",e?"Push notifications aktif":"Push notifications nonaktif"))}_showNotificationAlert(e,t){const i=document.createElement("div");i.className=`notification-alert notification-alert-${t}`,i.textContent=e,i.style.cssText=`
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${t==="success"?"#27ae60":"#e74c3c"};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `,document.body.appendChild(i),setTimeout(()=>{i.style.animation="slideOut 0.3s ease-out",setTimeout(()=>{document.body.removeChild(i)},300)},3e3)}_initializeNavigation(){const e=document.getElementById("menuToggle"),t=document.getElementById("navLinks");e&&t&&(e.addEventListener("click",()=>{e.classList.toggle("active"),t.classList.toggle("active")}),document.querySelectorAll(".nav-links a").forEach(s=>{s.addEventListener("click",()=>{e.classList.remove("active"),t.classList.remove("active")})}));const i=document.getElementById("logoutBtn");i&&i.addEventListener("click",()=>{y.logout(),window.location.hash="#/login",this._setupAuthUI()})}_initializeScrollEffects(){const e=document.getElementById("navbar");e&&window.addEventListener("scroll",()=>{window.pageYOffset>100?e.classList.add("scrolled"):e.classList.remove("scrolled")})}_setupAuthUI(){const e=y.isLoggedIn(),t=document.getElementById("loginLink"),i=document.getElementById("registerLink"),r=document.getElementById("storiesLinkItem"),s=document.getElementById("favoritesLinkItem"),n=document.getElementById("addStoryLinkItem"),o=document.getElementById("notificationLinkItem"),l=document.getElementById("logoutLinkItem");e?(t&&(t.parentElement.style.display="none"),i&&(i.parentElement.style.display="none"),r&&(r.style.display="block"),s&&(s.style.display="block"),n&&(n.style.display="block"),o&&(o.style.display="block"),l&&(l.style.display="block")):(t&&(t.parentElement.style.display="block"),i&&(i.parentElement.style.display="block"),r&&(r.style.display="none"),s&&(s.style.display="none"),n&&(n.style.display="none"),o&&(o.style.display="none"),l&&(l.style.display="none"))}_checkAuth(){const e=T(),t=y.isLoggedIn();return["/stories","/add-story","/favorites"].includes(e)&&!t?(window.location.hash="#/login",!1):!0}init(){this._initializeBackToTop(),this.renderPage(),window.addEventListener("hashchange",()=>{this.renderPage()}),window.addEventListener("popstate",()=>{this.renderPage()})}_initializeBackToTop(){const e=document.getElementById("backToTop");e&&(window.addEventListener("scroll",()=>{window.pageYOffset>300?e.classList.add("show"):e.classList.remove("show")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}),e.addEventListener("keypress",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}))}))}async renderPage(){if(!this._checkAuth())return;const e=T(),t=$[e];if(!t){this._showError();return}if(m(this,p))try{this._showLoading(),this._setupAuthUI(),document.startViewTransition?await document.startViewTransition(async()=>{m(this,p).innerHTML=await t.render(),await t.afterRender()}).finished:(m(this,p).innerHTML=await t.render(),m(this,p).classList.add("page-enter"),await t.afterRender()),window.scrollTo(0,0),this._hideLoading()}catch(i){console.error("Error rendering page:",i),this._showError()}}_showLoading(){const e=document.getElementById("loadingSpinner");e&&(e.style.display="flex")}_hideLoading(){const e=document.getElementById("loadingSpinner");e&&(e.style.display="none")}destroy(){window.removeEventListener("hashchange",this.renderPage),window.removeEventListener("popstate",this.renderPage)}}p=new WeakMap,k=new WeakMap,_=new WeakMap,g=new WeakMap;document.addEventListener("DOMContentLoaded",()=>{new N({content:document.getElementById("mainContent"),drawerButton:document.getElementById("menuToggle"),navigationDrawer:document.getElementById("navLinks")}).init()});async function O(){return"serviceWorker"in navigator?await navigator.serviceWorker.getRegistration()?"✓ PWA Active":"✗ PWA Not Registered":"✗ PWA Not Supported"}window.addEventListener("load",()=>{O().then(a=>{const e=document.getElementById("pwa-status");e&&(e.textContent=a)})});
