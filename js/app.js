/**
 * Water Intelligence - Main Application Controller (Dynamic Live Telemetry Edition)
 * Prepared for SIH 2026 - Saurav (Frontend, Dashboard & Data Visualisation)
 */

const CORRECT_PIN = "2026";

// Application State
const state = {
  currentRegionKey: "delhi",
  isLiveApiMode: false,
  backendApiUrl: "http://127.0.0.1:5000/api/water-intelligence",
  data: JSON.parse(JSON.stringify(REGION_DATA)), // Clone deep copy for dynamic mutations
  isUnlocked: false,
  autoStreamInterval: null,
  isAutoStreamActive: true
};

// Expose selectRegion globally for Leaflet map popups
window.selectRegion = function(regionKey) {
  if (state.data[regionKey]) {
    state.currentRegionKey = regionKey;
    const regionSelect = document.getElementById("regionSelect");
    if (regionSelect) regionSelect.value = regionKey;
    renderDashboard(regionKey);
    focusMapRegion(regionKey, state.data);
  }
};

// Lock/Unlock Functions
window.lockDashboard = function() {
  localStorage.removeItem("wi_dashboard_unlocked");
  state.isUnlocked = false;
  const lockModal = document.getElementById("lockModal");
  if (lockModal) {
    lockModal.classList.remove("hidden");
    lockModal.classList.remove("opacity-0");
  }
  const pinInput = document.getElementById("pinInput");
  if (pinInput) {
    pinInput.value = "";
    pinInput.focus();
  }
};

window.unlockDashboard = function() {
  const pinInput = document.getElementById("pinInput");
  const errorMsg = document.getElementById("pinErrorMsg");
  const lockCard = document.getElementById("lockCard");
  const enteredPin = pinInput ? pinInput.value.trim() : "";

  if (enteredPin === CORRECT_PIN) {
    localStorage.setItem("wi_dashboard_unlocked", "true");
    state.isUnlocked = true;
    
    if (errorMsg) errorMsg.classList.add("hidden");

    const lockModal = document.getElementById("lockModal");
    if (lockModal) {
      lockModal.classList.add("transition-all", "duration-500", "opacity-0", "pointer-events-none");
      setTimeout(() => {
        lockModal.classList.add("hidden");
      }, 500);
    }

    setTimeout(() => {
      renderDashboard(state.currentRegionKey);
      if (mapInstance) mapInstance.invalidateSize();
    }, 100);

  } else {
    if (errorMsg) {
      errorMsg.textContent = "Incorrect Security PIN. Please try again.";
      errorMsg.classList.remove("hidden");
    }
    if (lockCard) {
      lockCard.classList.remove("animate-shake");
      void lockCard.offsetWidth; // Trigger reflow
      lockCard.classList.add("animate-shake");
    }
    if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
    }
  }
};

/**
 * Main DOM Content Loaded Event Listener
 */
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // Setup Lock Screen
  setupLockScreen();

  // Populate Dropdown
  setupRegionDropdown();

  // Initialize Map
  initMap(state.data, (selectedKey) => {
    state.currentRegionKey = selectedKey;
    const regionSelect = document.getElementById("regionSelect");
    if (regionSelect) regionSelect.value = selectedKey;
    renderDashboard(selectedKey);
  });

  // Apply initial dynamic micro-jitter on fresh load
  applyLiveTelemetryJitter(state.currentRegionKey, false);

  // Initial Dashboard Render
  renderDashboard(state.currentRegionKey);

  // Setup Event Listeners
  setupEventListeners();

  // Initialize Akansha's Database Hub & SQL Simulator
  initDatabaseTab();

  // Start Live Streaming Auto-Update (Every 6 Seconds)
  startLiveAutoStream();
});

/**
 * Setup Lock Screen
 */
function setupLockScreen() {
  const isUnlocked = localStorage.getItem("wi_dashboard_unlocked") === "true";
  const lockModal = document.getElementById("lockModal");
  const pinInput = document.getElementById("pinInput");
  const unlockBtn = document.getElementById("unlockBtn");

  if (isUnlocked) {
    state.isUnlocked = true;
    if (lockModal) lockModal.classList.add("hidden");
  } else {
    state.isUnlocked = false;
    if (lockModal) {
      lockModal.classList.remove("hidden");
      if (pinInput) setTimeout(() => pinInput.focus(), 200);
    }
  }

  if (unlockBtn) {
    unlockBtn.addEventListener("click", window.unlockDashboard);
  }

  if (pinInput) {
    pinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        window.unlockDashboard();
      }
    });
  }
}

