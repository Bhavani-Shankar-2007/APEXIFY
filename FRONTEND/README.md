# MAUSAM-SHIELD AI: Forecast Bust Detection for Medium-Range Weather Forecasts

An AI/ML-powered operational meteorological decision-support prototype and REST API that identifies **regions and lead times (Day 1 to Day 10)** where Numerical Weather Prediction (NWP) models are likely to suffer high uncertainty or large forecast errors (**"Forecast Busts"**).

---

## Core Capabilities & Expected Outcomes

1. **Forecast Confidence Map (Day 1 to Day 10)**:
   - Interactive geospatial map (Leaflet + interpolated grid heatmaps + subdivision polygons) showing region-wise **Forecast Confidence ($0-100\%$)**, **Bust Probability ($P_{\text{bust}}$)**, and **Multi-Model Ensemble Spread ($\sigma$)**.
   - Animated **Day 1 to Day 10 (+24h to +240h)** timeline scrubber.
2. **All 6 High-Impact Indian Weather Regimes**:
   - **Monsoon Depressions** (Bay of Bengal track bifurcation & inland stall busts)
   - **Extreme Heavy Rainfall Events** (Western Ghats / Konkan offshore trough & Mid-Tropospheric Cyclone errors)
   - **Western Disturbances** (Extratropical Rossby trough phase-lock with monsoon easterlies)
   - **Tropical Cyclones** (Day 4–10 recurvature & rapid intensification uncertainty)
   - **Severe Heat Waves** (Subtropical blocking ridge persistence vs spurious convective cooling busts)
   - **Break / Active Monsoon Phases** (BSISO northward propagation & Himalayan foothill trough jumps)
3. **Error-Prone Area Detection**:
   - Automatic spatial & tabular detection of subdivisions exceeding the configurable Bust Probability alert threshold, with synoptic GFS vs. ECMWF track divergence overlays.
4. **Explainable AI (XAI) & Historical Analog Matching**:
   - **SHAP Feature Attributions** quantifying the exact contribution of *Multi-Model Spread*, *Run-to-Run Flip-Flop Index ($d\text{Prog}/dt$)*, *Moisture Flux Convergence / CAPE*, *Orographic Complexity*, and *Historical Analog Error Distance*.
   - **ERA5 / TIGGE Historical Analog Matcher** linking current NWP flow patterns to famous past forecast bust events (e.g., Aug 2018 Odisha Depression, Jul 2021 Konkan Deluge, Jul 2023 Himachal WD-Monsoon collision, May 2020 Super Cyclone Amphan).
5. **Live Multi-Model NWP Feed (Open-Meteo GFS vs. ECMWF)**:
   - Fetches real-time 10-day GFS and ECMWF IFS forecasts for Indian meteorological stations and computes live inter-model divergence and AI bust probabilities.
6. **Prototype Dashboard & FastAPI REST Service**:
   - Interactive What-If Synoptic Perturbation Simulator and REST endpoints (`/api/v1/forecast-confidence`, `/api/v1/error-prone-areas`, `/api/v1/predict-bust`, `/docs`).

---

## Quick Start

### Option 1: Run with FastAPI Backend + Frontend Server
```bash
cd ForecastBust-AI
pip install -r requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8080 --reload
```
Then open **http://localhost:8080** in your browser (Swagger API docs at **http://localhost:8080/docs**).

### Option 2: Open Frontend Directly
Open `frontend/index.html` in any modern web browser.
