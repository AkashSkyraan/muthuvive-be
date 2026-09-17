export interface AddUpdateAboutus {
  id?: number;
  yoe: number;
  clients: number;
  projects: number;
  users: number;
  address: string;
  mobile: string;
  email: string;
  c_yoe: number;
  c_clients: number;
  c_projects: number;
  c_built: number;
}

export interface GetAboutUsData {
  id?: number;
  status?: string;
}

// consultsnt

export interface AddUpdateConsultant {
  id?: number;
  name: string;
  role: string;
  image: string;
}

export interface GetConsultant {
  id?: number;
  status?: string;
}
