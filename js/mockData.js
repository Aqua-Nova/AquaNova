/**
 * Water Intelligence - Mock Dataset & Region Telemetry
 * Prepared for SIH 2026 - Saurav (Frontend & Visualisation)
 * 
 * This file provides high-fidelity sample data for multiple Indian regions.
 * If the backend API is offline during the hackathon demo, the dashboard
 * seamlessly falls back to these records.
 */

const REGION_DATA = {
  "delhi": {
    name: "Delhi NCR",
    state: "Delhi",
    lat: 28.6139,
    lng: 77.2090,
    status: "HIGH", // LOW | MODERATE | HIGH | CRITICAL
    statusText: "High Shortage Risk",
    waterTrend: { label: "Declining", change: "-14%", direction: "down" },
    forecast7d: { label: "Decreasing", note: "Dry spell expected next 7 days", direction: "down" },
    storageLevel: { value: 34, label: "34% of Full Capacity", status: "warning" },
    groundwaterDepth: { value: "38.5 m", label: "Depleting (-1.2m YoY)", status: "danger" },
    dailyConsumption: "935 MLD",
    rainfallAnomaly: "-42% vs Normal",
    
    // 4-Day Forecast matching Slide 9 mockup
    next4Days: [
      { day: "Today", value: 58, color: "#10b981", badge: "Moderate" },
      { day: "Day 2", value: 48, color: "#f59e0b", badge: "Stressed" },
      { day: "Day 3", value: 38, color: "#f97316", badge: "High Risk" },
      { day: "Day 4", value: 28, color: "#ef4444", badge: "Critical" }
    ],

    // Multi-week Historical Trends
    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [45, 32, 18, 12, 5],        // in mm
      consumption: [810, 840, 890, 920, 935], // in MLD
      availability: [78, 68, 54, 42, 34]     // in % capacity
    },

    // Contributing Risk Factors
    factors: [
      { name: "Monsoon Deficit", weight: 45, trend: "down", desc: "42% below long-period average in Yamuna catchment" },
      { name: "Urban Consumption Surge", weight: 30, trend: "up", desc: "Peak summer/humidity demand up by 15.4%" },
      { name: "Upstream Inflow Reduction", weight: 25, trend: "down", desc: "Wazirabad barrage level down to 667.2 ft" }
    ],

    // Proactive Early Warning Alert
    alert: {
      active: true,
      level: "HIGH",
      title: "Water Shortage Risk Detected",
      summary: "The selected region is showing a declining water availability trend. Reduced rainfall and increasing consumption are primary contributing factors.",
      recommendations: [
        "Enforce phased municipal supply rationing in outer district sectors (08:00 - 17:00).",
        "Deploy mobile sensor telemetry to detect secondary distribution leakage in grid 4.",
        "Issue proactive conservation advisory to bulk commercial consumers.",
        "Prepare backup water tank logistics for high-density residential blocks."
      ]
    }
  },

  "bundelkhand": {
    name: "Bundelkhand (Jhansi Zone)",
    state: "Uttar Pradesh / MP",
    lat: 25.4484,
    lng: 78.5685,
    status: "CRITICAL",
    statusText: "Critical Drought Stress",
    waterTrend: { label: "Severely Depleting", change: "-28%", direction: "down" },
    forecast7d: { label: "Extreme Dry", note: "No precipitation expected", direction: "down" },
    storageLevel: { value: 19, label: "19% Reservoir Level", status: "danger" },
    groundwaterDepth: { value: "52.3 m", label: "Critical Over-Exploitation", status: "danger" },
    dailyConsumption: "280 MLD",
    rainfallAnomaly: "-58% vs Normal",

    next4Days: [
      { day: "Today", value: 32, color: "#f97316", badge: "High Risk" },
      { day: "Day 2", value: 24, color: "#ef4444", badge: "Critical" },
      { day: "Day 3", value: 18, color: "#b91c1c", badge: "Severe" },
      { day: "Day 4", value: 12, color: "#7f1d1d", badge: "Emergency" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [12, 8, 4, 0, 0],
      consumption: [240, 255, 270, 275, 280],
      availability: [42, 35, 28, 22, 19]
    },

    factors: [
      { name: "Consecutive Rain Failure", weight: 55, trend: "down", desc: "Catchment reservoirs receiving zero fresh runoff" },
      { name: "Agricultural Tube-well Draw", weight: 30, trend: "up", desc: "Unregulated borewell extraction for kharif sowing" },
      { name: "Soil Moisture Depletion", weight: 15, trend: "down", desc: "Topsoil aridity index exceeding critical threshold" }
    ],

    alert: {
      active: true,
      level: "CRITICAL",
      title: "Emergency Water Scarcity Warning",
      summary: "Critical reservoir and aquifer depletion detected. Immediate inter-agency mitigation required within 48 hours.",
      recommendations: [
        "Activate Emergency Water Supply Plan and prepare railway water tankers.",
        "Restrict non-essential industrial water intake immediately.",
        "Prioritize livestock and drinking water supply over secondary agricultural canals."
      ]
    }
  },

  "marathwada": {
    name: "Marathwada (Aurangabad / Sambhajinagar)",
    state: "Maharashtra",
    lat: 19.8762,
    lng: 75.3433,
    status: "HIGH",
    statusText: "High Water Stress",
    waterTrend: { label: "Declining", change: "-18%", direction: "down" },
    forecast7d: { label: "Deficit Trend", note: "Isolated light showers only", direction: "down" },
    storageLevel: { value: 27, label: "27% Jayakwadi Dam Storage", status: "warning" },
    groundwaterDepth: { value: "41.0 m", label: "Semi-Critical Zone", status: "danger" },
    dailyConsumption: "410 MLD",
    rainfallAnomaly: "-35% vs Normal",

    next4Days: [
      { day: "Today", value: 50, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 2", value: 41, color: "#f97316", badge: "Stressed" },
      { day: "Day 3", value: 31, color: "#ef4444", badge: "High Risk" },
      { day: "Day 4", value: 22, color: "#ef4444", badge: "Critical" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [30, 22, 14, 8, 4],
      consumption: [380, 390, 400, 405, 410],
      availability: [58, 49, 39, 31, 27]
    },

    factors: [
      { name: "Deficit Monsoon Inflow", weight: 48, trend: "down", desc: "Godavari basin feeder streams underperforming" },
      { name: "Sugarcane Belt Consumption", weight: 32, trend: "up", desc: "High water footprint crop irrigation demand" },
      { name: "Evaporative Losses", weight: 20, trend: "up", desc: "High ambient temperature increasing surface loss" }
    ],

    alert: {
      active: true,
      level: "HIGH",
      title: "Regional Shortage Prediction Flagged",
      summary: "Jayakwadi dam active storage falling below 30-day buffer threshold under current consumption velocity.",
      recommendations: [
        "Shift canal supply to micro-irrigation schedules.",
        "Enforce strict audit on urban municipal pipeline losses.",
        "Coordinate with state water board for synchronized dam gate control."
      ]
    }
  },

  "jaipur": {
    name: "Jaipur Metropolitan",
    state: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    status: "MODERATE",
    statusText: "Moderate Water Stress",
    waterTrend: { label: "Slowly Declining", change: "-6%", direction: "down" },
    forecast7d: { label: "Scattered Rain", note: "Moderate monsoon surge expected", direction: "up" },
    storageLevel: { value: 61, label: "61% Bisalpur Dam Level", status: "success" },
    groundwaterDepth: { value: "32.0 m", label: "Over-exploited in suburban zones", status: "warning" },
    dailyConsumption: "520 MLD",
    rainfallAnomaly: "-12% vs Normal",

    next4Days: [
      { day: "Today", value: 68, color: "#10b981", badge: "Normal" },
      { day: "Day 2", value: 64, color: "#10b981", badge: "Normal" },
      { day: "Day 3", value: 59, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 4", value: 55, color: "#f59e0b", badge: "Moderate" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [60, 45, 30, 25, 35],
      consumption: [500, 505, 515, 520, 520],
      availability: [72, 69, 66, 63, 61]
    },

    factors: [
      { name: "Bisalpur Reservoir Buffer", weight: 50, trend: "stable", desc: "Current storage provides 60-day urban buffer" },
      { name: "Suburban Ground Water Draw", weight: 30, trend: "up", desc: "Heavy reliance on private tankers in outer wards" },
      { name: "Monsoon Revival Outlook", weight: 20, trend: "up", desc: "Upcoming western disturbance may augment supply" }
    ],

    alert: {
      active: false,
      level: "MODERATE",
      title: "Advisory: Monitor Outer Subdivisions",
      summary: "Overall reservoir supply is stable, but groundwater drawdown in peripheral zones requires regulated extraction.",
      recommendations: [
        "Maintain normal urban distribution schedule while monitoring dam levels.",
        "Expedite rainwater harvesting structure inspections in educational institutions."
      ]
    }
  },

  "bengaluru": {
    name: "Bengaluru Urban Zone",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    status: "HIGH",
    statusText: "Borewell & Grid Stress",
    waterTrend: { label: "Declining", change: "-12%", direction: "down" },
    forecast7d: { label: "Moderate Showers", note: "Intermittent convective rainfall", direction: "up" },
    storageLevel: { value: 44, label: "44% Cauvery Reservoir Share", status: "warning" },
    groundwaterDepth: { value: "48.2 m", label: "Severe Borewell Depletion (IT Corridor)", status: "danger" },
    dailyConsumption: "1450 MLD",
    rainfallAnomaly: "-24% vs Normal",

    next4Days: [
      { day: "Today", value: 56, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 2", value: 51, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 3", value: 43, color: "#f97316", badge: "Stressed" },
      { day: "Day 4", value: 36, color: "#ef4444", badge: "High Risk" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [42, 38, 25, 20, 28],
      consumption: [1380, 1400, 1420, 1440, 1450],
      availability: [65, 59, 52, 48, 44]
    },

    factors: [
      { name: "IT Corridor Borewell Failure", weight: 42, trend: "down", desc: "Over 35% public borewells running dry in Mahadevapura" },
      { name: "Cauvery Stage-V Inflow Lag", weight: 33, trend: "stable", desc: "Piped water feeder network undergoing balancing" },
      { name: "Lake Rejuvenation Deficit", weight: 25, trend: "down", desc: "Urban runoff bypassed into stormwater drains" }
    ],

    alert: {
      active: true,
      level: "HIGH",
      title: "Groundwater Stress & Piped Grid Imbalance",
      summary: "Peripheral wards facing tanker dependency and rapid groundwater table drop despite stable Cauvery river inflows.",
      recommendations: [
        "Fix maximum rate caps on private water tankers in high-stress zones.",
        "Mandate treated wastewater reuse for commercial tech parks and gardens.",
        "Accelerate recharge well injection in dry lake beds."
      ]
    }
  },

  "chennai": {
    name: "Chennai Coastal Region",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    status: "LOW",
    statusText: "Normal / Low Risk",
    waterTrend: { label: "Stable / Recovering", change: "+4%", direction: "up" },
    forecast7d: { label: "Normal Inflow", note: "Northeast monsoon preparedness on track", direction: "up" },
    storageLevel: { value: 76, label: "76% Combined Lake Storage", status: "success" },
    groundwaterDepth: { value: "14.5 m", label: "Healthy Aquifer Level", status: "success" },
    dailyConsumption: "860 MLD",
    rainfallAnomaly: "+14% vs Normal",

    next4Days: [
      { day: "Today", value: 82, color: "#10b981", badge: "Abundant" },
      { day: "Day 2", value: 80, color: "#10b981", badge: "Abundant" },
      { day: "Day 3", value: 78, color: "#10b981", badge: "Good" },
      { day: "Day 4", value: 75, color: "#10b981", badge: "Normal" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [35, 50, 65, 40, 55],
      consumption: [840, 850, 855, 860, 860],
      availability: [68, 70, 73, 75, 76]
    },

    factors: [
      { name: "Major Reservoir Storage", weight: 60, trend: "up", desc: "Poondi, Chembarambakkam, Red Hills at healthy levels" },
      { name: "Desalination Plant Output", weight: 25, trend: "stable", desc: "Minjur & Nemmeli plants running at 92% capacity" },
      { name: "Rainwater Harvesting Recharge", weight: 15, trend: "up", desc: "Widespread rooftop RWH systems replenishing shallow wells" }
    ],

    alert: {
      active: false,
      level: "LOW",
      title: "System Status: Normal Operations",
      summary: "Current reservoir volumes and desalination outputs are sufficient to satisfy city demand for 120+ days.",
      recommendations: [
        "Continue routine distribution schedule.",
        "Perform pre-monsoon desilting of supply channels and surplus weirs."
      ]
    }
  },

  "mumbai": {
    name: "Mumbai Metropolitan (MMR)",
    state: "Maharashtra",
    lat: 19.0760,
    lng: 72.8777,
    status: "LOW",
    statusText: "Normal / Healthy Reservoir Stock",
    waterTrend: { label: "Stable Inflow", change: "+8%", direction: "up" },
    forecast7d: { label: "Heavy Konkan Monsoon", note: "Continuous reservoir catchment replenishment", direction: "up" },
    storageLevel: { value: 86, label: "86% 7-Lake Combined System", status: "success" },
    groundwaterDepth: { value: "8.2 m", label: "Adequate Coastal Water Table", status: "success" },
    dailyConsumption: "3850 MLD",
    rainfallAnomaly: "+22% vs Normal",

    next4Days: [
      { day: "Today", value: 88, color: "#10b981", badge: "Abundant" },
      { day: "Day 2", value: 86, color: "#10b981", badge: "Abundant" },
      { day: "Day 3", value: 84, color: "#10b981", badge: "Good" },
      { day: "Day 4", value: 81, color: "#10b981", badge: "Normal" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [110, 145, 95, 80, 120],
      consumption: [3750, 3800, 3820, 3850, 3850],
      availability: [74, 78, 82, 84, 86]
    },

    factors: [
      { name: "Bhatsa & Upper Vaitarna Inflow", weight: 55, trend: "up", desc: "Catchment gates operating to balance flood cushion and storage" },
      { name: "High Urban Pipeline Flow", weight: 28, trend: "stable", desc: "Hydraulic pressure maintained across South & Suburb grids" },
      { name: "Monsoon Catchment Discharge", weight: 17, trend: "up", desc: "Tansa and Modak Sagar overflowing into spillways" }
    ],

    alert: {
      active: false,
      level: "LOW",
      title: "Adequate Annual Water Buffer Stock",
      summary: "Combined lake storage exceeds 1.25 million ML, securing drinking water supplies through next summer.",
      recommendations: [
        "Monitor automated sluice gates during intense convective downpours.",
        "Maintain proactive pipeline ultrasonic leak detection in old island ward networks."
      ]
    }
  },

  "hyderabad": {
    name: "Hyderabad Urban Agglomeration",
    state: "Telangana",
    lat: 17.3850,
    lng: 78.4867,
    status: "MODERATE",
    statusText: "Moderate Supply Balancing",
    waterTrend: { label: "Mild Deficit", change: "-5%", direction: "down" },
    forecast7d: { label: "Scattered Rains", note: "Godavari Phase-1 pumping operational", direction: "stable" },
    storageLevel: { value: 52, label: "52% Singur & Osmansagar Storage", status: "warning" },
    groundwaterDepth: { value: "34.2 m", label: "Stress in Cyberabad Belts", status: "warning" },
    dailyConsumption: "2150 MLD",
    rainfallAnomaly: "-16% vs Normal",

    next4Days: [
      { day: "Today", value: 62, color: "#10b981", badge: "Normal" },
      { day: "Day 2", value: 58, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 3", value: 52, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 4", value: 46, color: "#f97316", badge: "Stressed" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [45, 30, 20, 15, 22],
      consumption: [2050, 2080, 2110, 2140, 2150],
      availability: [64, 60, 56, 54, 52]
    },

    factors: [
      { name: "Godavari Pumping Energy Costs", weight: 45, trend: "stable", desc: "Long-distance multi-stage lift pipeline running 24/7" },
      { name: "IT Corridor Rapid Growth", weight: 35, trend: "up", desc: "High-density residential towers drawing deep borewells" },
      { name: "Manjira Inflow Deficit", weight: 20, trend: "down", desc: "Upstream check-dams retaining tributary runoff" }
    ],

    alert: {
      active: false,
      level: "MODERATE",
      title: "Advisory: Monitor Outer Ring Road Pressure",
      summary: "Piped supply is steady via Godavari lift scheme, but groundwater levels in western IT corridors show localized depletion.",
      recommendations: [
        "Optimize dual piping and decentralized sewage treatment plants in gated communities.",
        "Enforce staggered municipal pumping schedules across industrial estates."
      ]
    }
  },

  "kolkata": {
    name: "Kolkata & KMDA Zone",
    state: "West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    status: "LOW",
    statusText: "Low Stress / Perennial Surface Inflow",
    waterTrend: { label: "Stable Flow", change: "+2%", direction: "up" },
    forecast7d: { label: "Gangetic Monsoon Rains", note: "Active monsoon trough over Delta", direction: "up" },
    storageLevel: { value: 78, label: "78% Surface River Offtake Index", status: "success" },
    groundwaterDepth: { value: "11.0 m", label: "High Water Table (Salinity Monitored)", status: "success" },
    dailyConsumption: "1850 MLD",
    rainfallAnomaly: "+8% vs Normal",

    next4Days: [
      { day: "Today", value: 80, color: "#10b981", badge: "Abundant" },
      { day: "Day 2", value: 78, color: "#10b981", badge: "Good" },
      { day: "Day 3", value: 76, color: "#10b981", badge: "Good" },
      { day: "Day 4", value: 74, color: "#10b981", badge: "Normal" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [65, 80, 50, 70, 60],
      consumption: [1800, 1820, 1840, 1850, 1850],
      availability: [75, 76, 76, 77, 78]
    },

    factors: [
      { name: "Hooghly River Perennial Discharge", weight: 65, trend: "up", desc: "Palta and Garden Reach WTPs operating at optimum raw intake" },
      { name: "Salinity & Turbidity Monitoring", weight: 20, trend: "stable", desc: "Automated real-time chlorination and coagulant dosing" },
      { name: "East Kolkata Wetlands Filter", weight: 15, trend: "stable", desc: "Natural biological sewage attenuation and ground recharge" }
    ],

    alert: {
      active: false,
      level: "LOW",
      title: "Abundant Surface Water Availability",
      summary: "Riverine raw water intake is abundant. Focus remains on water quality, filtration, and pipeline disinfection.",
      recommendations: [
        "Continuous automated monitoring of riverbed silt and turbidity.",
        "Maintain pre-chlorination dosing during high-tide brackish water incursions."
      ]
    }
  },

  "ahmedabad": {
    name: "Ahmedabad & Gandhinagar",
    state: "Gujarat",
    lat: 23.0225,
    lng: 72.5714,
    status: "MODERATE",
    statusText: "Moderate Canal Dependent Zone",
    waterTrend: { label: "Stable Inflow", change: "-3%", direction: "down" },
    forecast7d: { label: "Isolated Showers", note: "Narmada main canal discharge steady", direction: "stable" },
    storageLevel: { value: 64, label: "64% Sardar Sarovar Allocation", status: "success" },
    groundwaterDepth: { value: "36.8 m", label: "Deep Alluvial Aquifer Zone", status: "warning" },
    dailyConsumption: "1420 MLD",
    rainfallAnomaly: "-10% vs Normal",

    next4Days: [
      { day: "Today", value: 70, color: "#10b981", badge: "Normal" },
      { day: "Day 2", value: 65, color: "#10b981", badge: "Normal" },
      { day: "Day 3", value: 58, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 4", value: 52, color: "#f59e0b", badge: "Moderate" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [50, 35, 25, 20, 18],
      consumption: [1360, 1380, 1400, 1410, 1420],
      availability: [72, 69, 67, 65, 64]
    },

    factors: [
      { name: "Narmada Main Canal Supply", weight: 58, trend: "stable", desc: "Continuous bulk conveyance to Kotarpur & Jaspur WTPs" },
      { name: "Sabarmati Riverfront Storage", weight: 24, trend: "stable", desc: "Barrage retention level maintained for city aesthetic & recharge" },
      { name: "Industrial Estate Intake", weight: 18, trend: "up", desc: "Vatva & Naroda estates monitored for effluent recycling" }
    ],

    alert: {
      active: false,
      level: "MODERATE",
      title: "Stable Supply Supported by Narmada Canal",
      summary: "Canal allocations provide 90% of urban potable needs. Secondary borewell dependency reduced.",
      recommendations: [
        "Audit smart water meter telemetry in commercial and institutional zones.",
        "Ensure lake interlinking channels are cleared for monsoon catchment inflow."
      ]
    }
  },

  "shimla": {
    name: "Shimla & Solan Hill Tract",
    state: "Himachal Pradesh",
    lat: 31.1048,
    lng: 77.1734,
    status: "HIGH",
    statusText: "High Mountain Spring Stress",
    waterTrend: { label: "Plunging Spring Inflow", change: "-24%", direction: "down" },
    forecast7d: { label: "Low Precipitation", note: "Hill catchment dry spell", direction: "down" },
    storageLevel: { value: 28, label: "28% Giri & Gumma Offtake", status: "danger" },
    groundwaterDepth: { value: "Mountain Spring Discharge: 18 LPM", label: "Spring Source Drying Up", status: "danger" },
    dailyConsumption: "46 MLD",
    rainfallAnomaly: "-48% vs Normal",

    next4Days: [
      { day: "Today", value: 44, color: "#f97316", badge: "Stressed" },
      { day: "Day 2", value: 36, color: "#f97316", badge: "Stressed" },
      { day: "Day 3", value: 26, color: "#ef4444", badge: "Critical" },
      { day: "Day 4", value: 18, color: "#b91c1c", badge: "Emergency" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [25, 18, 10, 6, 2],
      consumption: [42, 44, 45, 46, 46],
      availability: [54, 46, 38, 32, 28]
    },

    factors: [
      { name: "Hill Spring Discharge Failure", weight: 52, trend: "down", desc: "Gumma and Ashwini Khad natural spring yields down by 42%" },
      { name: "Tourist Surge & Hotel Consumption", weight: 30, trend: "up", desc: "Peak weekend tourist occupancy straining hill storage tanks" },
      { name: "Multi-Stage High-Head Pumping Lift", weight: 18, trend: "stable", desc: "High elevation lift prone to power fluctuations" }
    ],

    alert: {
      active: true,
      level: "HIGH",
      title: "Hill Spring Shortage & Tourist Influx Warning",
      summary: "Natural spring discharge is severely depressed. Rotational water rationing required across municipal wards.",
      recommendations: [
        "Enforce strict alternate-day municipal supply to domestic consumers.",
        "Audit bulk water storage and pricing in luxury hill resorts and hotels.",
        "Deploy mobile mountain spring telemetry sensors to locate secondary fissures."
      ]
    }
  },

  "pune": {
    name: "Pune Metropolitan (PMC / PCMC)",
    state: "Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    status: "LOW",
    statusText: "Normal / Abundant Dam Storage",
    waterTrend: { label: "Rising Inflow", change: "+11%", direction: "up" },
    forecast7d: { label: "Western Ghats Catchment Rain", note: "Continuous inflow into Khadakwasla complex", direction: "up" },
    storageLevel: { value: 89, label: "89% Khadakwasla, Panshet & Varasgaon", status: "success" },
    groundwaterDepth: { value: "12.4 m", label: "Recharged Deccan Basalt Aquifer", status: "success" },
    dailyConsumption: "1650 MLD",
    rainfallAnomaly: "+28% vs Normal",

    next4Days: [
      { day: "Today", value: 92, color: "#10b981", badge: "Abundant" },
      { day: "Day 2", value: 90, color: "#10b981", badge: "Abundant" },
      { day: "Day 3", value: 88, color: "#10b981", badge: "Abundant" },
      { day: "Day 4", value: 85, color: "#10b981", badge: "Good" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [90, 120, 110, 85, 95],
      consumption: [1600, 1620, 1630, 1650, 1650],
      availability: [76, 80, 84, 87, 89]
    },

    factors: [
      { name: "4-Dam Complex Overflow Inflow", weight: 62, trend: "up", desc: "Panshet, Varasgaon, Temghar & Khadakwasla near capacity" },
      { name: "Canal Discharge to Daund Agriculture", weight: 22, trend: "up", desc: "Surplus water released for downstream kharif crops" },
      { name: "Urban 24x7 Water Supply Balancing", weight: 16, trend: "stable", desc: "Piped network pressure equalization in progress" }
    ],

    alert: {
      active: false,
      level: "LOW",
      title: "Optimal Dam Storage & Safe Buffer",
      summary: "Dam levels ensure 100% water security for the upcoming 12 months for both urban and rural canal networks.",
      recommendations: [
        "Coordinate flood release protocols along Mutha riverbed during heavy spell.",
        "Continue pre-monsoon desilting and water treatment plant maintenance."
      ]
    }
  },

  "lucknow": {
    name: "Lucknow Smart City",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    status: "MODERATE",
    statusText: "Moderate River & Tube-Well Stress",
    waterTrend: { label: "Slow Deficit", change: "-7%", direction: "down" },
    forecast7d: { label: "Light Monsoonal Showers", note: "Gomti river discharge steady", direction: "stable" },
    storageLevel: { value: 58, label: "58% Gomti River Discharge Index", status: "warning" },
    groundwaterDepth: { value: "28.6 m", label: "Semi-Critical in Trans-Gomti", status: "warning" },
    dailyConsumption: "760 MLD",
    rainfallAnomaly: "-18% vs Normal",

    next4Days: [
      { day: "Today", value: 65, color: "#10b981", badge: "Normal" },
      { day: "Day 2", value: 60, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 3", value: 54, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 4", value: 48, color: "#f97316", badge: "Stressed" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [40, 32, 22, 18, 25],
      consumption: [720, 735, 750, 755, 760],
      availability: [68, 65, 62, 60, 58]
    },

    factors: [
      { name: "Gomti River Low Inflow", weight: 46, trend: "down", desc: "Upstream barrages retaining flow during monsoon gaps" },
      { name: "Deep Tube-Well Extraction", weight: 34, trend: "up", desc: "High municipal extraction in high-density old city sectors" },
      { name: "Aishbagh WTP Intake Pressure", weight: 20, trend: "stable", desc: "Raw water pumps operating under regulated hydraulic control" }
    ],

    alert: {
      active: false,
      level: "MODERATE",
      title: "Gomti Inflow & Tube-Well Monitoring",
      summary: "River intake and municipal borewells are operating within safe baseline, but Trans-Gomti wards require extraction regulation.",
      recommendations: [
        "Audit commercial borewells and mandate rainwater harvesting pits.",
        "Optimize aeration and filtration cycles at Aishbagh Water Treatment Plant."
      ]
    }
  }
};

/**
 * Akansha's Relational Database Schema & Query Presets (Layer 2)
 * Designed for SIH 2026 - Akansha (Database Architecture & Data Management)
 */
const AKANSHA_DB_SCHEMA = {
  version: "3.45.0",
  engine: "SQLite (WAL Mode) / PostgreSQL 16 Ready",
  lastBackup: "2026-09-05 15:45:00 UTC",
  totalRows: 14480,
  tables: [
    {
      name: "regions",
      description: "Master directory of monitored Indian administrative districts, coordinates and baseline capacities.",
      columns: [
        { name: "region_id", type: "TEXT PRIMARY KEY", pk: true, desc: "Unique identifier (e.g. 'delhi', 'bundelkhand')" },
        { name: "region_name", type: "TEXT NOT NULL", pk: false, desc: "District/Metropolitan Name" },
        { name: "state", type: "TEXT NOT NULL", pk: false, desc: "State / Union Territory" },
        { name: "lat", type: "REAL NOT NULL", pk: false, desc: "Latitude Coordinate" },
        { name: "lng", type: "REAL NOT NULL", pk: false, desc: "Longitude Coordinate" },
        { name: "zone", type: "TEXT", pk: false, desc: "Hydrological River Basin Zone" }
      ]
    },
    {
      name: "sensor_telemetry",
      description: "Time-series stream ingesting live IoT reservoir gauges, CGWB borewells and IMD rain gauges.",
      columns: [
        { name: "telemetry_id", type: "INTEGER PRIMARY KEY AUTOINCREMENT", pk: true, desc: "Auto-incrementing telemetry sequence" },
        { name: "region_id", type: "TEXT REFERENCES regions(region_id)", fk: true, desc: "Foreign Key linking district" },
        { name: "storage_capacity_pct", type: "REAL NOT NULL", pk: false, desc: "Current surface reservoir level (%)" },
        { name: "groundwater_depth_m", type: "REAL NOT NULL", pk: false, desc: "Water table depth below ground level (m)" },
        { name: "daily_consumption_mld", type: "INTEGER NOT NULL", pk: false, desc: "Daily urban consumption (Million Liters/Day)" },
        { name: "rainfall_anomaly_pct", type: "REAL NOT NULL", pk: false, desc: "Monsoon deficit/surplus vs normal (%)" },
        { name: "risk_status", type: "TEXT NOT NULL", pk: false, desc: "'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'" },
        { name: "recorded_at", type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", pk: false, desc: "ISO Ingestion Timestamp" }
      ]
    },
    {
      name: "forecast_4days",
      description: "AI Model (Deep's Layer 4) predictive inference outputs written to database for Saurav's frontend.",
      columns: [
        { name: "forecast_id", type: "INTEGER PRIMARY KEY AUTOINCREMENT", pk: true, desc: "Forecast record identifier" },
        { name: "region_id", type: "TEXT REFERENCES regions(region_id)", fk: true, desc: "Foreign Key to region" },
        { name: "day_name", type: "TEXT NOT NULL", pk: false, desc: "'Today', 'Day 2', 'Day 3', 'Day 4'" },
        { name: "predicted_availability", type: "REAL NOT NULL", pk: false, desc: "AI-predicted water availability index (%)" },
        { name: "badge_label", type: "TEXT NOT NULL", pk: false, desc: "Risk badge ('Moderate', 'Stressed', 'Critical')" },
        { name: "generated_at", type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", pk: false, desc: "Inference timestamp" }
      ]
    },
    {
      name: "mcda_risk_weights",
      description: "Multi-Criteria Decision Analysis parameters designed with Kanika for dynamic weighting.",
      columns: [
        { name: "weight_id", type: "INTEGER PRIMARY KEY", pk: true, desc: "Weight configuration ID" },
        { name: "parameter_name", type: "TEXT NOT NULL", pk: false, desc: "Parameter ('rainfall_deficit', 'storage_level', 'demand')" },
        { name: "weight_percentage", type: "INTEGER NOT NULL", pk: false, desc: "Assigned weight percentage (0-100%)" },
        { name: "active_profile", type: "TEXT NOT NULL", pk: false, desc: "'default_monsoon_profile', 'dry_spell_profile'" }
      ]
    }
  ]
};

const PRESET_SQL_QUERIES = [
  {
    id: "query_critical",
    title: "1. Critical Water Deficits",
    badge: "EMERGENCY FILTER",
    sql: `SELECT region_id, region_name, state, storage_capacity_pct, groundwater_depth_m, risk_status \nFROM sensor_telemetry \nWHERE risk_status IN ('HIGH', 'CRITICAL') \nORDER BY storage_capacity_pct ASC;`,
    description: "Filters all districts currently breaching safe thresholds requiring immediate municipal mitigation."
  },
  {
    id: "query_groundwater",
    title: "2. Deepest Aquifer Depletion",
    badge: "CGWB HYDROGRAPH",
    sql: `SELECT region_name, state, groundwater_depth_m, daily_consumption_mld, risk_status \nFROM sensor_telemetry \nORDER BY groundwater_depth_m DESC \nLIMIT 5;`,
    description: "Ranks top 5 severely depleted groundwater zones to flag tube-well over-extraction."
  },
  {
    id: "query_forecast",
    title: "3. Day-4 AI Shortage Warnings",
    badge: "PREDICTIVE ML",
    sql: `SELECT r.region_name, r.state, f.day_name, f.predicted_availability, f.badge_label \nFROM forecast_4days f \nJOIN regions r ON f.region_id = r.region_id \nWHERE f.day_name = 'Day 4' AND f.predicted_availability < 35.0 \nORDER BY f.predicted_availability ASC;`,
    description: "Joins AI inference forecast with region metadata to isolate impending shortages 96 hours ahead."
  },
  {
    id: "query_state_agg",
    title: "4. State Aggregation & Avg Storage",
    badge: "MUNICIPAL AGGREGATE",
    sql: `SELECT state, COUNT(*) AS monitored_districts, ROUND(AVG(storage_capacity_pct), 1) AS avg_storage_pct, ROUND(AVG(groundwater_depth_m), 1) AS avg_gw_depth_m \nFROM sensor_telemetry \nGROUP BY state \nORDER BY avg_storage_pct ASC;`,
    description: "Computes aggregate state-level water security indices across multi-district monitoring hubs."
  }
];


