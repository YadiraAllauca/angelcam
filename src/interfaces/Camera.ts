export interface Camera {
  id: number;
  name: string;
  type: string;
  snapshot: {
    url: string;
    created_at: string;
  };
  status: string;
  live_snapshot: string;
  streams: Array<{
    format: string;
    url: string;
  }>;
  applications: Array<{
    code: string;
  }>;
  owner: {
    email: string;
    first_name: string;
    last_name: string;
  };
  has_recording: boolean;
  has_notifications: boolean;
  audio_enabled: boolean;
  low_latency_enabled: boolean;
}
