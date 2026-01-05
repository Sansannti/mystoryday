var E=r=>{throw TypeError(r)};var I=(r,e,t)=>e.has(r)||E("Cannot "+t);var l=(r,e,t)=>(I(r,e,"read from private field"),t?t.call(r):e.get(r)),f=(r,e,t)=>e.has(r)?E("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),v=(r,e,t,i)=>(I(r,e,"write to private field"),i?i.call(r,t):e.set(r,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=t(a);fetch(a.href,s)}})();const b="https://story-api.dicoding.dev/v1";class w{static async register(e,t,i){const a=await fetch(`${b}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:i})}),s=await a.json();if(!a.ok)throw new Error(s.message||"Registration failed");return s}static async login(e,t){const i=await fetch(`${b}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),a=await i.json();if(!i.ok)throw new Error(a.message||"Login failed");return a}static async getStories(){const e=localStorage.getItem("token");if(!e)throw new Error("No token found. Please login first.");const t=await fetch(`${b}/stories`,{headers:{Authorization:`Bearer ${e}`}}),i=await t.json();if(!t.ok)throw new Error(i.message||"Failed to fetch stories");return i}static async addStory(e,t,i,a){const s=localStorage.getItem("token");if(!s)throw new Error("No token found. Please login first.");const o=new FormData;o.append("description",e),o.append("photo",t),i&&a&&(o.append("lat",i),o.append("lon",a));const n=await fetch(`${b}/stories`,{method:"POST",headers:{Authorization:`Bearer ${s}`},body:o}),c=await n.json();if(!n.ok)throw new Error(c.message||"Failed to add story");return c}}class y{static saveToken(e){localStorage.setItem("token",e)}static getToken(){return localStorage.getItem("token")}static removeToken(){localStorage.removeItem("token")}static isLoggedIn(){return!!this.getToken()}static saveUserInfo(e,t){localStorage.setItem("userName",e),localStorage.setItem("userId",t)}static getUserName(){return localStorage.getItem("userName")}static getUserId(){return localStorage.getItem("userId")}static clearUserInfo(){localStorage.removeItem("userName"),localStorage.removeItem("userId")}static logout(){this.removeToken(),this.clearUserInfo()}}const B={async render(){return`
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
    `},async afterRender(){const r=document.getElementById("loginForm"),e=document.getElementById("loginAlert");r.addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("email").value,a=document.getElementById("password").value;try{e.innerHTML='<div class="alert alert-success">Loading...</div>';const s=await w.login(i,a);y.saveToken(s.loginResult.token),y.saveUserInfo(s.loginResult.name,s.loginResult.userId),e.innerHTML='<div class="alert alert-success">Login berhasil! Redirecting...</div>',setTimeout(()=>{window.location.hash="#/stories"},1e3)}catch(s){e.innerHTML=`<div class="alert alert-error">${s.message}</div>`}})}},F={async render(){return`
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
    `},async afterRender(){const r=document.getElementById("registerForm"),e=document.getElementById("registerAlert");r.addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("name").value,a=document.getElementById("email").value,s=document.getElementById("password").value;if(s.length<8){e.innerHTML='<div class="alert alert-error">Password minimal 8 karakter</div>';return}try{e.innerHTML='<div class="alert alert-success">Loading...</div>',await w.register(i,a,s),e.innerHTML='<div class="alert alert-success">Registrasi berhasil! Redirecting to login...</div>',setTimeout(()=>{window.location.hash="#/login"},1500)}catch(o){e.innerHTML=`<div class="alert alert-error">${o.message}</div>`}})}},D="MyStoryDayDB",C=1,d="favorites",u="pendingStories";class p{static async openDB(){return new Promise((e,t)=>{const i=indexedDB.open(D,C);i.onerror=()=>{t(new Error("Failed to open database"))},i.onsuccess=()=>{e(i.result)},i.onupgradeneeded=a=>{const s=a.target.result;s.objectStoreNames.contains(d)||s.createObjectStore(d,{keyPath:"id"}).createIndex("createdAt","createdAt",{unique:!1}),s.objectStoreNames.contains(u)||s.createObjectStore(u,{keyPath:"id",autoIncrement:!0}).createIndex("timestamp","timestamp",{unique:!1})}})}static async addFavorite(e){try{const a=(await this.openDB()).transaction([d],"readwrite").objectStore(d),s={...e,savedAt:new Date().toISOString()};return await a.add(s),!0}catch(t){return console.error("Error adding favorite:",t),!1}}static async removeFavorite(e){try{return await(await this.openDB()).transaction([d],"readwrite").objectStore(d).delete(e),!0}catch(t){return console.error("Error removing favorite:",t),!1}}static async getAllFavorites(){try{const i=(await this.openDB()).transaction([d],"readonly").objectStore(d);return new Promise((a,s)=>{const o=i.getAll();o.onsuccess=()=>a(o.result),o.onerror=()=>s(o.error)})}catch(e){return console.error("Error getting favorites:",e),[]}}static async isFavorite(e){try{const a=(await this.openDB()).transaction([d],"readonly").objectStore(d);return new Promise((s,o)=>{const n=a.get(e);n.onsuccess=()=>s(!!n.result),n.onerror=()=>o(n.error)})}catch(t){return console.error("Error checking favorite:",t),!1}}static async searchFavorites(e){const t=await this.getAllFavorites(),i=e.toLowerCase();return t.filter(a=>a.name.toLowerCase().includes(i)||a.description.toLowerCase().includes(i))}static async sortFavorites(e="newest"){const t=await this.getAllFavorites();switch(e){case"newest":return t.sort((i,a)=>new Date(a.savedAt)-new Date(i.savedAt));case"oldest":return t.sort((i,a)=>new Date(i.savedAt)-new Date(a.savedAt));case"name":return t.sort((i,a)=>i.name.localeCompare(a.name));default:return t}}static async addPendingStory(e){try{const a=(await this.openDB()).transaction([u],"readwrite").objectStore(u),s={...e,timestamp:new Date().toISOString(),synced:!1};return new Promise((o,n)=>{const c=a.add(s);c.onsuccess=()=>o(c.result),c.onerror=()=>n(c.error)})}catch(t){throw console.error("Error adding pending story:",t),t}}static async getPendingStories(){try{const i=(await this.openDB()).transaction([u],"readonly").objectStore(u);return new Promise((a,s)=>{const o=i.getAll();o.onsuccess=()=>a(o.result),o.onerror=()=>s(o.error)})}catch(e){return console.error("Error getting pending stories:",e),[]}}static async deletePendingStory(e){try{const a=(await this.openDB()).transaction([u],"readwrite").objectStore(u);return new Promise((s,o)=>{const n=a.delete(e);n.onsuccess=()=>s(!0),n.onerror=()=>o(n.error)})}catch(t){return console.error("Error deleting pending story:",t),!1}}static async clearPendingStories(){try{const i=(await this.openDB()).transaction([u],"readwrite").objectStore(u);return new Promise((a,s)=>{const o=i.clear();o.onsuccess=()=>a(!0),o.onerror=()=>s(o.error)})}catch(e){return console.error("Error clearing pending stories:",e),!1}}}const M="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",T="https://story-api.dicoding.dev/v1";class g{static async requestPermission(){try{return await Notification.requestPermission()==="granted"}catch(e){return console.error("Error requesting notification permission:",e),!1}}static async subscribe(){try{const e=await navigator.serviceWorker.ready;let t=await e.pushManager.getSubscription();return t||(t=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this._urlBase64ToUint8Array(M)}),console.log("Push subscription created:",t)),await this._sendSubscriptionToServer(t),t}catch(e){throw console.error("Error subscribing to push notifications:",e),e}}static async _sendSubscriptionToServer(e){try{const t=localStorage.getItem("token");if(!t){console.warn("No auth token found, skipping server subscription");return}const i=e.toJSON(),a=await fetch(`${T}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:i.endpoint,keys:{p256dh:i.keys.p256dh,auth:i.keys.auth}})});if(!a.ok){const o=await a.json();throw console.error("Failed to send subscription to server:",o),new Error("Server subscription failed")}const s=await a.json();console.log("Subscription sent to server successfully:",s)}catch(t){throw console.error("Error sending subscription to server:",t),t}}static async unsubscribe(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return t?(await this._removeSubscriptionFromServer(t),await t.unsubscribe(),console.log("Push subscription removed"),!0):!1}catch(e){return console.error("Error unsubscribing from push notifications:",e),!1}}static async _removeSubscriptionFromServer(e){try{const t=localStorage.getItem("token");if(!t){console.warn("No auth token found, skipping server unsubscription");return}const i=e.toJSON(),a=await fetch(`${T}/notifications/unsubscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:i.endpoint})});if(a.ok)console.log("Subscription removed from server successfully");else{const s=await a.json();console.error("Failed to remove subscription from server:",s)}}catch(t){console.error("Error removing subscription from server:",t)}}static async isSubscribed(){try{return!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch(e){return console.error("Error checking subscription status:",e),!1}}static async getSubscription(){try{return await(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch(e){return console.error("Error getting subscription:",e),null}}static _urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),i=(e+t).replace(/-/g,"+").replace(/_/g,"/"),a=window.atob(i),s=new Uint8Array(a.length);for(let o=0;o<a.length;++o)s[o]=a.charCodeAt(o);return s}static async showTestNotification(){Notification.permission!=="granted"&&await this.requestPermission(),Notification.permission==="granted"&&await(await navigator.serviceWorker.ready).showNotification("MyStoryDay",{body:"Push notification berhasil diaktifkan!",icon:"/mystoryday/icon-192x192.png",badge:"/mystoryday/icon-96x96.png",vibrate:[200,100,200],data:{url:"/mystoryday/#/stories"}})}static async showFavoriteNotification(e){if(Notification.permission==="granted")try{await(await navigator.serviceWorker.ready).showNotification("Favorit Ditambahkan! ❤️",{body:`"${e}" telah ditambahkan ke daftar favorit Anda`,icon:"/mystoryday/icon-192x192.png",badge:"/mystoryday/icon-96x96.png",vibrate:[200,100,200],tag:"favorite-added",data:{url:"/mystoryday/#/favorites"},actions:[{action:"view",title:"Lihat Favorit"},{action:"close",title:"Tutup"}]})}catch(t){console.error("Error showing favorite notification:",t)}}static async showUnfavoriteNotification(e){if(Notification.permission==="granted")try{await(await navigator.serviceWorker.ready).showNotification("Favorit Dihapus",{body:`"${e}" telah dihapus dari daftar favorit Anda`,icon:"/mystoryday/icon-192x192.png",badge:"/mystoryday/icon-96x96.png",vibrate:[100],tag:"favorite-removed",data:{url:"/mystoryday/#/favorites"}})}catch(t){console.error("Error showing unfavorite notification:",t)}}}const x={_stories:[],_map:null,_markers:[],_currentLayer:"streets",_favoriteIds:new Set,async render(){return`
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
    `},async afterRender(){await this._loadFavoriteIds(),await this._loadStories(),this._initMap(),this._setupLayerControls()},async _loadFavoriteIds(){try{const r=await p.getAllFavorites();this._favoriteIds=new Set(r.map(e=>e.id))}catch(r){console.error("Error loading favorite IDs:",r)}},async _loadStories(){const r=document.getElementById("storiesGrid"),e=document.getElementById("storiesAlert");try{const t=await w.getStories();if(this._stories=t.listStory,this._stories.length===0){r.innerHTML='<p style="text-align: center;">Belum ada cerita. Tambahkan cerita pertama Anda!</p>';return}r.innerHTML=this._stories.map((s,o)=>{const n=this._favoriteIds.has(s.id);return`
          <article class="story-card" data-index="${o}">
            <button class="favorite-btn ${n?"is-favorite":""}" 
                    data-id="${s.id}" 
                    aria-label="${n?"Hapus dari favorit":"Tambah ke favorit"}">
              ${n?"❤️":"🤍"}
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
        `}).join("");const i=document.getElementById("mapDescription"),a=this._stories.filter(s=>s.lat&&s.lon).length;i.textContent=`Peta interaktif menampilkan lokasi ${a} cerita. Klik pada kartu cerita di bawah untuk melihat lokasinya di peta.`,this._setupStoryCardHandlers(),this._setupFavoriteButtons()}catch(t){e.innerHTML=`<div class="alert alert-error">${t.message}</div>`,r.innerHTML=""}},_setupFavoriteButtons(){document.querySelectorAll(".favorite-btn").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const i=e.dataset.id;await this._toggleFavorite(i,e)})})},async _toggleFavorite(r,e){const t=document.getElementById("storiesAlert"),i=this._stories.find(a=>a.id===r);if(i)try{this._favoriteIds.has(r)?(await p.removeFavorite(r),this._favoriteIds.delete(r),e.textContent="🤍",e.classList.remove("is-favorite"),e.setAttribute("aria-label","Tambah ke favorit"),t.innerHTML='<div class="alert alert-success">Dihapus dari favorit</div>'):(await p.addFavorite(i),this._favoriteIds.add(r),e.textContent="❤️",e.classList.add("is-favorite"),e.setAttribute("aria-label","Hapus dari favorit"),t.innerHTML='<div class="alert alert-success">Ditambahkan ke favorit</div>',await g.showFavoriteNotification(i.name)),setTimeout(()=>{t.innerHTML=""},2e3)}catch(a){t.innerHTML=`<div class="alert alert-error">Error: ${a.message}</div>`}},_initMap(){this._map&&(this._map.remove(),this._map=null,this._markers=[]),this._map=L.map("map").setView([-6.2088,106.8456],5),this._addStreetsLayer(),this._addMarkers()},_addStreetsLayer(){this._currentTileLayer&&this._map.removeLayer(this._currentTileLayer),this._currentTileLayer=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this._map)},_addSatelliteLayer(){this._currentTileLayer&&this._map.removeLayer(this._currentTileLayer),this._currentTileLayer=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles © Esri"}).addTo(this._map)},_setupLayerControls(){const r=document.getElementById("streetsLayer"),e=document.getElementById("satelliteLayer");r.addEventListener("click",()=>{this._addStreetsLayer(),r.classList.add("active"),e.classList.remove("active")}),e.addEventListener("click",()=>{this._addSatelliteLayer(),e.classList.add("active"),r.classList.remove("active")}),r.classList.add("active")},_addMarkers(){this._markers.forEach(r=>this._map.removeLayer(r)),this._markers=[],this._stories.forEach((r,e)=>{if(r.lat&&r.lon){const t=L.marker([r.lat,r.lon],{title:r.name}).bindPopup(`
          <div style="text-align: center;">
            <img src="${r.photoUrl}" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem;" alt="Foto cerita: ${r.name}">
            <h3 style="margin: 0.5rem 0; font-size: 1.1rem;">${r.name}</h3>
            <p style="margin: 0.3rem 0; color: #7f8c8d;">${r.description.substring(0,100)}${r.description.length>100?"...":""}</p>
          </div>
        `).addTo(this._map);t.storyIndex=e,this._markers.push(t)}})},_setupStoryCardHandlers(){document.querySelectorAll(".story-card-button").forEach(e=>{const t=e.closest(".story-card"),i=parseInt(t.dataset.index),a=()=>{const s=this._stories[i];if(s.lat&&s.lon){this._map.setView([s.lat,s.lon],13);const o=this._markers.find(n=>n.storyIndex===i);o&&o.openPopup()}document.querySelectorAll(".story-card").forEach(o=>o.classList.remove("highlighted")),t.classList.add("highlighted")};e.addEventListener("click",a)})}},N={_map:null,_marker:null,_selectedLocation:null,_selectedFile:null,_stream:null,async render(){return`
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
    `},async afterRender(){this._initMap(),this._setupFileUpload(),this._setupCamera(),this._setupForm(),this._setupConnectionMonitor(),this._checkPendingStories()},_setupConnectionMonitor(){const r=document.getElementById("connectionStatus");window.addEventListener("online",()=>{r.innerHTML='<span class="status-online">🟢 Online</span>',this._syncPendingStories()}),window.addEventListener("offline",()=>{r.innerHTML='<span class="status-offline">🔴 Offline - Cerita akan dikirim saat online</span>'})},async _checkPendingStories(){try{const r=await p.getPendingStories(),e=document.getElementById("pendingStoriesStatus");if(r.length>0&&(e.style.display="block",e.innerHTML=`
          <div class="alert alert-warning">
            📤 ${r.length} cerita menunggu untuk dikirim
            ${navigator.onLine?'<button id="syncNowBtn" class="btn-secondary" style="margin-left: 1rem;">Kirim Sekarang</button>':""}
          </div>
        `,navigator.onLine)){const t=document.getElementById("syncNowBtn");t&&t.addEventListener("click",()=>this._syncPendingStories())}}catch(r){console.error("Error checking pending stories:",r)}},async _syncPendingStories(){const r=document.getElementById("pendingStoriesStatus"),e=document.getElementById("addStoryAlert");try{const t=await p.getPendingStories();if(t.length===0)return;r.innerHTML='<div class="alert alert-success">⏳ Mengirim cerita yang tertunda...</div>';let i=0;for(const a of t)try{await w.addStory(a.description,a.photo,a.lat,a.lon),await p.deletePendingStory(a.id),i++}catch(s){console.error("Error syncing story:",s)}i>0&&(r.innerHTML=`<div class="alert alert-success">✅ ${i} cerita berhasil dikirim!</div>`,setTimeout(()=>{r.style.display="none"},3e3)),"serviceWorker"in navigator&&"sync"in self.registration&&await(await navigator.serviceWorker.ready).sync.register("sync-stories")}catch(t){console.error("Error syncing stories:",t),e.innerHTML=`<div class="alert alert-error">Error syncing stories: ${t.message}</div>`}},_initMap(){this._map=L.map("addStoryMap").setView([-6.2088,106.8456],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this._map),this._map.on("click",r=>{const{lat:e,lng:t}=r.latlng;this._marker&&this._map.removeLayer(this._marker),this._marker=L.marker([e,t]).addTo(this._map),this._selectedLocation={lat:e,lon:t},document.getElementById("coordsDisplay").textContent=`${e.toFixed(6)}, ${t.toFixed(6)}`})},_setupFileUpload(){const r=document.getElementById("photo"),e=document.getElementById("filePreview"),t=document.getElementById("cameraSection");r.addEventListener("change",i=>{const a=i.target.files[0];if(a){this._selectedFile=a;const s=new FileReader;s.onload=o=>{e.innerHTML=`
            <img src="${o.target.result}" alt="Preview foto yang dipilih" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
            <p style="color: #27ae60; margin-top: 0.5rem;">✓ Foto berhasil dipilih</p>
          `},s.readAsDataURL(a),t.style.display="none"}})},_setupCamera(){const r=document.getElementById("startCamera"),e=document.getElementById("capturePhoto"),t=document.getElementById("stopCamera"),i=document.getElementById("videoPreview"),a=document.querySelector(".camera-buttons"),s=document.getElementById("photoCanvas"),o=document.getElementById("filePreview"),n=document.getElementById("photo");r.addEventListener("click",async()=>{try{this._stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1}),i.srcObject=this._stream,i.style.display="block",a.style.display="flex",r.style.display="none",r.setAttribute("aria-expanded","true")}catch(c){alert("Tidak dapat mengakses kamera: "+c.message)}}),e.addEventListener("click",()=>{s.width=i.videoWidth,s.height=i.videoHeight,s.getContext("2d").drawImage(i,0,0),s.toBlob(P=>{this._selectedFile=new File([P],"camera-photo.jpg",{type:"image/jpeg"}),o.innerHTML=`
          <img src="${s.toDataURL()}" alt="Foto yang diambil dari kamera" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
          <p style="color: #27ae60; margin-top: 0.5rem;">✓ Foto berhasil diambil dari kamera</p>
        `;const _=new DataTransfer;_.items.add(this._selectedFile),n.files=_.files,this._stopCamera()},"image/jpeg",.95)}),t.addEventListener("click",()=>{this._stopCamera()})},_stopCamera(){this._stream&&(this._stream.getTracks().forEach(i=>i.stop()),this._stream=null);const r=document.getElementById("videoPreview"),e=document.querySelector(".camera-buttons"),t=document.getElementById("startCamera");r.style.display="none",e.style.display="none",t.style.display="block",t.setAttribute("aria-expanded","false")},_setupForm(){const r=document.getElementById("addStoryForm"),e=document.getElementById("addStoryAlert");r.addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("description").value;if(!this._selectedFile){e.innerHTML='<div class="alert alert-error">Silakan pilih foto atau ambil foto menggunakan kamera terlebih dahulu</div>';return}if(!this._selectedLocation){e.innerHTML='<div class="alert alert-error">Silakan pilih lokasi pada peta</div>';return}if(!navigator.onLine){await this._saveForLater(i);return}try{e.innerHTML='<div class="alert alert-success">Mengunggah cerita...</div>',await w.addStory(i,this._selectedFile,this._selectedLocation.lat,this._selectedLocation.lon),e.innerHTML='<div class="alert alert-success">Cerita berhasil ditambahkan! Redirecting...</div>',this._stopCamera(),setTimeout(()=>{window.location.hash="#/stories"},1500)}catch(a){a.message.includes("network")||a.message.includes("fetch")?await this._saveForLater(i):e.innerHTML=`<div class="alert alert-error">${a.message}</div>`}})},async _saveForLater(r){const e=document.getElementById("addStoryAlert");try{await p.addPendingStory({description:r,photo:this._selectedFile,lat:this._selectedLocation.lat,lon:this._selectedLocation.lon}),e.innerHTML='<div class="alert alert-success">💾 Cerita disimpan! Akan dikirim otomatis saat online.</div>',"serviceWorker"in navigator&&"sync"in self.registration&&await(await navigator.serviceWorker.ready).sync.register("sync-stories"),setTimeout(()=>{window.location.hash="#/stories"},2e3)}catch(t){e.innerHTML=`<div class="alert alert-error">Error menyimpan cerita: ${t.message}</div>`}}},$={_favorites:[],_filteredFavorites:[],async render(){return`
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
    `},async afterRender(){await this._loadFavorites(),this._setupSearchAndSort()},async _loadFavorites(){const r=document.getElementById("favoritesGrid"),e=document.getElementById("emptyState"),t=document.getElementById("favoritesAlert");try{if(this._favorites=await p.getAllFavorites(),this._filteredFavorites=[...this._favorites],this._favorites.length===0){r.style.display="none",e.style.display="flex";return}this._renderFavorites()}catch(i){t.innerHTML=`<div class="alert alert-error">Error loading favorites: ${i.message}</div>`,r.innerHTML=""}},_renderFavorites(){const r=document.getElementById("favoritesGrid"),e=document.getElementById("emptyState");if(this._filteredFavorites.length===0){r.innerHTML=`
        <div class="no-results">
          <p>Tidak ada cerita yang sesuai dengan pencarian</p>
        </div>
      `;return}r.style.display="grid",e.style.display="none",r.innerHTML=this._filteredFavorites.map(t=>`
      <article class="favorite-card">
        <button class="remove-favorite" data-id="${t.id}" data-name="${t.name}" aria-label="Hapus dari favorit">
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
    `).join(""),this._setupRemoveButtons()},_setupRemoveButtons(){document.querySelectorAll(".remove-favorite").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const i=e.dataset.id,a=e.dataset.name;await this._removeFavorite(i,a)})})},async _removeFavorite(r,e){const t=document.getElementById("favoritesAlert");try{await p.removeFavorite(r)&&(t.innerHTML='<div class="alert alert-success">Cerita dihapus dari favorit</div>',await g.showUnfavoriteNotification(e),this._favorites=this._favorites.filter(a=>a.id!==r),this._filteredFavorites=this._filteredFavorites.filter(a=>a.id!==r),this._renderFavorites(),setTimeout(()=>{t.innerHTML=""},3e3))}catch(i){t.innerHTML=`<div class="alert alert-error">Error menghapus favorit: ${i.message}</div>`}},_setupSearchAndSort(){const r=document.getElementById("searchInput"),e=document.getElementById("sortSelect");r.addEventListener("input",t=>{const i=t.target.value.toLowerCase().trim();i===""?this._filteredFavorites=[...this._favorites]:this._filteredFavorites=this._favorites.filter(a=>a.name.toLowerCase().includes(i)||a.description.toLowerCase().includes(i)),this._renderFavorites()}),e.addEventListener("change",t=>{const i=t.target.value;this._sortFavorites(i)})},_sortFavorites(r){switch(r){case"newest":this._filteredFavorites.sort((e,t)=>new Date(t.savedAt)-new Date(e.savedAt));break;case"oldest":this._filteredFavorites.sort((e,t)=>new Date(e.savedAt)-new Date(t.savedAt));break;case"name":this._filteredFavorites.sort((e,t)=>e.name.localeCompare(t.name));break}this._renderFavorites()}},H={"/":B,"/login":B,"/register":F,"/stories":x,"/add-story":N,"/favorites":$},A=()=>{const r=window.location.hash.slice(1).toLowerCase()||"/";return r===""?"/":r};var m,k,S,h;class O{constructor({content:e,drawerButton:t,navigationDrawer:i}){f(this,m,null);f(this,k,null);f(this,S,null);f(this,h,null);v(this,m,e),v(this,k,t),v(this,S,i),this._initialAppShell()}_initialAppShell(){this._initializeNavigation(),this._initializeScrollEffects(),this._setupAuthUI(),this._setupPWAFeatures()}_setupPWAFeatures(){this._setupInstallPrompt(),this._setupPushNotifications()}_setupInstallPrompt(){const e=document.getElementById("installBanner"),t=document.getElementById("installButton"),i=document.getElementById("dismissBanner");window.addEventListener("beforeinstallprompt",a=>{console.log("beforeinstallprompt fired"),a.preventDefault(),v(this,h,a);const s=localStorage.getItem("installBannerDismissed"),o=localStorage.getItem("appInstalled");!s&&!o&&(e.style.display="block")}),t&&t.addEventListener("click",async()=>{if(!l(this,h))return;l(this,h).prompt();const{outcome:a}=await l(this,h).userChoice;console.log(`User response to install prompt: ${a}`),a==="accepted"&&localStorage.setItem("appInstalled","true"),v(this,h,null),e.style.display="none"}),i&&i.addEventListener("click",()=>{e.style.display="none",localStorage.setItem("installBannerDismissed","true"),setTimeout(()=>{localStorage.removeItem("installBannerDismissed")},7*24*60*60*1e3)}),window.addEventListener("appinstalled",()=>{console.log("PWA installed successfully"),localStorage.setItem("appInstalled","true"),e.style.display="none"})}async _setupPushNotifications(){const e=document.getElementById("notificationToggle");if(document.getElementById("notificationIcon"),!e||!("serviceWorker"in navigator)||!("PushManager"in window)){console.warn("Push notifications not supported"),e&&(e.style.display="none");return}const t=await g.isSubscribed();this._updateNotificationIcon(t),e.addEventListener("click",async()=>{try{if(e.disabled=!0,await g.isSubscribed())if(console.log("🔕 Unsubscribing..."),await g.unsubscribe())this._updateNotificationIcon(!1),this._showNotificationAlert("Push notifications dinonaktifkan","success");else throw new Error("Failed to unsubscribe");else{if(console.log("🔔 Subscribing..."),!await g.requestPermission()){this._showNotificationAlert("Permission ditolak untuk notifications. Silakan aktifkan di pengaturan browser.","error"),e.disabled=!1;return}await g.subscribe(),this._updateNotificationIcon(!0),this._showNotificationAlert("✅ Push notifications berhasil diaktifkan!","success"),setTimeout(()=>{g.showTestNotification()},1e3)}}catch(i){console.error("Error toggling push notifications:",i);let a="Error mengatur notifications";i.message.includes("token")?a="Silakan login terlebih dahulu":i.message.includes("subscribe")&&(a="Gagal mendaftar notifikasi. Silakan coba lagi."),this._showNotificationAlert(a,"error")}finally{e.disabled=!1}})}_updateNotificationIcon(e){const t=document.getElementById("notificationIcon"),i=document.getElementById("notificationToggle");t&&(t.textContent=e?"🔔":"🔕"),i&&(i.setAttribute("aria-label",e?"Nonaktifkan push notifications":"Aktifkan push notifications"),i.setAttribute("title",e?"Push notifications aktif - Klik untuk nonaktifkan":"Push notifications nonaktif - Klik untuk aktifkan"),e?i.style.background="rgba(39, 174, 96, 0.1)":i.style.background="transparent")}_showNotificationAlert(e,t){const i=document.createElement("div");i.className=`notification-alert notification-alert-${t}`,i.textContent=e,i.style.cssText=`
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
    max-width: 400px;
  `,document.body.appendChild(i),setTimeout(()=>{i.style.animation="slideOut 0.3s ease-out",setTimeout(()=>{i.parentNode&&document.body.removeChild(i)},300)},4e3)}_initializeNavigation(){const e=document.getElementById("menuToggle"),t=document.getElementById("navLinks");e&&t&&(e.addEventListener("click",()=>{e.classList.toggle("active"),t.classList.toggle("active")}),document.querySelectorAll(".nav-links a").forEach(s=>{s.addEventListener("click",()=>{e.classList.remove("active"),t.classList.remove("active")})}));const i=document.getElementById("logoutBtn");i&&i.addEventListener("click",()=>{y.logout(),window.location.hash="#/login",this._setupAuthUI()})}_initializeScrollEffects(){const e=document.getElementById("navbar");e&&window.addEventListener("scroll",()=>{window.pageYOffset>100?e.classList.add("scrolled"):e.classList.remove("scrolled")})}_setupAuthUI(){const e=y.isLoggedIn(),t=document.getElementById("loginLink"),i=document.getElementById("registerLink"),a=document.getElementById("storiesLinkItem"),s=document.getElementById("favoritesLinkItem"),o=document.getElementById("addStoryLinkItem"),n=document.getElementById("notificationLinkItem"),c=document.getElementById("logoutLinkItem");e?(t&&(t.parentElement.style.display="none"),i&&(i.parentElement.style.display="none"),a&&(a.style.display="block"),s&&(s.style.display="block"),o&&(o.style.display="block"),n&&(n.style.display="block"),c&&(c.style.display="block")):(t&&(t.parentElement.style.display="block"),i&&(i.parentElement.style.display="block"),a&&(a.style.display="none"),s&&(s.style.display="none"),o&&(o.style.display="none"),n&&(n.style.display="none"),c&&(c.style.display="none"))}_checkAuth(){const e=A(),t=y.isLoggedIn();return["/stories","/add-story","/favorites"].includes(e)&&!t?(window.location.hash="#/login",!1):!0}init(){this._initializeBackToTop(),this.renderPage(),window.addEventListener("hashchange",()=>{this.renderPage()}),window.addEventListener("popstate",()=>{this.renderPage()})}_initializeBackToTop(){const e=document.getElementById("backToTop");e&&(window.addEventListener("scroll",()=>{window.pageYOffset>300?e.classList.add("show"):e.classList.remove("show")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}),e.addEventListener("keypress",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}))}))}async renderPage(){if(!this._checkAuth())return;const e=A(),t=H[e];if(!t){this._showError("Halaman tidak ditemukan");return}if(l(this,m))try{this._showLoading(),this._setupAuthUI(),document.startViewTransition?await document.startViewTransition(async()=>{l(this,m).innerHTML=await t.render(),await t.afterRender()}).finished:(l(this,m).innerHTML=await t.render(),l(this,m).classList.add("page-enter"),await t.afterRender()),window.scrollTo(0,0),this._hideLoading()}catch(i){console.error("Error rendering page:",i),this._showError(i.message||"Terjadi kesalahan saat memuat halaman")}}_showLoading(){const e=document.getElementById("loadingSpinner");e&&(e.style.display="flex")}_hideLoading(){const e=document.getElementById("loadingSpinner");e&&(e.style.display="none")}_showError(e="Terjadi kesalahan"){this._hideLoading(),l(this,m)&&(l(this,m).innerHTML=`
        <div class="error-message">
          <h2>⚠️ Oops!</h2>
          <p>${e}</p>
          <a href="#/" class="btn-primary">Kembali ke Home</a>
        </div>
      `)}destroy(){window.removeEventListener("hashchange",this.renderPage),window.removeEventListener("popstate",this.renderPage)}}m=new WeakMap,k=new WeakMap,S=new WeakMap,h=new WeakMap;document.addEventListener("DOMContentLoaded",()=>{new O({content:document.getElementById("mainContent"),drawerButton:document.getElementById("menuToggle"),navigationDrawer:document.getElementById("navLinks")}).init()});async function R(){return"serviceWorker"in navigator?await navigator.serviceWorker.getRegistration()?"✓ PWA Active":"✗ PWA Not Registered":"✗ PWA Not Supported"}window.addEventListener("load",()=>{R().then(r=>{const e=document.getElementById("pwa-status");e&&(e.textContent=r)})});
