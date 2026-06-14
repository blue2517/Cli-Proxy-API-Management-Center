import { apiClient } from './client';

export interface ProxyHealthStatus {
  status: 'healthy' | 'probing' | 'disabled';
  proxy_url: string;
  backoff_level: number;
  disabled_at?: string;
  next_probe_at?: string;
  last_error: string;
  last_probe_at?: string;
  monitored: boolean;
}

export const proxyHealthApi = {
  getStatus: (): Promise<ProxyHealthStatus> => apiClient.get('/proxy-health'),
};
