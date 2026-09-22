export type AuthIdentifierType = "email" | "mobile";

export interface RequestOtpInput {
  type: string;
}

export interface VerifyOtpInput {
  type: string;
  otp: string;
}

export interface SignupInput {
  email?: string;
  mobile?: string;
  password: string;
}

export interface LoginInput {
  type: string;
  password: string;
}

export interface ForgotPasswordInput {
  type: string;
  otp: string;
  password: string;
}

export interface JwtPayload {
  id: number;
}


