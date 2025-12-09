import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockAuthState } from '../../tests/testUtils';
import Dashboard from '../Dashboard';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Dashboard', () => {
  it('renders dashboard with user information', () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: mockAuthState,
    });
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/welcome back, test user/i)).toBeInTheDocument();
  });

  it('shows verification warning when user is not verified', () => {
    const unverifiedState = {
      ...mockAuthState,
      auth: {
        ...mockAuthState.auth,
        user: {
          ...mockAuthState.auth.user,
          is_email_verified: false,
          is_mobile_verified: false,
        },
      },
    };
    
    renderWithProviders(<Dashboard />, {
      preloadedState: unverifiedState,
    });
    
    expect(screen.getByText(/verification required/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify now/i })).toBeInTheDocument();
  });

  it('displays company profile when user has company', () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: mockAuthState,
    });
    
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('shows "Register Company" button when user has no company', () => {
    const noCompanyState = {
      ...mockAuthState,
      company: {
        company: null,
        hasCompany: false,
        loading: false,
        error: null,
      },
    };
    
    renderWithProviders(<Dashboard />, {
      preloadedState: noCompanyState,
    });
    
    expect(screen.getByText(/no company profile/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register your company/i })).toBeInTheDocument();
  });

  it('displays user stats correctly', () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: mockAuthState,
    });
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Registered')).toBeInTheDocument();
  });
});