import { ApiResponse } from '@/types';

// Use host machine IP as fallback for Android emulator compatibility
// localhost doesn't work on Android emulator as it refers to the emulator itself
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.59:8000';

// Scraped product interface matching backend response
export interface ScrapedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  url: string;
  discount?: string;
  ratings?: string;
  reviews?: string;
}

// Scrape API response interface
export interface ScrapeResponse {
  success: boolean;
  data?: ScrapedProduct[];
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Scrape products from Lazada based on search query
   * @param query - Search term to find products
   * @returns ScrapeResponse with array of scraped products or error
   */
  async scrapeLazada(query: string): Promise<ScrapeResponse> {
    try {
      const url = `${API_BASE_URL}/api/scrape/lazada`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          type: 'search',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to scrape products',
        };
      }

      return {
        success: data.success,
        data: data.data,
        error: data.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

export const apiService = new ApiService();