import { ApiResponse } from '@/types';
import { NativeModules, Platform } from 'react-native';

const debugLog = (...args: unknown[]) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[ApiService]', ...args);
  }
};

const parseHost = (value?: string | null) => {
  if (!value) return null;
  try {
    return new URL(value).hostname;
  } catch {
    try {
      return new URL(`http://${value}`).hostname;
    } catch {
      return null;
    }
  }
};

const getScriptHost = () => {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (!scriptURL) return null;
  try {
    return new URL(scriptURL).hostname;
  } catch {
    return null;
  }
};

const buildUrl = (host: string) => `http://${host}:8000`;

// Prefer Metro host in dev to match the bundle URL; fall back to env/localhost.
const resolveBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const scriptHost = getScriptHost();
  const envHost = parseHost(envUrl);

  // In dev, if env host differs from the Metro host, assume Metro host is right.
  if (__DEV__ && scriptHost && scriptHost !== 'localhost') {
    if (envUrl && envHost && envHost !== scriptHost) {
      return {
        url: buildUrl(scriptHost),
        meta: { source: 'metro-host', scriptHost, envUrl, envHost },
      };
    }
  }

  if (envUrl) {
    return { url: envUrl, meta: { source: 'env', envUrl, envHost, scriptHost } };
  }

  if (scriptHost) {
    if (scriptHost !== 'localhost') {
      return { url: buildUrl(scriptHost), meta: { source: 'metro-host', scriptHost } };
    }
    if (Platform.OS === 'android') {
      return { url: 'http://10.0.2.2:8000', meta: { source: 'android-localhost' } };
    }
    return { url: 'http://127.0.0.1:8000', meta: { source: 'localhost' } };
  }

  if (Platform.OS === 'android') {
    return { url: 'http://10.0.2.2:8000', meta: { source: 'android-fallback' } };
  }
  return { url: 'http://localhost:8000', meta: { source: 'fallback' } };
};

const { url: API_BASE_URL, meta: API_BASE_META } = resolveBaseUrl();

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
  constructor() {
    debugLog('init', { API_BASE_URL, meta: API_BASE_META });
  }

  private withTimeout(options: RequestInit, timeoutMs = 15000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    return {
      ...options,
      signal: controller.signal,
      cleanup: () => clearTimeout(timeoutId),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      debugLog('request:start', { url, method: options.method ?? 'GET', endpoint });

      const { cleanup, ...opts } = this.withTimeout(options);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...opts.headers,
        },
        ...opts,
      });
      cleanup();

      const data = await response.json();
      debugLog('request:response', {
        url,
        status: response.status,
        ok: response.ok,
        endpoint,
      });

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        data,
        success: true,
      };
    } catch (error) {
      debugLog('request:error', {
        endpoint,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
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
      debugLog('scrape:start', { url, query });

      const { cleanup, ...opts } = this.withTimeout(
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            type: 'search',
          }),
        },
        60000
      );

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        ...opts,
      });
      cleanup();

      const data = await response.json();
      debugLog('scrape:response', {
        url,
        status: response.status,
        ok: response.ok,
        success: data?.success,
        count: Array.isArray(data?.data) ? data.data.length : 0,
        error: data?.error,
      });

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