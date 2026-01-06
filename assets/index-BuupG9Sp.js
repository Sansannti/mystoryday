var E=i=>{throw TypeError(i)};var I=(i,e,t)=>e.has(i)||E("Cannot "+t);var l=(i,e,t)=>(I(i,e,"read from private field"),t?t.call(i):e.get(i)),y=(i,e,t)=>e.has(i)?E("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t),f=(i,e,t,r)=>(I(i,e,"write to private field"),r?r.call(i,t):e.set(i,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(a){if(a.ep)return;a.ep=!0;const s=t(a);fetch(a.href,s)}})();const b="https://story-api.dicoding.dev/v1";class w{static async register(e,t,r){const a=await fetch(`${b}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:r})}),s=await a.json();if(!a.ok)throw new Error(s.message||"Registration failed");return s}static async login(e,t){const r=await fetch(`${b}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),a=await r.json();if(!r.ok)throw new Error(a.message||"Login failed");return a}static async getStories(){const e=localStorage.getItem("token");if(!e)throw new Error("No token found. Please login first.");const t=await fetch(`${b}/stories`,{headers:{Authorization:`Bearer ${e}`}}),r=await t.json();if(!t.ok)throw new Error(r.message||"Failed to fetch stories");return r}static async addStory(e,t,r,a){const s=localStorage.getItem("token");if(!s)throw new Error("No token found. Please login first.");const n=new FormData;n.append("description",e),n.append("photo",t),r&&a&&(n.append("lat",r),n.append("lon",a));const o=await fetch(`${b}/stories`,{method:"POST",headers:{Authorization:`Bearer ${s}`},body:n}),c=await o.json();if(!o.ok)throw new Error(c.message||"Failed to add story");return c}}class v{static saveToken(e){localStorage.setItem("token",e)}static getToken(){return localStorage.getItem("token")}static removeToken(){localStorage.removeItem("token")}static isLoggedIn(){return!!this.getToken()}static saveUserInfo(e,t){localStorage.setItem("userName",e),localStorage.setItem("userId",t)}static getUserName(){return localStorage.getItem("userName")}static getUserId(){return localStorage.getItem("userId")}static clearUserInfo(){localStorage.removeItem("userName"),localStorage.removeItem("userId")}static logout(){this.removeToken(),this.clearUserInfo()}}const B={async render(){return`
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
    `},async afterRender(){const i=document.getElementById("loginForm"),e=document.getElementById("loginAlert");i.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("email").value,a=document.getElementById("password").value;try{e.innerHTML='<div class="alert alert-success">Loading...</div>';const s=await w.login(r,a);v.saveToken(s.loginResult.token),v.saveUserInfo(s.loginResult.name,s.loginResult.userId),e.innerHTML='<div class="alert alert-success">Login berhasil! Redirecting...</div>',setTimeout(()=>{window.location.hash="#/stories"},1e3)}catch(s){e.innerHTML=`<div class="alert alert-error">${s.message}</div>`}})}},P={async render(){return`
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
    `},async afterRender(){const i=document.getElementById("registerForm"),e=document.getElementById("registerAlert");i.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("name").value,a=document.getElementById("email").value,s=document.getElementById("password").value;if(s.length<8){e.innerHTML='<div class="alert alert-error">Password minimal 8 karakter</div>';return}try{e.innerHTML='<div class="alert alert-success">Loading...</div>',await w.register(r,a,s),e.innerHTML='<div class="alert alert-success">Registrasi berhasil! Redirecting to login...</div>',setTimeout(()=>{window.location.hash="#/login"},1500)}catch(n){e.innerHTML=`<div class="alert alert-error">${n.message}</div>`}})}},F="MyStoryDayDB",D=1,d="favorites",u="pendingStories";class g{static async openDB(){return new Promise((e,t)=>{const r=indexedDB.open(F,D);r.onerror=()=>{t(new Error("Failed to open database"))},r.onsuccess=()=>{e(r.result)},r.onupgradeneeded=a=>{const s=a.target.result;s.objectStoreNames.contains(d)||s.createObjectStore(d,{keyPath:"id"}).createIndex("createdAt","createdAt",{unique:!1}),s.objectStoreNames.contains(u)||s.createObjectStore(u,{keyPath:"id",autoIncrement:!0}).createIndex("timestamp","timestamp",{unique:!1})}})}static async addFavorite(e){try{const a=(await this.openDB()).transaction([d],"readwrite").objectStore(d),s={...e,savedAt:new Date().toISOString()};return await a.add(s),!0}catch(t){return console.error("Error adding favorite:",t),!1}}static async removeFavorite(e){try{return await(await this.openDB()).transaction([d],"readwrite").objectStore(d).delete(e),!0}catch(t){return console.error("Error removing favorite:",t),!1}}static async getAllFavorites(){try{const r=(await this.openDB()).transaction([d],"readonly").objectStore(d);return new Promise((a,s)=>{const n=r.getAll();n.onsuccess=()=>a(n.result),n.onerror=()=>s(n.error)})}catch(e){return console.error("Error getting favorites:",e),[]}}static async isFavorite(e){try{const a=(await this.openDB()).transaction([d],"readonly").objectStore(d);return new Promise((s,n)=>{const o=a.get(e);o.onsuccess=()=>s(!!o.result),o.onerror=()=>n(o.error)})}catch(t){return console.error("Error checking favorite:",t),!1}}static async searchFavorites(e){const t=await this.getAllFavorites(),r=e.toLowerCase();return t.filter(a=>a.name.toLowerCase().includes(r)||a.description.toLowerCase().includes(r))}static async sortFavorites(e="newest"){const t=await this.getAllFavorites();switch(e){case"newest":return t.sort((r,a)=>new Date(a.savedAt)-new Date(r.savedAt));case"oldest":return t.sort((r,a)=>new Date(r.savedAt)-new Date(a.savedAt));case"name":return t.sort((r,a)=>r.name.localeCompare(a.name));default:return t}}static async addPendingStory(e){try{const a=(await this.openDB()).transaction([u],"readwrite").objectStore(u),s={...e,timestamp:new Date().toISOString(),synced:!1};return new Promise((n,o)=>{const c=a.add(s);c.onsuccess=()=>n(c.result),c.onerror=()=>o(c.error)})}catch(t){throw console.error("Error adding pending story:",t),t}}static async getPendingStories(){try{const r=(await this.openDB()).transaction([u],"readonly").objectStore(u);return new Promise((a,s)=>{const n=r.getAll();n.onsuccess=()=>a(n.result),n.onerror=()=>s(n.error)})}catch(e){return console.error("Error getting pending stories:",e),[]}}static async deletePendingStory(e){try{const a=(await this.openDB()).transaction([u],"readwrite").objectStore(u);return new Promise((s,n)=>{const o=a.delete(e);o.onsuccess=()=>s(!0),o.onerror=()=>n(o.error)})}catch(t){return console.error("Error deleting pending story:",t),!1}}static async clearPendingStories(){try{const r=(await this.openDB()).transaction([u],"readwrite").objectStore(u);return new Promise((a,s)=>{const n=r.clear();n.onsuccess=()=>a(!0),n.onerror=()=>s(n.error)})}catch(e){return console.error("Error clearing pending stories:",e),!1}}}const p={VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",API_BASE_URL:"https://story-api.dicoding.dev/v1",_urlBase64ToUint8Array(i){const e="=".repeat((4-i.length%4)%4),t=(i+e).replace(/-/g,"+").replace(/_/g,"/"),r=window.atob(t),a=new Uint8Array(r.length);for(let s=0;s<r.length;++s)a[s]=r.charCodeAt(s);return a},async requestPermission(){if(!("Notification"in window))return console.warn("This browser does not support notifications"),!1;try{const i=await Notification.requestPermission();return console.log("Notification permission:",i),i==="granted"}catch(i){return console.error("Error requesting notification permission:",i),!1}},async isSubscribed(){if(!("serviceWorker"in navigator)||!("PushManager"in window))return!1;try{return await(await navigator.serviceWorker.ready).pushManager.getSubscription()!==null}catch(i){return console.error("Error checking subscription:",i),!1}},async subscribe(){if(!("serviceWorker"in navigator)||!("PushManager"in window))throw new Error("Push not supported");const i=v.getToken();if(!i)throw new Error("Token tidak ditemukan");const e=await navigator.serviceWorker.ready;let t=await e.pushManager.getSubscription();if(!t){const s=this._urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY);t=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:s})}const r=t.toJSON(),a=await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({endpoint:r.endpoint,keys:{p256dh:r.keys.p256dh,auth:r.keys.auth}})});if(!a.ok){const s=await a.json();throw new Error(s.message)}return t},async unsubscribe(){if(!("serviceWorker"in navigator)||!("PushManager"in window))return!1;const i=v.getToken();if(!i)return console.warn("No auth token - cannot unsubscribe from server"),!1;try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(!t)return console.log("No active subscription to unsubscribe"),!0;console.log("Unsubscribing from push notifications...");const a=t.toJSON().endpoint;console.log("Endpoint to unsubscribe:",a);const s=await fetch(`${this.API_BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({endpoint:a})});if(!s.ok){const c=await s.json();throw console.error("Server unsubscribe error:",c),new Error(c.message||"Failed to unsubscribe from server")}const n=await s.json();console.log("✅ Server unsubscribe successful:",n);const o=await t.unsubscribe();return console.log("✅ Local unsubscribe successful:",o),o}catch(e){console.error("❌ Error unsubscribing:",e);try{const r=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(r){const a=await r.unsubscribe();return console.log("⚠️ Local unsubscribe fallback successful:",a),a}}catch(t){console.error("❌ Local unsubscribe also failed:",t)}throw e}},async showTestNotification(){"serviceWorker"in navigator&&await(await navigator.serviceWorker.ready).showNotification("MyStoryDay",{body:"Push notifications berhasil diaktifkan! 🎉",icon:"/mystoryday/icon-192x192.png",badge:"/mystoryday/icon-96x96.png",vibrate:[200,100,200],data:{url:"/mystoryday/#/stories"}})},async showFavoriteNotification(i){if(!(!("serviceWorker"in navigator)||Notification.permission!=="granted"))try{await(await navigator.serviceWorker.ready).showNotification("Cerita Ditambahkan ke Favorit! ❤️",{body:`"${i}" telah disimpan ke favorit Anda`,icon:"/mystoryday/icon-192x192.png",badge:"/mystoryday/icon-96x96.png",vibrate:[200,100,200],data:{url:"/mystoryday/#/favorites"},actions:[{action:"view",title:"Lihat Favorit"},{action:"close",title:"Tutup"}]})}catch(t){console.error("Error showing favorite notification:",t)}},async showUnfavoriteNotification(i){if(!(!("serviceWorker"in navigator)||Notification.permission!=="granted"))try{await(await navigator.serviceWorker.ready).showNotification("Cerita Dihapus dari Favorit",{body:`"${i}" telah dihapus dari favorit Anda`,icon:"/mystoryday/icon-192x192.png",badge:"/mystoryday/icon-96x96.png",vibrate:[200],data:{url:"/mystoryday/#/favorites"}})}catch(t){console.error("Error showing unfavorite notification:",t)}}},C={_stories:[],_map:null,_markers:[],_currentLayer:"streets",_favoriteIds:new Set,async render(){return`
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
    `},async afterRender(){await this._loadFavoriteIds(),await this._loadStories(),this._initMap(),this._setupLayerControls()},async _loadFavoriteIds(){try{const i=await g.getAllFavorites();this._favoriteIds=new Set(i.map(e=>e.id))}catch(i){console.error("Error loading favorite IDs:",i)}},async _loadStories(){const i=document.getElementById("storiesGrid"),e=document.getElementById("storiesAlert");try{const t=await w.getStories();if(this._stories=t.listStory,this._stories.length===0){i.innerHTML='<p style="text-align: center;">Belum ada cerita. Tambahkan cerita pertama Anda!</p>';return}i.innerHTML=this._stories.map((s,n)=>{const o=this._favoriteIds.has(s.id);return`
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
        `}).join("");const r=document.getElementById("mapDescription"),a=this._stories.filter(s=>s.lat&&s.lon).length;r.textContent=`Peta interaktif menampilkan lokasi ${a} cerita. Klik pada kartu cerita di bawah untuk melihat lokasinya di peta.`,this._setupStoryCardHandlers(),this._setupFavoriteButtons()}catch(t){e.innerHTML=`<div class="alert alert-error">${t.message}</div>`,i.innerHTML=""}},_setupFavoriteButtons(){document.querySelectorAll(".favorite-btn").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const r=e.dataset.id;await this._toggleFavorite(r,e)})})},async _toggleFavorite(i,e){const t=document.getElementById("storiesAlert"),r=this._stories.find(a=>a.id===i);if(r)try{this._favoriteIds.has(i)?(await g.removeFavorite(i),this._favoriteIds.delete(i),e.textContent="🤍",e.classList.remove("is-favorite"),e.setAttribute("aria-label","Tambah ke favorit"),t.innerHTML='<div class="alert alert-success">Dihapus dari favorit</div>'):(await g.addFavorite(r),this._favoriteIds.add(i),e.textContent="❤️",e.classList.add("is-favorite"),e.setAttribute("aria-label","Hapus dari favorit"),t.innerHTML='<div class="alert alert-success">Ditambahkan ke favorit</div>'),setTimeout(()=>{t.innerHTML=""},2e3)}catch(a){t.innerHTML=`<div class="alert alert-error">Error: ${a.message}</div>`}},_initMap(){this._map&&(this._map.remove(),this._map=null,this._markers=[]),this._map=L.map("map").setView([-6.2088,106.8456],5),this._addStreetsLayer(),this._addMarkers()},_addStreetsLayer(){this._currentTileLayer&&this._map.removeLayer(this._currentTileLayer),this._currentTileLayer=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this._map)},_addSatelliteLayer(){this._currentTileLayer&&this._map.removeLayer(this._currentTileLayer),this._currentTileLayer=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles © Esri"}).addTo(this._map)},_setupLayerControls(){const i=document.getElementById("streetsLayer"),e=document.getElementById("satelliteLayer");i.addEventListener("click",()=>{this._addStreetsLayer(),i.classList.add("active"),e.classList.remove("active")}),e.addEventListener("click",()=>{this._addSatelliteLayer(),e.classList.add("active"),i.classList.remove("active")}),i.classList.add("active")},_addMarkers(){this._markers.forEach(i=>this._map.removeLayer(i)),this._markers=[],this._stories.forEach((i,e)=>{if(i.lat&&i.lon){const t=L.marker([i.lat,i.lon],{title:i.name}).bindPopup(`
          <div style="text-align: center;">
            <img src="${i.photoUrl}" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem;" alt="Foto cerita: ${i.name}">
            <h3 style="margin: 0.5rem 0; font-size: 1.1rem;">${i.name}</h3>
            <p style="margin: 0.3rem 0; color: #7f8c8d;">${i.description.substring(0,100)}${i.description.length>100?"...":""}</p>
          </div>
        `).addTo(this._map);t.storyIndex=e,this._markers.push(t)}})},_setupStoryCardHandlers(){document.querySelectorAll(".story-card-button").forEach(e=>{const t=e.closest(".story-card"),r=parseInt(t.dataset.index),a=()=>{const s=this._stories[r];if(s.lat&&s.lon){this._map.setView([s.lat,s.lon],13);const n=this._markers.find(o=>o.storyIndex===r);n&&n.openPopup()}document.querySelectorAll(".story-card").forEach(n=>n.classList.remove("highlighted")),t.classList.add("highlighted")};e.addEventListener("click",a)})}},M={_map:null,_marker:null,_selectedLocation:null,_selectedFile:null,_stream:null,async render(){return`
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
              <legend class="form-legend"><h2 style="font-size: 1.2rem; margin: 0;">Informasi Cerita</h2></legend>
              
              <div class="form-group">
                <label for="description">Deskripsi Cerita</label>
                <textarea 
                  id="description" 
                  name="description" 
                  required
                  placeholder="Ceritakan pengalaman Anda..."

                ></textarea>
              </div>
            </fieldset>
            
            <!-- Section 2: Foto -->
            <fieldset class="form-fieldset">
              <legend class="form-legend"><h2 style="font-size: 1.2rem; margin: 0;">Foto Cerita</h2></legend>
              
            <div class="form-group">
              <label for="photo">
               <h3 style="font-size: 1rem; margin: 0 0 0.5rem 0;">Upload dari File</h3>
              </label>

              <p id="photoHelpText" class="help-text">
                Format: JPG, PNG. Maksimal 5MB
              </p>

              <div class="file-upload">
                <label for="photo" class="file-upload-label">
                  📷 Klik untuk upload foto
                </label>

                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  aria-describedby="photoHelpText"
                >
              </div>

              <div
                id="filePreview"
                class="file-preview"
                aria-live="polite"
              ></div>
            </div>

              
              <div class="form-group" id="cameraSection">
                 <h3 style="font-size: 1rem; margin: 0 0 0.5rem 0;">Atau Gunakan Kamera</h3>
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
             <legend class="form-legend"><h2 style="font-size: 1.2rem; margin: 0;">Lokasi Cerita</h2></legend>
              
              <div class="form-group">
                <h3 style="font-size: 1rem; margin: 0 0 0.5rem 0;">Pilih Lokasi di Peta (Klik pada peta)</h3>
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
    `},async afterRender(){this._initMap(),this._setupFileUpload(),this._setupCamera(),this._setupForm(),this._setupConnectionMonitor(),this._checkPendingStories()},_setupConnectionMonitor(){const i=document.getElementById("connectionStatus");window.addEventListener("online",()=>{i.innerHTML='<span class="status-online">🟢 Online</span>',this._syncPendingStories()}),window.addEventListener("offline",()=>{i.innerHTML='<span class="status-offline">🔴 Offline - Cerita akan dikirim saat online</span>'})},async _checkPendingStories(){try{const i=await g.getPendingStories(),e=document.getElementById("pendingStoriesStatus");if(i.length>0&&(e.style.display="block",e.innerHTML=`
          <div class="alert alert-warning">
            📤 ${i.length} cerita menunggu untuk dikirim
            ${navigator.onLine?'<button id="syncNowBtn" class="btn-secondary" style="margin-left: 1rem;">Kirim Sekarang</button>':""}
          </div>
        `,navigator.onLine)){const t=document.getElementById("syncNowBtn");t&&t.addEventListener("click",()=>this._syncPendingStories())}}catch(i){console.error("Error checking pending stories:",i)}},async _syncPendingStories(){const i=document.getElementById("pendingStoriesStatus"),e=document.getElementById("addStoryAlert");try{const t=await g.getPendingStories();if(t.length===0)return;i.innerHTML='<div class="alert alert-success">⏳ Mengirim cerita yang tertunda...</div>';let r=0;for(const s of t)try{await w.addStory(s.description,s.photo,s.lat,s.lon),await g.deletePendingStory(s.id),r++}catch(n){console.error("Error syncing story:",n)}if(r>0&&(i.innerHTML=`<div class="alert alert-success">✅ ${r} cerita berhasil dikirim!</div>`,setTimeout(()=>{i.style.display="none"},3e3)),!("serviceWorker"in navigator)){console.warn("Service Worker not supported");return}const a=await navigator.serviceWorker.ready;if(!a){console.warn("SW registration not ready");return}if(!("sync"in a)){console.warn("Background Sync not supported");return}await a.sync.register("sync-stories")}catch(t){console.error("Error syncing stories:",t),e.innerHTML=`<div class="alert alert-error">Error syncing stories: ${t.message}</div>`}},_initMap(){this._map&&(this._map.remove(),this._map=null,this._markers=[]),this._map=L.map("addStoryMap").setView([-6.2088,106.8456],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this._map),this._map.on("click",i=>{const{lat:e,lng:t}=i.latlng;this._marker&&this._map.removeLayer(this._marker),this._marker=L.marker([e,t]).addTo(this._map),this._selectedLocation={lat:e,lon:t},document.getElementById("coordsDisplay").textContent=`${e.toFixed(6)}, ${t.toFixed(6)}`})},_setupFileUpload(){const i=document.getElementById("photo"),e=document.getElementById("filePreview"),t=document.getElementById("cameraSection");i.addEventListener("change",r=>{const a=r.target.files[0];if(a){this._selectedFile=a;const s=new FileReader;s.onload=n=>{e.innerHTML=`
            <img src="${n.target.result}" alt="Preview foto yang dipilih" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
            <p style="color: #27ae60; margin-top: 0.5rem;">✓ Foto berhasil dipilih</p>
          `},s.readAsDataURL(a),t.style.display="none"}})},_setupCamera(){const i=document.getElementById("startCamera"),e=document.getElementById("capturePhoto"),t=document.getElementById("stopCamera"),r=document.getElementById("videoPreview"),a=document.querySelector(".camera-buttons"),s=document.getElementById("photoCanvas"),n=document.getElementById("filePreview"),o=document.getElementById("photo");i.addEventListener("click",async()=>{try{this._stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1}),r.srcObject=this._stream,r.style.display="block",a.style.display="flex",i.style.display="none",i.setAttribute("aria-expanded","true")}catch(c){alert("Tidak dapat mengakses kamera: "+c.message)}}),e.addEventListener("click",()=>{s.width=r.videoWidth,s.height=r.videoHeight,s.getContext("2d").drawImage(r,0,0),s.toBlob(A=>{this._selectedFile=new File([A],"camera-photo.jpg",{type:"image/jpeg"}),n.innerHTML=`
          <img src="${s.toDataURL()}" alt="Foto yang diambil dari kamera" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
          <p style="color: #27ae60; margin-top: 0.5rem;">✓ Foto berhasil diambil dari kamera</p>
        `;const S=new DataTransfer;S.items.add(this._selectedFile),o.files=S.files,this._stopCamera()},"image/jpeg",.95)}),t.addEventListener("click",()=>{this._stopCamera()})},_stopCamera(){this._stream&&(this._stream.getTracks().forEach(r=>r.stop()),this._stream=null);const i=document.getElementById("videoPreview"),e=document.querySelector(".camera-buttons"),t=document.getElementById("startCamera");i.style.display="none",e.style.display="none",t.style.display="block",t.setAttribute("aria-expanded","false")},_setupForm(){const i=document.getElementById("addStoryForm"),e=document.getElementById("addStoryAlert");i.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("description").value;if(!this._selectedFile){e.innerHTML='<div class="alert alert-error">Silakan pilih foto atau ambil foto menggunakan kamera terlebih dahulu</div>';return}if(!this._selectedLocation){e.innerHTML='<div class="alert alert-error">Silakan pilih lokasi pada peta</div>';return}if(!navigator.onLine){await this._saveForLater(r);return}try{e.innerHTML='<div class="alert alert-success">Mengunggah cerita...</div>',await w.addStory(r,this._selectedFile,this._selectedLocation.lat,this._selectedLocation.lon),e.innerHTML='<div class="alert alert-success">Cerita berhasil ditambahkan! Redirecting...</div>',this._stopCamera(),setTimeout(()=>{window.location.hash="#/stories"},1500)}catch(a){a.message.includes("network")||a.message.includes("fetch")?await this._saveForLater(r):e.innerHTML=`<div class="alert alert-error">${a.message}</div>`}})},async _saveForLater(i){const e=document.getElementById("addStoryAlert");try{if(await g.addPendingStory({description:i,photo:this._selectedFile,lat:this._selectedLocation.lat,lon:this._selectedLocation.lon}),e.innerHTML='<div class="alert alert-success">💾 Cerita disimpan! Akan dikirim otomatis saat online.</div>',!("serviceWorker"in navigator)){console.warn("Service Worker not supported");return}const t=await navigator.serviceWorker.ready;if(!t){console.warn("SW registration not ready");return}if(!("sync"in t)){console.warn("Background Sync not supported");return}await t.sync.register("sync-stories"),setTimeout(()=>{window.location.hash="#/stories"},2e3)}catch(t){e.innerHTML=`<div class="alert alert-error">Error menyimpan cerita: ${t.message}</div>`}}},x={_favorites:[],_filteredFavorites:[],async render(){return`
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
    `},async afterRender(){await this._loadFavorites(),this._setupSearchAndSort()},async _loadFavorites(){const i=document.getElementById("favoritesGrid"),e=document.getElementById("emptyState"),t=document.getElementById("favoritesAlert");try{if(this._favorites=await g.getAllFavorites(),this._filteredFavorites=[...this._favorites],this._favorites.length===0){i.style.display="none",e.style.display="flex";return}this._renderFavorites()}catch(r){t.innerHTML=`<div class="alert alert-error">Error loading favorites: ${r.message}</div>`,i.innerHTML=""}},_renderFavorites(){const i=document.getElementById("favoritesGrid"),e=document.getElementById("emptyState");if(this._filteredFavorites.length===0){i.innerHTML=`
        <div class="no-results">
          <p>Tidak ada cerita yang sesuai dengan pencarian</p>
        </div>
      `;return}i.style.display="grid",e.style.display="none",i.innerHTML=this._filteredFavorites.map(t=>`
      <article class="favorite-card">
        <button class="remove-favorite" data-id="${t.id}" aria-label="Hapus dari favorit">
          ❌
        </button>
        <img src="${t.photoUrl}" alt="Foto cerita: ${t.name}">
        <div class="favorite-card-content">
          <h2 style="font-size: 1.25rem; margin: 0 0 0.5rem 0;">${t.name}</h2>
          <p>${t.description}</p>
          <div class="favorite-meta">
            <span>📅 Dibuat: ${new Date(t.createdAt).toLocaleDateString("id-ID")}</span>
            <span>💾 Disimpan: ${new Date(t.savedAt).toLocaleDateString("id-ID")}</span>
          </div>
        </div>
      </article>
    `).join(""),this._setupRemoveButtons()},_setupRemoveButtons(){document.querySelectorAll(".remove-favorite").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const r=e.dataset.id;await this._removeFavorite(r)})})},async _removeFavorite(i){const e=document.getElementById("favoritesAlert");try{const t=this._favorites.find(a=>a.id===i);if(await g.removeFavorite(i)){this._favorites=this._favorites.filter(s=>s.id!==i),this._filteredFavorites=this._filteredFavorites.filter(s=>s.id!==i),this._renderFavorites(),e.innerHTML='<div class="alert alert-success">Cerita dihapus dari favorit</div>';const a=this._favorites.find(s=>s.id===i);if(a!=null&&a.name&&(p!=null&&p.showUnfavoriteNotification))try{await p.showUnfavoriteNotification(a.name)}catch{}setTimeout(()=>{e.innerHTML=""},3e3)}}catch(t){e.innerHTML=`<div class="alert alert-error">Error menghapus favorit: ${t.message}</div>`}},_setupSearchAndSort(){const i=document.getElementById("searchInput"),e=document.getElementById("sortSelect");i.addEventListener("input",t=>{const r=t.target.value.toLowerCase().trim();r===""?this._filteredFavorites=[...this._favorites]:this._filteredFavorites=this._favorites.filter(a=>a.name.toLowerCase().includes(r)||a.description.toLowerCase().includes(r)),this._renderFavorites()}),e.addEventListener("change",t=>{const r=t.target.value;this._sortFavorites(r)})},_sortFavorites(i){switch(i){case"newest":this._filteredFavorites.sort((e,t)=>new Date(t.savedAt)-new Date(e.savedAt));break;case"oldest":this._filteredFavorites.sort((e,t)=>new Date(e.savedAt)-new Date(t.savedAt));break;case"name":this._filteredFavorites.sort((e,t)=>e.name.localeCompare(t.name));break}this._renderFavorites()}},N={"/":B,"/login":B,"/register":P,"/stories":C,"/add-story":M,"/favorites":x},T=()=>{const i=window.location.hash.slice(1).toLowerCase()||"/";return i===""?"/":i};var m,k,_,h;class ${constructor({content:e,drawerButton:t,navigationDrawer:r}){y(this,m,null);y(this,k,null);y(this,_,null);y(this,h,null);f(this,m,e),f(this,k,t),f(this,_,r),this._initialAppShell()}_initialAppShell(){this._initializeNavigation(),this._initializeScrollEffects(),this._setupAuthUI(),this._setupPWAFeatures()}_setupPWAFeatures(){this._setupInstallPrompt(),this._setupPushNotifications()}_setupInstallPrompt(){const e=document.getElementById("installBanner"),t=document.getElementById("installButton"),r=document.getElementById("dismissBanner");window.addEventListener("beforeinstallprompt",a=>{console.log("beforeinstallprompt fired"),a.preventDefault(),f(this,h,a);const s=localStorage.getItem("installBannerDismissed"),n=localStorage.getItem("appInstalled");!s&&!n&&(e.style.display="block")}),t&&t.addEventListener("click",async()=>{if(!l(this,h))return;l(this,h).prompt();const{outcome:a}=await l(this,h).userChoice;console.log(`User response to install prompt: ${a}`),a==="accepted"&&localStorage.setItem("appInstalled","true"),f(this,h,null),e.style.display="none"}),r&&r.addEventListener("click",()=>{e.style.display="none",localStorage.setItem("installBannerDismissed","true"),setTimeout(()=>{localStorage.removeItem("installBannerDismissed")},7*24*60*60*1e3)}),window.addEventListener("appinstalled",()=>{console.log("PWA installed successfully"),localStorage.setItem("appInstalled","true"),e.style.display="none"})}async _setupPushNotifications(){const e=document.getElementById("notificationToggle");if(document.getElementById("notificationIcon"),!e||!("serviceWorker"in navigator)||!("PushManager"in window))return;const t=await p.isSubscribed();this._updateNotificationIcon(t),e.addEventListener("click",async()=>{try{if(e.disabled=!0,await p.isSubscribed())if(console.log("🔕 Unsubscribing..."),await p.unsubscribe())this._updateNotificationIcon(!1),this._showNotificationAlert("Push notifications dinonaktifkan","success");else throw new Error("Failed to unsubscribe");else{if(console.log("🔔 Subscribing..."),!await p.requestPermission()){this._showNotificationAlert("Permission ditolak untuk notifications. Silakan aktifkan di pengaturan browser.","error"),e.disabled=!1;return}await p.subscribe(),this._updateNotificationIcon(!0),this._showNotificationAlert("✅ Push notifications berhasil diaktifkan!","success"),setTimeout(()=>{p.showTestNotification()},1e3)}}catch(r){console.error("Error toggling push notifications:",r);let a="Error mengatur notifications";r.message.includes("token")?a="Silakan login terlebih dahulu":r.message.includes("subscribe")&&(a="Gagal mendaftar notifikasi. Silakan coba lagi."),this._showNotificationAlert(a,"error")}finally{e.disabled=!1}})}_updateNotificationIcon(e){const t=document.getElementById("notificationIcon"),r=document.getElementById("notificationToggle");t&&(t.textContent=e?"🔔":"🔕"),r&&(r.setAttribute("aria-label",e?"Nonaktifkan push notifications":"Aktifkan push notifications"),r.setAttribute("title",e?"Push notifications aktif - Klik untuk nonaktifkan":"Push notifications nonaktif - Klik untuk aktifkan"),e?r.style.background="rgba(39, 174, 96, 0.1)":r.style.background="transparent")}_showNotificationAlert(e,t){const r=document.createElement("div");r.className=`notification-alert notification-alert-${t}`,r.textContent=e,r.style.cssText=`
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${t==="success"?"#27ae60":"#e74c3c"};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `,document.body.appendChild(r),setTimeout(()=>{r.style.animation="slideOut 0.3s ease-out",setTimeout(()=>{document.body.removeChild(r)},300)},4e3)}_initializeNavigation(){const e=document.getElementById("menuToggle"),t=document.getElementById("navLinks");e&&t&&(e.addEventListener("click",()=>{e.classList.toggle("active"),t.classList.toggle("active")}),document.querySelectorAll(".nav-links a").forEach(s=>{s.addEventListener("click",()=>{e.classList.remove("active"),t.classList.remove("active")})}));const r=document.getElementById("logoutBtn");r&&r.addEventListener("click",()=>{v.logout(),window.location.hash="#/login",this._setupAuthUI()})}_initializeScrollEffects(){const e=document.getElementById("navbar");e&&window.addEventListener("scroll",()=>{window.pageYOffset>100?e.classList.add("scrolled"):e.classList.remove("scrolled")})}_setupAuthUI(){const e=v.isLoggedIn(),t=document.getElementById("loginLink"),r=document.getElementById("registerLink"),a=document.getElementById("storiesLinkItem"),s=document.getElementById("favoritesLinkItem"),n=document.getElementById("addStoryLinkItem"),o=document.getElementById("notificationLinkItem"),c=document.getElementById("logoutLinkItem");e?(t&&(t.parentElement.style.display="none"),r&&(r.parentElement.style.display="none"),a&&(a.style.display="block"),s&&(s.style.display="block"),n&&(n.style.display="block"),o&&(o.style.display="block"),c&&(c.style.display="block")):(t&&(t.parentElement.style.display="block"),r&&(r.parentElement.style.display="block"),a&&(a.style.display="none"),s&&(s.style.display="none"),n&&(n.style.display="none"),o&&(o.style.display="none"),c&&(c.style.display="none"))}_checkAuth(){const e=T(),t=v.isLoggedIn();return["/stories","/add-story","/favorites"].includes(e)&&!t?(window.location.hash="#/login",!1):!0}init(){this._initializeBackToTop(),this.renderPage(),window.addEventListener("hashchange",()=>{this.renderPage()}),window.addEventListener("popstate",()=>{this.renderPage()})}_initializeBackToTop(){const e=document.getElementById("backToTop");e&&(window.addEventListener("scroll",()=>{window.pageYOffset>300?e.classList.add("show"):e.classList.remove("show")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}),e.addEventListener("keypress",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}))}))}async renderPage(){if(!this._checkAuth())return;const e=T(),t=N[e];if(!t){this._showError("Halaman tidak ditemukan");return}if(l(this,m))try{this._showLoading(),this._setupAuthUI(),document.startViewTransition?await document.startViewTransition(async()=>{l(this,m).innerHTML=await t.render(),await t.afterRender()}).finished:(l(this,m).innerHTML=await t.render(),l(this,m).classList.add("page-enter"),await t.afterRender()),window.scrollTo(0,0),this._hideLoading()}catch(r){console.error("Error rendering page:",r),this._showError(r.message||"Terjadi kesalahan saat memuat halaman")}}_showLoading(){const e=document.getElementById("loadingSpinner");e&&(e.style.display="flex")}_hideLoading(){const e=document.getElementById("loadingSpinner");e&&(e.style.display="none")}_showError(e="Terjadi kesalahan"){this._hideLoading(),l(this,m)&&(l(this,m).innerHTML=`
        <div class="error-message">
          <h2>⚠️ Oops!</h2>
          <p>${e}</p>
          <a href="#/" class="btn-primary">Kembali ke Home</a>
        </div>
      `)}destroy(){window.removeEventListener("hashchange",this.renderPage),window.removeEventListener("popstate",this.renderPage)}}m=new WeakMap,k=new WeakMap,_=new WeakMap,h=new WeakMap;document.addEventListener("DOMContentLoaded",()=>{new $({content:document.getElementById("mainContent"),drawerButton:document.getElementById("menuToggle"),navigationDrawer:document.getElementById("navLinks")}).init()});async function H(){return"serviceWorker"in navigator?await navigator.serviceWorker.getRegistration()?"✓ PWA Active":"✗ PWA Not Registered":"✗ PWA Not Supported"}window.addEventListener("load",()=>{H().then(i=>{const e=document.getElementById("pwa-status");e&&(e.textContent=i)})});
