const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    return apiClient.post<{ user: any; token: string; message: string }>('/auth/register', data);
  },
  
  login: async (data: { email: string; password: string }) => {
    return apiClient.post<{ user: any; token: string; message: string }>('/auth/login', data);
  },
  
  getProfile: async () => {
    return apiClient.get<{ user: any }>('/auth/profile');
  },
};

// Tasks API
export const tasksApi = {
  getAll: async () => {
    return apiClient.get<{ tasks: any[] }>('/tasks');
  },
  
  create: async (data: any) => {
    return apiClient.post<{ task: any }>('/tasks', data);
  },
  
  update: async (id: string, data: any) => {
    return apiClient.put<{ task: any }>(`/tasks/${id}`, data);
  },
  
  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/tasks/${id}`);
  },
};

// Notes API
export const notesApi = {
  getAll: async () => {
    return apiClient.get<{ notes: any[] }>('/notes');
  },
  
  getById: async (id: string) => {
    return apiClient.get<{ note: any }>(`/notes/${id}`);
  },
  
  create: async (data: any) => {
    return apiClient.post<{ note: any }>('/notes', data);
  },
  
  update: async (id: string, data: any) => {
    return apiClient.put<{ note: any }>(`/notes/${id}`, data);
  },
  
  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/notes/${id}`);
  },
};

// Goals API
export const goalsApi = {
  getAll: async () => {
    return apiClient.get<{ goals: any[] }>('/goals');
  },
  
  getById: async (id: string) => {
    return apiClient.get<{ goal: any }>(`/goals/${id}`);
  },
  
  create: async (data: any) => {
    return apiClient.post<{ goal: any }>('/goals', data);
  },
  
  update: async (id: string, data: any) => {
    return apiClient.put<{ goal: any }>(`/goals/${id}`, data);
  },
  
  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/goals/${id}`);
  },
};

// Finance API
export const financeApi = {
  getAll: async () => {
    return apiClient.get<{ transactions: any[]; balance: number }>('/finance');
  },
  
  getById: async (id: string) => {
    return apiClient.get<{ transaction: any }>(`/finance/${id}`);
  },
  
  getStats: async () => {
    return apiClient.get<any>('/finance/stats');
  },
  
  create: async (data: any) => {
    return apiClient.post<{ transaction: any }>('/finance', data);
  },
  
  update: async (id: string, data: any) => {
    return apiClient.put<{ transaction: any }>(`/finance/${id}`, data);
  },
  
  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/finance/${id}`);
  },
};

// Articles API
export const articlesApi = {
  getAll: async (published?: boolean) => {
    const query = published !== undefined ? `?published=${published}` : '';
    return apiClient.get<{ articles: any[] }>(`/articles${query}`);
  },
  
  getById: async (id: string) => {
    return apiClient.get<{ article: any }>(`/articles/${id}`);
  },
  
  create: async (data: any) => {
    return apiClient.post<{ article: any }>('/articles', data);
  },
  
  update: async (id: string, data: any) => {
    return apiClient.put<{ article: any }>(`/articles/${id}`, data);
  },
  
  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/articles/${id}`);
  },
};

// Feed API
export const feedApi = {
  getFeed: async (limit = 50, offset = 0) => {
    return apiClient.get<{ activities: any[] }>(`/feed?limit=${limit}&offset=${offset}`);
  },
  
  getUserActivity: async (limit = 50, offset = 0, type?: string) => {
    const typeParam = type ? `&type=${type}` : '';
    return apiClient.get<{ activities: any[] }>(`/feed/user?limit=${limit}&offset=${offset}${typeParam}`);
  },
  
  getStats: async () => {
    return apiClient.get<any>('/feed/stats');
  },
};