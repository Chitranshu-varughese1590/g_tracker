# g-tracker 📸🌍
**Environmental Impact Tracking Platform with GPS-Enabled Image Logging**

---

## 📋 Project Overview

g-tracker is a web-based environmental monitoring application that enables users to photograph and geolocate garbage/pollution in real-time. The app automatically extracts GPS coordinates from image EXIF data, stores records with cloud backend support, and provides an interactive history view with map integration. Built as a college Web Development course project with real user adoption and positive feedback.

**Repository**: [GitHub - g_tracker](https://github.com/Chitranshu-varughese1590/g_tracker)  
**Code Size**: 322 lines of production JavaScript + HTML/CSS  
**Build Duration**: ~2 weeks (solo development)  
**Status**: Fully functional, college-deployed, actively used  
**Users**: College community members; received positive feedback during deployment

---

## 🎯 Problem Statement

Environmental monitoring typically requires manual data collection or expensive IoT sensors. g-tracker democratizes this by turning any smartphone with a camera into a data collection device—enabling crowdsourced environmental tracking with zero hardware cost.

---

## ✨ Core Features

### User Interface & UX
- **Intuitive Upload Interface**: Drag-and-drop image upload with visual feedback
- **Automatic Preview**: Real-time image preview with metadata display
- **History Modal**: Browsable record of all uploaded garbage locations with timestamps
- **Delete Functionality**: Remove individual records with single click
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features
- **EXIF Data Extraction**: Automatic GPS coordinate extraction from image metadata using exif.js library
- **Geolocation Fallback**: Device GPS access if EXIF data unavailable
- **Coordinate Conversion**: DMS (degrees, minutes, seconds) to decimal degrees conversion for map display
- **Map Integration**: Interactive Google Maps links to exact location coordinates
- **Async Storage Layer**: Pluggable storage backend (localStorage, cloud, custom)
- **Persistent History**: Records survive page refreshes and browser sessions

---

## 🏗️ Technical Architecture

### Frontend Stack
```
HTML5 → Structure & semantic layout
CSS3 → Responsive styling with flexbox/grid
JavaScript (ES6+) → DOM manipulation, async operations
EXIF.js → Image metadata extraction
Google Maps API → Location visualization
```

### Core Data Flow
```
User Upload
    ↓
Image File Input
    ↓
EXIF Extraction → GPS Coordinates
    ↓
Coordinate Conversion (DMS → DD)
    ↓
Async Storage (localStorage/Cloud)
    ↓
History Modal Display
    ↓
Map Link Generation
```

### Storage Architecture
```javascript
// Abstracted storage layer - supports multiple backends
const storage = {
    async set(key, value) { /* Store record */ },
    async get(key) { /* Retrieve record */ },
    async list(prefix) { /* List all records */ },
    async delete(key) { /* Delete record */ }
}
// Can swap implementation: localStorage → Firebase → MongoDB
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `handleFile(file)` | Processes uploaded image and triggers EXIF extraction |
| `extractExifData()` | Parses image metadata using exif.js library |
| `convertDMSToDD()` | Converts GPS format (43°27'30"N) to decimal (43.458°) |
| `saveRecord()` | Persists record to async storage backend |
| `loadHistory()` | Retrieves and displays all previous uploads |
| `displayLocation()` | Shows coordinates and generates map link |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **EXIF Parsing** | exif.js (CDN) |
| **Storage** | localStorage / Cloud Backend |
| **Maps** | Google Maps (via coordinate links) |
| **Hosting** | Static HTML/CSS/JS (can deploy anywhere) |
| **Build Tool** | None required (zero build step) |

---

## 🚀 How to Run Locally

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No server required; runs entirely in browser
- Optional: Local server for testing (to avoid CORS issues)

### Quick Start (Option 1: Direct File)
1. **Clone repository**
   ```bash
   git clone https://github.com/Chitranshu-varughese1590/g_tracker.git
   cd g_tracker
   ```

2. **Open in browser**
   ```bash
   open index.html  # macOS
   # or double-click index.html in file explorer
   ```

### Local Server (Option 2: Recommended)
1. **Using Python 3**
   ```bash
   python -m http.server 8000
   ```

2. **Using Node.js (http-server)**
   ```bash
   npx http-server
   ```

3. **Access in browser**
   ```
   http://localhost:8000
   ```

### How to Use
1. **Upload Image**: Click upload area or drag-and-drop image file
2. **View Metadata**: See extracted GPS coordinates and location information
3. **Save Record**: Click "💾 Save Record" to persist to storage
4. **View History**: Click "View History" to see all uploaded garbage locations
5. **Delete Record**: Remove individual records from history modal
6. **Map Link**: Click coordinate link to open location in Google Maps

---

## 🌐 Deployment Options

### Option 1: GitHub Pages (FREE - RECOMMENDED)
```bash
# Push repo with index.html to GitHub
git push origin main

# Enable GitHub Pages in Settings
# - Go to Repo Settings → Pages
# - Select "Deploy from a branch"
# - Choose "main" branch, root directory

# Access at: https://YOUR_USERNAME.github.io/g_tracker/
```

### Option 2: Vercel (FREE - ZERO CONFIG)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts; auto-generates URL
# Access at: https://g-tracker-[random].vercel.app
```

### Option 3: Netlify (FREE - DRAG & DROP)
1. Visit [netlify.com](https://netlify.com)
2. Drag-and-drop `g_tracker` folder
3. Automatic deployment with URL

### Option 4: Firebase Hosting (FREE TIER)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize project
firebase init hosting

# Deploy
firebase deploy

# Access at: https://YOUR_PROJECT.firebaseapp.com
```

### Option 5: Add Cloud Backend (Firebase Firestore)
Replace localStorage with Firebase for persistent cloud storage:
```javascript
// Add Firebase SDK
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>

// Update storage layer
const db = firebase.firestore();
async set(key, value) {
    await db.collection('records').doc(key).set(value);
}
```

---

## 📊 STAR Method Summary

**Situation**: Environmental monitoring in urban areas requires real-time data collection but lacks accessible tools for citizen scientists to contribute geographic pollution tracking.

**Task**: Design and build a zero-setup web application enabling users to upload photos with automatic geolocation extraction and persistent history tracking—deployable with no backend server infrastructure.

**Action**:
- Implemented EXIF metadata extraction from images to automatically capture GPS coordinates without user input
- Built async storage abstraction layer supporting multiple backends (localStorage, Firebase, cloud APIs)
- Engineered coordinate conversion system (DMS ↔ decimal degrees) for seamless map integration
- Designed intuitive drag-and-drop UI with real-time image preview and history modal
- Deployed as zero-dependency static HTML/CSS/JS for instant deployment on any hosting

**Result**: Delivered fully functional environmental tracking platform deployed in college Web Development course; achieved real user adoption with positive feedback; demonstrates full-stack thinking (UI/UX, data extraction, storage abstraction, deployment strategy).

---

## 🎯 Key Technical Achievements

✅ **EXIF Geolocation Automation** — Automatic GPS extraction eliminates manual coordinate entry  
✅ **Abstracted Storage Layer** — Switch backends (localStorage → Firebase → custom API) without code changes  
✅ **Mobile-Responsive Design** — Works seamlessly on desktop and smartphone screens  
✅ **Zero Deployment Complexity** — Single HTML file; deploys to any static hosting (GitHub Pages, Vercel, etc.)  
✅ **Real-Time Map Integration** — Generate interactive map links for recorded locations  
✅ **User Feedback Collection** — College deployment provided real usage data and improvement insights  

---

## 🔄 Data Model

### Record Structure
```javascript
{
    id: "garbage:1708876543000",
    timestamp: "2026-02-20 14:30:00",
    latitude: 26.8124,
    longitude: 75.8298,
    imageBase64: "data:image/jpeg;base64,...",
    location: "26.8124° N, 75.8298° E",
    source: "exif_gps" // or "device_gps"
}
```

### Storage Keys
```
garbage:1708876543000  ← Record ID (timestamp-based)
garbage:1708876900000
garbage:1708877200000
```

---

## 🌱 Future Enhancements

- [ ] User authentication and personal galleries
- [ ] Community heatmap showing pollution hotspots
- [ ] ML image classification (detect waste types: plastic, metal, paper, etc.)
- [ ] Leaderboard for most active environmental monitors
- [ ] Export reports (CSV/PDF) of recorded locations
- [ ] Mobile app version (React Native)
- [ ] Integration with municipal cleaning services
- [ ] Time-series visualization of cleanup progress

---

## 🔐 Privacy & Data

- **Client-Side Processing**: All EXIF extraction happens locally in browser; no image data sent to servers
- **Optional Cloud Sync**: User can choose whether to upload to cloud or stay on device
- **No Personal Data**: App only collects location and image data you explicitly upload
- **User Control**: Delete records anytime; no data retention after deletion

---

## 🤝 Contributing

Pull requests welcome! Ideas for improvements:
- Additional image format support
- Offline mode with sync
- Time-range filters for history
- Export to common formats (CSV, KML for Google Earth)

---

## 📚 Learning Outcomes

- ✅ Image metadata parsing (EXIF format)
- ✅ Geolocation and mapping integration
- ✅ Async storage patterns and abstraction
- ✅ Drag-and-drop file handling
- ✅ Modal UI patterns
- ✅ Responsive web design
- ✅ Deployment strategies for static sites
- ✅ Real-world user feedback iteration

---

## 👨‍💻 Author

**Chitranshu V. Varughese**  
Computer Science Engineering Student (3rd Year)  
Poornima University  
[GitHub](https://github.com/Chitranshu-varughese1590) | [LinkedIn](https://www.linkedin.com/in/chitranshu-v-varughese-a21616330)

---

## 📄 License

MIT License - Open source and free to modify/deploy/learn from!

---

**Built with environmental passion 🌍 and vanilla JavaScript** 💚