function setupRegionDropdown() {
  const select = document.getElementById("regionSelect");
  if (!select) return;

  select.innerHTML = "";
  Object.keys(state.data).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${state.data[key].name} (${state.data[key].state})`;
    option.className = "bg-slate-900 text-slate-100 py-1";
    if (key === state.currentRegionKey) option.selected = true;
    select.appendChild(option);
  });
}

function setupEventListeners() {
  // Region Dropdown change
  const regionSelect = document.getElementById("regionSelect");
  if (regionSelect) {
    regionSelect.addEventListener("change", (e) => {
      window.selectRegion(e.target.value);
    });
  }

  // Tab switching
  const tabButtons = document.querySelectorAll("[data-tab-target]");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-target");
      switchTab(target);
    });
  });

  // Manual Live Fetch / Refresh Button
  const btnManualRefresh = document.getElementById("btnManualRefresh");
  if (btnManualRefresh) {
    btnManualRefresh.addEventListener("click", () => {
      const icon = document.getElementById("refreshIcon");
      if (icon) {
        icon.classList.remove("spinning-icon");
        void icon.offsetWidth;
        icon.classList.add("spinning-icon");
      }
      applyLiveTelemetryJitter(state.currentRegionKey, true);
      renderDashboard(state.currentRegionKey);
    });
  }

  // Auto-Stream Toggle
  const autoStreamToggle = document.getElementById("autoStreamToggle");
  if (autoStreamToggle) {
    autoStreamToggle.addEventListener("change", (e) => {
      state.isAutoStreamActive = e.target.checked;
      const pulsePing = document.getElementById("livePulsePing");
      const pulseDot = document.getElementById("livePulseDot");
      const statusText = document.getElementById("liveStatusText");

      if (state.isAutoStreamActive) {
        startLiveAutoStream();
        if (pulsePing) pulsePing.classList.remove("hidden");
        if (pulseDot) pulseDot.className = "relative inline-flex rounded-full h-2 w-2 bg-emerald-500";
        if (statusText) statusText.textContent = "Live Stream (6s)";
      } else {
        stopLiveAutoStream();
        if (pulsePing) pulsePing.classList.add("hidden");
        if (pulseDot) pulseDot.className = "relative inline-flex rounded-full h-2 w-2 bg-slate-500";
        if (statusText) statusText.textContent = "Stream Paused";
      }
    });
  }

  // Quick Action Button (Simulation)
  const btnTriggerSim = document.getElementById("btnTriggerSim");
  if (btnTriggerSim) {
    btnTriggerSim.addEventListener("click", () => {
      simulatePredictionDrift();
    });
  }

  // Header Lock Button
  const btnLockScreen = document.getElementById("btnLockScreen");
  if (btnLockScreen) {
    btnLockScreen.addEventListener("click", () => {
      window.lockDashboard();
    });
  }

  // Kanika's MCDA Simulator Slider Listeners
  setupMCDASimulatorListeners();
}

/**
 * Kanika's Multi-Criteria Decision Analysis (MCDA) Simulator Logic
 */
function setupMCDASimulatorListeners() {
  const sRainfall = document.getElementById("sliderRainfall");
  const sStorage = document.getElementById("sliderStorage");
  const sConsumption = document.getElementById("sliderConsumption");

  [sRainfall, sStorage, sConsumption].forEach(slider => {
    if (slider) {
      slider.addEventListener("input", updateMCDACalculation);
    }
  });

  updateMCDACalculation();
}

function updateMCDACalculation() {
  const sRainfall = document.getElementById("sliderRainfall");
  const sStorage = document.getElementById("sliderStorage");
  const sConsumption = document.getElementById("sliderConsumption");

  const w1 = sRainfall ? parseInt(sRainfall.value) : 40;
  const w2 = sStorage ? parseInt(sStorage.value) : 35;
  const w3 = sConsumption ? parseInt(sConsumption.value) : 25;

  const lRain = document.getElementById("labelRainfallWeight");
  const lStore = document.getElementById("labelStorageWeight");
  const lCons = document.getElementById("labelConsumptionWeight");

  if (lRain) lRain.textContent = `${w1}%`;
  if (lStore) lStore.textContent = `${w2}%`;
  if (lCons) lCons.textContent = `${w3}%`;

  // Formula: S = (w1 * 85 + w2 * 72 + w3 * 64) / (w1 + w2 + w3)
  const totalWeight = (w1 + w2 + w3) || 100;
  const compositeScore = ((w1 * 88 + w2 * 74 + w3 * 62) / totalWeight).toFixed(1);

  const scoreDisplay = document.getElementById("mcdaScoreDisplay");
  const riskClass = document.getElementById("mcdaRiskClassification");

  if (scoreDisplay) scoreDisplay.textContent = compositeScore;

  if (riskClass) {
    if (compositeScore >= 80) {
      riskClass.textContent = "CRITICAL VULNERABILITY (STAGE 4)";
      riskClass.className = "text-base font-black text-rose-400";
    } else if (compositeScore >= 65) {
      riskClass.textContent = "HIGH VULNERABILITY (STAGE 3)";
      riskClass.className = "text-base font-black text-orange-400";
    } else if (compositeScore >= 50) {
      riskClass.textContent = "MODERATE STRESS (STAGE 2)";
      riskClass.className = "text-base font-black text-amber-400";
    } else {
      riskClass.textContent = "NORMAL BASELINE (STAGE 1)";
      riskClass.className = "text-base font-black text-emerald-400";
    }
  }
}

window.resetMCDASimulator = function() {
  const sRainfall = document.getElementById("sliderRainfall");
  const sStorage = document.getElementById("sliderStorage");
  const sConsumption = document.getElementById("sliderConsumption");

  if (sRainfall) sRainfall.value = 40;
  if (sStorage) sStorage.value = 35;
  if (sConsumption) sConsumption.value = 25;

  updateMCDACalculation();
};

/**
 * Starts automatic telemetry polling/simulation
 */
function startLiveAutoStream() {
  if (state.autoStreamInterval) clearInterval(state.autoStreamInterval);
  state.autoStreamInterval = setInterval(() => {
    if (state.isAutoStreamActive) {
      applyLiveTelemetryJitter(state.currentRegionKey, false);
      renderDashboard(state.currentRegionKey);
    }
  }, 6000);
}

function stopLiveAutoStream() {
  if (state.autoStreamInterval) {
    clearInterval(state.autoStreamInterval);
    state.autoStreamInterval = null;
  }
}

/**
 * Generates realistic dynamic micro-fluctuations simulating live IoT telemetry & weather feeds
 */
function applyLiveTelemetryJitter(regionKey, isManual) {
  const baseData = REGION_DATA[regionKey];
  if (!baseData) return;

  // Clone fresh from base
  const updated = JSON.parse(JSON.stringify(baseData));

  // 1. Storage micro variance (+/- 0.8%)
  const storageJitter = (Math.random() * 1.6 - 0.8);
  const newStorage = Math.max(8, Math.min(96, Number((baseData.storageLevel.value + storageJitter).toFixed(1))));
  updated.storageLevel.value = newStorage;

  // 2. Groundwater depth micro variance (+/- 0.15m)
  const gwJitter = (Math.random() * 0.3 - 0.15);
  const baseGwNum = parseFloat(baseData.groundwaterDepth.value);
  if (!isNaN(baseGwNum)) {
    updated.groundwaterDepth.value = `${(baseGwNum + gwJitter).toFixed(1)} m`;
  }

  // 3. Urban Consumption variance (+/- 4 MLD)
  const baseCons = parseInt(baseData.dailyConsumption);
  if (!isNaN(baseCons)) {
    const consJitter = Math.floor(Math.random() * 9 - 4);
    updated.dailyConsumption = `${baseCons + consJitter} MLD`;
  }

  // 4. ML 4-Day Forecast slight dynamic adjustment
  updated.next4Days = baseData.next4Days.map((item, idx) => {
    const dayJitter = Math.floor(Math.random() * 5 - 2);
    const val = Math.max(10, Math.min(95, item.value + dayJitter));
    return {
      ...item,
      value: val
    };
  });

  state.data[regionKey] = updated;

  // Update live timestamp
  const now = new Date();
  const timeStr = now.toTimeString().split(" ")[0];
  const lastUpdatedEl = document.getElementById("lastUpdatedBadge");
  if (lastUpdatedEl) {
    lastUpdatedEl.innerHTML = `<span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span> Live Ingested: ${timeStr}`;
  }

  // Update Database Tab live table & row counts
  totalSimulatedDbRows += Math.floor(Math.random() * 2 + 1);
  const rowCountEl = document.getElementById("dbRowCountDisplay");
  if (rowCountEl) {
    rowCountEl.textContent = `${totalSimulatedDbRows.toLocaleString()} Rows`;
  }
  renderDatabaseTable();

  // Flash cards on update
  flashMetricCards();
}

function flashMetricCards() {
  const elements = [
    document.getElementById("storageValue"),
    document.getElementById("groundwaterValue"),
    document.getElementById("consumptionValue")
  ];

  elements.forEach(el => {
    if (el) {
      el.classList.remove("flash-update");
      void el.offsetWidth;
      el.classList.add("flash-update");
    }
  });
}

function switchTab(tabId) {
  document.querySelectorAll("[data-tab-target]").forEach(btn => {
    if (btn.getAttribute("data-tab-target") === tabId) {
      btn.className = "tab-btn active-tab px-3.5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 border-sky-400 text-sky-400 flex items-center gap-1.5 rounded-lg shrink-0";
    } else {
      btn.className = "tab-btn px-3.5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 rounded-lg shrink-0";
    }
  });

  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.add("hidden");
  });
  const activePanel = document.getElementById(tabId);
  if (activePanel) {
    activePanel.classList.remove("hidden");
  }

  if (tabId === "map-view-tab" && mapInstance) {
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 150);
  }

  if (tabId === "database-hub-tab") {
    renderDatabaseTable();
    executeActiveSqlQuery();
  }
}

function renderDashboard(regionKey) {
  const data = state.data[regionKey];
  if (!data) return;

  // 1. Header
  setText("regionTitle", data.name);
  setText("regionSubtitle", `Monitoring Zone: ${data.state} · Real-time Sensor Ingestion`);

  // 2. Risk Status Badge
  renderRiskStatusBadge(data.status, data.statusText);

  // 3. KPI Cards
  setText("trendValue", `${data.waterTrend.direction === 'down' ? '↓' : '↑'} ${data.waterTrend.label}`);
  setText("trendDelta", `${data.waterTrend.change} baseline variance`);
  const trendEl = document.getElementById("trendValue");
  if (trendEl) {
    trendEl.className = data.waterTrend.direction === 'down' 
      ? 'text-base sm:text-xl font-black text-rose-400 flex items-center gap-1' 
      : 'text-base sm:text-xl font-black text-emerald-400 flex items-center gap-1';
  }

  setText("forecast7dValue", data.forecast7d.label);
  setText("forecast7dNote", data.forecast7d.note);

  setText("storageValue", `${data.storageLevel.value}%`);
  setText("storageNote", data.storageLevel.label);
  const storageBar = document.getElementById("storageProgressBar");
  if (storageBar) {
    storageBar.style.width = `${Math.min(100, Math.max(0, data.storageLevel.value))}%`;
  }
  setText("groundwaterValue", data.groundwaterDepth.value);
  setText("groundwaterNote", data.groundwaterDepth.label);
  setText("consumptionValue", data.dailyConsumption);
  setText("rainfallAnomalyValue", data.rainfallAnomaly);

  // 4. Update Charts
  updateForecastChart(data.next4Days);
  updateHistoricalChart(data.historical);
  updateFactorDonut(data.factors);

  // 5. Render Early Warning Alert
  renderAlertBanner(data);

  // 6. Render Contributing Factors
  renderFactorsList(data.factors);

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderRiskStatusBadge(status, statusText) {
  const badge = document.getElementById("statusBadge");
  if (!badge) return;

  let colorClasses = "";
  let iconName = "alert-triangle";

  switch (status.toUpperCase()) {
    case "CRITICAL":
      colorClasses = "bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-lg shadow-rose-950/40 animate-pulse";
      iconName = "alert-octagon";
      break;
    case "HIGH":
      colorClasses = "bg-orange-950/90 text-orange-300 border-orange-500/60 shadow-lg shadow-orange-950/40";
      iconName = "alert-triangle";
      break;
    case "MODERATE":
      colorClasses = "bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-950/40";
      iconName = "info";
      break;
    case "LOW":
    default:
      colorClasses = "bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950/40";
      iconName = "check-circle-2";
      break;
  }

  badge.className = `px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider border flex items-center gap-1.5 ${colorClasses}`;
  badge.innerHTML = `<i data-lucide="${iconName}" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i> ${status} RISK`;
}

function renderAlertBanner(data) {
  const alertContainer = document.getElementById("alertBannerContainer");
  if (!alertContainer) return;

  const alert = data.alert;
  if (!alert) {
    alertContainer.innerHTML = "";
    return;
  }

  const isHighOrCritical = data.status === "HIGH" || data.status === "CRITICAL";
  const bgClass = isHighOrCritical 
    ? "bg-rose-950/40 border-rose-800/60 text-rose-100" 
    : "bg-emerald-950/40 border-emerald-800/60 text-emerald-100";
  const badgeClass = isHighOrCritical ? "bg-rose-600 text-white" : "bg-emerald-600 text-white";

  alertContainer.innerHTML = `
    <div class="rounded-2xl border p-4 sm:p-5 ${bgClass} backdrop-blur shadow-lg">
      <div class="flex items-start gap-3 sm:gap-3.5">
        <div class="p-2 sm:p-2.5 rounded-xl ${badgeClass} shrink-0 mt-0.5 shadow-md">
          <i data-lucide="${isHighOrCritical ? 'alert-triangle' : 'shield-check'}" class="w-4 h-4 sm:w-5 sm:h-5"></i>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-black text-sm sm:text-base tracking-tight text-white">${alert.title}</h4>
            <span class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-black uppercase ${badgeClass}">${data.status}</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 mb-3">${alert.summary}</p>
          
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Main Factors:</span>
            ${data.factors.map(f => `
              <span class="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200">
                <span class="${f.trend === 'down' ? 'text-rose-400 font-black' : 'text-amber-400 font-black'}">${f.trend === 'down' ? '↓' : '↑'}</span>
                <span>${f.name}</span>
              </span>
            `).join('')}
          </div>

          <div class="bg-slate-900/90 rounded-xl p-3 sm:p-4 border border-slate-800">
            <p class="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-sky-400"></i> Proactive Decision Support (Early Action):
            </p>
            <ul class="space-y-1 text-xs text-slate-300 list-disc list-inside">
              ${alert.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFactorsList(factors) {
  const container = document.getElementById("factorsListContainer");
  if (!container) return;

  container.innerHTML = factors.map(factor => `
    <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-bold text-slate-200 flex items-center gap-1">
          <span class="font-bold ${factor.trend === 'down' ? 'text-rose-400' : 'text-amber-400'}">
            ${factor.trend === 'down' ? '↓' : '↑'}
          </span>
          ${factor.name}
        </span>
        <span class="text-[10px] sm:text-[11px] font-black text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/30">
          ${factor.weight}% weight
        </span>
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed">${factor.desc}</p>
    </div>
  `).join('');
}

function simulatePredictionDrift() {
  const current = state.data[state.currentRegionKey];
  if (!current) return;

  current.status = "CRITICAL";
  current.statusText = "Simulated Heatwave & Inflow Shock";
  current.waterTrend = { label: "Severe Plunge", change: "-34%", direction: "down" };
  current.next4Days = [
    { day: "Today", value: 45, color: "#fb923c", badge: "Stressed" },
    { day: "Day 2", value: 32, color: "#f87171", badge: "Critical" },
    { day: "Day 3", value: 20, color: "#ef4444", badge: "Severe" },
    { day: "Day 4", value: 14, color: "#991b1b", badge: "Emergency" }
  ];
  current.alert.title = "SIMULATION ALERT: Accelerated Aquifer Depletion";
  current.alert.summary = "Deep learning model flags high probability of reservoir head exhaustion within 96 hours.";

  renderDashboard(state.currentRegionKey);
  flashMetricCards();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * =========================================================================
 * Akansha's Relational Database & SQL Telemetry Module (Layer 2)
 * =========================================================================
 */

let activePresetQueryId = "query_critical";
let totalSimulatedDbRows = 14480;

function initDatabaseTab() {
  // Load first preset query into editor
  loadPresetQuery("query_critical");

  // Render initial SQL Live Ingestion Table
  renderDatabaseTable();

  // Setup DB tab event listeners
  setupDatabaseListeners();
}

window.loadPresetQuery = function(presetId) {
  const preset = PRESET_SQL_QUERIES.find(p => p.id === presetId);
  if (!preset) return;

  activePresetQueryId = presetId;
  const editor = document.getElementById("sqlInputEditor");
  const descEl = document.getElementById("activePresetDesc");

  if (editor) editor.value = preset.sql;
  if (descEl) descEl.textContent = preset.description;

  // Execute query immediately to display results
  executeActiveSqlQuery();
};

function setupDatabaseListeners() {
  const btnRun = document.getElementById("btnRunQuery");
  if (btnRun) {
    btnRun.addEventListener("click", () => {
      executeActiveSqlQuery();
    });
  }

  const btnReset = document.getElementById("btnResetQuery");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      loadPresetQuery("query_critical");
    });
  }

  const dbSearch = document.getElementById("dbSearchInput");
  if (dbSearch) {
    dbSearch.addEventListener("input", filterDatabaseTable);
  }

  const dbFilter = document.getElementById("dbRiskFilter");
  if (dbFilter) {
    dbFilter.addEventListener("change", filterDatabaseTable);
  }

  const btnCsv = document.getElementById("btnExportCsv");
  if (btnCsv) {
    btnCsv.addEventListener("click", exportDatabaseCSV);
  }

  const btnSqlDump = document.getElementById("btnExportSqlDump");
  if (btnSqlDump) {
    btnSqlDump.addEventListener("click", exportDatabaseSqlDump);
  }
}

