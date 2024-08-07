import { UserData } from "./UserData";

export interface LoginResponse {
  message: string;
  data: UserData;
  error: string;
}