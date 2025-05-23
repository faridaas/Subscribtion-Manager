const API_URL = 'http://localhost:5000/api';

export const userService = {
  async getCurrentUser() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    
    // Update localStorage with fresh user data
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  }
}; 