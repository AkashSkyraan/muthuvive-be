export interface UpdateProfileInput {
  name?: string;
  email?: string;
  mobile?: string;
  country_code?: string;
  user_id: number;
}

export interface PropertyUserParams {
  user_id: number;
  type: string;
}
