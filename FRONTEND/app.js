// ============================================================================
// MAUSAM-AI: WHITE SIDEBAR + DARK MODE + DUAL-TONE BLUE UI CONTROLLER
// Standalone Frontend — Ready for Future Backend Integration
// ============================================================================

const API_CONFIG = {
  USE_BACKEND: false,
  BASE_URL: "http://localhost:8080/api/v1"
};

const REGIME_PHOTOS = {
  monsoon_depression:
    "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=1000&auto=format&fit=crop&q=80",
  heavy_rainfall:
    "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1000&auto=format&fit=crop&q=80",
  western_disturbance:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80",
  cyclone:
    "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1000&auto=format&fit=crop&q=80",
  heat_wave:
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1000&auto=format&fit=crop&q=80",
  break_monsoon:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop&q=80"
};

let state = {
  activeTab: "home",
  regimeId: "monsoon_depression",
  selectedRegionId: "odisha_coastal",
  leadDay: 5,
  curveMode: "bust", // 'bust' | 'confidence'
  mapMode: "bust", // 'bust' | 'confidence'
  matrixMode: "bust",
  isPlaying: false,
  playInterval: null,
  isDarkMode: false
};

let homeMiniMap = null;
let homeMiniTileLayer = null;
let homeMiniLayer = null;
let fullGisMap = null;
let fullGisTileLayer = null;
let fullGisLayer = null;
let splineChart = null;

// Custom Chart.js plugin to draw value labels right above each point on the spline curve
const pointValueLabelPlugin = {
  id: "pointValueLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const isDark = document.documentElement.classList.contains("dark");
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((point, index) => {
        const val = dataset.data[index];
        ctx.save();
        ctx.font = "600 11px 'Poppins', sans-serif";
        ctx.fillStyle =
          index + 1 === state.leadDay
            ? isDark
              ? "#ffffff"
              : "#1F3153"
            : "#4D94DB";
        ctx.textAlign = "center";
        ctx.fillText(`${val}%`, point.x, point.y - 12);
        ctx.restore();
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  populateRegionDropdown();
  initHomeMiniMap();
  updateAllUI();
  updateSimulator();
});

// ============================================================================
// DARK MODE TOGGLE
// ============================================================================
function toggleDarkMode() {
  state.isDarkMode = !state.isDarkMode;
  document.documentElement.classList.toggle("dark", state.isDarkMode);

  const labelEl = document.getElementById("sidebar-theme-label");
  if (labelEl) {
    labelEl.textContent = state.isDarkMode ? "Light Mode" : "Dark Mode";
  }

  // Switch basemap tiles between light voyager and dark_all
  const tileUrl = state.isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  if (homeMiniTileLayer) homeMiniTileLayer.setUrl(tileUrl);
  if (fullGisTileLayer) fullGisTileLayer.setUrl(tileUrl);

  updateAllUI();
  updateSimulator();
}

// ============================================================================
// METRICS CALCULATION
// ============================================================================
function getRegionMetrics(regimeId, regionId, day) {
  const regime = WEATHER_REGIMES[regimeId];
  const profile =
    regime.regionBustProfiles[regionId] || [20, 25, 35, 45, 55, 60, 58, 52, 48, 45];
  const bustProb = profile[Math.max(0, Math.min(9, day - 1))];
  const confidence = 100 - bustProb;
  const spreadVal = Math.round(bustProb * 0.82 + day * 1.6);
  const gfsVal = Math.round(52 + bustProb * 1.22);
  const ecmwfVal = Math.max(12, gfsVal - spreadVal);
  return { bustProb, confidence, spreadVal, gfsVal, ecmwfVal };
}

function populateRegionDropdown() {
  const sel = document.getElementById("quick-region-select");
  if (!sel) return;
  sel.innerHTML = MET_SUBDIVISIONS.map(
    (s) => `<option value="${s.id}">${s.shortName}</option>`
  ).join("");
}

// ============================================================================
// MINI MAP (HOME CARD) & FULL GIS MAP (FORECAST TAB)
// ============================================================================
function initHomeMiniMap() {
  const el = document.getElementById("home-mini-map");
  if (!el) return;
  homeMiniMap = L.map("home-mini-map", {
    center: [21.0, 82.0],
    zoom: 4,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false
  });

  homeMiniTileLayer = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    { subdomains: "abcd" }
  ).addTo(homeMiniMap);

  homeMiniLayer = L.layerGroup().addTo(homeMiniMap);
}

