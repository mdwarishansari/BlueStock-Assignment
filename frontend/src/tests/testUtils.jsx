import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import companyReducer from '../store/slices/companySlice';
import uiReducer from '../store/slices/uiSlice';
import theme from '../styles/theme';

/**
 * Create a test store with initial state
 */
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      company: companyReducer,
      ui: uiReducer,
    },
    preloadedState,
  });
}

/**
 * Create a test query client
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
}

/**
 * Render with all providers
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Mock user data
 */
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  full_name: 'Test User',
  gender: 'm',
  mobile_no: '+919876543210',
  is_email_verified: true,
  is_mobile_verified: true,
  created_at: '2024-01-01T00:00:00.000Z',
};

/**
 * Mock company data
 */
export const mockCompany = {
  id: 1,
  owner_id: 1,
  company_name: 'Test Company',
  address: '123 Test Street',
  city: 'Test City',
  state: 'Test State',
  country: 'India',
  postal_code: '123456',
  website: 'https://test.com',
  logo_url: 'https://example.com/logo.jpg',
  banner_url: 'https://example.com/banner.jpg',
  industry: 'Technology',
  founded_date: '2020-01-01',
  description: 'Test company description',
  social_links: {
    linkedin: 'https://linkedin.com/company/test',
    twitter: 'https://twitter.com/test',
  },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

/**
 * Mock authenticated state
 */
export const mockAuthState = {
  auth: {
    user: mockUser,
    token: 'mock-token',
    isAuthenticated: true,
    loading: false,
    error: null,
  },
  company: {
    company: mockCompany,
    hasCompany: true,
    loading: false,
    error: null,
  },
  ui: {
    sidebarOpen: true,
    mobileMenuOpen: false,
    theme: 'light',
    notifications: [],
    globalLoading: false,
  },
};

// Export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';