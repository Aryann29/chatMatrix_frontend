import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const tokenStorage = {
  setToken: (token) => {
    localStorage.setItem('access_token', token); 
  },
  getToken: () => {
    return localStorage.getItem('access_token'); 
  },
  removeToken: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  },
  setUserData: (userData) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
  },
  getUserData: () => {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};

const authAPI = {
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getToken: async (credentials) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', credentials.email);
    params.append('password', credentials.password);

    const response = await axios.post(`${API_BASE_URL}/auth/token`, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },

  validateToken: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Token validation failed:', error);
      tokenStorage.removeToken();
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const tokenData = await authAPI.getToken(credentials);

      if (tokenData.access_token) {
        tokenStorage.setToken(tokenData.access_token);
        tokenStorage.setUserData({
          username: tokenData.username,
          email: tokenData.email
        });

        // Consider if you need to await validateToken here.
        // It's often good for immediate feedback, but the interceptor handles 401s globally.
        await authAPI.validateToken(tokenData.access_token);
        return tokenData;
      }
      throw new Error('No access token received');
    } catch (error) {
      tokenStorage.removeToken();
      throw error;
    }
  },

  logout: () => {
    tokenStorage.removeToken();
  },

  getCurrentUser: () => {
    return tokenStorage.getUserData();
  },

  isAuthenticated: () => {
    return tokenStorage.isAuthenticated(); // Delegate to tokenStorage's version
  },
};

axios.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.removeToken();
      window.location.href = '/login'; // Redirect to login page on 401
    }
    return Promise.reject(error);
  }
);

export { tokenStorage, authAPI };