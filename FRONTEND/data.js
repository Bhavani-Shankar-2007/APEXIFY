// ============================================================================
// MAUSAM-SHIELD AI: METEOROLOGICAL SUBDIVISIONS, REGIMES & HINDCAST DATASET
// Covers all 6 problem-statement regimes across Day 1 to Day 10 lead times
// ============================================================================

const MET_SUBDIVISIONS = [
  {
    id: "odisha_coastal",
    name: "Odisha & North Coastal AP",
    shortName: "Odisha / NCAP",
    lat: 20.15,
    lon: 85.50,
    zoneDesc: "Core Bay of Bengal Landfall & Monsoon Trough Southern Arm",
    polygon: [
      [22.3, 83.5], [22.4, 87.4], [19.2, 85.2], [17.6, 83.2], [18.8, 81.4], [21.0, 82.5]
    ]
  },
  {
    id: "konkan_goa",
    name: "Konkan, Mumbai & Western Ghats",
    shortName: "Konkan / Ghats",
    lat: 18.65,
    lon: 73.15,
    zoneDesc: "Steep Orographic Barrier & Arabian Sea Low-Level Jet Core",
    polygon: [
      [20.6, 72.6], [20.5, 74.1], [15.2, 74.4], [15.0, 73.5], [18.9, 72.7]
    ]
  },
  {
    id: "west_himalayas",
    name: "Western Himalayas (J&K, HP, UK)",
    shortName: "W. Himalayas",
    lat: 31.60,
    lon: 77.20,
    zoneDesc: "Mid-Latitude Westerly Trough & Complex Valley Orography",
    polygon: [
      [34.6, 74.0], [34.2, 78.5], [30.2, 80.5], [29.4, 78.0], [31.5, 75.2], [33.0, 74.0]
    ]
  },
  {
    id: "central_india",
    name: "Central India (MP & Chhattisgarh)",
    shortName: "Central India",
    lat: 22.70,
    lon: 79.80,
    zoneDesc: "Core Monsoon Zone & Depression Inland Track Corridor",
    polygon: [
      [24.8, 75.5], [24.6, 83.2], [20.2, 82.5], [20.8, 76.0]
    ]
  },
  {
    id: "gangetic_wb",
    name: "Gangetic West Bengal & Head Bay",
    shortName: "Gangetic WB",
    lat: 22.65,
    lon: 88.10,
    zoneDesc: "Monsoon Depression Genesis & Recurving Cyclone Corridor",
    polygon: [
      [24.3, 86.5], [24.2, 89.2], [21.3, 89.1], [21.5, 86.8]
    ]
  },
  {
    id: "nw_planes",
    name: "Indo-Gangetic Plains (Delhi, Punjab, UP)",
    shortName: "NW / IGP Plains",
    lat: 28.40,
    lon: 77.80,
    zoneDesc: "Monsoon Trough Axis Oscillation & WD-Easterly Confluence",
    polygon: [
      [31.2, 74.5], [30.0, 78.2], [26.5, 82.0], [25.8, 78.5], [28.0, 75.0]
    ]
  },
  {
    id: "rajasthan_arid",
    name: "West & East Rajasthan (Thar Sector)",
    shortName: "Rajasthan",
    lat: 26.80,
    lon: 72.40,
    zoneDesc: "Subtropical Anti-Cyclone Blocking & Heat Wave Core",
    polygon: [
      [29.5, 70.2], [28.8, 76.0], [24.2, 76.2], [24.5, 70.5]
    ]
  },
  {
    id: "northeast_india",
    name: "Northeast India (Assam & Meghalaya)",
    shortName: "Northeast India",
    lat: 26.10,
    lon: 92.10,
    zoneDesc: "Foothill Monsoon Trough Locking & Southerly Moisture Surge",
    polygon: [
      [27.8, 89.8], [27.9, 95.8], [24.5, 94.5], [25.0, 89.8]
    ]
  },
  {
    id: "gujarat_saurashtra",
    name: "Gujarat & Saurashtra-Kutch",
    shortName: "Gujarat",
    lat: 22.50,
    lon: 71.20,
    zoneDesc: "Mid-Tropospheric Cyclone (MTC) & Arabian Sea Recurvature Zone",
    polygon: [
      [24.4, 68.8], [24.2, 73.5], [20.5, 73.0], [20.8, 69.8]
    ]
  },
  {
    id: "kerala_south",
    name: "Kerala & South Interior Peninsula",
    shortName: "Kerala / South",
    lat: 10.85,
    lon: 76.50,
    zoneDesc: "Monsoon Onset Vortex & Southern Ghat Orographic Enhancement",
    polygon: [
      [13.2, 74.8], [13.0, 77.8], [8.2, 77.6], [8.3, 76.2]
    ]
  },
  {
    id: "coromandel_tn",
    name: "Tamil Nadu & Coromandel Coast",
    shortName: "Tamil Nadu",
    lat: 12.60,
    lon: 79.90,
    zoneDesc: "Lee-Side Rain Shadow & NE Monsoon Easterly Wave Zone",
    polygon: [
      [14.5, 79.5], [14.4, 80.6], [9.5, 79.8], [9.8, 78.0]
    ]
  },
  {
    id: "bay_of_bengal",
    name: "Central & North Bay of Bengal (Marine)",
    shortName: "Bay of Bengal",
    lat: 17.80,
    lon: 88.80,
    zoneDesc: "Warm Pool SST Convective Initiation & Vorticity Genesis",
    polygon: [
      [20.5, 86.5], [20.5, 92.0], [14.8, 91.8], [14.8, 85.5]
    ]
  }
];

