// Frontend API Service Layer
// Connects APEXIFY frontend to the FastAPI Backend

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.USE_BACKEND ? API_CONFIG.BASE_URL : 'http://localhost:8000/api';
  }

  async fetchDashboard() {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      return null;
    }
  }

  async fetchConfidence(region) {
    try {
      const response = await fetch(`${this.baseUrl}/confidence/${region}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching confidence for ${region}:`, error);
      return null;
    }
  }

  async fetchBustProbability(region) {
    try {
      const response = await fetch(`${this.baseUrl}/bust/${region}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching bust probability for ${region}:`, error);
      return null;
    }
  }

  async fetchExplanations(region) {
    try {
      const response = await fetch(`${this.baseUrl}/explanations/${region}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching explanations for ${region}:`, error);
      return null;
    }
  }

  async refreshCache(regionId, leadDay) {
    // Attempt to fetch from backend
    if (!API_CONFIG.USE_BACKEND) return;
    try {
        const confRes = await fetch(`${this.baseUrl}/confidence/${regionId}`);
        if(confRes.ok) {
            const data = await confRes.json();
            const cacheKey = `${regionId}_${leadDay}`;
            window.apiCache = window.apiCache || {};
            // Assuming the backend schema currently returns dummy data, 
            // we merge it to fit the { bustProb, confidence, spreadVal, gfsVal, ecmwfVal } schema
            window.apiCache[cacheKey] = {
                bustProb: data.bust_probability ? Math.round(data.bust_probability * 100) : 50,
                confidence: data.confidence || 50,
                spreadVal: 15,
                gfsVal: 80,
                ecmwfVal: 70
            };
        }
    } catch (e) {
        console.log("Backend not available yet, using local mock logic", e);
    }
  }
}

const apiService = new ApiService();
window.apiService = apiService;
