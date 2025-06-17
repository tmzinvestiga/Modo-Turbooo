// API service layer for backend integration
// This file provides a clean interface for all API calls

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store tokens
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken }),
    });
    
    // Store tokens
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    });
    return response.data;
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    
    // Update tokens
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      // Always clear local storage, even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Task management endpoints (ready for backend integration)
  async getTasks(): Promise<any[]> {
    const response = await this.request<any[]>('/tasks');
    return response.data;
  }

  async createTask(task: any): Promise<any> {
    const response = await this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return response.data;
  }

  async updateTask(id: string, task: any): Promise<any> {
    const response = await this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  // Calendar endpoints
  async getCalendarEvents(): Promise<any[]> {
    const response = await this.request<any[]>('/calendar/events');
    return response.data;
  }

  async createCalendarEvent(event: any): Promise<any> {
    const response = await this.request<any>('/calendar/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    return response.data;
  }

  // Performance/Analytics endpoints
  async getPerformanceData(): Promise<any> {
    const response = await this.request<any>('/analytics/performance');
    return response.data;
  }

  async getUserStats(): Promise<any> {
    const response = await this.request<any>('/analytics/stats');
    return response.data;
  }
}

export const apiService = new ApiService();
export type { User, AuthResponse, LoginRequest, RegisterRequest };

