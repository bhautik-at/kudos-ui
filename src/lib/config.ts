// Configuration settings for the application
const config = {
  // API URLs
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },

  // Authentication
  auth: {
    tokenKey: 'auth_token',
  },
};

export default config;
