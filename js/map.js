/**
 * Water Intelligence - Geospatial Map Engine (Cyber Radar Edition)
 * Prepared for SIH 2026 - Saurav (Frontend & Visualisation Lead)
 */

let mapInstance = null;
let markersLayer = null;

const REGION_COORDINATES = {
  delhi: { lat: 28.6139, lng: 77.2090, label: "Delhi NCR" },
  bundelkhand: { lat: 25.4484, lng: 79.5678, label: "Bundelkhand" },
  marathwada: { lat: 19.8762, lng: 75.3433, label: "Marathwada" },
  jaipur: { lat: 26.9124, lng: 75.7873, label: "Jaipur" },
  bengaluru: { lat: 12.9716, lng: 77.5946, label: "Bengaluru" },
  chennai: { lat: 13.0827, lng: 80.2707, label: "Chennai" }
};

function getStatusColor(status) {
  switch ((status || "").toUpperCase()) {
    case "CRITICAL": return "#f43f5e";
    case "HIGH": return "#fb923c";
    case "MODERATE": return "#fbbf24";
    case "LOW":
    default: return "#10b981";
  }
}

/**
 * Initialize Dark Cyber Leaflet Map
 */
function initMap(data, onMarkerClick) {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  // Centered on India
  mapInstance = L.map("map", {
    center: [22.5, 78.9],
    zoom: window.innerWidth < 640 ? 4.2 : 4.8,
    minZoom: 3.5,
    maxZoom: 10,
    zoomControl: true
  });

  // CartoDB Dark Matter High-Res Tiles
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CartoDB</a> | SIH 2026 Water AI',
    maxZoom: 19,
    subdomains: "abcd"
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);
  renderMapMarkers(data, onMarkerClick);
}

/**
 * Render Glowing Radar Pins on Map
 */
function renderMapMarkers(data, onMarkerClick) {
  if (!markersLayer || !mapInstance) return;
  markersLayer.clearLayers();

  Object.keys(data).forEach(key => {
    const regionData = data[key];
    if (!regionData || !regionData.lat || !regionData.lng) return;

    const lat = regionData.lat;
    const lng = regionData.lng;
    const color = getStatusColor(regionData.status);

    // Glowing Radar Ping Ring (Outer)
    const pingCircle = L.circleMarker([lat, lng], {
      radius: 18,
      color: color,
      fillColor: color,
      fillOpacity: 0.15,
      weight: 1,
      className: 'radar-pulse-marker'
    }).addTo(markersLayer);

    // Core Solid Telemetry Node (Inner)
    const marker = L.circleMarker([lat, lng], {
      radius: 8,
      fillColor: color,
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.95
    }).addTo(markersLayer);

    // Cyber Tooltip Popup
    const popupHtml = `
      <div class="p-2 space-y-1.5 min-w-[190px]">
        <div class="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1">
          <strong class="text-xs font-black text-white">${regionData.name}</strong>
          <span class="text-[9px] font-black px-1.5 py-0.5 rounded uppercase" style="background-color: ${color}22; color: ${color}; border: 1px solid ${color}66;">
            ${regionData.status}
          </span>
        </div>
        <div class="text-[10px] space-y-1 text-slate-300">
          <div class="flex justify-between">
            <span class="text-slate-400">Storage Level:</span>
            <span class="font-bold text-white">${regionData.storageLevel.value}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Groundwater:</span>
            <span class="font-bold text-white">${regionData.groundwaterDepth.value}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Consumption:</span>
            <span class="font-bold text-sky-300">${regionData.dailyConsumption}</span>
          </div>
        </div>
        <button 
          onclick="window.selectRegion('${key}')" 
          class="w-full mt-1.5 py-1 px-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-[10px] font-black tracking-wide shadow-md transition-all active:scale-95 text-center cursor-pointer block"
        >
          Inspect Live Node ➔
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -5] });
    pingCircle.bindPopup(popupHtml, { closeButton: false, offset: [0, -5] });

    marker.on("click", () => {
      if (onMarkerClick) onMarkerClick(key);
    });
  });
}

/**
 * Smoothly Pan Map to Selected Region
 */
function focusMapRegion(regionKey, data) {
  if (!mapInstance) return;
  const regionData = data ? data[regionKey] : null;
  if (regionData && regionData.lat && regionData.lng) {
    mapInstance.flyTo([regionData.lat, regionData.lng], 6.5, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  } else if (REGION_COORDINATES[regionKey]) {
    const coords = REGION_COORDINATES[regionKey];
    mapInstance.flyTo([coords.lat, coords.lng], 6.5, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }
}
