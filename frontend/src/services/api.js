// frontend/src/services/api.js
const API_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur API');
    }
    return response.json();
  }

  // ===== AUTHENTIFICATION =====
  async googleLogin(googleData) {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(googleData)
    });
    return this.handleResponse(response);
  }

  async linkedinLogin(linkedinData) {
    const response = await fetch(`${API_URL}/auth/linkedin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(linkedinData)
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // ===== GESTION DES CVs =====
  async getMyCVs() {
    const response = await fetch(`${API_URL}/cvs/my-cvs`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getCV(id) {
    const response = await fetch(`${API_URL}/cvs/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createCV(cvData) {
    const response = await fetch(`${API_URL}/cvs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(cvData)
    });
    return this.handleResponse(response);
  }

  async updateCV(id, cvData) {
    const response = await fetch(`${API_URL}/cvs/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(cvData)
    });
    return this.handleResponse(response);
  }

  async deleteCV(id) {
    const response = await fetch(`${API_URL}/cvs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();