function initFullGisMap() {
  const el = document.getElementById("full-gis-map");
  if (!el || fullGisMap) return;

  fullGisMap = L.map("full-gis-map", {
    center: [21.5, 81.0],
    zoom: 5,
    minZoom: 4,
    maxZoom: 8
  });

  const tileUrl = state.isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  fullGisTileLayer = L.tileLayer(tileUrl, {
    attribution: "&copy; OpenStreetMap &copy; CARTO | MausamAI"
  }).addTo(fullGisMap);

  fullGisLayer = L.layerGroup().addTo(fullGisMap);
}

function renderMaps() {
  const regime = WEATHER_REGIMES[state.regimeId];
  const activeSub =
    MET_SUBDIVISIONS.find((s) => s.id === state.selectedRegionId) || MET_SUBDIVISIONS[0];

  if (homeMiniMap && homeMiniLayer) {
    homeMiniLayer.clearLayers();
    homeMiniMap.setView([activeSub.lat, activeSub.lon], 5);

    MET_SUBDIVISIONS.forEach((sub) => {
      const m = getRegionMetrics(state.regimeId, sub.id, state.leadDay);
      const isSelected = sub.id === state.selectedRegionId;
      const color = m.bustProb >= 65 ? "#1F3153" : "#4D94DB";

      L.circle([sub.lat, sub.lon], {
        radius: isSelected ? 140000 : 95000,
        color: isSelected ? "#4D94DB" : "transparent",
        weight: 2,
        fillColor: color,
        fillOpacity: isSelected ? 0.55 : 0.28
      }).addTo(homeMiniLayer);
    });
  }

  if (fullGisMap && fullGisLayer) {
    fullGisLayer.clearLayers();

    MET_SUBDIVISIONS.forEach((sub) => {
      const m = getRegionMetrics(state.regimeId, sub.id, state.leadDay);
      const isSelected = sub.id === state.selectedRegionId;
      const val = state.mapMode === "confidence" ? m.confidence : m.bustProb;

      const fillColor =
        state.mapMode === "confidence"
          ? m.confidence >= 60
            ? "#10b981"
            : m.confidence >= 40
            ? "#4D94DB"
            : "#ef4444"
          : m.bustProb >= 70
          ? "#ef4444"
          : m.bustProb >= 50
          ? "#1F3153"
          : "#4D94DB";

      const poly = L.polygon(sub.polygon, {
        color: isSelected ? "#4D94DB" : fillColor,
        weight: isSelected ? 3 : 1.5,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.42 : 0.24
      });

      poly.on("click", () => selectRegion(sub.id));
      poly.bindTooltip(
        `<strong>${sub.name}</strong><br/>Bust Prob: ${m.bustProb}% | Confidence: ${m.confidence}%`,
        { sticky: true }
      );
      poly.addTo(fullGisLayer);

      const badge = L.divIcon({
        className: "map-pin-clean",
        html: `<div style="background:${fillColor};color:#fff;padding:3px 8px;border-radius:99px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);transform:translate(-50%,-50%);">
          ${sub.shortName}: ${val}%
        </div>`,
        iconSize: [80, 22]
      });

      L.marker([sub.lat, sub.lon], { icon: badge })
        .on("click", () => selectRegion(sub.id))
        .addTo(fullGisLayer);
    });

    if (regime.tracks) {
      L.polyline(regime.tracks.gfs, { color: "#ef4444", weight: 3, dashArray: "6, 6" })
        .bindTooltip("IMD-GFS Track")
        .addTo(fullGisLayer);
      L.polyline(regime.tracks.ecmwf, { color: "#4D94DB", weight: 3 })
        .bindTooltip("ECMWF-IFS Track")
        .addTo(fullGisLayer);
    }
  }
}

