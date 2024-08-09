import { LoginResponse } from "./LoginResponse";

export interface CameraListProps {
  token: string | null;
}

export interface LoginProps {
  onLogin: (data: LoginResponse) => void;
}

export interface CameraLiveStreamProps {
  cameraId: number;
  token: string;
}