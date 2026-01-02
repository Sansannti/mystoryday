const BASE_URL = 'https://story-api.dicoding.dev/v1';

class StoryAPI {
  static async register(name, email, password) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  }

  static async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  }

  static async getStories() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found. Please login first.');
    }

    const response = await fetch(`${BASE_URL}/stories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stories');
    }
    
    return data;
  }

  static async addStory(description, photo, lat, lon) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found. Please login first.');
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add story');
    }
    
    return data;
  }
}

export default StoryAPI;