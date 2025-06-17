// Environment configuration
// This file manages environment-specific settings

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    retryAttempts: 3,
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'authToken',
    refreshTokenKey: 'refreshToken',
    userKey: 'user',
    tokenExpirationBuffer: 5 * 60 * 1000, // 5 minutes in milliseconds
  },

  // Google OAuth Configuration
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`,
  },

  // Feature Flags
  features: {
    enableGoogleAuth: process.env.REACT_APP_ENABLE_GOOGLE_AUTH === 'true',
    enableEmailVerification: process.env.REACT_APP_ENABLE_EMAIL_VERIFICATION !== 'false',
    enableMockData: process.env.REACT_APP_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development',
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  },

  // App Configuration
  app: {
    name: 'MODO TURBO',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    supportEmail: process.env.REACT_APP_SUPPORT_EMAIL || 'support@modoturbo.com',
  },

  // UI Configuration
  ui: {
    defaultTheme: 'light',
    enableDarkMode: true,
    animationDuration: 300,
  },

  // Validation Rules
  validation: {
    password: {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
    },
    email: {
      allowedDomains: [], // Empty array means all domains are allowed
    },
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // Cache Configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // Maximum number of cached items
  },
};

// Helper functions
export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
export const isTest = config.app.environment === 'test';

// Validation helpers
export const validateConfig = () => {
  const errors: string[] = [];

  if (config.features.enableGoogleAuth && !config.google.clientId) {
    errors.push('Google Client ID is required when Google Auth is enabled');
  }

  if (!config.api.baseUrl) {
    errors.push('API Base URL is required');
  }

  if (errors.length > 0) {
    console.warn('Configuration validation errors:', errors);
    if (isProduction) {
      throw new Error(`Configuration errors: ${errors.join(', ')}`);
    }
  }
};

// Initialize configuration validation
validateConfig();

