const API_URL = 'http://localhost:5000/api';

export const resetPasswordService = {
  async requestPasswordReset(email) {
    const response = await fetch(`${API_URL}/auth/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Failed to request password reset');
    }

    const data = await response.json();
    return data;
  },

  async resetPassword(token, newPassword) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        newPassword
      })
    });

    if (!response.ok) {
      throw new Error('Failed to reset password');
    }

    const data = await response.json();
    return data;
  }
}; 