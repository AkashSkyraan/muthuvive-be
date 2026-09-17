

export interface Admin {
  id: number;
  username: string;
  password: string;
  role: "admin" | "subadmin";
  status: number;
  created_by: number | null;
  created_at: Date;
}

export interface CreateAdminRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateSubAdminRequest {
  username: string;
  password: string;
}