// ============================================================================
// MAIN UI RENDERER
// ============================================================================
function updateAllUI() {
  const regime = WEATHER_REGIMES[state.regimeId];
  const sub =
    MET_SUBDIVISIONS.find((s) => s.id === state.selectedRegionId) || MET_SUBDIVISIONS[0];
  const m = getRegionMetrics(state.regimeId, sub.id, state.leadDay);

  const sel = document.getElementById("quick-region-select");
  if (sel) sel.value = sub.id;

  document.getElementById(
    "current-regime-label"
  ).textContent = `Current Monitored Region • ${regime.name}`;
  document.getElementById("main-location-title").textContent = `${sub.name}`;

  const heroCard = document.getElementById("scenic-hero-card");
  if (heroCard) {
    heroCard.style.backgroundImage = `url("${REGIME_PHOTOS[state.regimeId]}")`;
  }
  document.getElementById("hero-conf-number").textContent = m.confidence;
  document.getElementById(
    "hero-day-label"
  ).textContent = `Day ${state.leadDay} (+${state.leadDay * 24}h Lead)`;
  document.getElementById("hero-bust-status").textContent = `${m.bustProb}% Bust Risk • ${
    m.bustProb >= 55 ? "Error-Prone" : "Reliable"
  }`;

  const pillsContainer = document.getElementById("home-day-pills");
  if (pillsContainer) {
    let pHtml = "";
    for (let d = 1; d <= 10; d++) {
      pHtml += `<button class="d-pill ${
        d === state.leadDay ? "active" : ""
      }" onclick="setLeadDay(${d})">D${d}</button>`;
    }
    pillsContainer.innerHTML = pHtml;
  }

  document.getElementById("highlights-day-tag").textContent = `Day ${state.leadDay}`;
  document.getElementById("hl-bust-prob").textContent = `${m.bustProb}%`;
  document.getElementById("hl-bust-tag").textContent =
    m.bustProb >= 65
      ? "Severe Bust Risk"
      : m.bustProb >= 45
      ? "Moderate Error Risk"
      : "Low Error Risk";
  document.getElementById("hl-conf-score").textContent = `${m.confidence}%`;
  document.getElementById("hl-spread-val").textContent = `±${m.spreadVal} ${
    regime.unit.split(" ")[0]
  }`;
  document.getElementById("hl-gfs-val").textContent = `${m.gfsVal} ${
    regime.unit.split(" ")[0]
  }`;
  document.getElementById("hl-ecmwf-val").textContent = `${m.ecmwfVal} ${
    regime.unit.split(" ")[0]
  }`;

  const errorCount = MET_SUBDIVISIONS.filter(
    (s) => getRegionMetrics(state.regimeId, s.id, state.leadDay).bustProb >= 55
  ).length;
  document.getElementById("bell-alert-count").textContent = errorCount;

  renderDribbbleSplineChart(sub);
  renderRightPanel();
  renderSecondaryViews(regime, sub);
  renderMaps();

  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// SMOOTH SKY-BLUE (#4D94DB) SPLINE CHART
// ============================================================================
function renderDribbbleSplineChart(sub) {
  const ctx = document.getElementById("dribbbleSplineChart");
  if (!ctx) return;
  if (splineChart) splineChart.destroy();

  const isDark = document.documentElement.classList.contains("dark");
  const labels = [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
    "Day 8",
    "Day 9",
    "Day 10"
  ];
  const dataPoints = [];
  for (let d = 1; d <= 10; d++) {
    const m = getRegionMetrics(state.regimeId, sub.id, d);
    dataPoints.push(state.curveMode === "bust" ? m.bustProb : m.confidence);
  }

  const gradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 160);
  gradient.addColorStop(0, "rgba(77, 148, 219, 0.36)");
  gradient.addColorStop(1, "rgba(77, 148, 219, 0.0)");

  splineChart = new Chart(ctx, {
    type: "line",
    plugins: [pointValueLabelPlugin],
    data: {
      labels,
      datasets: [
        {
          data: dataPoints,
          borderColor: "#4D94DB",
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.42,
          pointRadius: labels.map((_, idx) => (idx + 1 === state.leadDay ? 6 : 4)),
          pointBackgroundColor: labels.map((_, idx) =>
            idx + 1 === state.leadDay ? "#1F3153" : isDark ? "#1e293b" : "#ffffff"
          ),
          pointBorderColor: labels.map((_, idx) =>
            idx + 1 === state.leadDay ? "#4D94DB" : "#4D94DB"
          ),
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 26, bottom: 4, left: 10, right: 10 }
      },
      onClick: (e, elements) => {
        if (elements && elements.length > 0) {
          const idx = elements[0].index;
          setLeadDay(idx + 1);
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) =>
              `${state.curveMode === "bust" ? "Bust Prob" : "Confidence"}: ${c.raw}%`
          }
        }
      },
      scales: {
        y: {
          display: false,
          min: 0,
          max: 105
        },
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: isDark ? "#cbd5e1" : "#1F3153",
            font: { family: "'Poppins', sans-serif", size: 11, weight: "500" }
          }
        }
      }
    }
  });
}

