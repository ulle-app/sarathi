import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshResponse,
  User,
  UpdateProfileRequest,
} from '@/types/api';
import {
  Assessment,
  AssessmentSummary,
  AssessmentResult,
  ResponseItem,
  AssessmentInsights,
} from '@/types/assessment';
import {
  Career,
  CareerSummary,
  CareerRecommendation,
  SkillGapAnalysis,
} from '@/types/career';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
  timeout: 8000, // fail fast on slow network calls
});

// Token storage (in-memory for security)
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Request interceptor to add auth header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err: Error) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<ApiResponse<RefreshResponse>>('/auth/refresh');
        const newToken = data.data?.accessToken;

        if (newToken) {
          setAccessToken(newToken);
          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        setAccessToken(null);
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.data.data?.accessToken) {
      setAccessToken(response.data.data.accessToken);
    }
    return response.data.data!;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    if (response.data.data?.accessToken) {
      setAccessToken(response.data.data.accessToken);
    }
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  refresh: async (): Promise<string> => {
    const response = await api.post<ApiResponse<RefreshResponse>>('/auth/refresh');
    const token = response.data.data?.accessToken;
    if (token) {
      setAccessToken(token);
    }
    return token!;
  },
};

// User API
export const userApi = {
  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/users/me');
    return response.data.data!.user;
  },

  updateMe: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.patch<ApiResponse<{ user: User }>>('/users/me', data);
    return response.data.data!.user;
  },

  deleteMe: async (): Promise<void> => {
    await api.delete('/users/me');
    setAccessToken(null);
  },
};

// Assessment API
export const assessmentApi = {
  getAll: async (type?: string, academicLevel?: string): Promise<AssessmentSummary[]> => {
    const params: any = {};
    if (type) params.type = type;
    if (academicLevel) params.academicLevel = academicLevel;
    const response = await api.get<ApiResponse<{ assessments: AssessmentSummary[] }>>('/assessments', { params });
    return response.data.data!.assessments;
  },

  getById: async (id: string): Promise<Assessment> => {
    const response = await api.get<ApiResponse<{ assessment: Assessment }>>(`/assessments/${id}`);
    return response.data.data!.assessment;
  },

  start: async (assessmentId: string): Promise<AssessmentResult> => {
    const response = await api.post<ApiResponse<{ result: AssessmentResult }>>(`/assessments/${assessmentId}/start`);
    return response.data.data!.result;
  },

  saveProgress: async (resultId: string, responses: ResponseItem[]): Promise<AssessmentResult> => {
    const response = await api.patch<ApiResponse<{ result: AssessmentResult }>>(`/assessments/${resultId}/progress`, { responses });
    return response.data.data!.result;
  },

  submit: async (resultId: string, responses: ResponseItem[]): Promise<AssessmentResult> => {
    const response = await api.post<ApiResponse<{ result: AssessmentResult }>>(`/assessments/${resultId}/submit`, { responses });
    return response.data.data!.result;
  },
};

// Results API
export const resultsApi = {
  getAll: async (): Promise<AssessmentResult[]> => {
    const response = await api.get<ApiResponse<{ results: AssessmentResult[] }>>('/results');
    return response.data.data!.results;
  },

  getById: async (id: string): Promise<{ result: AssessmentResult; assessment: Assessment }> => {
    const response = await api.get<ApiResponse<{ result: AssessmentResult; assessment: Assessment }>>(`/results/${id}`);
    return response.data.data!;
  },

  getInsights: async (id: string): Promise<{ result: AssessmentResult; insights: AssessmentInsights }> => {
    const response = await api.get<ApiResponse<{ result: AssessmentResult; insights: AssessmentInsights }>>(`/results/${id}/insights`);
    return response.data.data!;
  },
};

// Career API
export const careerApi = {
  getAll: async (category?: string, search?: string, filters?: { recommended_streams?: string[]; education_levels?: string[]; is_student_friendly?: boolean; }): Promise<CareerSummary[]> => {
    const params: Record<string, any> = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (filters?.recommended_streams && filters.recommended_streams.length > 0) {
      params.recommended_streams = filters.recommended_streams.join(',');
    }
    if (filters?.education_levels && filters.education_levels.length > 0) {
      params.education_levels = filters.education_levels.join(',');
    }
    if (typeof filters?.is_student_friendly === 'boolean') {
      params.is_student_friendly = String(filters.is_student_friendly);
    }

    const response = await api.get<ApiResponse<{ careers: CareerSummary[] }>>('/careers', { params });
    return response.data.data!.careers;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<{ categories: string[] }>>('/careers/categories');
    return response.data.data!.categories;
  },

  getById: async (id: string): Promise<Career> => {
    const response = await api.get<ApiResponse<{ career: Career }>>(`/careers/${id}`);
    return response.data.data!.career;
  },

  getRecommendations: async (): Promise<CareerRecommendation[]> => {
    const response = await api.get<ApiResponse<{ recommendations: CareerRecommendation[] }>>('/careers/recommendations');
    return response.data.data!.recommendations;
  },

  getSkillGap: async (careerId: string): Promise<SkillGapAnalysis> => {
    const response = await api.get<ApiResponse<{ skillGap: SkillGapAnalysis }>>(`/careers/${careerId}/skill-gap`);
    return response.data.data!.skillGap;
  },

  getRelated: async (careerId: string): Promise<CareerSummary[]> => {
    const response = await api.get<ApiResponse<{ relatedCareers: CareerSummary[] }>>(`/careers/${careerId}/related`);
    return response.data.data!.relatedCareers;
  },
};

export default api;
