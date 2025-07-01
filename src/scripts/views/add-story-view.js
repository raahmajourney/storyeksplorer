import { initMap } from '../utils/map-helper.js';

class AddStoryView {
    constructor({ container, onSubmit }) {
        this._container = container;
        this._onSubmit = onSubmit;
        this._mediaStream = null;
        this._capturedPhoto = null;
        this._render();
    }

    _render() {
        this._container.innerHTML = `
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
        `;

        this._initMap();
        this._setupEventListeners();
    }

    _initMap() {
        const mapContainer = this._container.querySelector('#map');
        this._map = initMap(mapContainer, [0, 0], 2);

        this._map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            this._container.querySelector('#lat-value').textContent = lat.toFixed(4);
            this._container.querySelector('#lon-value').textContent = lng.toFixed(4);

            if (this._marker) {
                this._map.removeLayer(this._marker);
            }

            this._marker = L.marker([lat, lng]).addTo(this._map)
                .bindPopup('Your story location')
                .openPopup();
        });
    }

    _setupEventListeners() {
        const form = this._container.querySelector('#story-form');
        const takePhotoBtn = this._container.querySelector('#take-photo');
        const cameraStream = this._container.querySelector('#camera-stream');
        const captureBtn = this._container.querySelector('#capture');
        const photoCanvas = this._container.querySelector('#photo-canvas');
        const photoPreview = this._container.querySelector('#photo-preview');
        const fileInput = this._container.querySelector('#photo');
        const loadingIndicator = this._container.querySelector('#loading-indicator');
        const submitBtn = this._container.querySelector('.btn-submit');

        const canvasToBlob = (canvas) => {
            return new Promise(resolve => {
                canvas.toBlob(blob => resolve(blob), 'image/jpeg');
            });
        };

        takePhotoBtn.addEventListener('click', async () => {
            try {
                this._mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                cameraStream.srcObject = this._mediaStream;
                cameraStream.style.display = 'block';
                captureBtn.style.display = 'inline-block';
            } catch (error) {
                alert('Kamera tidak tersedia atau ditolak oleh pengguna.');
            }
        });

        captureBtn.addEventListener('click', async () => {
            const context = photoCanvas.getContext('2d');
            photoCanvas.width = cameraStream.videoWidth;
            photoCanvas.height = cameraStream.videoHeight;
            context.drawImage(cameraStream, 0, 0);
            cameraStream.style.display = 'none';
            captureBtn.style.display = 'none';
            this._stopCamera();

            this._capturedPhoto = await canvasToBlob(photoCanvas);
            photoPreview.innerHTML = `<img src="${URL.createObjectURL(this._capturedPhoto)}" alt="Captured Photo">`;
            submitBtn.disabled = false;
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                this._capturedPhoto = fileInput.files[0];
                photoPreview.innerHTML = `<img src="${URL.createObjectURL(this._capturedPhoto)}" alt="Selected Photo">`;
                submitBtn.disabled = false;
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const description = this._container.querySelector('#description').value;
            const lat = parseFloat(this._container.querySelector('#lat-value').textContent);
            const lon = parseFloat(this._container.querySelector('#lon-value').textContent);
            const photo = this._capturedPhoto;

            if (!photo || !(photo instanceof Blob)) {
                alert('Foto belum siap! Harap ambil atau pilih foto terlebih dahulu.');
                return;
            }

            loadingIndicator.style.display = 'block';
            submitBtn.disabled = true;

            try {
                await this._onSubmit({ photo, description, lat, lon });
                this._stopCamera();
                window.location.hash = '#/';
            } catch (error) {
                alert(`Failed to add story: ${error.message}`);
            } finally {
                loadingIndicator.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    _stopCamera() {
        if (this._mediaStream) {
            this._mediaStream.getTracks().forEach(track => track.stop());
            this._mediaStream = null;
        }
    }

    destroy() {
        this._stopCamera();
    }
}

export default AddStoryView;
