// Store the JWT token in localStorage
function storeToken(tokenData) {
    localStorage.setItem('authToken', tokenData.token);
    localStorage.setItem('userEmail', tokenData.email);
    localStorage.setItem('userType', tokenData.dtype);
    localStorage.setItem('fullName', tokenData.fullName);
    
    // Store specific ID based on user type
    if (tokenData.studentId) {
      localStorage.setItem('specificId', tokenData.studentId);
    } else if (tokenData.facultyId) {
      localStorage.setItem('specificId', tokenData.facultyId);
    } else if (tokenData.adminId) {
      localStorage.setItem('specificId', tokenData.adminId);
    }
  }
  
  // Get the stored token
  function getToken() {
    return localStorage.getItem('authToken');
  }
  
  // Check if user is logged in
  function isLoggedIn() {
    return !!getToken();
  }
  
  // Get user type (student, faculty, admin)
  function getUserType() {
    return localStorage.getItem('userType');
  }
  
  // Get user email
  function getUserEmail() {
    return localStorage.getItem('userEmail');
  }
  
  // Get user's full name
  function getFullName() {
    return localStorage.getItem('fullName');
  }
  
  // Logout user
  function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('fullName');
    localStorage.removeItem('specificId');
    
    // Redirect to login page
    window.location.href = 'login.html';
  }
  
  // Check authentication and redirect if not logged in
  function checkAuth() {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
  
  // Add token to fetch requests
  async function authenticatedFetch(url, options = {}) {
    if (!options.headers) {
      options.headers = {};
    }
    
    const token = getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, options);
      
      // If unauthorized, redirect to login
      if (response.status === 401) {
        logout();
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }