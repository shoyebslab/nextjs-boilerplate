import { RoleType } from "@/config/permissions.config";

export interface UserItem {
  id: string | number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: RoleType;
  department?: string;
  is_active: boolean;
  date_joined: string;
}

export interface UserFormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: RoleType;
  department?: string;
  password?: string;
  is_active?: boolean;
}
