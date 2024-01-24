const BASE_URL = 'https://diva-challenge-ul4cm77qva-uc.a.run.app'; // Replace with your actual API base URL

const getAuthToken = async () => {
  try {
    // Check if the token is already in local storage
    const storedToken = localStorage.getItem('jwt');

    // Check if the stored token exists and is not expired
    if (storedToken) {
      const decodedToken = parseJwt(storedToken);

      // Check if the token is not expired
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        return storedToken;
      }
    }

    // If the token is expired or not available, fetch a new one from the login endpoint
    const response = await fetch(`${BASE_URL}/login`);
    if (!response.ok) {
      throw new Error('Failed to get JWT');
    }

    const { jwt } = await response.json();

    // Store the new token in local storage
    localStorage.setItem('jwt', jwt);

    return jwt;
  } catch (error) {
    throw new Error(`Error retrieving or storing JWT: ${error.message}`);
  }
};

const checkStatus = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/alive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check server status');
    }

    return response.text();
  } catch (error) {
    throw new Error(`Error checking server status: ${error.message}`);
  }
};

const sendMessage = async (message) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${BASE_URL}/slack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: message }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      // Check if the response has content before parsing
      const jsonResponse = response.status === 204 ? {} : await response.json();
  
      return jsonResponse;
    } catch (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  };
  

// Helper function to parse JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export { checkStatus, sendMessage };
