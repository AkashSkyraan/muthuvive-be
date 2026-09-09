export interface AddUpdateAboutus {
  id?: number;
  yoe: number;
  clients: number;
  projects: number;
  users: number;
  address: string;
  mobile: string;
  email: string;
}

export interface GetAboutUsData {
  id?: number;
  status?: string;
}
