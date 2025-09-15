export const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      await fetch('https://virallens-agent.onrender.com/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');

    window.location.href = '/login';
  }
};
