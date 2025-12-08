import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiRequest<T = any>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      credentials: 'include',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return { data, status: response.status };
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { error: errorMessage, status: 500 };
  }
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await apiRequest<{ urls: string[] }>('/upload', 'POST', formData);
  if (response.error || !response.data) {
    throw new Error(response.error || 'Failed to upload images');
  }

  return response.data.urls;
}

export const tourApi = {
  // Tour CRUD operations
  getTours: async () => {
    const response = await apiRequest<{ tours: any[] }>('/tours');
    return response;
  },

  getTour: async (id: string) => {
    const response = await apiRequest<{ tour: any }>(`/tours/${id}`);
    return response;
  },

  createTour: async (data: any) => {
    const response = await apiRequest<{ tour: any }>('/tours', 'POST', data);
    return response;
  },

  updateTour: async (id: string, data: any) => {
    const response = await apiRequest<{ tour: any }>(`/tours/${id}`, 'PUT', data);
    return response;
  },

  deleteTour: async (id: string) => {
    const response = await apiRequest(`/tours/${id}`, 'DELETE');
    return response;
  },

  // Guides
  getGuides: async () => {
    const response = await apiRequest<{ guides: Array<{ id: string; name: string; email: string }> }>('/guides');
    return response;
  },

  // Categories
  getCategories: async () => {
    const response = await apiRequest<{ categories: string[] }>('/categories');
    return response;
  },
};

export default apiRequest;
