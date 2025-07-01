(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const f="https://story-api.dicoding.dev/v1",p={STORIES:`${f}/stories`,LOGIN:`${f}/login`,REGISTER:`${f}/register`},x={"Content-Type":"application/json",Accept:"application/json"},_=e=>({Authorization:`Bearer ${e}`});class g{async getAllStories(){const t=localStorage.getItem("token");if(!t)throw new Error("Authentication required");const o=await(await fetch(p.STORIES,{headers:_(t)})).json();if(!o.error)return o.listStory.map(i=>({...i,lat:i.lat!==null&&!isNaN(i.lat)?i.lat:0,lon:i.lon!==null&&!isNaN(i.lon)?i.lon:0,photoUrl:i.photoUrl||"./assets/images/default-story.jpg",name:i.name||"Anonymous",description:i.description||"No description",createdAt:i.createdAt||new Date().toISOString()}));throw new Error(o.message)}async getStoryById(t){const n=localStorage.getItem("token");if(!n)throw new Error("Authentication required");const i=await(await fetch(`${p.STORIES}/${t}`,{headers:_(n)})).json();if(!i.error){const s=i.story;return{...s,lat:s.lat!==null&&!isNaN(s.lat)?s.lat:0,lon:s.lon!==null&&!isNaN(s.lon)?s.lon:0,photoUrl:s.photoUrl||"./assets/images/default-story.jpg",name:s.name||"Anonymous",description:s.description||"No description",createdAt:s.createdAt||new Date().toISOString()}}throw new Error(i.message)}async addStory({photo:t,description:n,lat:o,lon:i}){const s=localStorage.getItem("token");if(!s)throw new Error("Authentication required");const a=new FormData;a.append("photo",t),a.append("description",n),a.append("lat",o),a.append("lon",i);const r=await(await fetch(p.STORIES,{method:"POST",headers:_(s),body:a})).json();if(!r.error)return r;throw new Error(r.message)}async login({email:t,password:n}){const i=await(await fetch(p.LOGIN,{method:"POST",headers:x,body:JSON.stringify({email:t,password:n})})).json();if(!i.error)return i;throw new Error(i.message)}async register({name:t,email:n,password:o}){const s=await(await fetch(p.REGISTER,{method:"POST",headers:x,body:JSON.stringify({name:t,email:n,password:o})})).json();if(!s.error)return s;throw new Error(s.message)}}function M(e,t,n){const o=L.map(e).setView(t,n),i=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),s=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"});i.addTo(o);const a={"Street Map":i,Satellite:s};return L.control.layers(a).addTo(o),o}function z(e,t){e.innerHTML="";const n=t.filter(a=>a.lat!==null&&a.lon!==null&&!isNaN(a.lat)&&!isNaN(a.lon));if(n.length===0){e.innerHTML=`
      <div class="no-location-message">
        <i class="fas fa-map-marker-alt"></i>
        <p>No valid location data to display</p>
      </div>
    `;return}const o=n.reduce((a,c)=>a+c.lat,0)/n.length,i=n.reduce((a,c)=>a+c.lon,0)/n.length,s=M(e,[o,i],5);n.forEach(a=>{L.marker([a.lat,a.lon]).addTo(s).bindPopup(`
        <h3>${a.name}</h3>
        <img src="${a.photoUrl}" alt="${a.name}'s story" style="max-width: 150px;">
        <p>${a.description}</p>
      `)})}class Y{constructor({container:t}){this._container=t}showLoading(){this._container.innerHTML=`
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading stories...</p>
      </div>
    `}showStories(t){this._container.innerHTML=`
    <section class="stories">
      <div class="notification-controls">
        <button id="subscribe-btn" class="notif-btn">Subscribe</button>
        <button id="unsubscribe-btn" class="notif-btn">Unsubscribe</button>
      </div>
      <h2 class="section-title">Recent Stories</h2>
      <div class="story-list" id="story-list"></div>
      <div class="story-map" id="story-map"></div>
    </section>
  `;const n=this._container.querySelector("#story-list"),o=this._container.querySelector("#story-map"),i=t.filter(s=>s.lat!==0&&s.lon!==0);t.forEach(s=>{const a=this._createStoryElement(s);n.appendChild(a)}),i.length>0?z(o,i):o.innerHTML=`
        <div class="no-location-message">
          <i class="fas fa-map-marker-alt"></i>
          <p>No location data available for these stories</p>
        </div>
      `}_createStoryElement(t){const n=document.createElement("article");return n.className="story-card",n.innerHTML=`
      <img src="${t.photoUrl}" alt="Story by ${t.name}" class="story-image">
      <div class="story-content">
        <h3>${t.name}</h3>
        <p class="story-date">
          <i class="far fa-calendar-alt"></i> 
          ${new Date(t.createdAt).toLocaleDateString()}
        </p>
        <p class="story-desc">${t.description}</p>
        <button class="btn-detail" data-id="${t.id}">Read More</button>
      </div>
    `,n.querySelector(".btn-detail").addEventListener("click",()=>{window.location.hash=`#/detail/${t.id}`}),n}showError(t){this._container.innerHTML=`
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${t}</p>
        <button class="btn-retry">Try Again</button>
      </div>
    `,this._container.querySelector(".btn-retry").addEventListener("click",()=>{window.location.reload()})}}const Q="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";function X(e){const t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/-/g,"+").replace(/_/g,"/"),o=atob(n),i=new Uint8Array(o.length);for(let s=0;s<o.length;++s)i[s]=o.charCodeAt(s);return i}async function H(){if(!("serviceWorker"in navigator)||!("PushManager"in window)){alert("Browser tidak mendukung Push Notification");return}const e=localStorage.getItem("token");if(!e){alert("Kamu harus login untuk subscribe");return}try{const t=await navigator.serviceWorker.ready;if(await t.pushManager.getSubscription()){console.log("ℹ️ Sudah subscribe sebelumnya, tidak perlu ulangi.");return}const o=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:X(Q)});await fetch(`${f}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({endpoint:o.endpoint,keys:{p256dh:o.toJSON().keys.p256dh,auth:o.toJSON().keys.auth}})}),alert("✅ Berhasil subscribe notifikasi!")}catch(t){console.error(t),alert("❌ Gagal subscribe notifikasi!")}}async function Z(){const e=localStorage.getItem("token");if(!e){alert("Harus login dulu");return}try{const n=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(!n){alert("Kamu belum subscribe");return}await fetch(`${f}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({endpoint:n.endpoint})}),await n.unsubscribe(),alert("🗑️ Berhasil unsubscribe")}catch(t){console.error(t),alert("❌ Gagal unsubscribe")}}class tt{constructor({container:t}){this._container=t,this._storyModel=new g,this._view=new Y({container:t}),this._showStories()}async _showStories(){try{if(this._view.showLoading(),!localStorage.getItem("token")){window.location.hash="#/auth";return}const n=await this._storyModel.getAllStories();this._view.showStories(n),setTimeout(()=>{var o,i;(o=document.querySelector("#subscribe-btn"))==null||o.addEventListener("click",H),(i=document.querySelector("#unsubscribe-btn"))==null||i.addEventListener("click",Z)},0)}catch(t){t.message.includes("authentication")?window.location.hash="#/auth":this._view.showError(t.message)}}}class et{constructor({container:t,onSubmit:n}){this._container=t,this._onSubmit=n,this._mediaStream=null,this._capturedPhoto=null,this._render()}_render(){this._container.innerHTML=`
            <section class="add-story">
                <h2 class="section-title">Share Your Story</h2>
                <form id="story-form">
                    <div class="form-group">
                        <label for="photo">Photo</label>
                        <div class="photo-input">
                            <input type="file" id="photo" accept="image/*">
                            <button type="button" id="take-photo" class="btn-camera">
                                <i class="fas fa-camera"></i> Take Photo
                            </button>
                            <video id="camera-stream" autoplay playsinline style="display: none;"></video>
                            <canvas id="photo-canvas" style="display: none;"></canvas>
                            <button type="button" id="capture" style="display: none;">Capture</button>
                        </div>
                        <div class="photo-preview" id="photo-preview"></div>
                    </div>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" rows="5" required></textarea>
                    </div>

                    <div class="form-group">
                        <label>Location</label>
                        <div class="map-container" id="map"></div>
                        <div class="coordinates">
                            <span>Lat: <span id="lat-value">0</span></span>
                            <span>Lon: <span id="lon-value">0</span></span>
                        </div>
                    </div>

                    <div id="loading-indicator" style="display:none; text-align:center; margin-top:1em;">
                        <span>Uploading...</span>
                    </div>

                    <button type="submit" class="btn-submit" disabled>Share Story</button>
                </form>
            </section>
        `,this._initMap(),this._setupEventListeners()}_initMap(){const t=this._container.querySelector("#map");this._map=M(t,[0,0],2),this._map.on("click",n=>{const{lat:o,lng:i}=n.latlng;this._container.querySelector("#lat-value").textContent=o.toFixed(4),this._container.querySelector("#lon-value").textContent=i.toFixed(4),this._marker&&this._map.removeLayer(this._marker),this._marker=L.marker([o,i]).addTo(this._map).bindPopup("Your story location").openPopup()})}_setupEventListeners(){const t=this._container.querySelector("#story-form"),n=this._container.querySelector("#take-photo"),o=this._container.querySelector("#camera-stream"),i=this._container.querySelector("#capture"),s=this._container.querySelector("#photo-canvas"),a=this._container.querySelector("#photo-preview"),c=this._container.querySelector("#photo"),r=this._container.querySelector("#loading-indicator"),l=this._container.querySelector(".btn-submit"),J=u=>new Promise(v=>{u.toBlob(w=>v(w),"image/jpeg")});n.addEventListener("click",async()=>{try{this._mediaStream=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=this._mediaStream,o.style.display="block",i.style.display="inline-block"}catch{alert("Kamera tidak tersedia atau ditolak oleh pengguna.")}}),i.addEventListener("click",async()=>{const u=s.getContext("2d");s.width=o.videoWidth,s.height=o.videoHeight,u.drawImage(o,0,0),o.style.display="none",i.style.display="none",this._stopCamera(),this._capturedPhoto=await J(s),a.innerHTML=`<img src="${URL.createObjectURL(this._capturedPhoto)}" alt="Captured Photo">`,l.disabled=!1}),c.addEventListener("change",()=>{c.files.length>0&&(this._capturedPhoto=c.files[0],a.innerHTML=`<img src="${URL.createObjectURL(this._capturedPhoto)}" alt="Selected Photo">`,l.disabled=!1)}),t.addEventListener("submit",async u=>{u.preventDefault();const v=this._container.querySelector("#description").value,w=parseFloat(this._container.querySelector("#lat-value").textContent),W=parseFloat(this._container.querySelector("#lon-value").textContent),S=this._capturedPhoto;if(!S||!(S instanceof Blob)){alert("Foto belum siap! Harap ambil atau pilih foto terlebih dahulu.");return}r.style.display="block",l.disabled=!0;try{await this._onSubmit({photo:S,description:v,lat:w,lon:W}),this._stopCamera(),window.location.hash="#/"}catch(K){alert(`Failed to add story: ${K.message}`)}finally{r.style.display="none",l.disabled=!1}})}_stopCamera(){this._mediaStream&&(this._mediaStream.getTracks().forEach(t=>t.stop()),this._mediaStream=null)}destroy(){this._stopCamera()}}class nt{constructor({container:t}){this._container=t,this._storyModel=new g,this._view=new et({container:t,onSubmit:this._onSubmit.bind(this)}),window.addEventListener("hashchange",()=>{this._view.destroy()})}async _onSubmit({photo:t,description:n,lat:o,lon:i}){try{if(!localStorage.getItem("token"))throw new Error("You need to login first");return await this._storyModel.addStory({photo:t,description:n,lat:o,lon:i}),!0}catch(s){throw s}}}class it{constructor({container:t,onLogin:n,onRegister:o}){this._container=t,this._onLogin=n,this._onRegister=o,this._render()}_render(){this._container.innerHTML=`
      <style>
        .spinner {
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.6s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-left: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      </style>

      <section class="auth">
        <div class="auth-tabs">
          <button class="tab-btn active" id="login-tab">Login</button>
          <button class="tab-btn" id="register-tab">Register</button>
        </div>
        
        <div class="auth-content">
          <form id="login-form" class="auth-form active">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" required>
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" required>
            </div>
            <button type="submit" class="btn-submit">
              <span class="btn-text">Login</span>
              <span class="spinner" style="display: none;"></span>
            </button>
          </form>
          
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="register-name">Name</label>
              <input type="text" id="register-name" required>
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" required minlength="6">
            </div>
            <button type="submit" class="btn-submit">
              <span class="btn-text">Register</span>
              <span class="spinner" style="display: none;"></span>
            </button>
          </form>
        </div>
      </section>
    `,this._setupEventListeners()}_setupEventListeners(){document.getElementById("login-tab").addEventListener("click",()=>{document.getElementById("login-form").classList.add("active"),document.getElementById("register-form").classList.remove("active"),document.getElementById("login-tab").classList.add("active"),document.getElementById("register-tab").classList.remove("active")}),document.getElementById("register-tab").addEventListener("click",()=>{document.getElementById("register-form").classList.add("active"),document.getElementById("login-form").classList.remove("active"),document.getElementById("register-tab").classList.add("active"),document.getElementById("login-tab").classList.remove("active")}),document.getElementById("login-form").addEventListener("submit",async t=>{t.preventDefault();const n=t.target.querySelector(".btn-submit"),o=n.querySelector(".btn-text"),i=n.querySelector(".spinner");n.disabled=!0,o.textContent="Logging in...",i.style.display="inline-block";const s=document.getElementById("login-email").value,a=document.getElementById("login-password").value;try{await this._onLogin({email:s,password:a})}finally{n.disabled=!1,o.textContent="Login",i.style.display="none"}}),document.getElementById("register-form").addEventListener("submit",async t=>{t.preventDefault();const n=t.target.querySelector(".btn-submit"),o=n.querySelector(".btn-text"),i=n.querySelector(".spinner");n.disabled=!0,o.textContent="Registering...",i.style.display="inline-block";const s=document.getElementById("register-name").value,a=document.getElementById("register-email").value,c=document.getElementById("register-password").value;try{await this._onRegister({name:s,email:a,password:c})}finally{n.disabled=!1,o.textContent="Register",i.style.display="none"}})}}class ot{constructor({container:t}){this._container=t,this._storyModel=new g,this._view=new it({container:t,onLogin:this._handleLogin.bind(this),onRegister:this._handleRegister.bind(this)})}async _handleLogin({email:t,password:n}){try{const o=await this._storyModel.login({email:t,password:n});localStorage.setItem("token",o.loginResult.token),localStorage.setItem("user",JSON.stringify({name:o.loginResult.name,email:t})),window.location.hash="#/"}catch(o){alert(`Login failed: ${o.message}`)}}async _handleRegister({name:t,email:n,password:o}){try{await this._storyModel.register({name:t,email:n,password:o}),alert("Registration successful! Please login with your credentials."),document.getElementById("login-tab").click(),document.getElementById("login-email").value=n,document.getElementById("login-password").value=o}catch(i){alert(`Registration failed: ${i.message}`)}}}class st{constructor({container:t}){this._container=t,this._favButton=null}showLoading(){this._container.innerHTML=`
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading story details...</p>
      </div>
    `}showStoryDetail(t,n=!1){if(this._container.innerHTML=`
      <section class="story-detail">
        <h2 class="section-title">Story Details</h2>
        <div class="detail-container">
          <div class="detail-image">
            <img src="${t.photoUrl}" alt="Story by ${t.name}">
          </div>
          <div class="detail-content">
            <h3>${t.name}</h3>
            <p class="story-date">
              <i class="far fa-calendar-alt"></i> 
              ${new Date(t.createdAt).toLocaleDateString()}
            </p>
            <p class="story-desc">${t.description}</p>

            <button id="favButton" class="fav-button" title="Tambahkan ke Favorit">
              <i class="${n?"fa-solid":"fa-regular"} fa-heart"></i>
              ${n?"Favorited":"Favorite"}
            </button>

            <div class="detail-map-container">
              ${t.lat!==0&&t.lon!==0?'<div class="detail-map" id="detail-map"></div>':`<div class="no-location-message">
                  <i class="fas fa-map-marker-alt"></i>
                  <p>No location data available for this story</p>
                </div>`}
            </div>
            <a href="#/" class="btn-back"><i class="fas fa-arrow-left"></i> Back to Stories</a>
          </div>
        </div>
      </section>
    `,t.lat!==0&&t.lon!==0){const o=this._container.querySelector("#detail-map"),i=M(o,[t.lat,t.lon],13);L.marker([t.lat,t.lon]).addTo(i).bindPopup(`<h4>${t.name}'s Location</h4><p>${t.description}</p>`).openPopup()}this._favButton=this._container.querySelector("#favButton"),this._favButton.addEventListener("click",()=>{var o;(o=this._onFavoriteClicked)==null||o.call(this,t)})}updateFavoriteButton(t){this._favButton&&(this._favButton.innerHTML=`
      <i class="${t?"fa-solid":"fa-regular"} fa-heart"></i>
      ${t?"Favorited":"Favorite"}
    `,this._favButton.classList.toggle("favorited",t))}set onFavoriteClicked(t){this._onFavoriteClicked=t}showError(t){this._container.innerHTML=`
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${t}</p>
        <a href="#/" class="btn-back"><i class="fas fa-arrow-left"></i> Back to Stories</a>
      </div>
    `}}const I=(e,t)=>t.some(n=>e instanceof n);let C,$;function at(){return C||(C=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function rt(){return $||($=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const B=new WeakMap,E=new WeakMap,y=new WeakMap;function ct(e){const t=new Promise((n,o)=>{const i=()=>{e.removeEventListener("success",s),e.removeEventListener("error",a)},s=()=>{n(d(e.result)),i()},a=()=>{o(e.error),i()};e.addEventListener("success",s),e.addEventListener("error",a)});return y.set(t,e),t}function lt(e){if(B.has(e))return;const t=new Promise((n,o)=>{const i=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",a),e.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{o(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",s),e.addEventListener("error",a),e.addEventListener("abort",a)});B.set(e,t)}let P={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return B.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return d(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function U(e){P=e(P)}function dt(e){return rt().includes(e)?function(...t){return e.apply(D(this),t),d(this.request)}:function(...t){return d(e.apply(D(this),t))}}function ut(e){return typeof e=="function"?dt(e):(e instanceof IDBTransaction&&lt(e),I(e,at())?new Proxy(e,P):e)}function d(e){if(e instanceof IDBRequest)return ct(e);if(E.has(e))return E.get(e);const t=ut(e);return t!==e&&(E.set(e,t),y.set(t,e)),t}const D=e=>y.get(e);function ht(e,t,{blocked:n,upgrade:o,blocking:i,terminated:s}={}){const a=indexedDB.open(e,t),c=d(a);return o&&a.addEventListener("upgradeneeded",r=>{o(d(a.result),r.oldVersion,r.newVersion,d(a.transaction),r)}),n&&a.addEventListener("blocked",r=>n(r.oldVersion,r.newVersion,r)),c.then(r=>{s&&r.addEventListener("close",()=>s()),i&&r.addEventListener("versionchange",l=>i(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}const pt=["get","getKey","getAll","getAllKeys","count"],mt=["put","add","delete","clear"],k=new Map;function q(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(k.get(t))return k.get(t);const n=t.replace(/FromIndex$/,""),o=t!==n,i=mt.includes(n);if(!(n in(o?IDBIndex:IDBObjectStore).prototype)||!(i||pt.includes(n)))return;const s=async function(a,...c){const r=this.transaction(a,i?"readwrite":"readonly");let l=r.store;return o&&(l=l.index(c.shift())),(await Promise.all([l[n](...c),i&&r.done]))[0]};return k.set(t,s),s}U(e=>({...e,get:(t,n,o)=>q(t,n)||e.get(t,n,o),has:(t,n)=>!!q(t,n)||e.has(t,n)}));const ft=["continue","continuePrimaryKey","advance"],N={},A=new WeakMap,j=new WeakMap,gt={get(e,t){if(!ft.includes(t))return e[t];let n=N[t];return n||(n=N[t]=function(...o){A.set(this,j.get(this)[t](...o))}),n}};async function*yt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,gt);for(j.set(n,t),y.set(n,D(t));t;)yield n,t=await(A.get(n)||t.continue()),A.delete(n)}function O(e,t){return t===Symbol.asyncIterator&&I(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&I(e,[IDBIndex,IDBObjectStore])}U(e=>({...e,get(t,n,o){return O(t,n)?yt:e.get(t,n,o)},has(t,n){return O(t,n)||e.has(t,n)}}));const bt="stories-db",h="favorites",b=ht(bt,1,{upgrade(e){e.objectStoreNames.contains(h)||e.createObjectStore(h,{keyPath:"id"})}});async function vt(e){return(await b).put(h,e)}async function V(e){return(await b).delete(h,e)}async function R(e){return!!await(await b).get(h,e)}async function G(){return(await b).getAll(h)}class wt{constructor({container:t}){this._container=t,this._storyModel=new g,this._view=new st({container:t}),this._showStoryDetail()}async _showStoryDetail(){try{this._view.showLoading();const t=window.location.hash.split("/")[2],n=await this._storyModel.getStoryById(t),o=await R(n.id);this._view.showStoryDetail(n,o),this._view.onFavoriteClicked=async i=>{await R(i.id)?(await V(i.id),this._view.updateFavoriteButton(!1)):(await vt(i),this._view.updateFavoriteButton(!0))}}catch(t){this._view.showError(t.message)}}}function St(){document.startViewTransition||(document.startViewTransition=e=>(e(),{ready:Promise.resolve(),updateCallbackDone:Promise.resolve(),finished:Promise.resolve()})),document.addEventListener("click",e=>{const t=e.target.closest("a");if(!t)return;const n=new URL(t.href);n.origin===location.origin&&(e.preventDefault(),document.startViewTransition(()=>{window.location.href=n.href}))})}function _t(){const e=document.querySelector(".skip-link"),t=document.querySelector("#main-content");e&&t&&e.addEventListener("click",i=>{i.preventDefault(),t.setAttribute("tabindex","-1"),t.focus(),setTimeout(()=>t.removeAttribute("tabindex"),1e3)});const n=document.querySelector(".hamburger");n&&n.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),o())});function o(){document.querySelector(".navigation").classList.toggle("active")}document.querySelectorAll(".fas, .far").forEach(i=>{!i.getAttribute("aria-hidden")&&!i.closest("button, a")&&i.setAttribute("aria-hidden","true")}),document.querySelectorAll("img:not([alt])").forEach(i=>{(!i.getAttribute("role")||i.getAttribute("role")!=="presentation")&&i.setAttribute("alt","")})}class Lt{constructor({container:t}){this._container=t}async render(){return`
      <main id="main-content" class="container" tabindex="-1">
        <h1>Daftar Cerita Favorit</h1>
        <div id="favorite-list" class="story-list"></div>
      </main>
    `}async showFavorites(t){const n=document.querySelector("#favorite-list");if(n){if(t.length===0){n.innerHTML='<p class="empty-message">No favorite stories yet.</p>';return}n.innerHTML=t.map(o=>{const i=new Date(o.createdAt).toLocaleDateString();return`
        <div class="fav-card">
          <img src="${o.photoUrl}" alt="${o.name}">
          <h3>${o.name}</h3>
          <p class="story-date">
            <i class="far fa-calendar-alt"></i> ${i}
          </p>
          <p class="story-desc">${o.description}</p>
          <div class="story-coordinates">
            <small><i class="fas fa-map-marker-alt"></i> 
              Lat: ${o.lat.toFixed(5)}, Lon: ${o.lon.toFixed(5)}
            </small>
          </div>
          <button data-id="${o.id}" class="unfav-btn">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </div>
      `}).join(""),n.querySelectorAll(".unfav-btn").forEach(o=>{o.addEventListener("click",async i=>{const s=i.currentTarget.getAttribute("data-id");if(confirm("Yakin ingin menghapus dari daftar favorit?")){await V(s);const c=await G();this.showFavorites(c)}})})}}}class Et{constructor({container:t}){this._view=new Lt({container:t}),this._init()}async _init(){const t=await this._view.render();this._view._container.innerHTML=t;const n=await G();this._view.showFavorites(n)}}const F={"/":tt,"/add":nt,"/auth":ot,"/detail/:id":wt,"/fav":Et};function kt(){const e=localStorage.getItem("token");document.getElementById("auth-link");const t=document.querySelector(".user-nav-item"),n=document.querySelector(".auth-nav-item");if(e){n.style.display="none",t.style.display="block";const o=JSON.parse(localStorage.getItem("user")||"{}");document.getElementById("username-display").textContent=o.name||"User"}else n.style.display="block",t.style.display="none"}function It(){St(),_t();const e=document.querySelector("#main-content");function t(){const o=window.location.hash.slice(1)||"/",i=localStorage.getItem("token");if((["/","/add"].includes(o)||o.startsWith("/detail"))&&!i){window.location.hash="#/auth";return}for(const c in F){const r=c.replace(/:\w+/g,"([^/]+)");if(new RegExp(`^${r}$`).test(o)){document.startViewTransition(()=>{e.innerHTML="",new F[c]({container:e})});break}}kt(),localStorage.getItem("token")&&H()}function n(o){const i=o.target.closest("a");if(!i||!i.classList.contains("nav-link"))return;o.preventDefault();const s=i.getAttribute("href");s.startsWith("#")&&(window.location.hash=s.slice(1))}document.addEventListener("click",o=>{o.target.id==="logout-btn"&&(o.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.hash="#/auth")}),window.addEventListener("hashchange",t),document.addEventListener("click",n),t()}let m;const T=document.getElementById("install-btn");window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),m=e,T.style.display="block"});T.addEventListener("click",async()=>{m&&(m.prompt(),(await m.userChoice).outcome==="accepted"&&console.log("✅ Aplikasi diinstall"),m=null,T.style.display="none")});document.addEventListener("DOMContentLoaded",It);