// ============================================================================
// RIGHT PANEL: "CHANCE OF FORECAST BUST" BARS + ALTERNATING SPLIT CARDS
// ============================================================================
function renderRightPanel() {
  const barsContainer = document.getElementById("chance-bars-list");
  if (barsContainer) {
    const shortLabels = [
      "Track Spread",
      "Moisture Flux",
      "Run Flip-Flop",
      "Ridge Steering",
      "Analog Error",
      "Orography",
      "Jet Coupling"
    ];

    const sub =
      MET_SUBDIVISIONS.find((s) => s.id === state.selectedRegionId) || MET_SUBDIVISIONS[0];
    const m = getRegionMetrics(state.regimeId, sub.id, state.leadDay);

    const widths = [
      Math.min(94, m.bustProb + 8),
      Math.min(90, Math.round(m.bustProb * 0.85)),
      Math.min(92, Math.round(m.bustProb * 0.92)),
      Math.min(96, m.bustProb + 12),
      Math.min(86, Math.round(m.bustProb * 0.76)),
      Math.min(82, Math.round(m.bustProb * 0.65)),
      Math.min(78, Math.round(m.bustProb * 0.54))
    ];

    const maxW = Math.max(...widths);

    barsContainer.innerHTML = shortLabels
      .map((label, idx) => {
        const w = widths[idx];
        const isPeak = w === maxW;
        return `
        <div class="chance-bar-row" title="Meteorological Driver: ${label} (${w}%)">
          <span class="chance-label">${label}</span>
          <div class="chance-track">
            <div class="chance-fill ${isPeak ? "peak" : ""}" style="width: ${w}%;"></div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  document.getElementById("right-day-badge").textContent = `Day ${state.leadDay}`;
  const splitContainer = document.getElementById("right-split-cards");
  if (splitContainer) {
    const ranked = MET_SUBDIVISIONS.map((s) => ({
      s,
      m: getRegionMetrics(state.regimeId, s.id, state.leadDay)
    })).sort((a, b) => b.m.bustProb - a.m.bustProb);

    splitContainer.innerHTML = ranked
      .slice(0, 3)
      .map(({ s, m }, idx) => {
        const isReverse = idx === 1;
        const isSelected = s.id === state.selectedRegionId;
        return `
        <div class="split-card ${isReverse ? "reverse" : ""}" onclick="selectRegion('${s.id}')">
          <div class="split-pill-side ${isSelected ? "active-navy" : ""}">
            <span>&uarr; ${m.bustProb}%</span>
            <span>&darr; ${m.confidence}%</span>
          </div>
          <div class="split-info-side">
            <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
              <circle cx="22" cy="14" r="6" fill="#fde047"/>
              <path d="M10 25H26C29 25 31 23 31 20C31 17.5 29 15.5 26.5 15.2C25.5 11.5 22 9 18 9C13.5 9 9.8 12.5 9.5 17C7 17.5 5 19.8 5 22.5C5 24 7.5 25 10 25Z" fill="#cbd5e1"/>
            </svg>
            <div class="split-info-text">
              <strong>${s.shortName}</strong>
              <small>${m.bustProb >= 65 ? "Severe Bust Risk" : "Error-Prone"}</small>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }
}

// ============================================================================
// SECONDARY VIEWS
// ============================================================================
function renderSecondaryViews(regime, sub) {
  const gisHeading = document.getElementById("gis-map-heading");
  if (gisHeading) {
    gisHeading.textContent = `${regime.name} — Confidence Map (Day ${state.leadDay})`;
  }
  const gisSlider = document.getElementById("gis-day-slider");
  if (gisSlider) gisSlider.value = state.leadDay;
  const gisReadout = document.getElementById("gis-day-readout");
  if (gisReadout) gisReadout.textContent = `Day ${state.leadDay} (+${state.leadDay * 24}h)`;
  const gisBanner = document.getElementById("gis-explain-banner");
  if (gisBanner) {
    gisBanner.innerHTML = `<strong>${sub.name} (Day ${state.leadDay}):</strong> ${regime.narrative}<br/><strong>Operational Action:</strong> ${regime.recommendation}`;
  }

  const locDay = document.getElementById("loc-day-label");
  if (locDay) locDay.textContent = `Day ${state.leadDay}`;
  const locGrid = document.getElementById("locations-cards-grid");
  if (locGrid) {
    locGrid.innerHTML = MET_SUBDIVISIONS.map((item) => {
      const im = getRegionMetrics(state.regimeId, item.id, state.leadDay);
      return `
        <div class="dribbble-sub-card" onclick="selectRegionAndGoHome('${item.id}')">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <strong style="font-size:0.92rem;">${item.shortName}</strong>
            <span style="background:${
              im.bustProb >= 60 ? "#1F3153" : "#4D94DB"
            };color:#fff;padding:3px 10px;border-radius:99px;font-size:0.74rem;font-weight:600;">
              ${im.bustProb}% Bust
            </span>
          </div>
          <p style="font-size:0.75rem;color:#64748b;margin-bottom:10px;">${item.zoneDesc}</p>
          <div style="display:flex;justify-content:space-between;font-size:0.74rem;font-weight:600;">
            <span>Confidence: ${im.confidence}%</span>
            <span>Spread: ±${im.spreadVal}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  const narrativeCard = document.getElementById("analytics-narrative-card");
  if (narrativeCard) {
    narrativeCard.innerHTML = `
      <strong>Meteorological Explanation (${sub.name}, Day ${state.leadDay}):</strong> ${regime.narrative}<br/>
      <span style="color:#4D94DB;font-weight:600;display:block;margin-top:6px;">&rarr; ${regime.recommendation}</span>
    `;
  }

  const analogsGrid = document.getElementById("analytics-analogs-grid");
  if (analogsGrid) {
    analogsGrid.innerHTML = regime.analogs
      .map(
        (a) => `
      <div class="dribbble-sub-card">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:0.76rem;font-weight:700;color:#4D94DB;">${a.date}</span>
          <span style="font-size:0.72rem;background:rgba(77,148,219,0.15);color:#4D94DB;padding:2px 8px;border-radius:99px;font-weight:600;">
            Match: ${a.similarity}
          </span>
        </div>
        <strong style="font-size:0.88rem;display:block;margin-bottom:6px;">${a.title}</strong>
        <p style="font-size:0.75rem;color:#64748b;line-height:1.5;margin-bottom:8px;">${a.desc}</p>
        <div style="font-size:0.72rem;font-weight:600;color:#ef4444;">${a.errorStat}</div>
      </div>
    `
      )
      .join("");
  }

  const driversGrid = document.getElementById("analytics-drivers-grid");
  if (driversGrid) {
    driversGrid.innerHTML = regime.shapDrivers
      .map(
        (d) => `
      <div class="dribbble-sub-card">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <strong style="font-size:0.84rem;">${d.feature}</strong>
          <span style="font-weight:700;color:${
            d.contribution >= 0 ? "#4D94DB" : "#10b981"
          };font-size:0.8rem;">
            ${d.contribution >= 0 ? "+" : ""}${d.contribution}%
          </span>
        </div>
        <p style="font-size:0.75rem;color:#64748b;">${d.desc}</p>
      </div>
    `
      )
      .join("");
  }

  const matTable = document.getElementById("dribbble-matrix-table");
  if (matTable) {
    let html = `<thead><tr><th>Region</th>`;
    for (let d = 1; d <= 10; d++) html += `<th>D${d}</th>`;
    html += `</tr></thead><tbody>`;

    MET_SUBDIVISIONS.forEach((s) => {
      html += `<tr><td><strong>${s.shortName}</strong></td>`;
      for (let d = 1; d <= 10; d++) {
        const dm = getRegionMetrics(state.regimeId, s.id, d);
        const v = state.matrixMode === "bust" ? dm.bustProb : dm.confidence;
        const bg =
          state.matrixMode === "bust"
            ? dm.bustProb >= 70
              ? "#1F3153;color:#fff"
              : dm.bustProb >= 50
              ? "#4D94DB;color:#fff"
              : "rgba(77,148,219,0.16);color:inherit"
            : dm.confidence >= 60
            ? "#4D94DB;color:#fff"
            : "rgba(77,148,219,0.16);color:inherit";
        html += `<td style="background:${bg}" onclick="selectCellAndGoHome('${s.id}', ${d})">${v}%</td>`;
      }
      html += `</tr>`;
    });
    html += `</tbody>`;
    matTable.innerHTML = html;
  }
}

// ============================================================================
// USER INTERACTION HANDLERS
// ============================================================================
function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll(".tab-view").forEach((el) => {
    el.classList.toggle("active", el.id === `view-${tabId}`);
  });

  document.querySelectorAll(".navy-nav-item").forEach((btn) => {
    const isActive = btn.getAttribute("data-tab") === tabId;
    btn.classList.toggle("active", isActive);
    if (isActive) {
      btn.className =
        "navy-nav-item active border-l-4 border-[#4D94DB] bg-[#4D94DB]/10 text-[#4D94DB] font-semibold";
    } else {
      btn.className =
        "navy-nav-item border-l-4 border-transparent text-gray-500 dark:text-gray-300 hover:text-[#4D94DB] hover:bg-gray-100 dark:hover:bg-slate-700/50";
    }
  });

  if (tabId === "forecast") {
    setTimeout(() => {
      initFullGisMap();
      fullGisMap.invalidateSize();
      renderMaps();
    }, 80);
  } else if (tabId === "home" && homeMiniMap) {
    setTimeout(() => {
      homeMiniMap.invalidateSize();
      renderMaps();
    }, 80);
  }
}

function selectRegime(regimeId) {
  state.regimeId = regimeId;
  document.querySelectorAll(".r-pill").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-regime") === regimeId);
  });

  const top = MET_SUBDIVISIONS.map((s) => ({
    id: s.id,
    b: getRegionMetrics(regimeId, s.id, state.leadDay).bustProb
  })).sort((a, b) => b.b - a.b)[0];
  state.selectedRegionId = top.id;

  updateAllUI();
}

function selectRegion(regionId) {
  state.selectedRegionId = regionId;
  updateAllUI();
}

function selectRegionAndGoHome(regionId) {
  state.selectedRegionId = regionId;
  switchTab("home");
  updateAllUI();
}

function selectCellAndGoHome(regionId, day) {
  state.selectedRegionId = regionId;
  state.leadDay = day;
  switchTab("home");
  updateAllUI();
}

function setLeadDay(day) {
  state.leadDay = day;
  updateAllUI();
}

function setCurveMode(mode) {
  state.curveMode = mode;
  document.getElementById("tab-curve-bust").classList.toggle("active", mode === "bust");
  document.getElementById("tab-curve-conf").classList.toggle("active", mode === "confidence");
  const sub =
    MET_SUBDIVISIONS.find((s) => s.id === state.selectedRegionId) || MET_SUBDIVISIONS[0];
  renderDribbbleSplineChart(sub);
}

function setMapMode(mode) {
  state.mapMode = mode;
  document.getElementById("map-btn-bust").classList.toggle("active", mode === "bust");
  document.getElementById("map-btn-conf").classList.toggle("active", mode === "confidence");
  renderMaps();
}

function setMatrixMode(mode) {
  state.matrixMode = mode;
  document.getElementById("mat-btn-bust").classList.toggle("active", mode === "bust");
  document.getElementById("mat-btn-conf").classList.toggle("active", mode === "confidence");
  updateAllUI();
}

function togglePlayDays() {
  state.isPlaying = !state.isPlaying;
  const label = document.getElementById("play-days-label");
  if (state.isPlaying) {
    if (label) label.textContent = "Pause";
    state.playInterval = setInterval(() => {
      let next = state.leadDay + 1;
      if (next > 10) next = 1;
      setLeadDay(next);
    }, 1200);
  } else {
    clearInterval(state.playInterval);
    if (label) label.textContent = "Play Day 1–10";
  }
}

function handleSearchInput(query) {
  const q = query.trim().toLowerCase();
  if (!q) return;

  const matchedSub = MET_SUBDIVISIONS.find(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.shortName.toLowerCase().includes(q) ||
      s.zoneDesc.toLowerCase().includes(q)
  );
  if (matchedSub) {
    selectRegion(matchedSub.id);
    return;
  }

  const matchedRegime = Object.values(WEATHER_REGIMES).find((r) =>
    r.name.toLowerCase().includes(q)
  );
  if (matchedRegime) {
    selectRegime(matchedRegime.id);
  }
}

function updateSimulator() {
  const day = parseInt(document.getElementById("sim-i-day")?.value || 5);
  const spread = parseFloat(document.getElementById("sim-i-spread")?.value || 52);
  const flip = parseFloat(document.getElementById("sim-i-flip")?.value || 68) / 100;
  const cape = parseFloat(document.getElementById("sim-i-cape")?.value || 2400);

  document.getElementById("sim-v-day").textContent = `Day ${day} (+${day * 24}h)`;
  document.getElementById("sim-v-spread").textContent = `${spread} mm`;
  document.getElementById("sim-v-flip").textContent = flip.toFixed(2);
  document.getElementById("sim-v-cape").textContent = `${cape} J/kg`;

  const bustProb = Math.min(
    96,
    Math.max(
      8,
      Math.round(day * 3.1 + (spread / 120) * 38 + flip * 25 + (cape / 5000) * 16 - 8)
    )
  );
  const conf = 100 - bustProb;

  const banner = document.getElementById("sim-output-banner");
  if (banner) {
    banner.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <span style="font-size:0.75rem;color:#64748b;font-weight:600;">SIMULATED AI OUTPUT (DAY ${day})</span>
          <h3 style="font-size:1.25rem;margin-top:2px;">
            Bust Probability: ${bustProb}% &nbsp;|&nbsp; Confidence: ${conf}%
          </h3>
        </div>
        <span style="background:${
          bustProb >= 55 ? "#1F3153" : "#4D94DB"
        };color:#fff;padding:8px 16px;border-radius:99px;font-size:0.82rem;font-weight:600;">
          ${bustProb >= 55 ? "Error-Prone Bust Alert" : "Reliable Deterministic Forecast"}
        </span>
      </div>
    `;
  }
}
