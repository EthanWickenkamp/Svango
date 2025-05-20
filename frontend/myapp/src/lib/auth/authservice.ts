// src/auth/authService.js
import { token, user, isAuthenticated } from './authstore';
import { get } from 'svelte/store';

/**
 * Login user and store JWT tokens
 */
export const login = async (username, password) => {
  try {
    const response = await fetch('/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store tokens
    token.set(data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    // Fetch user profile after successful login
    await fetchUserProfile();
    return true;
    
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

/**
 * Fetch the user's profile data
 */
export const fetchUserProfile = async () => {
  try {
    const response = await authenticatedFetch('/api/user/profile/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    const userData = await response.json();
    user.set(userData);
    return userData;
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
};

/**
 * Make authenticated API requests with the JWT token
 */
export const authenticatedFetch = async (url, options = {}) => {
  // Get current token from store
  const accessToken = get(token);
  
  if (!accessToken) {
    // Try to refresh if no access token is available
    const refreshSuccess = await refreshToken();
    if (!refreshSuccess) {
      throw new Error('Authentication required');
    }
  }
  
  // Set up headers with the token
  const headers = {
    ...options.headers || {},
    'Authorization': `Bearer ${get(token)}`
  };
  
  // Make the request
  const response = await fetch(url, { 
    ...options, 
    headers 
  });
  
  // If unauthorized, try to refresh the token and retry
  if (response.status === 401) {
    const refreshSuccess = await refreshToken();
    
    if (refreshSuccess) {
      // Update headers with new token and retry request
      headers.Authorization = `Bearer ${get(token)}`;
      return fetch(url, { ...options, headers });
    } else {
      // If refresh fails, clear auth state
      logout();
      throw new Error('Session expired. Please login again.');
    }
  }
  
  return response;
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      return false;
    }
    
    const response = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    token.set(data.access);
    
    // Some implementations also refresh the refresh token
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    
    return true;
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

/**
 * Log out user by clearing tokens and state
 */
export const logout = () => {
  token.set(null);
  user.set(null);
  localStorage.removeItem('refresh_token');
};

/**
 * Check if the current session is valid
 */
export const checkAuth = async () => {
  // If we have a token but no user, fetch the user profile
  if (get(token) && !get(user)) {
    return await fetchUserProfile() !== null;
  }
  
  // If we have both token and user, consider authenticated
  return !!get(token) && !!get(user);
};