import { GraphQLError, ApiError } from '@/types/graphql';
import { AppError } from '@/types/common';
import { ImageUpload } from '@/types/common';
import { useAuthStore } from '@/stores/authStore';

// API Error handling utilities
export class ApiErrorHandler {
  static createError(message: string, code: string = 'UNKNOWN_ERROR', details?: any): AppError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  static fromGraphQLError(graphqlError: GraphQLError): AppError {
    return {
      code: graphqlError.code || 'GRAPHQL_ERROR',
      message: graphqlError.message,
      details: graphqlError.path,
      timestamp: new Date().toISOString(),
    };
  }

  static fromNetworkError(error: any): AppError {
    return {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error occurred',
      details: error,
      timestamp: new Date().toISOString(),
    };
  }

  static isNetworkError(error: any): boolean {
    return error?.networkError || error?.code === 'NETWORK_ERROR';
  }

  static isAuthError(error: any): boolean {
    return error?.code === 'UNAUTHENTICATED' || error?.code === 'FORBIDDEN';
  }

  static isValidationError(error: any): boolean {
    return error?.code === 'BAD_USER_INPUT' || error?.code === 'VALIDATION_ERROR';
  }

  static getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.graphQLErrors?.length > 0) {
      return error.graphQLErrors[0].message;
    }

    if (error?.networkError) {
      return 'Network error occurred. Please check your connection.';
    }

    return 'An unexpected error occurred.';
  }

  static getErrorCode(error: any): string {
    if (error?.code) {
      return error.code;
    }

    if (error?.graphQLErrors?.length > 0) {
      return error.graphQLErrors[0].code || 'GRAPHQL_ERROR';
    }

    if (error?.networkError) {
      return 'NETWORK_ERROR';
    }

    return 'UNKNOWN_ERROR';
  }
}

// API Response utilities
export class ApiResponseHandler {
  static success<T>(data: T, message?: string): { success: true; data: T; message?: string } {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(error: string | AppError): { success: false; error: string } {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return {
      success: false,
      error: errorMessage,
    };
  }

  static isSuccess<T>(response: any): response is { success: true; data: T } {
    return response?.success === true;
  }

  static isError(response: any): response is { success: false; error: string } {
    return response?.success === false;
  }
}

// Retry utilities
export class RetryHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }

        // Don't retry on auth errors
        if (ApiErrorHandler.isAuthError(error)) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError;
  }

  static async withExponentialBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }

        // Don't retry on auth errors
        if (ApiErrorHandler.isAuthError(error)) {
          throw error;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

// Cache utilities
export class CacheHandler {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static has(key: string): boolean {
    return this.cache.has(key);
  }
}

// Request utilities
export class RequestHandler {
  static createHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw ApiErrorHandler.createError(
        errorData.message || `HTTP ${response.status}`,
        `HTTP_${response.status}`,
        errorData
      );
    }

    return response.json();
  }

  static async get<T>(url: string, token?: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.createHeaders(token),
    });

    return this.handleResponse<T>(response);
  }

  static async post<T>(url: string, data: any, token?: string): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.createHeaders(token),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  static async put<T>(url: string, data: any, token?: string): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.createHeaders(token),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  static async delete<T>(url: string, token?: string): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.createHeaders(token),
    });

    return this.handleResponse<T>(response);
  }
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4001';

/**
 * Upload an image to the backend
 */
export const uploadImage = async (imageUri: string): Promise<string> => {
  try {
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // Create form data
    const formData = new FormData();
    
    // Get file info from URI
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('image', {
      uri: imageUri,
      type,
      name: filename,
    } as any);

    // Upload to backend
    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result.data.url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

/**
 * Check if an image URL is a local file URI
 */
export const isLocalImage = (imageUrl: string): boolean => {
  return imageUrl.startsWith('file://') || imageUrl.startsWith('content://');
};

/**
 * Get a valid image URL (handle local vs remote URLs)
 */
export const getValidImageUrl = (imageUrl: string): string | null => {
  if (!imageUrl) return null;
  
  // If it's already a remote URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a local file URI, return null (can't display)
  if (isLocalImage(imageUrl)) {
    return null;
  }
  
  // If it's a relative path, make it absolute
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  return imageUrl;
};
