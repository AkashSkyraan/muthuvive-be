export interface ValidationError extends Error {
  status?: number;
  errors?: string;
}