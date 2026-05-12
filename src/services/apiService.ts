// API Service - Helper for making requests to PHP backend
class APIService {
  private baseURL = '/api';

  private async handleResponse<T>(response: Response): Promise<T> {
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        result && typeof result === "object" && "message" in result
          ? String(result.message)
          : `HTTP error! status: ${response.status}`;
      throw new Error(message);
    }

    return result as T;
  }

  async post<T = any>(
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data || {}),
        credentials: 'include', // Include cookies for sessions
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for sessions
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  async put<T = any>(
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data || {}),
        credentials: 'include',
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
}

const apiService = new APIService();
export default apiService;