function executeActiveSqlQuery() {
  const editor = document.getElementById("sqlInputEditor");
  const sqlText = editor ? editor.value.trim() : "";
  const container = document.getElementById("queryResultContainer");
  const metaBadge = document.getElementById("queryResultMeta");
  const statusBadge = document.getElementById("queryExecBadge");

  const startTime = performance.now();

  let columns = [];
  let rows = [];

  // Parse query based on SQL keywords
  const upperSql = sqlText.toUpperCase();

  if (upperSql.includes("GROUP BY STATE") || activePresetQueryId === "query_state_agg") {
    // State Aggregation Query
    columns = ["state", "monitored_districts", "avg_storage_pct", "avg_gw_depth_m", "status_summary"];
    const stateMap = {};
    Object.keys(state.data).forEach(k => {
      const d = state.data[k];
      if (!stateMap[d.state]) {
        stateMap[d.state] = { count: 0, totalStorage: 0, totalGw: 0, risks: [] };
      }
      stateMap[d.state].count++;
      stateMap[d.state].totalStorage += Number(d.storageLevel.value);
      stateMap[d.state].totalGw += parseFloat(d.groundwaterDepth.value) || 25;
      stateMap[d.state].risks.push(d.status);
    });

    rows = Object.keys(stateMap).map(st => {
      const item = stateMap[st];
      const avgStorage = (item.totalStorage / item.count).toFixed(1);
      const avgGw = (item.totalGw / item.count).toFixed(1);
      const hasCritical = item.risks.includes("CRITICAL");
      const hasHigh = item.risks.includes("HIGH");
      const summary = hasCritical ? "CRITICAL RISK" : (hasHigh ? "HIGH STRESS" : "STABLE BUFFER");
      return [st, item.count, `${avgStorage}%`, `${avgGw} m`, summary];
    });

  } else if (upperSql.includes("FORECAST_4DAYS") || activePresetQueryId === "query_forecast") {
    // 4-Day Forecast Query
    columns = ["region_id", "region_name", "state", "day_name", "predicted_availability", "badge_label"];
    Object.keys(state.data).forEach(k => {
      const d = state.data[k];
      const day4 = d.next4Days[3] || d.next4Days[d.next4Days.length - 1];
      rows.push([
        k,
        d.name,
        d.state,
        day4.day || "Day 4",
        `${day4.value}%`,
        day4.badge || "Stressed"
      ]);
    });
    // Sort ascending by availability
    rows.sort((a, b) => parseFloat(a[4]) - parseFloat(b[4]));

  } else if (upperSql.includes("GROUNDWATER_DEPTH_M DESC") || activePresetQueryId === "query_groundwater") {
    // Deepest Aquifer Query
    columns = ["region_id", "region_name", "state", "groundwater_depth_m", "daily_consumption", "risk_status"];
    const list = Object.keys(state.data).map(k => state.data[k]);
    list.sort((a, b) => {
      const gA = parseFloat(a.groundwaterDepth.value) || 0;
      const gB = parseFloat(b.groundwaterDepth.value) || 0;
      return gB - gA;
    });

    rows = list.slice(0, 5).map(d => [
      d.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 6),
      d.name,
      d.state,
      d.groundwaterDepth.value,
      d.dailyConsumption,
      d.status
    ]);

  } else {
    // Default / Critical Risk Filter Query
    columns = ["region_id", "region_name", "state", "storage_capacity_pct", "groundwater_depth_m", "risk_status"];
    Object.keys(state.data).forEach(k => {
      const d = state.data[k];
      if (d.status === "CRITICAL" || d.status === "HIGH" || !upperSql.includes("CRITICAL")) {
        rows.push([
          k,
          d.name,
          d.state,
          `${d.storageLevel.value}%`,
          d.groundwaterDepth.value,
          d.status
        ]);
      }
    });
    rows.sort((a, b) => parseFloat(a[3]) - parseFloat(b[3]));
  }

  const endTime = performance.now();
  const execTime = (endTime - startTime + (Math.random() * 0.4 + 0.6)).toFixed(2);

  if (metaBadge) {
    metaBadge.textContent = `${rows.length} records retrieved in ${execTime} ms`;
  }
  if (statusBadge) {
    statusBadge.textContent = `⚡ Executed in ${execTime} ms · 0 Errors`;
  }

  if (container) {
    container.innerHTML = `
      <table class="w-full text-left text-xs font-mono">
        <thead class="bg-slate-900 text-sky-400 border-b border-slate-800 text-[10px] uppercase tracking-wider">
          <tr>
            <th class="py-2 px-3 text-slate-500">#</th>
            ${columns.map(col => `<th class="py-2 px-3">${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-900 text-slate-300">
          ${rows.map((row, idx) => `
            <tr class="hover:bg-slate-900/60 transition">
              <td class="py-2 px-3 text-slate-600">${idx + 1}</td>
              ${row.map(val => {
                let badgeClass = "";
                if (val === "CRITICAL" || val === "Emergency") badgeClass = "text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800";
                else if (val === "HIGH" || val === "High Risk" || val === "Severe") badgeClass = "text-orange-400 font-bold bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-800";
                else if (val === "MODERATE" || val === "Stressed" || val === "HIGH STRESS") badgeClass = "text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800";
                else if (val === "LOW" || val === "Normal" || val === "STABLE BUFFER") badgeClass = "text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800";

                return `<td class="py-2 px-3 ${badgeClass ? '' : 'text-slate-300'}">${badgeClass ? `<span class="${badgeClass}">${val}</span>` : val}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

function renderDatabaseTable() {
  const tbody = document.getElementById("dbLiveTableBody");
  if (!tbody) return;

  const searchInput = document.getElementById("dbSearchInput");
  const riskFilter = document.getElementById("dbRiskFilter");

  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const filter = riskFilter ? riskFilter.value : "ALL";

  const entries = Object.keys(state.data).map(key => ({
    key,
    ...state.data[key]
  }));

  const filtered = entries.filter(item => {
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) || 
      item.state.toLowerCase().includes(query) || 
      item.key.toLowerCase().includes(query);
    const matchesRisk = filter === "ALL" || item.status.toUpperCase() === filter;
    return matchesSearch && matchesRisk;
  });

  tbody.innerHTML = filtered.map(item => {
    let riskBadge = "";
    switch (item.status) {
      case "CRITICAL":
        riskBadge = `<span class="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold">CRITICAL</span>`;
        break;
      case "HIGH":
        riskBadge = `<span class="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-600 font-bold">HIGH</span>`;
        break;
      case "MODERATE":
        riskBadge = `<span class="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600 font-bold">MODERATE</span>`;
        break;
      case "LOW":
      default:
        riskBadge = `<span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">LOW</span>`;
        break;
    }

    return `
      <tr class="hover:bg-slate-900/80 transition">
        <td class="py-2 px-3 font-mono text-sky-400 font-bold">${item.key}</td>
        <td class="py-2 px-3 font-sans font-bold text-white">${item.name}</td>
        <td class="py-2 px-3 text-slate-400 font-sans">${item.state}</td>
        <td class="py-2 px-3 font-mono text-emerald-400 font-bold">${item.storageLevel.value}%</td>
        <td class="py-2 px-3 font-mono text-amber-300">${item.groundwaterDepth.value}</td>
        <td class="py-2 px-3 font-mono text-slate-300">${item.dailyConsumption}</td>
        <td class="py-2 px-3 font-mono text-rose-400">${item.rainfallAnomaly}</td>
        <td class="py-2 px-3">${riskBadge}</td>
        <td class="py-2 px-3 text-right">
          <button onclick="window.selectRegion('${item.key}'); switchTab('dashboard-tab');" class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-600 transition cursor-pointer">
            Inspect →
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const summary = document.getElementById("dbTableSummaryText");
  if (summary) {
    summary.textContent = `Showing ${filtered.length} of ${entries.length} active district telemetry nodes`;
  }
}

function filterDatabaseTable() {
  renderDatabaseTable();
}

function exportDatabaseCSV() {
  const entries = Object.keys(state.data).map(k => state.data[k]);
  const headers = ["region_id", "region_name", "state", "storage_capacity_pct", "groundwater_depth_m", "daily_consumption_mld", "rainfall_anomaly", "risk_status", "ingestion_timestamp"];

  const rows = entries.map(item => [
    item.name.toLowerCase().replace(/[^a-z]/g, ''),
    `"${item.name}"`,
    `"${item.state}"`,
    item.storageLevel.value,
    `"${item.groundwaterDepth.value}"`,
    `"${item.dailyConsumption}"`,
    `"${item.rainfallAnomaly}"`,
    item.status,
    `"${new Date().toISOString()}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `water_intelligence_telemetry_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportDatabaseSqlDump() {
  const entries = Object.keys(state.data).map(k => ({ key: k, ...state.data[k] }));

  let sqlDump = `-- ==========================================================\n`;
  sqlDump += `-- Water Intelligence — SQLite / PostgreSQL Telemetry DDL\n`;
  sqlDump += `-- Smart India Hackathon 2026 — Layer 2 Data Storage (Akansha)\n`;
  sqlDump += `-- Ingestion Date: ${new Date().toUTCString()}\n`;
  sqlDump += `-- ==========================================================\n\n`;

  sqlDump += `-- Table 1: Master Districts\n`;
  sqlDump += `CREATE TABLE IF NOT EXISTS regions (\n`;
  sqlDump += `    region_id TEXT PRIMARY KEY,\n`;
  sqlDump += `    region_name TEXT NOT NULL,\n`;
  sqlDump += `    state TEXT NOT NULL,\n`;
  sqlDump += `    lat REAL NOT NULL,\n`;
  sqlDump += `    lng REAL NOT NULL\n`;
  sqlDump += `);\n\n`;

  sqlDump += `-- Table 2: Real-Time Sensor Telemetry Stream\n`;
  sqlDump += `CREATE TABLE IF NOT EXISTS sensor_telemetry (\n`;
  sqlDump += `    telemetry_id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
  sqlDump += `    region_id TEXT REFERENCES regions(region_id),\n`;
  sqlDump += `    storage_capacity_pct REAL NOT NULL,\n`;
  sqlDump += `    groundwater_depth_m REAL NOT NULL,\n`;
  sqlDump += `    daily_consumption_mld INTEGER NOT NULL,\n`;
  sqlDump += `    rainfall_anomaly_pct TEXT NOT NULL,\n`;
  sqlDump += `    risk_status TEXT NOT NULL,\n`;
  sqlDump += `    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
  sqlDump += `);\n\n`;

  sqlDump += `-- Table 3: 4-Day AI Predictions (Deep's Model Outputs)\n`;
  sqlDump += `CREATE TABLE IF NOT EXISTS forecast_4days (\n`;
  sqlDump += `    forecast_id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
  sqlDump += `    region_id TEXT REFERENCES regions(region_id),\n`;
  sqlDump += `    day_name TEXT NOT NULL,\n`;
  sqlDump += `    predicted_availability REAL NOT NULL,\n`;
  sqlDump += `    badge_label TEXT NOT NULL\n`;
  sqlDump += `);\n\n`;

  sqlDump += `-- Table 4: MCDA Risk Weights (Kanika's Research Engine)\n`;
  sqlDump += `CREATE TABLE IF NOT EXISTS mcda_risk_weights (\n`;
  sqlDump += `    weight_id INTEGER PRIMARY KEY,\n`;
  sqlDump += `    parameter_name TEXT NOT NULL,\n`;
  sqlDump += `    weight_percentage INTEGER NOT NULL\n`;
  sqlDump += `);\n\n`;

  sqlDump += `-- Initial Seed Data (12 Indian Districts)\n`;
  entries.forEach(e => {
    sqlDump += `INSERT INTO regions (region_id, region_name, state, lat, lng) VALUES ('${e.key}', '${e.name}', '${e.state}', ${e.lat}, ${e.lng});\n`;
    sqlDump += `INSERT INTO sensor_telemetry (region_id, storage_capacity_pct, groundwater_depth_m, daily_consumption_mld, rainfall_anomaly_pct, risk_status) VALUES ('${e.key}', ${e.storageLevel.value}, ${parseFloat(e.groundwaterDepth.value) || 30.0}, ${parseInt(e.dailyConsumption) || 500}, '${e.rainfallAnomaly}', '${e.status}');\n`;
  });

  const blob = new Blob([sqlDump], { type: "text/sql;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `akansha_water_intelligence_schema_${Date.now()}.sql`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

