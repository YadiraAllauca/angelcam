import { AvailableFeatures } from "./AvailableFeatures";

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  my_cameras_count: number;
  shared_cameras_count: number;
  total_cameras_count: number;
  cameras_with_guests_count: number;
  root_site: string;
  require_qualification: boolean;
  available_features: AvailableFeatures;
}
