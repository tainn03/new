import { NextApiRequest, NextApiResponse } from 'next';

export interface ExtendedNextApiRequest extends NextApiRequest {
  user?: {
    id: number;
    email: string;
    name: string;
  };
  requestId?: string;
  startTime?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LogEntry {
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ip?: string;
  userId?: number;
  timestamp: Date;
}