// ============================================================================
// 6 SYNOPTIC WEATHER REGIMES WITH DAY 1-10 PATTERNS, TRACKS & ANALOGS
// ============================================================================
const WEATHER_REGIMES = {
  monsoon_depression: {
    id: "monsoon_depression",
    name: "Bay of Bengal Monsoon Depression",
    bannerTitle: "Bay of Bengal Monsoon Depression — Track Bifurcation & Inland Stall Uncertainty",
    primaryVariable: "precip_24h",
    unit: "mm/day",
    rocAuc: 0.92,
    leadWarningByDay: {
      1: "Day 1 (+24h): High NWP consensus on Head Bay low-pressure genesis",
      2: "Day 2 (+48h): Well-aligned depression intensification over NW Bay",
      3: "Day 3 (+72h): Coastal landfall timing spread emerging (±90 km)",
      4: "Day 4 (+96h): Ridge interaction creates WNW vs NW track split",
      5: "Day 5 (+120h): CRITICAL BUST WINDOW — GFS stalls over Odisha; ECMWF tracks fast to MP",
      6: "Day 6 (+144h): Severe rainfall displacement (>250 km error between models)",
      7: "Day 7 (+168h): Potential interaction with mid-latitude trough over Central India",
      8: "Day 8 (+192h): Remnant low-pressure moisture feed uncertainty over Gujarat/RJ",
      9: "Day 9 (+216h): Extended-range predictability barrier reached",
      10: "Day 10 (+240h): Climatological ensemble spread dominates deterministic run"
    },
    // Synoptic tracks: Deterministic GFS vs ECMWF vs Ensemble Mean
    tracks: {
      gfs: [[17.5, 89.2], [18.6, 87.8], [19.8, 86.2], [20.6, 84.8], [21.1, 83.9], [21.5, 83.2], [22.0, 82.4], [22.8, 81.0]],
      ecmwf: [[17.5, 89.2], [18.8, 87.5], [20.2, 85.6], [21.6, 82.8], [22.9, 79.5], [23.8, 76.4], [24.5, 73.8], [24.9, 71.5]],
      label: "Depression Track Divergence (Red: GFS Slow/Stall vs Cyan: ECMWF Fast WNW)"
    },
    // Base risk multipliers per region [Day 1 .. Day 10]
    regionBustProfiles: {
      odisha_coastal:    [18, 26, 42, 64, 78, 84, 76, 68, 62, 58],
      central_india:     [12, 19, 35, 58, 75, 86, 88, 81, 74, 70],
      gangetic_wb:       [20, 29, 46, 61, 70, 66, 59, 54, 51, 49],
      bay_of_bengal:     [22, 34, 52, 67, 72, 65, 58, 52, 48, 45],
      gujarat_saurashtra:[10, 14, 22, 34, 48, 64, 77, 83, 79, 75],
      konkan_goa:        [15, 22, 33, 47, 58, 63, 66, 62, 58, 55],
      nw_planes:         [11, 16, 25, 38, 52, 61, 69, 72, 68, 65],
      rajasthan_arid:    [9,  12, 18, 28, 41, 56, 71, 76, 73, 69],
      west_himalayas:    [14, 18, 26, 35, 44, 52, 59, 63, 61, 58],
      northeast_india:   [16, 21, 29, 37, 45, 49, 53, 55, 54, 52],
      kerala_south:      [12, 17, 23, 30, 36, 40, 43, 45, 46, 47],
      coromandel_tn:     [10, 14, 19, 25, 31, 35, 38, 41, 42, 44]
    },
    shapDrivers: [
      { feature: "Multi-Model Track Spread (GFS vs ECMWF)", contribution: +28.4, desc: "310 km landfall & inland translation speed divergence at 850 hPa" },
      { feature: "850 hPa Moisture Flux Convergence (∇·qV)", contribution: +19.2, desc: "Nonlinear convective heating feedback amplifying core vorticity error" },
      { feature: "Run-to-Run Flip-Flop Index (dProg/dt)", contribution: +15.6, desc: "Last 4 NWP cycles shifted peak rainfall core by 180 km SSW" },
      { feature: "Subtropical Ridge Position at 500 hPa", contribution: +11.8, desc: "Uncertain steering current strength north of 23°N" },
      { feature: "Historical Analog Error Distance (KNN)", contribution: +8.5, desc: "Matches high-bust Aug 2018 & Sep 2021 slow-moving depressions" },
      { feature: "Soil Moisture Initialization Anomaly", contribution: -4.2, desc: "Assimilated SMAP satellite soil wetness reduces surface flux bias" }
    ],
    narrative: "Deterministic NWP models frequently bust during Day 4–7 of Bay of Bengal Monsoon Depressions due to convective parameterization differences: GFS over-intensifies diabatic vortex stretching and stalls the system near coastal Odisha, whereas ECMWF-IFS translates the vortex faster across Central India along the Monsoon Trough.",
    recommendation: "Operational Guidance: Avoid single deterministic rainfall maps for Day 4–7. Issue probabilistic heavy rainfall swath warnings combining 75th percentile NCMRWF-NEPS + ECMWF ensemble members across southern Odisha and Chhattisgarh.",
    analogs: [
      {
        date: "14–18 Aug 2018",
        similarity: "94.2%",
        title: "Odisha–Chhattisgarh Slow-Moving Depression Bust",
        desc: "Operational Day-5 GFS forecast predicted rapid dissipation over north MP, but the system stalled for 36h over Odisha-Chhattisgarh border causing 380 mm unforecast deluge.",
        errorStat: "Day-5 Precip RMSE: 92.4 mm | Track Error: 285 km"
      },
      {
        date: "12–15 Sep 2021",
        similarity: "91.6%",
        title: "Deep Depression Extreme Coastal Core Shift",
        desc: "Models underestimated 850 hPa cross-equatorial moisture surge, resulting in a 160 mm negative bias over Puri & Bhubaneswar at 120h lead time.",
        errorStat: "Day-5 Precip RMSE: 78.1 mm | ACC: 0.41"
      },
      {
        date: "06–10 Aug 2019",
        similarity: "88.9%",
        title: "Monsoon Depression Recurvature toward Gujarat",
        desc: "Bifurcation between western track (Gujarat flood) and northwestern track (East Rajasthan) caused major medium-range confidence drop at Day 6.",
        errorStat: "Day-6 Precip RMSE: 69.5 mm | Track Error: 340 km"
      }
    ]
  },

  heavy_rainfall: {
    id: "heavy_rainfall",
    name: "Extreme Orographic & Mesoscale Heavy Rainfall",
    bannerTitle: "Western Ghats & Konkan Offshore Trough — Extreme Mesoscale Rainfall Bust Detection",
    primaryVariable: "precip_24h",
    unit: "mm/day",
    rocAuc: 0.90,
    leadWarningByDay: {
      1: "Day 1 (+24h): Offshore trough detected; localized convective core placement ±35 km",
      2: "Day 2 (+48h): Arabian Sea Somali Jet surge increasing CAPE over Konkan",
      3: "Day 3 (+72h): Coarse global NWP grid smoothing steep Western Ghats escarpment",
      4: "Day 4 (+96h): HIGH BUST RISK — Mid-Tropospheric Cyclone (MTC) genesis at 700-500 hPa uncertain",
      5: "Day 5 (+120h): Severe underestimation of >200 mm/day extreme tail in deterministic NWP",
      6: "Day 6 (+144h): Offshore vortex stagnation vs northward drift toward South Gujarat",
      7: "Day 7 (+168h): Large spread in Arabian Sea moisture transport (IVT > 850 kg/m/s)",
      8: "Day 8 (+192h): Synoptic-scale Somali Jet pulsing phase uncertainty",
      9: "Day 9 (+216h): Low skill on mesoscale convective organization",
      10: "Day 10 (+240h): Background monsoon active phase probability only"
    },
    tracks: {
      gfs: [[11.5, 74.2], [13.8, 73.6], [15.9, 73.1], [17.8, 72.7], [19.1, 72.6], [20.8, 72.4]],
      ecmwf: [[11.5, 74.5], [14.2, 74.0], [16.5, 73.5], [18.5, 73.0], [19.4, 72.9], [21.5, 72.7]],
      label: "Offshore Trough & 850hPa Somali Jet Core Axis along Western Ghats"
    },
    regionBustProfiles: {
      konkan_goa:        [28, 39, 58, 76, 85, 88, 82, 75, 70, 66],
      kerala_south:      [24, 35, 52, 68, 77, 79, 73, 67, 62, 58],
      gujarat_saurashtra:[18, 28, 44, 62, 74, 81, 78, 72, 66, 61],
      northeast_india:   [25, 36, 51, 66, 75, 78, 74, 69, 65, 62],
      central_india:     [14, 22, 34, 48, 59, 64, 61, 56, 52, 49],
      odisha_coastal:    [15, 21, 30, 42, 51, 55, 54, 50, 47, 45],
      west_himalayas:    [19, 27, 39, 52, 63, 67, 64, 59, 55, 52],
      gangetic_wb:       [16, 23, 33, 45, 54, 58, 56, 52, 49, 46],
      nw_planes:         [12, 17, 25, 36, 46, 52, 50, 47, 44, 42],
      rajasthan_arid:    [8,  12, 18, 26, 35, 42, 44, 41, 38, 36],
      coromandel_tn:     [11, 15, 22, 29, 36, 40, 41, 39, 37, 35],
      bay_of_bengal:     [16, 24, 34, 45, 53, 57, 55, 51, 48, 45]
    },
    shapDrivers: [
      { feature: "Orographic Gradient Resolution Error", contribution: +31.2, desc: "Global NWP (12–25 km) smooths Sahyadri crest, misplacing upwind rain max" },
      { feature: "Integrated Vapor Transport (IVT) Spread", contribution: +22.5, desc: "Somali Low-Level Jet core speed varies by 18 kt across ensemble members" },
      { feature: "700–500 hPa Mid-Tropospheric Cyclone (MTC)", contribution: +18.0, desc: "Baroclinic-convective coupling over North Konkan poorly resolved at Day 4+" },
      { feature: "CAPE & Warm-Rain Microphysics Bias", contribution: +12.4, desc: "Parameterized deep convection triggers too early over Arabian Sea waters" },
      { feature: "Run-to-Run Flip-Flop Index (dProg/dt)", contribution: +9.8, desc: "24h rainfall total over Mumbai oscillated between 65 mm and 240 mm" },
      { feature: "Arabian Sea SST Warm Anomaly", contribution: -3.1, desc: "High confidence in background boundary-layer moisture supply" }
    ],
    narrative: "Extreme rainfall events (>204.5 mm/day) over the Western Ghats and Northeast India suffer from the classic 'Drizzle & Displacement Bust' in medium-range NWP: global models trigger convective parameterization prematurely over the offshore Arabian Sea and underestimate orographic uplifting partnered with 600 hPa Mid-Tropospheric Cyclones.",
    recommendation: "Operational Guidance: Apply AI Post-Processing quantile mapping and downscale with 3km convection-permitting WRF/NCUM-R guidance inside 72h; flag Mumbai/Raigad/Ratnagiri for flash-flood bust watch at Day 4–6.",
    analogs: [
      {
        date: "18–21 Jul 2021",
        similarity: "95.4%",
        title: "Mumbai & Chiplun Extreme Orographic Deluge",
        desc: "Day-5 global models predicted 70–90 mm/day, whereas interactions between an offshore vortex and MTC produced >350 mm/24h causing severe flooding.",
        errorStat: "Day-5 Precip Underestimation: -215 mm | Bust Prob: 88%"
      },
      {
        date: "08–12 Aug 2019",
        similarity: "92.1%",
        title: "Kerala & Western Ghats Multi-Day Cloudburst Surge",
        desc: "Persistent cross-equatorial flow surge was under-predicted by deterministic NWP at Day 4–7 across Wayanad and Idukki.",
        errorStat: "Day-5 Precip RMSE: 104.2 mm | ACC: 0.38"
      },
      {
        date: "01–03 Jul 2019",
        similarity: "89.3%",
        title: "North Konkan Mid-Tropospheric Cyclone Stall",
        desc: "Rapid intensification of a 600 hPa vortex near Mumbai was missed until 36h before extreme urban flooding.",
        errorStat: "Day-4 Precip RMSE: 86.7 mm | Flip-Flop Index: 0.84"
      }
    ]
  },

  western_disturbance: {
    id: "western_disturbance",
    name: "Western Disturbance & Easterly Interaction",
    bannerTitle: "Extratropical Western Disturbance Trough — Phase Speed & Monsoon Easterly Confluence",
    primaryVariable: "z500",
    unit: "m (Z500)",
    rocAuc: 0.91,
    leadWarningByDay: {
      1: "Day 1 (+24h): Upper-tropospheric Rossby wave trough over Afghanistan well locked",
      2: "Day 2 (+48h): Induced cyclonic circulation over Central Pakistan & West Rajasthan",
      3: "Day 3 (+72h): Trough phase speed divergence (±4° longitude) across 30°N",
      4: "Day 4 (+96h): CRITICAL BUST RISK — Uncertain coupling between 300 hPa Westerly Trough & 850 hPa Bay Easterlies",
      5: "Day 5 (+120h): Extreme heavy snow/rain bust risk over Himachal & Uttarakhand",
      6: "Day 6 (+144h): Rossby wave breaking vs progressive trough passage uncertainty",
      7: "Day 7 (+168h): Secondary upstream trough amplification over Caspian Sea",
      8: "Day 8 (+192h): Large Z500 geopotential spread (>95 m) over North India",
      9: "Day 9 (+216h): Subtropical westerly jet core latitude shift",
      10: "Day 10 (+240h): Low deterministic skill on induced plains thunderstorm squalls"
    },
    tracks: {
      gfs: [[34.0, 66.0], [33.2, 69.5], [32.4, 72.8], [31.5, 75.6], [30.8, 77.9], [30.5, 80.2]],
      ecmwf: [[34.0, 66.0], [32.6, 69.0], [31.0, 72.2], [29.8, 75.0], [29.5, 77.5], [30.2, 80.5]],
      label: "500 hPa Western Disturbance Trough Axis & Induced Low Trajectory"
    },
    regionBustProfiles: {
      west_himalayas:    [20, 31, 49, 74, 86, 89, 83, 76, 70, 65],
      nw_planes:         [18, 28, 45, 68, 79, 82, 75, 68, 62, 58],
      rajasthan_arid:    [16, 25, 40, 59, 71, 74, 67, 60, 55, 51],
      central_india:     [11, 16, 26, 39, 51, 56, 54, 49, 45, 42],
      northeast_india:   [14, 20, 30, 42, 55, 66, 72, 69, 64, 60],
      gangetic_wb:       [10, 15, 22, 33, 45, 54, 58, 55, 51, 48],
      gujarat_saurashtra:[12, 18, 27, 38, 47, 51, 49, 45, 42, 40],
      odisha_coastal:    [9,  13, 19, 27, 35, 40, 42, 40, 38, 36],
      konkan_goa:        [8,  11, 16, 22, 28, 32, 34, 33, 32, 30],
      kerala_south:      [7,  10, 14, 18, 22, 25, 27, 28, 28, 27],
      coromandel_tn:     [8,  11, 15, 20, 24, 27, 29, 30, 30, 29],
      bay_of_bengal:     [10, 14, 20, 28, 35, 39, 41, 40, 38, 37]
    },
    shapDrivers: [
      { feature: "500 hPa Trough Phase & Tilt Uncertainty", contribution: +29.6, desc: "Upstream Rossby wave dispersion causes 350 km E-W trough phase error" },
      { feature: "Westerly–Easterly Moisture Confluence", contribution: +24.1, desc: "Highly sensitive alignment between Arabian/Bay moisture feed and upper divergence" },
      { feature: "Himalayan Complex Terrain Locking", contribution: +16.8, desc: "Orographic blocking over Pir Panjal & Dhauladhar ranges distorts valley rain/snow" },
      { feature: "300 hPa Subtropical Jet Streak Coupling", contribution: +11.5, desc: "Right-entrance jet quadrant ageostrophic uplift varies across models" },
      { feature: "Run-to-Run Z500 Cutoff Low Flip-Flop", contribution: +9.2, desc: "Alternating between open progressive wave and closed cutoff low over HP" },
      { feature: "Upstream Radiosonde / Satellite Assimilation", contribution: -3.8, desc: "IASI hyperspectral sounding constrains initial upper-level potential vorticity" }
    ],
    narrative: "Catastrophic forecast busts over the Western Himalayas (Himachal Pradesh, Uttarakhand, J&K) occur when a deep mid-latitude Western Disturbance trough slows down, forms a cut-off low, and locks phase with lower-tropospheric moist easterlies from the Bay of Bengal/Arabian Sea — a non-linear interaction where a 150 km phase error shifts extreme rainfall from Pakistan into the Beas/Sutlej catchments.",
    recommendation: "Operational Guidance: Monitor 200–500 hPa Potential Vorticity (PV) streamers and Z500 ensemble spaghetti plots. When trough tilt turns negative at Day 4–6, elevate Kullu/Mandi/Uttarakhand flash-flood & landslide alerts.",
    analogs: [
      {
        date: "07–11 Jul 2023",
        similarity: "96.8%",
        title: "Himachal Pradesh WD–Monsoon Interaction Super-Bust",
        desc: "Rare synoptic coupling of an intense Western Disturbance and monsoon depression produced 400%+ normal rainfall over Kullu & Mandi; Day-6 deterministic models missed the phase-lock.",
        errorStat: "Day-5 Z500 Error: 88 m | Precip Bust: +195 mm"
      },
      {
        date: "15–17 Jun 2013",
        similarity: "93.5%",
        title: "Uttarakhand Kedarnath Extratropical-Monsoon Collision",
        desc: "Amplified mid-latitude trough collided with early monsoon surge; medium-range forecasts 5 days prior underestimated trough stagnation against the Garhwal Himalayas.",
        errorStat: "Day-5 Precip RMSE: 118.0 mm | Bust Prob: 91%"
      },
      {
        date: "01–03 Mar 2024",
        similarity: "87.4%",
        title: "North India Severe Hailstorm & Squall WD Bust",
        desc: "Induced cyclonic circulation over Punjab/Haryana deepened 6 hPa more than Day-5 NWP consensus.",
        errorStat: "Day-5 Wind Gust Error: 28 kt | ACC: 0.44"
      }
    ]
  },

  cyclone: {
    id: "cyclone",
    name: "Tropical Cyclone Genesis & Recurvature",
    bannerTitle: "Bay of Bengal Severe Cyclonic Storm — Day 4–10 Recurvature & Rapid Intensification Bust",
    primaryVariable: "wind_850",
    unit: "kt (850hPa)",
    rocAuc: 0.94,
    leadWarningByDay: {
      1: "Day 1 (+24h): Well-defined cyclonic circulation; track cone < 65 km",
      2: "Day 2 (+48h): Deepening over high Ocean Heat Content (OHC > 90 kJ/cm²)",
      3: "Day 3 (+72h): Rapid Intensification (RI) onset sensitivity to vertical wind shear",
      4: "Day 4 (+96h): BIFURCATION ALERT — Subtropical ridge break creates recurvature uncertainty",
      5: "Day 5 (+120h): Landfall point spread spans 420 km (Andhra vs Odisha vs West Bengal)",
      6: "Day 6 (+144h): Along-track translation speed spread (±12h landfall timing)",
      7: "Day 7 (+168h): Post-landfall inland decay vs northeastward recurvature into Assam",
      8: "Day 8 (+192h): Secondary cyclogenesis false-alarm tendency in GFS",
      9: "Day 9 (+216h): Very high track spread (>650 km) across TIGGE ensemble",
      10: "Day 10 (+240h): Genesis probability guidance only; deterministic track unreliable"
    },
    tracks: {
      gfs: [[12.2, 88.5], [13.8, 87.2], [15.5, 86.0], [17.2, 85.1], [18.9, 84.5], [20.4, 84.2], [21.8, 84.0]],
      ecmwf: [[12.2, 88.5], [14.0, 87.6], [16.1, 87.0], [18.4, 87.4], [20.6, 88.2], [22.4, 89.1], [24.2, 90.5]],
      label: "Cyclone Recurvature Cone (Red: GFS Odisha Landfall vs Cyan: ECMWF Sundarbans Recurve)"
    },
    regionBustProfiles: {
      bay_of_bengal:     [24, 38, 56, 75, 88, 91, 86, 80, 76, 72],
      odisha_coastal:    [20, 34, 54, 76, 89, 92, 85, 76, 68, 62],
      gangetic_wb:       [18, 30, 48, 71, 86, 90, 88, 79, 72, 66],
      coromandel_tn:     [22, 33, 47, 58, 62, 56, 49, 44, 40, 38],
      northeast_india:   [12, 18, 28, 45, 64, 78, 84, 80, 74, 68],
      central_india:     [10, 15, 24, 38, 52, 60, 58, 52, 48, 44],
      gujarat_saurashtra:[14, 21, 32, 44, 54, 58, 56, 52, 49, 46],
      konkan_goa:        [12, 18, 26, 35, 43, 47, 46, 43, 40, 38],
      kerala_south:      [11, 16, 22, 29, 35, 38, 37, 35, 34, 33],
      nw_planes:         [8,  11, 16, 24, 32, 38, 41, 39, 37, 35],
      rajasthan_arid:    [6,  9,  12, 17, 22, 26, 28, 27, 26, 25],
      west_himalayas:    [8,  11, 15, 21, 28, 33, 36, 35, 34, 32]
    },
    shapDrivers: [
      { feature: "500–200 hPa Steering Ridge Weakness", contribution: +33.5, desc: "Depth of approaching mid-latitude trough dictates straight vs recurving track" },
      { feature: "Vortex Depth & Beta-Drift Coupling", contribution: +23.8, desc: "Stronger cyclone cores experience stronger poleward/eastward steering layers" },
      { feature: "Vertical Wind Shear & Dry Air Intrusion", contribution: +17.2, desc: "Rapid Intensification (RI) vs shear-induced vortex tilt uncertainty" },
      { feature: "GFS False Cyclogenesis / Spurious Spin-Up Bias", contribution: +12.9, desc: "Known historical positive bias in GFS convective vortex spin-up at Day 6–10" },
      { feature: "Run-to-Run Landfall Shift (dProg/dt)", contribution: +9.4, desc: "Consecutive cycles shifted landfall between Gopalpur and Sagar Island" },
      { feature: "Argo Float Ocean Heat Content (OHC)", contribution: -4.6, desc: "Well-observed Bay of Bengal barrier layer constrains SST cooling" }
    ],
    narrative: "Medium-range (Day 4–8) tropical cyclone forecasts in the Bay of Bengal and Arabian Sea experience dramatic track & intensity busts when a storm approaches the 16°N–19°N recurvature zone. Because steering height depends on vortex intensity, an early Rapid Intensification error of 20 kt feeds back into a 350+ km track error between Andhra/Odisha and West Bengal/Bangladesh.",
    recommendation: "Operational Guidance: Suppress deterministic single-line track cones beyond +96h. Weight ECMWF-EPS and NCMRWF ensemble cluster probabilities conditioned on vortex depth.",
    analogs: [
      {
        date: "15–20 May 2020",
        similarity: "95.9%",
        title: "Super Cyclone Amphan Rapid Intensification & Track Shift",
        desc: "Early medium-range runs showed wide spread between Odisha coast and Bangladesh before locking onto Sundarbans after explosive RI from Cat-1 to Cat-5 in 30 hours.",
        errorStat: "Day-5 Intensity Error: 45 kt | Track Spread: 390 km"
      },
      {
        date: "08–13 Jun 2023",
        similarity: "93.1%",
        title: "Cyclone Biparjoy Multi-Loop Recurvature Bust",
        desc: "Weak steering currents caused erratic slow movement and a sharp northeastward recurvature toward Kutch that defied Day 5–7 deterministic tracks.",
        errorStat: "Day-5 Track Error: 365 km | Bust Prob: 89%"
      },
      {
        date: "28 Apr–03 May 2019",
        similarity: "90.4%",
        title: "Extremely Severe Cyclone Fani Near-Coast Recurvature",
        desc: "Sensitivity to the timing of ridge retreat determined whether Fani grazed Tamil Nadu/AP or recurved directly into Puri, Odisha.",
        errorStat: "Day-6 Track Error: 310 km | Wind RMSE: 32 kt"
      }
    ]
  },

  heat_wave: {
    id: "heat_wave",
    name: "Severe Pre-Monsoon Heat Wave & Blocking High",
    bannerTitle: "NW & Central India Subtropical Blocking Anti-Cyclone — Heat Wave Termination Bust",
    primaryVariable: "temp_2m",
    unit: "°C (Tmax)",
    rocAuc: 0.89,
    leadWarningByDay: {
      1: "Day 1 (+24h): Strong anti-cyclonic subsidence & hot dry Thar northwesterlies locked",
      2: "Day 2 (+48h): Tmax > 45°C across Rajasthan, Vidarbha, and South UP",
      3: "Day 3 (+72h): Boundary-layer sensible heat flux vs dust aerosol radiative cooling spread",
      4: "Day 4 (+96h): BUST WINDOW — Premature pre-monsoon thunderstorm (Kalbaishakhi/Andhi) cooling in NWP",
      5: "Day 5 (+120h): 3.5°C–5.2°C Tmax error where models falsely break the blocking ridge",
      6: "Day 6 (+144h): Coastal sea-breeze front penetration error over Odisha & Konkan",
      7: "Day 7 (+168h): Persistent soil desiccation feedback extending heat wave duration",
      8: "Day 8 (+192h): Uncertain Western Disturbance relief cloud cover over IGP",
      9: "Day 9 (+216h): Ensemble spread in 850 hPa temperature anomaly (>4°C)",
      10: "Day 10 (+240h): Extended-range extreme heat persistence probability"
    },
    tracks: {
      gfs: [[28.5, 70.0], [27.8, 73.5], [26.5, 77.2], [24.8, 80.5], [23.2, 84.0]],
      ecmwf: [[27.0, 70.5], [26.2, 74.0], [25.0, 77.8], [23.5, 81.2], [21.8, 85.2]],
      label: "45°C Surface Isotherm & Dry-Line Advection Axis across NW–East India"
    },
    regionBustProfiles: {
      rajasthan_arid:    [14, 22, 36, 54, 68, 74, 72, 68, 64, 60],
      nw_planes:         [16, 26, 42, 62, 76, 80, 75, 69, 64, 59],
      central_india:     [15, 24, 39, 58, 72, 77, 73, 67, 62, 58],
      odisha_coastal:    [18, 29, 46, 65, 78, 81, 74, 66, 60, 56],
      gangetic_wb:       [19, 30, 48, 67, 79, 82, 76, 68, 62, 57],
      gujarat_saurashtra:[14, 21, 33, 49, 62, 66, 63, 58, 54, 50],
      coromandel_tn:     [13, 20, 31, 44, 55, 59, 57, 53, 49, 46],
      konkan_goa:        [12, 18, 28, 41, 52, 55, 52, 48, 45, 42],
      west_himalayas:    [11, 17, 26, 38, 49, 53, 51, 47, 44, 41],
      northeast_india:   [10, 15, 22, 31, 40, 44, 43, 40, 38, 36],
      kerala_south:      [9,  13, 18, 25, 31, 34, 35, 34, 33, 32],
      bay_of_bengal:     [8,  11, 15, 20, 25, 28, 29, 28, 27, 26]
    },
    shapDrivers: [
      { feature: "Spurious Convective Outflow Cooling in NWP", contribution: +27.9, desc: "Models trigger afternoon pre-monsoon storms too easily, dropping Tmax by 5°C" },
      { feature: "500 hPa Blocking Anti-Cyclone Persistence", contribution: +22.4, desc: "Medium-range NWP breaks down atmospheric blocking ridges 36–48h too early" },
      { feature: "Thar Mineral Dust Aerosol Radiative Forcing", contribution: +16.1, desc: "Unassimilated dust optical depth alters daytime shortwave & nighttime LW trapping" },
      { feature: "Sea-Breeze Front Inland Timing (East Coast)", contribution: +13.5, desc: "15 km shift in sea-breeze front over Odisha/WB causes 6°C station bust" },
      { feature: "Soil Desiccation & Evaporative Fraction Bias", contribution: +10.2, desc: "Overestimated root-zone soil moisture produces cold bias in 2m temperature" },
      { feature: "Clear-Sky Subsidence Inversion Strength", contribution: -4.0, desc: "High confidence in synoptic adiabatic warming over West Rajasthan" }
    ],
    narrative: "During severe Indian heat waves, medium-range NWP frequently predicts 'False Heat Wave Relief' at Day 4–7: models prematurely erode the 500 hPa subtropical blocking high or trigger spurious convective drizzle (Kalbaishakhi/Andhi) that cools model 2m temperatures by 4–6°C while extreme 46°C+ heat actually persists on the ground.",
    recommendation: "Operational Guidance: Apply soil-moisture bias correction to Day 4–8 Tmax and discount NWP heat-wave termination signals unless supported by >70% of ensemble members.",
    analogs: [
      {
        date: "26–30 May 2024",
        similarity: "95.1%",
        title: "Delhi & NW India 49°C Extreme Heat Wave Persistence",
        desc: "Day-5 NWP forecasts indicated a 4°C cooling from an approaching weak WD, but dry subsidence persisted and Mungeshpur/Najafgarh breached 49°C.",
        errorStat: "Day-5 Tmax Bias: -4.6°C | Heat Alert Bust"
      },
      {
        date: "27 Apr–02 May 2022",
        similarity: "92.3%",
        title: "Indo-Gangetic & East India Pre-Monsoon Heat Dome",
        desc: "Models triggered false Kalbaishakhi thunderstorms over Gangetic WB & Odisha at Day 5, masking a persistent 44.5°C severe heat wave.",
        errorStat: "Day-5 Tmax RMSE: 4.1°C | ACC: 0.49"
      },
      {
        date: "15–20 May 2016",
        similarity: "89.7%",
        title: "Phalodi & Thar Desert Record 51°C Blocking Ridge",
        desc: "Land-atmosphere sensible heat feedback amplified surface temperatures 3.8°C above raw GFS deterministic guidance.",
        errorStat: "Day-6 Tmax RMSE: 3.9°C | Bust Prob: 79%"
      }
    ]
  },

  break_monsoon: {
    id: "break_monsoon",
    name: "Break / Active Monsoon Phase Transition",
    bannerTitle: "Monsoon Trough Northward Shift to Himalayan Foothills — Break-Monsoon Transition Bust",
    primaryVariable: "precip_24h",
    unit: "mm/day",
    rocAuc: 0.91,
    leadWarningByDay: {
      1: "Day 1 (+24h): Monsoon trough axis currently near normal position (Ganganagar to Head Bay)",
      2: "Day 2 (+48h): Negative OLR anomaly propagating northward from equatorial Indian Ocean",
      3: "Day 3 (+72h): Boreal Summer Intraseasonal Oscillation (BSISO) phase speed spread",
      4: "Day 4 (+96h): TRANSITION BUST WINDOW — NWP struggles with sudden trough jump to foothills",
      5: "Day 5 (+120h): False active-monsoon rain predicted over Central India while Break sets in",
      6: "Day 6 (+144h): Extreme foothill deluge bust over Bihar, Sikkim, and Assam",
      7: "Day 7 (+168h): Anti-cyclonic anomaly over core monsoon zone (MP/Vidarbha dry spell)",
      8: "Day 8 (+192h): BSISO Phase 2/3 revival timing uncertainty in Bay of Bengal",
      9: "Day 9 (+216h): Low skill on intraseasonal active-break phase lock",
      10: "Day 10 (+240h): Extended-range MJO/BSISO index guidance required"
    },
    tracks: {
      gfs: [[28.5, 75.0], [26.8, 79.5], [24.8, 83.5], [22.8, 87.5]],
      ecmwf: [[30.8, 76.5], [28.8, 81.2], [27.2, 85.8], [26.5, 90.5]],
      label: "Monsoon Trough Axis Position (Red: GFS Core Zone vs Cyan: ECMWF Foothill Break Lock)"
    },
    regionBustProfiles: {
      central_india:     [16, 28, 48, 72, 85, 89, 86, 79, 73, 68],
      nw_planes:         [18, 30, 50, 74, 84, 87, 82, 75, 69, 64],
      northeast_india:   [20, 32, 52, 73, 86, 90, 87, 81, 75, 70],
      west_himalayas:    [17, 27, 44, 65, 77, 81, 77, 71, 65, 60],
      gangetic_wb:       [15, 24, 39, 58, 71, 75, 71, 65, 60, 56],
      odisha_coastal:    [14, 23, 38, 56, 69, 73, 68, 62, 57, 53],
      coromandel_tn:     [13, 21, 34, 49, 62, 68, 66, 61, 56, 52],
      rajasthan_arid:    [12, 19, 31, 45, 57, 62, 59, 54, 50, 46],
      gujarat_saurashtra:[11, 18, 29, 42, 53, 58, 55, 50, 46, 43],
      konkan_goa:        [14, 22, 35, 48, 59, 63, 60, 55, 51, 48],
      kerala_south:      [12, 18, 27, 38, 47, 51, 49, 46, 43, 41],
      bay_of_bengal:     [15, 24, 37, 52, 64, 68, 65, 60, 55, 52]
    },
    shapDrivers: [
      { feature: "BSISO / MJO Intraseasonal Phase Propagation", contribution: +30.8, desc: "NWP convective schemes damp northward-propagating 30–60 day oscillation" },
      { feature: "Monsoon Trough Latitude Jump (23°N → 28°N)", contribution: +24.5, desc: "Bimodal regime transition between Core Monsoon Zone and Himalayan foothills" },
      { feature: "Equatorial Indian Ocean Convective Competition", contribution: +16.4, desc: "Spurious ITCZ convection over 5°S–5°N robs moisture from cross-equatorial jet" },
      { feature: "Run-to-Run Flip-Flop Index (dProg/dt)", contribution: +11.9, desc: "Models oscillate on exact date of trough migration into Nepal/Bihar foothills" },
      { feature: "Tibetan Anticyclone 200 hPa Easterly Jet", contribution: +8.7, desc: "Upper-level divergence core displacement over Eastern Himalayas" },
      { feature: "Indian Ocean Dipole (IOD) Background State", contribution: -3.5, desc: "Slowly varying SST boundary condition well captured" }
    ],
    narrative: "Transitions between Active and Break Monsoon phases are notorious for medium-range 'Regime Transition Busts' at Day 5–9. Global NWP models struggle to propagate the Boreal Summer Intraseasonal Oscillation (BSISO) northward across the Indian landmass, often lingering rain over Central India (MP/Maharashtra) when the Monsoon Trough actually jumps abruptly to the Himalayan foothills — causing simultaneous unforecast dry spells in Central India and severe floods in Bihar/Assam.",
    recommendation: "Operational Guidance: Cross-check Day 5–10 deterministic NWP with real-time BSISO1/BSISO2 phase space diagrams. Flag agro-meteorological advisories in Central India for high dry-spell bust risk.",
    analogs: [
      {
        date: "05–14 Aug 2023",
        similarity: "96.1%",
        title: "August 2023 Extreme Break-Monsoon Transition",
        desc: "Abrupt migration of the Monsoon Trough to the Himalayan foothills triggered the driest August on record over Central India while causing severe flooding in Bihar & Northeast India.",
        errorStat: "Day-6 Core Zone Bias: +48 mm (False Rain) | Foothill Bias: -115 mm"
      },
      {
        date: "28 Jul–06 Aug 2017",
        similarity: "92.8%",
        title: "Bihar & Assam Foothill Trough Lock Bust",
        desc: "Medium-range forecasts 6 days ahead predicted trough southward return, but the trough remained locked along the foothills for 9 consecutive days.",
        errorStat: "Day-6 Precip RMSE: 84.5 mm | ACC: 0.39"
      },
      {
        date: "10–18 Jul 2009",
        similarity: "88.6%",
        title: "Core Monsoon Zone False Revival Bust",
        desc: "Spurious Bay of Bengal low spin-up in GFS gave false confidence in monsoon revival over MP and Vidarbha.",
        errorStat: "Day-7 False Alarm Rate: 0.74 | Bust Prob: 86%"
      }
    ]
  }
};

// Multi-regime skill comparison for Tab 2 chart
const REGIME_SKILL_CURVES = {
  days: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"],
  monsoon_depression: [86, 79, 68, 52, 38, 29, 34, 41, 45, 48],
  heavy_rainfall:     [80, 71, 56, 41, 28, 24, 30, 36, 41, 44],
  western_disturbance:[84, 75, 61, 45, 31, 27, 33, 39, 44, 47],
  cyclone:            [88, 78, 63, 44, 26, 21, 27, 34, 39, 43],
  heat_wave:          [90, 83, 72, 58, 44, 38, 42, 47, 51, 54],
  break_monsoon:      [87, 77, 62, 43, 29, 25, 29, 35, 40, 45]
};
