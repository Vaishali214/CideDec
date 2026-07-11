import { mockApi } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Global flag to persist mock mode for the session once connection fails
let useMockMode = false;

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('cidedec_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<{ data: T | null; error: string | null }> {
    const method = options.method || 'GET';
    let requestBody: any = null;
    if (options.body) {
      try {
        requestBody = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      } catch {
        requestBody = options.body;
      }
    }

    if (useMockMode) {
      const mockRes = mockApi.handleRequest(method, path, requestBody);
      return mockRes as { data: T | null; error: string | null };
    }

    let resolvedPath = path;
    if (path.startsWith('/auth/')) {
      resolvedPath = `/api/v1/auth${path.substring(5)}`;
    } else if (path.startsWith('/api/')) {
      resolvedPath = `/api/v1${path.substring(4)}`;
    }

    const url = `${API_BASE_URL}${resolvedPath}`;
    const headers = { ...this.getHeaders(), ...options.headers };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 || response.status === 403) {
        // Try to refresh token
        const refreshToken = localStorage.getItem('cidedec_refresh_token');
        if (refreshToken) {
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken })
            });
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              if (refreshData.token && refreshData.refreshToken) {
                localStorage.setItem('cidedec_token', refreshData.token);
                localStorage.setItem('cidedec_refresh_token', refreshData.refreshToken);

                // Retry original request with new token
                const retryHeaders = {
                  ...headers,
                  'Authorization': `Bearer ${refreshData.token}`
                };
                const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
                const retryText = await retryResponse.text();
                let retryJson;
                try {
                  retryJson = retryText ? JSON.parse(retryText) : {};
                } catch {
                  retryJson = { error: retryText || 'Unknown server response' };
                }

                if (retryResponse.ok) {
                  if (retryJson.data !== undefined) {
                    return { data: retryJson.data as T, error: null };
                  }
                  return { data: retryJson as T, error: null };
                }
              }
            }
          } catch (refreshErr) {
            if (import.meta.env.DEV) console.error('Auto-refresh token failed:', refreshErr);
          }
        }

        // Token is invalid/expired and refresh failed
        localStorage.removeItem('cidedec_token');
        localStorage.removeItem('cidedec_refresh_token');
        return { data: null, error: 'Session expired. Please log in again.' };
      }

      const responseText = await response.text();
      let resJson;
      try {
        resJson = responseText ? JSON.parse(responseText) : {};
      } catch {
        resJson = { error: responseText || 'Unknown server response' };
      }

      if (!response.ok) {
        return { data: null, error: resJson.error || `HTTP error! status: ${response.status}` };
      }

      // Backend wraps resources in a { data: ... } property, or returns { ok: true }
      if (resJson.data !== undefined) {
        return { data: resJson.data as T, error: null };
      }
      return { data: resJson as T, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network connection failed';
      if (import.meta.env.DEV) console.warn(`[API Client] Connection to backend at ${API_BASE_URL} failed. Enabling client-side LocalStorage DB fallback mode.`, msg);
      useMockMode = true;
      const mockRes = mockApi.handleRequest(method, path, requestBody);
      return mockRes as { data: T | null; error: string | null };
    }
  }

  async get<T>(path: string): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(path, { method: 'GET' });
  }

  async post<T>(path: string, body?: any): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: any): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
