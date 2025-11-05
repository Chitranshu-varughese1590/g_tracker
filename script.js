const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewSection = document.getElementById('previewSection');
const imagePreview = document.getElementById('imagePreview');
const locationInfo = document.getElementById('locationInfo');
const mapLinkContainer = document.getElementById('mapLinkContainer');
const statusMessage = document.getElementById('statusMessage');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const historyModal = document.getElementById('historyModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const historyContainer = document.getElementById('historyContainer');

let currentImage = null;
let currentLocation = null;

const storage = {
  data: {},

  async set(key, value) {
    if (window.storage) {
      return await window.storage.set(key, value);
    } else {
      this.data[key] = value;
      return { key, value };
    }
  },

  async get(key) {
    if (window.storage) {
      return await window.storage.get(key);
    } else {
      if (this.data[key]) {
        return { key, value: this.data[key] };
      }
      throw new Error('Key not found');
    }
  },

  async list(prefix) {
    if (window.storage) {
      return await window.storage.list(prefix);
    } else {
      const keys = Object.keys(this.data).filter(k => k.startsWith(prefix));
      return { keys };
    }
  },

  async delete(key) {
    if (window.storage) {
      return await window.storage.delete(key);
    } else {
      delete this.data[key];
      return { key, deleted: true };
    }
  }
};

async function loadHistory() {
  try {
    const result = await storage.list('garbage:');
    if (!result || !result.keys || result.keys.length === 0) {
      historyContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <h3>No records yet</h3>
          <p>Upload your first garbage picture to start tracking!</p>
        </div>
      `;
      return;
    }

    const records = [];
    for (const key of result.keys) {
      try {
        const item = await storage.get(key);
        if (item && item.value) {
          records.push(JSON.parse(item.value));
        }
      } catch (e) {
        console.error('Error loading record:', e);
      }
    }

    records.sort((a, b) => b.timestamp - a.timestamp);

    if (records.length === 0) {
      historyContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <h3>No records yet</h3>
          <p>Upload your first garbage picture to start tracking!</p>
        </div>
      `;
      return;
    }

    historyContainer.innerHTML = `
      <div class="history-grid">
        ${records.map(record => `
          <div class="history-item">
            <img src="${record.image}" alt="Garbage" class="history-image" />
            <div class="history-details">
              <div class="history-date">${new Date(record.timestamp).toLocaleString()}</div>
              <div class="history-location">
                📍 ${formatCoordinate(record.latitude, true)}, ${formatCoordinate(record.longitude, false)}
              </div>
              <a href="https://maps.google.com/?q=${record.latitude},${record.longitude}" 
                 target="_blank" class="history-map-link">🗺️ View Map</a>
              <button class="delete-btn" onclick="deleteRecord('${record.id}')">🗑️ Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error loading history:', error);
    historyContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Error loading history</h3>
        <p>Please try again later.</p>
      </div>
    `;
  }
}

async function deleteRecord(id) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  
  try {
    await storage.delete(`garbage:${id}`);
    await loadHistory();
    showStatus('Record deleted successfully!', 'success');
    setTimeout(() => {
      statusMessage.innerHTML = '';
    }, 2000);
  } catch (error) {
    console.error('Error deleting record:', error);
    showStatus('Failed to delete record', 'error');
  }
}

function showStatus(message, type) {
  statusMessage.innerHTML = `
    <div class="status ${type}">
      ${type === 'loading' ? '<div class="spinner"></div>' : ''}
      ${message}
    </div>
  `;
}

function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes/60 + seconds/(60*60);
  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}

function formatCoordinate(value, isLat) {
  const direction = isLat ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
  return `${Math.abs(value).toFixed(6)}° ${direction}`;
}

function displayLocation(lat, lon, source) {
  const sourceText = source === 'gps' ? 'from image GPS data' : 'from current device location';
  
  locationInfo.innerHTML = `
    <strong>Latitude:</strong> ${formatCoordinate(lat, true)}<br>
    <strong>Longitude:</strong> ${formatCoordinate(lon, false)}<br>
    <span style="color: #999; font-size: 12px;">Location obtained ${sourceText}</span>
  `;
  
  mapLinkContainer.innerHTML = `
    <a href="https://maps.google.com/?q=${lat},${lon}" target="_blank" class="map-link">
      🗺️ View on Google Maps
    </a>
  `;
  
  currentLocation = { latitude: lat, longitude: lon };
  showStatus('Location successfully extracted!', 'success');
}

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showStatus('Please select a valid image file', 'error');
    return;
  }
  
  showStatus('Processing image...', 'loading');
  
  const reader = new FileReader();
  reader.onload = function(e) {
    currentImage = e.target.result;
    imagePreview.src = currentImage;
    previewSection.classList.add('active');
  };
  reader.readAsDataURL(file);
  
  EXIF.getData(file, function() {
    const latArr = EXIF.getTag(this, "GPSLatitude");
    const lonArr = EXIF.getTag(this, "GPSLongitude");
    const latRef = EXIF.getTag(this, "GPSLatitudeRef");
    const lonRef = EXIF.getTag(this, "GPSLongitudeRef");
    
    if (latArr && lonArr && latRef && lonRef) {
      const lat = convertDMSToDD(latArr[0], latArr[1], latArr[2], latRef);
      const lon = convertDMSToDD(lonArr[0], lonArr[1], lonArr[2], lonRef);
      displayLocation(lat, lon, 'gps');
    } else {
      showStatus('No GPS data in image, requesting current location...', 'loading');
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            displayLocation(lat, lon, 'device');
          },
          function(error) {
            showStatus('Unable to retrieve location. Please enable location services.', 'error');
            locationInfo.innerHTML = 'Location unavailable. Please enable GPS or location services.';
          }
        );
      } else {
        showStatus('Geolocation is not supported by this browser.', 'error');
        locationInfo.innerHTML = 'Geolocation is not supported by your browser.';
      }
    }
  });
}

uploadArea.addEventListener('click', () => imageInput.click());

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

imageInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) handleFile(file);
});

resetBtn.addEventListener('click', () => {
  imageInput.value = '';
  previewSection.classList.remove('active');
  statusMessage.innerHTML = '';
  locationInfo.innerHTML = '';
  mapLinkContainer.innerHTML = '';
  currentImage = null;
  currentLocation = null;
});

saveBtn.addEventListener('click', async () => {
  if (!currentImage || !currentLocation) {
    showStatus('Please upload an image with location first', 'error');
    return;
  }

  try {
    showStatus('Saving record...', 'loading');
    
    const id = Date.now().toString();
    const record = {
      id: id,
      image: currentImage,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      timestamp: Date.now()
    };

    const result = await storage.set(`garbage:${id}`, JSON.stringify(record));
    
    if (!result) {
      throw new Error('Storage operation failed');
    }
    
    showStatus('Record saved successfully!', 'success');
    
    setTimeout(() => {
      imageInput.value = '';
      previewSection.classList.remove('active');
      statusMessage.innerHTML = '';
      locationInfo.innerHTML = '';
      mapLinkContainer.innerHTML = '';
      currentImage = null;
      currentLocation = null;
    }, 1500);
  } catch (error) {
    console.error('Error saving record:', error);
    showStatus(`Failed to save: ${error.message || 'Storage error. Image may be too large (max 5MB).'}`, 'error');
  }
});

viewHistoryBtn.addEventListener('click', async () => {
  historyModal.classList.add('active');
  await loadHistory();
});

closeModalBtn.addEventListener('click', () => {
  historyModal.classList.remove('active');
});

historyModal.addEventListener('click', (e) => {
  if (e.target === historyModal) {
    historyModal.classList.remove('active');
  }
});
